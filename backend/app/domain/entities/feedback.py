from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import List


@dataclass(frozen=True)
class GenerationFeedback:
    id: str
    generation_id: str
    rating: int
    labels: List[str] = field(default_factory=list)
    comment: str | None = None
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
