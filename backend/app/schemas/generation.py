from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional, Dict
from datetime import datetime
from app.domain.enums.poetry_form import PoetryForm
from app.domain.enums.generation_status import GenerationStatus
from app.schemas.retrieval import SourcePoemSchema

class GeneratePoemRequest(BaseModel):
    first_verse: str = Field(..., alias="firstVerse", min_length=2)
    poetry_form: PoetryForm = Field(..., alias="poetryForm")
    author_style: Optional[str] = Field(None, alias="authorStyle")
    period_style: Optional[str] = Field(None, alias="periodStyle")
    top_k: Optional[int] = Field(None, alias="topK", ge=1)
    embedding_k: Optional[int] = Field(None, alias="embeddingK", ge=1)
    bm25_k: Optional[int] = Field(None, alias="bm25K", ge=1)
    alpha: Optional[float] = Field(None, ge=0.0, le=1.0)

    model_config = ConfigDict(populate_by_name=True)

class GeneratePoemResponse(BaseModel):
    id: str
    status: GenerationStatus
    title: str
    lines: List[str]
    full_text: str = Field(..., alias="fullText")
    sources: List[SourcePoemSchema]
    validation_passed: bool = Field(..., alias="validationPassed")
    validation_errors: List[str] = Field(default_factory=list, alias="validationErrors")
    attempt_count: int = Field(..., alias="attemptCount")
    provider: str
    model: str
    prompt_version: str = Field(..., alias="promptVersion")
    corpus_version: str = Field(..., alias="corpusVersion")
    timings_ms: Dict[str, float] = Field(default_factory=dict, alias="timingsMs")
    created_at: datetime = Field(..., alias="createdAt")

    model_config = ConfigDict(populate_by_name=True)