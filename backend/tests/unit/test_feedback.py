import asyncio

import httpx
import pytest

from app.adapters.persistence.supabase_feedback_repository import (
    DisabledFeedbackRepository,
    SupabaseFeedbackRepository,
)
from app.core.errors import AppError
from app.schemas.feedback import FeedbackRequest


class StubAsyncClient:
    def __init__(self, response: httpx.Response):
        self.response = response
        self.calls: list[dict] = []
        self.closed = False

    async def post(self, url: str, *, headers: dict, json: dict):
        self.calls.append({"url": url, "headers": headers, "json": json})
        return self.response

    async def aclose(self):
        self.closed = True


def test_feedback_request_normalizes_optional_fields():
    request = FeedbackRequest.model_validate({
        "rating": 5,
        "labels": [" relevant ", "relevant", "", "structured"],
        "comment": "   ",
    })

    assert request.labels == ["relevant", "structured"]
    assert request.comment is None


def test_supabase_feedback_repository_posts_insert_payload():
    response = httpx.Response(
        201,
        json=[{
            "id": "feedback-1",
            "generation_id": "generation-1",
            "rating": 4,
            "labels": ["relevant"],
            "comment": "Hay hơn mong đợi",
            "created_at": "2026-08-26T01:02:03Z",
        }],
        request=httpx.Request("POST", "https://example.supabase.co/rest/v1/generation_feedback"),
    )
    client = StubAsyncClient(response)
    repo = SupabaseFeedbackRepository(
        supabase_url="https://example.supabase.co",
        admin_key="legacy-service-role-jwt",
        table="generation_feedback",
        timeout_seconds=10,
        client=client,
    )

    feedback = asyncio.run(repo.save_feedback(
        generation_id="generation-1",
        rating=4,
        labels=["relevant"],
        comment="Hay hơn mong đợi",
    ))

    assert client.calls == [{
        "url": "https://example.supabase.co/rest/v1/generation_feedback",
        "headers": {
            "apikey": "legacy-service-role-jwt",
            "Authorization": "Bearer legacy-service-role-jwt",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        },
        "json": {
            "generation_id": "generation-1",
            "rating": 4,
            "labels": ["relevant"],
            "comment": "Hay hơn mong đợi",
        },
    }]
    assert feedback.id == "feedback-1"
    assert feedback.generation_id == "generation-1"
    assert feedback.rating == 4
    assert feedback.labels == ["relevant"]


def test_supabase_feedback_repository_uses_apikey_only_for_secret_key():
    response = httpx.Response(
        201,
        json=[{
            "id": "feedback-1",
            "generation_id": "generation-1",
            "rating": 5,
            "labels": [],
            "comment": None,
            "created_at": "2026-08-26T01:02:03Z",
        }],
        request=httpx.Request("POST", "https://example.supabase.co/rest/v1/generation_feedback"),
    )
    client = StubAsyncClient(response)
    repo = SupabaseFeedbackRepository(
        supabase_url="https://example.supabase.co",
        admin_key="sb_secret_feedback",
        table="generation_feedback",
        timeout_seconds=10,
        client=client,
    )

    asyncio.run(repo.save_feedback(
        generation_id="generation-1",
        rating=5,
        labels=[],
        comment=None,
    ))

    assert client.calls[0]["headers"] == {
        "apikey": "sb_secret_feedback",
        "Content-Type": "application/json",
        "Prefer": "return=representation",
    }


def test_disabled_feedback_repository_raises_configuration_error():
    with pytest.raises(AppError) as exc_info:
        asyncio.run(DisabledFeedbackRepository().save_feedback(
            generation_id="generation-1",
            rating=5,
            labels=[],
            comment=None,
        ))

    assert exc_info.value.status_code == 503
    assert exc_info.value.code == "FEEDBACK_STORE_NOT_CONFIGURED"
