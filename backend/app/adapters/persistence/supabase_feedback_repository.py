from datetime import datetime, timezone
from typing import Any
from urllib.parse import quote

import httpx

from app.core.errors import AppError
from app.domain.entities.feedback import GenerationFeedback
from app.ports.feedback_repository import IFeedbackRepository


class DisabledFeedbackRepository(IFeedbackRepository):
    async def save_feedback(
        self,
        *,
        generation_id: str,
        rating: int,
        labels: list[str],
        comment: str | None,
    ) -> GenerationFeedback:
        raise AppError(
            status_code=503,
            code="FEEDBACK_STORE_NOT_CONFIGURED",
            message="Feedback storage is not configured. Set SUPABASE_URL and SUPABASE_SECRET_KEY.",
            retryable=False,
        )


class SupabaseFeedbackRepository(IFeedbackRepository):
    def __init__(
        self,
        *,
        supabase_url: str,
        admin_key: str,
        table: str,
        timeout_seconds: float,
        client: httpx.AsyncClient | None = None,
    ):
        self.supabase_url = supabase_url.rstrip("/")
        self.table = table
        self._client = client or httpx.AsyncClient(timeout=timeout_seconds)
        self._owns_client = client is None
        self._headers = {
            "apikey": admin_key,
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        }
        if not admin_key.startswith("sb_secret_"):
            self._headers["Authorization"] = f"Bearer {admin_key}"

    async def save_feedback(
        self,
        *,
        generation_id: str,
        rating: int,
        labels: list[str],
        comment: str | None,
    ) -> GenerationFeedback:
        payload = {
            "generation_id": generation_id,
            "rating": rating,
            "labels": labels,
            "comment": comment,
        }

        try:
            response = await self._client.post(
                self._feedback_url,
                headers=self._headers,
                json=payload,
            )
        except httpx.HTTPError as exc:
            raise AppError(
                status_code=503,
                code="FEEDBACK_STORE_UNAVAILABLE",
                message="Could not connect to Supabase feedback storage.",
                details={"reason": str(exc)},
                retryable=True,
            ) from exc

        if response.status_code not in (200, 201):
            raise AppError(
                status_code=502,
                code="FEEDBACK_STORE_REJECTED",
                message="Supabase rejected the feedback insert.",
                details={
                    "status_code": response.status_code,
                    "body": response.text[:1000],
                },
                retryable=response.status_code >= 500,
            )

        row = self._first_row(response)
        return self._map_row(row)

    async def close(self) -> None:
        if self._owns_client:
            await self._client.aclose()

    @property
    def _feedback_url(self) -> str:
        return f"{self.supabase_url}/rest/v1/{quote(self.table, safe='')}"

    def _first_row(self, response: httpx.Response) -> dict[str, Any]:
        try:
            body = response.json()
        except ValueError as exc:
            raise AppError(
                status_code=502,
                code="FEEDBACK_STORE_INVALID_RESPONSE",
                message="Supabase returned an invalid feedback response.",
                retryable=True,
            ) from exc

        if isinstance(body, list) and body and isinstance(body[0], dict):
            return body[0]
        if isinstance(body, dict):
            return body

        raise AppError(
            status_code=502,
            code="FEEDBACK_STORE_INVALID_RESPONSE",
            message="Supabase returned an unexpected feedback response.",
            details={"body": body},
            retryable=True,
        )

    def _map_row(self, row: dict[str, Any]) -> GenerationFeedback:
        created_at_raw = row.get("created_at")
        created_at = (
            datetime.fromisoformat(created_at_raw.replace("Z", "+00:00"))
            if isinstance(created_at_raw, str)
            else datetime.now(timezone.utc)
        )

        labels_raw = row.get("labels")
        labels = labels_raw if isinstance(labels_raw, list) else []

        return GenerationFeedback(
            id=str(row["id"]),
            generation_id=str(row["generation_id"]),
            rating=int(row["rating"]),
            labels=[str(label) for label in labels],
            comment=row.get("comment"),
            created_at=created_at,
        )
