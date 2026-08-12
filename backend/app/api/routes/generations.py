from fastapi import APIRouter, Depends
from app.schemas.common import ApiResponse
from app.schemas.generation import GeneratePoemRequest, GeneratePoemResponse
from app.domain.services.generation_orchestrator import GenerationOrchestrator
from app.api.dependencies import get_generation_orchestrator, resolve_retrieval_parameters
from app.core.config import settings

router = APIRouter(prefix="/generations", tags=["Generation"])

@router.post("", response_model=ApiResponse[GeneratePoemResponse])
async def generate_poem_endpoint(
    req: GeneratePoemRequest,
    orchestrator: GenerationOrchestrator = Depends(get_generation_orchestrator)
):
    params = resolve_retrieval_parameters(req)
    result = await orchestrator.generate_poem(
        first_verse=req.first_verse,
        poetry_form=req.poetry_form,
        author_style=req.author_style,
        period_style=req.period_style,
        top_k=params.top_k,
        embedding_k=params.embedding_k,
        bm25_k=params.bm25_k,
        alpha=params.alpha,
        temperature=settings.GENERATION_TEMPERATURE,
        max_output_tokens=settings.GENERATION_MAX_OUTPUT_TOKENS,
        timeout_seconds=settings.GENERATION_TIMEOUT_SECONDS,
    )
    
    response_data = GeneratePoemResponse(
        id=result.id,
        status=result.status,
        title=result.title,
        lines=result.lines,
        full_text=result.full_text,
        sources=[s.__dict__ for s in result.sources],
        validation_passed=result.validation_passed,
        validation_errors=result.validation_errors,
        attempt_count=result.attempt_count,
        provider=result.provider,
        model=result.model,
        prompt_version=result.prompt_version,
        corpus_version=result.corpus_version,
        timings_ms=result.timings_ms,
        created_at=result.created_at
    )
    
    return ApiResponse(data=response_data)