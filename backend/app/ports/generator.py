from dataclasses import dataclass
from typing import Protocol

@dataclass(frozen=True)
class GenerationInput:
    prompt: str
    temperature: float
    max_output_tokens: int
    timeout_seconds: float

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