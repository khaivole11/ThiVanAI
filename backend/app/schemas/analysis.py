from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, ConfigDict, Field


class AnalyzePoemRequest(BaseModel):
    title: str = Field(..., min_length=1)
    lines: List[str] = Field(..., min_length=1)
    full_text: str = Field(..., alias="fullText", min_length=1)
    poetry_form: str = Field(..., alias="poetryForm", min_length=1)
    opening_verse: str = Field(..., alias="openingVerse", min_length=1)
    author_style: Optional[str] = Field(None, alias="authorStyle")
    period_style: Optional[str] = Field(None, alias="periodStyle")

    model_config = ConfigDict(populate_by_name=True)


class PoemFormAnalysis(BaseModel):
    poem_type: str = Field(..., alias="poemType")
    line_count: int = Field(..., alias="lineCount", ge=1)
    rhyme_pattern: str = Field(..., alias="rhymePattern")
    rhythm_notes: str = Field(..., alias="rhythmNotes")

    model_config = ConfigDict(populate_by_name=True)


class PoemMeaningAnalysis(BaseModel):
    main_theme: str = Field(..., alias="mainTheme")
    emotional_tone: str = Field(..., alias="emotionalTone")
    message: str

    model_config = ConfigDict(populate_by_name=True)


class LiteraryDeviceAnalysis(BaseModel):
    type: str
    quote: str
    effect: str

    model_config = ConfigDict(populate_by_name=True)


class QualityReview(BaseModel):
    score: int = Field(..., ge=0, le=10)
    strengths: List[str]
    weaknesses: List[str]
    revision_suggestions: List[str] = Field(..., alias="revisionSuggestions")

    model_config = ConfigDict(populate_by_name=True)


class PoemAnalysisPayload(BaseModel):
    summary: str
    form: PoemFormAnalysis
    meaning: PoemMeaningAnalysis
    literary_devices: List[LiteraryDeviceAnalysis] = Field(..., alias="literaryDevices")
    quality_review: QualityReview = Field(..., alias="qualityReview")
    student_friendly_analysis: str = Field(..., alias="studentFriendlyAnalysis")

    model_config = ConfigDict(populate_by_name=True)


class PoemAnalysisResponse(PoemAnalysisPayload):
    provider: str
    model: str
    created_at: datetime = Field(..., alias="createdAt")

    model_config = ConfigDict(populate_by_name=True)
