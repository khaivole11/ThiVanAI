import asyncio

import pytest

from app.core.errors import GenerationValidationError
from app.core.resources import load_domain_resources
from app.domain.enums.poetry_form import PoetryForm
from app.domain.rules.prompts import PromptBuilder
from app.domain.rules.validators import PoetryValidator
from app.domain.services.generation_orchestrator import GenerationOrchestrator
from app.domain.services.request_normalizer import RequestNormalizer
from app.ports.generator import GenerationInput, GenerationOutput


class EmptyRetriever:
    def search(self, **kwargs):
        return []


class StaticContextBuilder:
    def build_context(self, sources):
        return "Không tìm thấy bài thơ tham khảo phù hợp."


class FakeGenerator:
    def __init__(self, outputs: list[str]):
        self._outputs = outputs
        self.prompts: list[str] = []

    async def generate(self, request: GenerationInput) -> GenerationOutput:
        self.prompts.append(request.prompt)
        output = self._outputs.pop(0)
        return GenerationOutput(text=output, provider="fake", model="fake-model")


class RecordingRepository:
    def __init__(self):
        self.saved = []

    async def save_generation(self, result):
        self.saved.append(result)


def make_orchestrator(generator: FakeGenerator, repository: RecordingRepository):
    resources = load_domain_resources()
    return GenerationOrchestrator(
        retriever_service=EmptyRetriever(),
        context_builder=StaticContextBuilder(),
        generator_adapter=generator,
        repository=repository,
        request_normalizer=RequestNormalizer(resources),
        prompt_builder=PromptBuilder(resources),
        validator=PoetryValidator(resources),
        resources=resources,
        corpus_version="test-corpus",
        max_validation_retries=1,
        title_excerpt_characters=24,
    )


def run_generation(orchestrator: GenerationOrchestrator):
    return asyncio.run(orchestrator.generate_poem(
        first_verse="Gà kia ai rán mà giòn",
        poetry_form=PoetryForm.LUC_BAT,
        author_style=None,
        period_style=None,
        top_k=5,
        embedding_k=20,
        bm25_k=20,
        alpha=0.65,
        temperature=0.7,
        max_output_tokens=512,
        timeout_seconds=30,
    ))


def test_generation_retries_and_saves_only_when_poem_passes_validation():
    invalid_poem = "Gà kia ai rán mà giòn\nNồi cơm sôi sùng sục, thơm lừng"
    valid_poem = "Gà kia ai rán mà giòn\nNồi cơm thơm tỏa khắp cả gian nhà"
    generator = FakeGenerator([invalid_poem, valid_poem])
    repository = RecordingRepository()
    orchestrator = make_orchestrator(generator, repository)

    result = run_generation(orchestrator)

    assert result.validation_passed is True
    assert result.attempt_count == 2
    assert result.lines == valid_poem.splitlines()
    assert len(repository.saved) == 1
    assert "Các lỗi validation ở lần trước" in generator.prompts[1]


def test_generation_raises_when_validation_still_fails_after_retries():
    invalid_poem = "Gà kia ai rán mà giòn\nNồi cơm sôi sùng sục, thơm lừng"
    generator = FakeGenerator([invalid_poem, invalid_poem])
    repository = RecordingRepository()
    orchestrator = make_orchestrator(generator, repository)

    with pytest.raises(GenerationValidationError) as exc_info:
        run_generation(orchestrator)

    assert exc_info.value.details["poetryForm"] == "Lục bát"
    assert exc_info.value.details["attemptCount"] == 2
    assert exc_info.value.details["validationErrors"]
    assert repository.saved == []
