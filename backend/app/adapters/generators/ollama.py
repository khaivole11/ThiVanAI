import httpx

from app.core.errors import GeneratorUnavailableError
from app.ports.generator import GenerationInput, GenerationOutput, IGeneratorAdapter

class OllamaAdapter(IGeneratorAdapter):
    def __init__(self, client: httpx.AsyncClient, base_url: str, model_name: str):
        self._client = client
        self._base_url = base_url.rstrip("/")
        self._model_name = model_name

    async def generate(self, request: GenerationInput) -> GenerationOutput:
        url = f"{self._base_url}/api/generate"
        payload = {
            "model": self._model_name,
            "prompt": request.prompt,
            "stream": False,
            "options": {
                "temperature": request.temperature,
                "num_predict": request.max_output_tokens,
            }
        }
        if request.response_format_schema is not None:
            payload["format"] = "json"

        try:
            res = await self._client.post(url, json=payload, timeout=request.timeout_seconds)
            res.raise_for_status()
        except Exception as exc:
            raise GeneratorUnavailableError("Ollama generation request failed") from exc

        text = str(res.json().get("response", "")).strip()
        if not text:
            raise GeneratorUnavailableError("Ollama returned an empty generation")
        return GenerationOutput(text=text, provider="ollama", model=self._model_name)

    async def close(self) -> None:
        await self._client.aclose()
