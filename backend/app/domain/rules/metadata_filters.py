import unicodedata
from typing import Any, Mapping


MetadataAliases = Mapping[str, tuple[str, ...]]

POETRY_FORM_ALIASES: MetadataAliases = {
    "Lục bát": ("lục bát",),
    "Thơ bảy chữ": ("bảy chữ",),
    "Thất ngôn bát cú": ("thất ngôn bát cú",),
    "Thất ngôn bát cú Đường luật": (
        "thất ngôn bát cú",
        "đường luật",
        "đường luật biến thể",
    ),
    "Thất ngôn tứ tuyệt": ("thất ngôn tứ tuyệt",),
    "Thơ tám chữ": ("tám chữ",),
    "Thơ tự do": ("thơ tự do", "tự do"),
    "Thơ năm chữ": ("năm chữ",),
    "Thơ bốn chữ": ("bốn chữ", "tứ ngôn"),
    "Thơ sáu chữ": ("sáu chữ",),
    "Song thất lục bát": ("song thất lục bát",),
}


def normalize_metadata_text(value: Any) -> str:
    return unicodedata.normalize("NFKC", str(value or "")).strip().casefold()


def metadata_value_variants(
    value: Any,
    aliases: MetadataAliases | None = None,
) -> list[str]:
    text = str(value or "").strip()
    if not text:
        return []

    variants: list[str] = [text]
    normalized_text = normalize_metadata_text(text)

    for canonical, alias_values in (aliases or {}).items():
        alias_group = (canonical, *alias_values)
        if normalized_text in {normalize_metadata_text(item) for item in alias_group}:
            variants.extend(alias_group)

    expanded: list[str] = []
    for item in variants:
        item_text = str(item or "").strip()
        if not item_text:
            continue
        expanded.extend([item_text, item_text.lower(), item_text.title()])

    return list(dict.fromkeys(expanded))


def metadata_value_matches(
    actual: Any,
    expected: Any,
    aliases: MetadataAliases | None = None,
) -> bool:
    actual_text = normalize_metadata_text(actual)
    if not actual_text:
        return False

    expected_values = {
        normalize_metadata_text(item)
        for item in metadata_value_variants(expected, aliases)
    }
    return actual_text in expected_values


def poetry_form_value_variants(value: Any) -> list[str]:
    return metadata_value_variants(value, POETRY_FORM_ALIASES)


def combine_chroma_filters(filters: list[dict[str, Any]]) -> dict[str, Any] | None:
    if not filters:
        return None
    if len(filters) == 1:
        return filters[0]
    return {"$or": filters}


def build_chroma_metadata_or_filter(
    genre: str | None = None,
    author: str | None = None,
    period: str | None = None,
    *,
    metadata_aliases: MetadataAliases | None = None,
) -> dict[str, Any] | None:
    form_filters: list[dict[str, Any]] = []
    style_filters: list[dict[str, Any]] = []

    if genre:
        for value in poetry_form_value_variants(genre):
            form_filters.append({"genre": {"$eq": value}})
            form_filters.append({"specific_genre": {"$eq": value}})

    if period:
        for value in metadata_value_variants(period, metadata_aliases):
            style_filters.append({"period": {"$eq": value}})

    if author:
        for value in metadata_value_variants(author):
            style_filters.append({"author": {"$eq": value}})

    clauses = [
        clause
        for clause in (
            combine_chroma_filters(form_filters),
            combine_chroma_filters(style_filters),
        )
        if clause is not None
    ]

    if not clauses:
        return None
    if len(clauses) == 1:
        return clauses[0]
    return {"$and": clauses}


def metadata_matches_or(
    metadata: Mapping[str, Any],
    genre: str | None = None,
    author: str | None = None,
    period: str | None = None,
    *,
    metadata_aliases: MetadataAliases | None = None,
) -> bool:
    if genre and not (
        metadata_value_matches(
            metadata.get("genre"),
            genre,
            aliases=POETRY_FORM_ALIASES,
        )
        or metadata_value_matches(
            metadata.get("specific_genre"),
            genre,
            aliases=POETRY_FORM_ALIASES,
        )
    ):
        return False

    style_conditions: list[bool] = []
    if period:
        style_conditions.append(
            metadata_value_matches(
                metadata.get("period"),
                period,
                aliases=metadata_aliases,
            )
        )

    if author:
        style_conditions.append(metadata_value_matches(metadata.get("author"), author))

    if not style_conditions:
        return True
    return any(style_conditions)
