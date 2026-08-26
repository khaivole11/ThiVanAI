from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class FeedbackRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    labels: list[str] = Field(default_factory=list, max_length=12)
    comment: str | None = Field(default=None, max_length=2000)

    @field_validator("labels", mode="after")
    @classmethod
    def normalize_labels(cls, labels: list[str]) -> list[str]:
        normalized: list[str] = []
        seen: set[str] = set()
        for label in labels:
            clean_label = label.strip()
            if not clean_label or clean_label in seen:
                continue
            if len(clean_label) > 64:
                raise ValueError("Each feedback label must be 64 characters or fewer")
            normalized.append(clean_label)
            seen.add(clean_label)
        return normalized

    @field_validator("comment", mode="after")
    @classmethod
    def normalize_comment(cls, comment: str | None) -> str | None:
        if comment is None:
            return None
        normalized = comment.strip()
        return normalized or None


class FeedbackResponse(BaseModel):
    id: str
    generation_id: str = Field(..., alias="generationId")
    rating: int
    labels: list[str] = Field(default_factory=list)
    comment: str | None = None
    created_at: datetime = Field(..., alias="createdAt")

    model_config = ConfigDict(populate_by_name=True)
