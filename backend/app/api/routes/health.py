from fastapi import APIRouter, Request, status, HTTPException
from app.schemas.common import ApiResponse

router = APIRouter(prefix="/health", tags=["Health & Readiness"])

@router.get("/live", response_model=ApiResponse[dict])
async def health_live():
    return ApiResponse(data={"status": "alive"})

@router.get("/ready", response_model=ApiResponse[dict])
async def health_ready(request: Request):
    manifest = getattr(request.app.state, "manifest", None)
    if not manifest:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Manifest dữ liệu chưa được khởi tạo. Hãy chạy script ingest_corpus.py trước."
        )
    return ApiResponse(data={
        "status": "ready",
        "manifest": manifest
    })