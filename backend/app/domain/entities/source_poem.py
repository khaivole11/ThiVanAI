from dataclasses import dataclass
from typing import Optional

@dataclass
class SourcePoem:
    poem_id: str
    title: str
    author: str
    genre: str
    period: str
    content_excerpt: str
    url: Optional[str] = None
    rank: int = 0
    dense_score: float = 0.0
    bm25_score: float = 0.0
    hybrid_score: float = 0.0