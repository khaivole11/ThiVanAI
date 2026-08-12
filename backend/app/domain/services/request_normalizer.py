from typing import Optional

from app.core.resources import DomainResources
from app.core.errors import PoetryConstraintError
from app.domain.rules.syllables import count_vietnamese_syllables
from app.domain.enums.poetry_form import PoetryForm

class RequestNormalizer:
    def __init__(self, resources: DomainResources):
        self._resources = resources

    @staticmethod
    def normalize_choice(value: Optional[str], choices: list, field_name: str, required: bool = True) -> Optional[str]:
        if value is None or str(value).strip() == "":
            if required:
                raise PoetryConstraintError(f"{field_name} is required")
            return None

        text = str(value).strip()
        if text.isdigit():
            idx = int(text) - 1
            if 0 <= idx < len(choices):
                return choices[idx]

        for choice in choices:
            if text.casefold() == choice.casefold():
                return choice

        if required:
            raise PoetryConstraintError(
                f"{field_name} is invalid",
                details={"allowedValues": choices},
            )
        return None

    def validate_opening_verse(self, first_verse: str, form: PoetryForm) -> None:
        spec = self._resources.poetry_form_specs[form.value]
        expected = spec.opening_syllables
        if expected is None:
            return

        actual = count_vietnamese_syllables(first_verse)
        if actual != expected:
            raise PoetryConstraintError(
                f"Opening verse for {form.value} must contain exactly {expected} syllables",
                details={
                    "form": form.value,
                    "expectedSyllables": expected,
                    "actualSyllables": actual,
                    "openingVerse": first_verse,
                },
            )