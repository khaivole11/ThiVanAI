from dataclasses import dataclass

from fastapi import HTTPException, Request, status

from app.core.config import settings
from app.domain.services.hybrid_retriever import HybridRetrieverService
from app.domain.services.generation_orchestrator import GenerationOrchestrator
from app.domain.services.poem_analysis import PoemAnalysisService
from app.ports.feedback_repository import IFeedbackRepository
from app.ports.result_repository import IResultRepository

@dataclass(frozen=True)
class RetrievalParameters:
    top_k: int
    embedding_k: int
    bm25_k: int
    alpha: float

def resolve_retrieval_parameters(req) -> RetrievalParameters:
    params = RetrievalParameters(
        top_k=req.top_k if req.top_k is not None else settings.RETRIEVAL_TOP_K,
        embedding_k=req.embedding_k if req.embedding_k is not None else settings.RETRIEVAL_EMBEDDING_K,
        bm25_k=req.bm25_k if req.bm25_k is not None else settings.RETRIEVAL_BM25_K,
        alpha=req.alpha if req.alpha is not None else settings.RETRIEVAL_ALPHA,
    )
    errors: list[str] = []
    if params.top_k > settings.RETRIEVAL_MAX_TOP_K:
        errors.append("topK must not exceed RETRIEVAL_MAX_TOP_K")
    if params.embedding_k > settings.RETRIEVAL_MAX_CANDIDATE_K:
        errors.append("embeddingK must not exceed RETRIEVAL_MAX_CANDIDATE_K")
    if params.bm25_k > settings.RETRIEVAL_MAX_CANDIDATE_K:
        errors.append("bm25K must not exceed RETRIEVAL_MAX_CANDIDATE_K")
    if errors:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail={"code": "INVALID_RETRIEVAL_PARAMETERS", "errors": errors},
        )
    return params

def get_hybrid_retriever(request: Request) -> HybridRetrieverService:
    return request.app.state.retriever

def get_result_repository(request: Request) -> IResultRepository:
    return request.app.state.repository

def get_feedback_repository(request: Request) -> IFeedbackRepository:
    return request.app.state.feedback_repository

def get_generation_orchestrator(request: Request) -> GenerationOrchestrator:
    return request.app.state.orchestrator

def get_poem_analysis_service(request: Request) -> PoemAnalysisService:
    return request.app.state.poem_analysis_service
