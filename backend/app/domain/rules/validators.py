from typing import Any, Dict, List, Tuple

from app.core.resources import DomainResources
from app.domain.enums.poetry_form import PoetryForm
from app.domain.rules.syllables import count_vietnamese_syllables


def clean_poem_lines(poem_text: str) -> List[str]:
    return [line.strip() for line in poem_text.splitlines() if line.strip()]


def make_error(line_number: int, line: str, expected: str, actual: str) -> Dict[str, Any]:
    return {
        "line_number": line_number,
        "line": line,
        "expected": expected,
        "actual": actual,
    }

class PoetryValidator:
    def __init__(self, resources: DomainResources):
        self._resources = resources

    def validate(self, form: PoetryForm, lines: List[str]) -> Tuple[bool, List[str]]:
        spec = self._resources.poetry_form_specs[form.value]
        raw_errors: list[Dict[str, Any]] = []

        if spec.required_line_count is not None and len(lines) != spec.required_line_count:
            raw_errors.append({
                "line_number": None,
                "line": None,
                "expected": f"exactly {spec.required_line_count} lines",
                "actual": f"{len(lines)} lines",
            })

        if spec.stanza_multiple is not None and len(lines) % spec.stanza_multiple != 0:
            raw_errors.append({
                "line_number": None,
                "line": None,
                "expected": f"a line count divisible by {spec.stanza_multiple}",
                "actual": f"{len(lines)} lines",
            })

        if spec.line_pattern:
            for line_number, line in enumerate(lines, 1):
                expected = spec.line_pattern[(line_number - 1) % len(spec.line_pattern)]
                actual = count_vietnamese_syllables(line)
                if actual != expected:
                    raw_errors.append(make_error(
                        line_number,
                        line,
                        f"{expected} syllables",
                        f"{actual} syllables",
                    ))

        messages: list[str] = []
        for err in raw_errors:
            if err["line_number"] is None:
                messages.append(
                    f"Invalid poem structure: expected {err['expected']}; received {err['actual']}."
                )
            else:
                messages.append(
                    f"Line {err['line_number']} ({err['line']!r}): "
                    f"expected {err['expected']}; received {err['actual']}."
                )

        return not messages, messages