from fastapi import APIRouter
from app.schemas.common import ApiResponse
from app.schemas.history import FeedbackRequest

router = APIRouter(prefix="/generations", tags=["Feedback"])

@router.post("/{generation_id}/feedback", response_model=ApiResponse[dict])
async def submit_feedback(generation_id: str, req: FeedbackRequest):
    return ApiResponse(data={"generation_id": generation_id, "rating": req.rating, "status": "recorded"})