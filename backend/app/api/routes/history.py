from fastapi import APIRouter, Depends, HTTPException, Query, status
from app.core.config import settings
from app.schemas.common import ApiResponse
from app.schemas.history import HistoryListResponse
from app.api.dependencies import get_result_repository
from app.ports.result_repository import IResultRepository

router = APIRouter(prefix="/generations", tags=["History"])

@router.get("", response_model=ApiResponse[HistoryListResponse])
async def get_history(
    page: int = Query(1, ge=1),
    page_size: int | None = Query(None, ge=1),
    repo: IResultRepository = Depends(get_result_repository)
):
    effective_page_size = page_size or settings.HISTORY_DEFAULT_PAGE_SIZE
    if effective_page_size > settings.HISTORY_MAX_PAGE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="pageSize must not exceed HISTORY_MAX_PAGE_SIZE",
        )
    offset = (page - 1) * effective_page_size
    items = await repo.list_generations(limit=effective_page_size, offset=offset)
    
    history_items = []
    for item in items:
        history_items.append({
            "id": item.id,
            "status": item.status,
            "title": item.title,
            "lines": item.lines,
            "fullText": item.full_text,
            "sources": [],
            "validationPassed": item.validation_passed,
            "validationErrors": item.validation_errors,
            "attemptCount": item.attempt_count,
            "provider": item.provider,
            "model": item.model,
            "promptVersion": item.prompt_version,
            "corpusVersion": item.corpus_version,
            "timingsMs": {},
            "createdAt": item.created_at
        })
        
    return ApiResponse(data=HistoryListResponse(
        items=history_items,
        total=len(history_items),
        page=page,
        pageSize=effective_page_size
    ))