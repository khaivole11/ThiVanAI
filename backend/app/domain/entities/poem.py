from dataclasses import dataclass
from typing import Optional

@dataclass
class Poem:
    id: str
    content: str
    title: str
    url: Optional[str] = None
    genre: Optional[str] = None
    period: Optional[str] = None
    specific_genre: Optional[str] = None
    author: Optional[str] = None