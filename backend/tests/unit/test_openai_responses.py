import asyncio

import httpx
import pytest

from app.adapters.generators.openai_responses import OpenAIResponsesAdapter
from app.core.errors import GeneratorUnavailableError
from app.ports.generator import GenerationInput


class StubAsyncClient:
    def __init__(self, response: httpx.Response):
        self.response = response
        self.calls: list[dict] = []
        self.closed = False

    async def post(self, url: str, *, headers: dict, json: dict, timeout: float):
        self.calls.append({
            "url": url,
            "headers": headers,
            "json": json,
            "timeout": timeout,
        })
        return self.response

    async def aclose(self):
        self.closed = True


def test_openai_responses_adapter_posts_payload_and_extracts_text():
    response = httpx.Response(
        200,
        json={
            "id": "resp_123",
            "model": "gpt-test",
            "status": "completed",
            "output": [{
                "type": "message",
                "content": [{
                    "type": "output_text",
                    "text": "Dòng thơ đầu\nDòng thơ sau",
                }],
            }],
            "usage": {
                "input_tokens": 11,
                "output_tokens": 7,
            },
        },
        request=httpx.Request("POST", "https://api.openai.com/v1/responses"),
    )
    client = StubAsyncClient(response)
    adapter = OpenAIResponsesAdapter(client=client, model_name="gpt-test", api_key="sk-test")

    output = asyncio.run(adapter.generate(GenerationInput(
        prompt="Viết tiếp câu thơ",
        temperature=0.4,
        max_output_tokens=128,
        timeout_seconds=30,
        response_format_name="poem_analysis",
        response_format_schema={"type": "object"},
    )))

    assert client.calls == [{
        "url": "https://api.openai.com/v1/responses",
        "headers": {
            "Authorization": "Bearer sk-test",
            "Content-Type": "application/json",
        },
        "json": {
            "model": "gpt-test",
            "input": "Viết tiếp câu thơ",
            "temperature": 0.4,
            "max_output_tokens": 128,
            "text": {
                "format": {
                    "type": "json_schema",
                    "name": "poem_analysis",
                    "schema": {"type": "object"},
                    "strict": True,
                }
            },
        },
        "timeout": 30,
    }]
    assert output.text == "Dòng thơ đầu\nDòng thơ sau"
    assert output.provider == "openai"
    assert output.model == "gpt-test"
    assert output.provider_request_id == "resp_123"
    assert output.input_tokens == 11
    assert output.output_tokens == 7


def test_openai_responses_adapter_raises_on_empty_text():
    response = httpx.Response(
        200,
        json={"id": "resp_123", "model": "gpt-test", "output": []},
        request=httpx.Request("POST", "https://api.openai.com/v1/responses"),
    )
    client = StubAsyncClient(response)
    adapter = OpenAIResponsesAdapter(client=client, model_name="gpt-test", api_key="sk-test")

    with pytest.raises(GeneratorUnavailableError):
        asyncio.run(adapter.generate(GenerationInput(
            prompt="Viết tiếp câu thơ",
            temperature=0.4,
            max_output_tokens=128,
            timeout_seconds=30,
        )))
