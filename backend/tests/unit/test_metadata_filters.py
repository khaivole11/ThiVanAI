from app.domain.rules.metadata_filters import (
    build_chroma_metadata_or_filter,
    metadata_matches_or,
)


PERIOD_ALIASES = {
    "(Hậu Lê, Mạc, Trịnh-Nguyễn)": ("Hậu Lê, Mạc, Trịnh-Nguyễn",),
}


def test_metadata_matches_any_requested_filter():
    criteria = {
        "genre": "Lục bát",
        "period": "Hiện đại",
        "author": "Nguyễn Du",
    }

    assert metadata_matches_or(
        {"genre": "tám chữ", "period": "Hiện đại", "author": "Vô danh"},
        **criteria,
    )
    assert metadata_matches_or(
        {"genre": "bảy chữ", "specific_genre": "lục bát", "period": "Nguyễn", "author": "Vô danh"},
        **criteria,
    )
    assert metadata_matches_or(
        {"genre": "bảy chữ", "specific_genre": "thất ngôn bát cú", "period": "Nguyễn", "author": "Vô danh"},
        genre="Thơ bảy chữ",
    )
    assert metadata_matches_or(
        {"genre": "tám chữ", "period": "Nguyễn", "author": "Nguyễn Du"},
        **criteria,
    )
    assert not metadata_matches_or(
        {"genre": "tám chữ", "period": "Nguyễn", "author": "Vô danh"},
        **criteria,
    )


def test_metadata_matches_period_aliases_bidirectionally():
    assert metadata_matches_or(
        {"period": "Hậu Lê, Mạc, Trịnh-Nguyễn"},
        period="(Hậu Lê, Mạc, Trịnh-Nguyễn)",
        metadata_aliases=PERIOD_ALIASES,
    )
    assert metadata_matches_or(
        {"period": "(Hậu Lê, Mạc, Trịnh-Nguyễn)"},
        period="Hậu Lê, Mạc, Trịnh-Nguyễn",
        metadata_aliases=PERIOD_ALIASES,
    )


def test_build_chroma_metadata_filter_uses_or_across_metadata_fields():
    where_clause = build_chroma_metadata_or_filter(
        genre="Lục bát",
        period="(Hậu Lê, Mạc, Trịnh-Nguyễn)",
        author="Nguyễn Du",
        metadata_aliases=PERIOD_ALIASES,
    )

    assert where_clause is not None
    filters = where_clause["$or"]
    assert {"genre": {"$eq": "lục bát"}} in filters
    assert {"specific_genre": {"$eq": "lục bát"}} in filters
    assert {"period": {"$eq": "Hậu Lê, Mạc, Trịnh-Nguyễn"}} in filters
    assert {"author": {"$eq": "Nguyễn Du"}} in filters


def test_build_chroma_metadata_filter_includes_poetry_form_aliases():
    where_clause = build_chroma_metadata_or_filter(genre="Thơ bảy chữ")

    assert where_clause is not None
    filters = where_clause["$or"]
    assert {"genre": {"$eq": "bảy chữ"}} in filters
    assert {"specific_genre": {"$eq": "bảy chữ"}} in filters
