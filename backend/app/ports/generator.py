from dataclasses import dataclass
from typing import Any, Protocol

@dataclass(frozen=True)
class GenerationInput:
    prompt: str
    temperature: float
    max_output_tokens: int
    timeout_seconds: float
    response_format_name: str | None = None
    response_format_schema: dict[str, Any] | None = None

@dataclass(frozen=True)
class GenerationOutput:
    text: str
    provider: str
    model: str
    finish_reason: str | None = None
    input_tokens: int | None = None
    output_tokens: int | None = None
    provider_request_id: str | None = None

class IGeneratorAdapter(Protocol):
    async def generate(self, request: GenerationInput) -> GenerationOutput: ...
    async def close(self) -> None: ...
