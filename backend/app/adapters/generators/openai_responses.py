from typing import Any

import httpx

from app.core.errors import GeneratorUnavailableError
from app.ports.generator import GenerationInput, GenerationOutput, IGeneratorAdapter

class OpenAIResponsesAdapter(IGeneratorAdapter):
    def __init__(
        self,
        client: httpx.AsyncClient,
        model_name: str,
        api_key: str,
        base_url: str = "https://api.openai.com/v1",
    ):
        self._client = client
        self._model_name = model_name
        self._responses_url = f"{base_url.rstrip('/')}/responses"
        self._headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

    async def generate(self, request: GenerationInput) -> GenerationOutput:
        payload = {
            "model": self._model_name,
            "input": request.prompt,
            "temperature": request.temperature,
            "max_output_tokens": request.max_output_tokens,
        }

        if request.response_format_schema is not None:
            payload["text"] = {
                "format": {
                    "type": "json_schema",
                    "name": request.response_format_name or "structured_output",
                    "schema": request.response_format_schema,
                    "strict": True,
                }
            }

        try:
            response = await self._client.post(
                self._responses_url,
                headers=self._headers,
                json=payload,
                timeout=request.timeout_seconds,
            )
            response.raise_for_status()
            response_data = response.json()
        except Exception as exc:
            raise GeneratorUnavailableError("OpenAI generation request failed") from exc

        if not isinstance(response_data, dict):
            raise GeneratorUnavailableError("OpenAI returned an invalid generation response")

        text = self._extract_output_text(response_data)
        if not text:
            raise GeneratorUnavailableError("OpenAI returned an empty generation")

        usage = response_data.get("usage")
        incomplete_details = response_data.get("incomplete_details")
        finish_reason = response_data.get("status")
        if isinstance(incomplete_details, dict) and incomplete_details.get("reason"):
            finish_reason = str(incomplete_details["reason"])

        return GenerationOutput(
            text=text,
            provider="openai",
            model=str(response_data.get("model") or self._model_name),
            finish_reason=str(finish_reason) if finish_reason else None,
            input_tokens=usage.get("input_tokens") if isinstance(usage, dict) else None,
            output_tokens=usage.get("output_tokens") if isinstance(usage, dict) else None,
            provider_request_id=response_data.get("id"),
        )

    async def close(self) -> None:
        await self._client.aclose()

    def _extract_output_text(self, response_data: Any) -> str:
        if not isinstance(response_data, dict):
            return ""

        output_text = response_data.get("output_text")
        if isinstance(output_text, str) and output_text.strip():
            return output_text.strip()

        texts: list[str] = []
        output_items = response_data.get("output")
        if not isinstance(output_items, list):
            return ""

        for output_item in output_items:
            if not isinstance(output_item, dict):
                continue
            content_items = output_item.get("content")
            if not isinstance(content_items, list):
                continue
            for content_item in content_items:
                if not isinstance(content_item, dict):
                    continue
                if content_item.get("type") not in {"output_text", "text"}:
                    continue
                text = content_item.get("text")
                if isinstance(text, str):
                    texts.append(text)

        return "".join(texts).strip()
