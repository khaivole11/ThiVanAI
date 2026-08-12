import json
from dataclasses import dataclass
from importlib.resources import files
from typing import Mapping

from app.domain.enums.poetry_form import PoetryForm


@dataclass(frozen=True)
class PoetryFormSpec:
    opening_syllables: int | None
    line_pattern: tuple[int, ...]
    required_line_count: int | None
    stanza_multiple: int | None
    prompt_rule: str


@dataclass(frozen=True)
class DomainResources:
    catalog_version: str
    prompt_version: str
    fallbacks: Mapping[str, str]
    periods: tuple[str, ...]
    period_aliases: Mapping[str, tuple[str, ...]]
    corpus_required_columns: tuple[str, ...]
    poetry_form_specs: Mapping[str, PoetryFormSpec]
    prompt_template: str
    context_separator: str
    context_source_template: str
    generation_title_template: str


def load_domain_resources() -> DomainResources:
    root = files("app.resources")
    catalog = json.loads(root.joinpath("domain_catalog.v1.json").read_text(encoding="utf-8"))
    template = root.joinpath("prompts", "poem_prompt_v1.txt").read_text(encoding="utf-8")

    form_specs = {
        name: PoetryFormSpec(
            opening_syllables=spec.get("openingSyllables"),
            line_pattern=tuple(spec.get("linePattern", [])),
            required_line_count=spec.get("requiredLineCount"),
            stanza_multiple=spec.get("stanzaMultiple"),
            prompt_rule=spec["promptRule"],
        )
        for name, spec in catalog["poetryForms"].items()
    }
    enum_values = {form.value for form in PoetryForm}
    if set(form_specs) != enum_values:
        raise ValueError("PoetryForm enum and domain catalog keys must match exactly")

    return DomainResources(
        catalog_version=catalog["catalogVersion"],
        prompt_version=catalog["promptVersion"],
        fallbacks=catalog["fallbacks"],
        periods=tuple(catalog["periods"]),
        period_aliases={
            canonical: tuple(aliases)
            for canonical, aliases in catalog["periodAliases"].items()
        },
        corpus_required_columns=tuple(catalog["corpusSchema"]["requiredColumns"]),
        poetry_form_specs=form_specs,
        prompt_template=template,
        context_separator=catalog["context"]["separator"],
        context_source_template=catalog["context"]["sourceTemplate"],
        generation_title_template=catalog["generationTitleTemplate"],
    )