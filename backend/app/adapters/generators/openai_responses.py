from openai import AsyncOpenAI

from app.core.errors import GeneratorUnavailableError
from app.ports.generator import GenerationInput, GenerationOutput, IGeneratorAdapter

class OpenAIResponsesAdapter(IGeneratorAdapter):
    def __init__(self, client: AsyncOpenAI, model_name: str):
        self._client = client
        self._model_name = model_name

    async def generate(self, request: GenerationInput) -> GenerationOutput:
        payload = {
            "model": self._model_name,
            "input": request.prompt,
            "temperature": request.temperature,
            "max_output_tokens": request.max_output_tokens,
            "timeout": request.timeout_seconds,
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
            response = await self._client.responses.create(**payload)
        except Exception as exc:
            raise GeneratorUnavailableError("OpenAI generation request failed") from exc

        text = response.output_text.strip()
        if not text:
            raise GeneratorUnavailableError("OpenAI returned an empty generation")
        return GenerationOutput(
            text=text,
            provider="openai",
            model=self._model_name,
            provider_request_id=getattr(response, "id", None),
        )

    async def close(self) -> None:
        await self._client.close()
