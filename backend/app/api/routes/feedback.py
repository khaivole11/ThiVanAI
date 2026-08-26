from fastapi import APIRouter, Depends, Path, status

from app.api.dependencies import get_feedback_repository
from app.schemas.common import ApiResponse
from app.schemas.feedback import FeedbackRequest, FeedbackResponse
from app.ports.feedback_repository import IFeedbackRepository

router = APIRouter(prefix="/generations", tags=["Feedback"])

@router.post(
    "/{generation_id}/feedback",
    response_model=ApiResponse[FeedbackResponse],
    status_code=status.HTTP_201_CREATED,
)
async def submit_feedback(
    req: FeedbackRequest,
    generation_id: str = Path(..., min_length=1),
    repo: IFeedbackRepository = Depends(get_feedback_repository),
):
    feedback = await repo.save_feedback(
        generation_id=generation_id,
        rating=req.rating,
        labels=req.labels,
        comment=req.comment,
    )
    return ApiResponse(
        data=FeedbackResponse(
            id=feedback.id,
            generation_id=feedback.generation_id,
            rating=feedback.rating,
            labels=feedback.labels,
            comment=feedback.comment,
            created_at=feedback.created_at,
        )
    )
