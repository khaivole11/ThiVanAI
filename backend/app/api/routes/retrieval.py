from fastapi import APIRouter, Depends
from app.schemas.common import ApiResponse
from app.schemas.retrieval import SearchRequest, SourcePoemSchema
from app.domain.services.hybrid_retriever import HybridRetrieverService
from app.api.dependencies import get_hybrid_retriever, resolve_retrieval_parameters

router = APIRouter(prefix="/retrieval", tags=["Retrieval Research"])

@router.post("/search", response_model=ApiResponse[list[SourcePoemSchema]])
async def search_sources(
    req: SearchRequest,
    retriever: HybridRetrieverService = Depends(get_hybrid_retriever)
):
    params = resolve_retrieval_parameters(req)
    results = retriever.search(
        query=req.first_verse,
        genre=req.genre,
        author=req.author,
        period=req.period,
        top_k=params.top_k,
        embedding_k=params.embedding_k,
        bm25_k=params.bm25_k,
        alpha=params.alpha,
    )
    schemas = [SourcePoemSchema(**src.__dict__) for src in results]
    return ApiResponse(data=schemas)