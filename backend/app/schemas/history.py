from pydantic import BaseModel, Field, ConfigDict
from typing import List
from app.schemas.generation import GeneratePoemResponse

class HistoryListResponse(BaseModel):
    items: List[GeneratePoemResponse]
    total: int
    page: int
    page_size: int = Field(..., alias="pageSize")

    model_config = ConfigDict(populate_by_name=True)
