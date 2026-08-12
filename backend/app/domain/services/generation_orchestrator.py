import time
import uuid
from typing import List

from app.core.resources import DomainResources
from app.ports.generator import GenerationInput
from app.domain.enums.poetry_form import PoetryForm
from app.domain.enums.generation_status import GenerationStatus
from app.domain.entities.generation import GenerationResult
from app.domain.rules.prompts import PromptBuilder
from app.domain.rules.validators import PoetryValidator
from app.domain.services.request_normalizer import RequestNormalizer

class GenerationOrchestrator:
    def __init__(
        self,
        retriever_service,
        context_builder,
        generator_adapter,
        repository,
        request_normalizer: RequestNormalizer,
        prompt_builder: PromptBuilder,
        validator: PoetryValidator,
        resources: DomainResources,
        corpus_version: str,
        max_validation_retries: int,
        title_excerpt_characters: int,
    ):
        self.retriever = retriever_service
        self.context_builder = context_builder
        self.generator = generator_adapter
        self.repository = repository
        self.request_normalizer = request_normalizer
        self.prompt_builder = prompt_builder
        self.validator = validator
        self.resources = resources
        self.corpus_version = corpus_version
        self.max_validation_retries = max_validation_retries
        self.title_excerpt_characters = title_excerpt_characters

    async def generate_poem(
        self,
        first_verse: str,
        poetry_form: PoetryForm,
        author_style: str | None,
        period_style: str | None,
        *,
        top_k: int,
        embedding_k: int,
        bm25_k: int,
        alpha: float,
        temperature: float,
        max_output_tokens: int,
        timeout_seconds: float,
    ) -> GenerationResult:
        gen_id = str(uuid.uuid4())
        timings = {}
        
        self.request_normalizer.validate_opening_verse(first_verse, poetry_form)
    
        t0 = time.time()
        sources = self.retriever.search(
            query=first_verse,
            genre=poetry_form.value,
            author=author_style,
            period=period_style,
            top_k=top_k,
            embedding_k=embedding_k,
            bm25_k=bm25_k,
            alpha=alpha,
        )
        timings['retrieval_ms'] = round((time.time() - t0) * 1000, 2)
        
        t1 = time.time()
        context_text = self.context_builder.build_context(sources)
        timings['context_ms'] = round((time.time() - t1) * 1000, 2)
        
        attempts = 0
        validation_passed = False
        validation_errors: List[str] = []
        generated_lines: List[str] = []
        retry_feedback = ""
        
        t2 = time.time()
        max_attempts = 1 + self.max_validation_retries
        generation_output = None
        while attempts < max_attempts and not validation_passed:
            attempts += 1
            prompt = self.prompt_builder.build(
                first_verse=first_verse,
                genre=poetry_form.value,
                author_style=author_style,
                period_style=period_style,
                retrieved_context=context_text,
                retry_feedback=retry_feedback
            )
            
            generation_output = await self.generator.generate(GenerationInput(
                prompt=prompt,
                temperature=temperature,
                max_output_tokens=max_output_tokens,
                timeout_seconds=timeout_seconds,
            ))
            lines = [line.strip() for line in generation_output.text.splitlines() if line.strip()]

            validation_passed, validation_errors = self.validator.validate(poetry_form, lines)
            if not lines or lines[0] != first_verse:
                validation_errors.append("The first generated line must exactly match the opening verse.")
                validation_passed = False
            generated_lines = lines
            
            if not validation_passed:
                retry_feedback = "\n".join([f"- {err}" for err in validation_errors])
                
        timings['generation_ms'] = round((time.time() - t2) * 1000, 2)
        
        status = GenerationStatus.COMPLETED if validation_passed else GenerationStatus.COMPLETED_WITH_WARNINGS
        full_text = "\n".join(generated_lines)
        opening_excerpt = first_verse[: self.title_excerpt_characters]
        title = self.resources.generation_title_template.format(
            poetry_form=poetry_form.value,
            opening_excerpt=opening_excerpt,
        )
        
        result = GenerationResult(
            id=gen_id,
            status=status,
            title=title,
            lines=generated_lines,
            full_text=full_text,
            sources=sources,
            validation_passed=validation_passed,
            validation_errors=validation_errors,
            attempt_count=attempts,
            provider=generation_output.provider,
            model=generation_output.model,
            prompt_version=self.prompt_builder.version,
            corpus_version=self.corpus_version,
            timings_ms=timings
        )
        
        if self.repository:
            await self.repository.save_generation(result)
            
        return result