from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class SearchRequest(BaseModel):
    first_verse: str = Field(..., alias="firstVerse", description="Câu mở đầu bài thơ")
    genre: Optional[str] = Field(None, description="Thể loại thơ")
    author: Optional[str] = Field(None, description="Tác giả")
    period: Optional[str] = Field(None, description="Thời kỳ")
    top_k: Optional[int] = Field(None, alias="topK", ge=1)
    embedding_k: Optional[int] = Field(None, alias="embeddingK", ge=1)
    bm25_k: Optional[int] = Field(None, alias="bm25K", ge=1)
    alpha: Optional[float] = Field(None, ge=0.0, le=1.0)
    
    model_config = ConfigDict(populate_by_name=True)

class SourcePoemSchema(BaseModel):
    poem_id: str = Field(..., alias="poemId")
    title: str
    author: str
    genre: str
    specific_genre: str = Field("", alias="specificGenre")
    period: str
    content_excerpt: str = Field(..., alias="contentExcerpt")
    url: Optional[str] = None
    rank: int
    dense_score: float = Field(..., alias="denseScore")
    bm25_score: float = Field(..., alias="bm25Score")
    hybrid_score: float = Field(..., alias="hybridScore")

    model_config = ConfigDict(populate_by_name=True)
