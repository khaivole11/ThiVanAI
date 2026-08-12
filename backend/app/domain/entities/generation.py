from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from app.domain.enums.generation_status import GenerationStatus
from app.domain.entities.source_poem import SourcePoem

@dataclass
class GenerationResult:
    id: str
    status: GenerationStatus
    title: str
    lines: List[str]
    full_text: str
    sources: List[SourcePoem]
    validation_passed: bool
    validation_errors: List[str]
    attempt_count: int
    provider: str
    model: str
    prompt_version: str
    corpus_version: str
    timings_ms: Dict[str, float] = field(default_factory=dict)
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))