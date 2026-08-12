from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
from app.schemas.generation import GeneratePoemResponse

class HistoryListResponse(BaseModel):
    items: List[GeneratePoemResponse]
    total: int
    page: int
    page_size: int = Field(..., alias="pageSize")

    model_config = ConfigDict(populate_by_name=True)

class FeedbackRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = None