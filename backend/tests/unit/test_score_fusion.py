import pytest
from app.domain.services.hybrid_retriever import HybridRetrieverService

class MockChroma:
    def search(self, query, genre=None, author=None, period=None, *, limit):
        return [
            {"id": "1", "content": "Bài thơ 1", "metadata": {"id": "1", "title": "T1", "author": "A1"}, "distance": 0.2},
            {"id": "2", "content": "Bài thơ 2", "metadata": {"id": "2", "title": "T2", "author": "A2"}, "distance": 0.5}
        ]

class MockBM25:
    def search(self, query, genre=None, author=None, period=None, *, limit):
        return [
            {"id": "1", "title": "T1", "author": "A1", "content": "Bài thơ 1", "score": 10.0},
            {"id": "3", "title": "T3", "author": "A3", "content": "Bài thơ 3", "score": 5.0}
        ]

def test_hybrid_fusion_min_max():
    retriever = HybridRetrieverService(chroma_store=MockChroma(), bm25_index=MockBM25())
    results = retriever.search(
        query="nắng hồng",
        top_k=3,
        embedding_k=20,
        bm25_k=20,
        alpha=0.65,
    )
    
    assert len(results) == 3
    assert results[0].poem_id == "1"
    assert results[0].rank == 1
    assert results[0].hybrid_score >= results[1].hybrid_score


class OpposedDense:
    def search(self, query, genre=None, author=None, period=None, *, limit):
        return [
            {"id": "dense", "content": "Dense thắng", "metadata": {"id": "dense", "title": "Dense", "author": "A"}, "distance": 0.0},
            {"id": "bm25", "content": "BM25 thắng", "metadata": {"id": "bm25", "title": "BM25", "author": "B"}, "distance": 9.0},
        ]


class OpposedBM25:
    def search(self, query, genre=None, author=None, period=None, *, limit):
        return [
            {"id": "dense", "title": "Dense", "author": "A", "content": "Dense thắng", "score": 0.0},
            {"id": "bm25", "title": "BM25", "author": "B", "content": "BM25 thắng", "score": 10.0},
        ]


def test_hybrid_fusion_prefers_bm25_with_dense_alpha_035():
    retriever = HybridRetrieverService(
        chroma_store=OpposedDense(),
        bm25_index=OpposedBM25(),
    )

    results = retriever.search(
        query="nắng hồng",
        top_k=2,
        embedding_k=20,
        bm25_k=20,
        alpha=0.35,
    )

    assert [result.poem_id for result in results] == ["bm25", "dense"]
    assert results[0].hybrid_score == 0.65
    assert results[1].hybrid_score == 0.35


class LeakyChroma:
    def search(self, query, genre=None, author=None, period=None, *, limit):
        return [
            {
                "id": "form",
                "content": "Chỉ match thể thơ",
                "metadata": {
                    "id": "form",
                    "title": "Chỉ theo thể",
                    "author": "A",
                    "genre": "lục bát",
                    "specific_genre": "lục bát",
                    "period": "Nguyễn",
                },
                "distance": 0.1,
            },
            {
                "id": "period",
                "content": "Match thời kỳ",
                "metadata": {
                    "id": "period",
                    "title": "Theo thời kỳ",
                    "author": "B",
                    "genre": "lục bát",
                    "specific_genre": "lục bát",
                    "period": "Hiện đại",
                },
                "distance": 0.2,
            },
            {
                "id": "author",
                "content": "Match tác giả",
                "metadata": {
                    "id": "author",
                    "title": "Theo tác giả",
                    "author": "Nguyễn Du",
                    "genre": "lục bát",
                    "specific_genre": "lục bát",
                    "period": "Trần",
                },
                "distance": 0.3,
            },
            {
                "id": "none",
                "content": "Không match metadata",
                "metadata": {
                    "id": "none",
                    "title": "Không hợp",
                    "author": "C",
                    "genre": "năm chữ",
                    "specific_genre": "năm chữ",
                    "period": "Tây Sơn",
                },
                "distance": 0.4,
            },
        ]


class EmptyBM25:
    def search(self, query, genre=None, author=None, period=None, *, limit):
        return []


def test_hybrid_retriever_enforces_metadata_or_after_fusion():
    retriever = HybridRetrieverService(chroma_store=LeakyChroma(), bm25_index=EmptyBM25())
    results = retriever.search(
        query="nắng hồng",
        genre="Lục bát",
        period="Hiện đại",
        author="Nguyễn Du",
        top_k=10,
        embedding_k=20,
        bm25_k=20,
        alpha=0.65,
    )

    assert {result.poem_id for result in results} == {"period", "author"}
    assert "form" not in {result.poem_id for result in results}
    assert "none" not in {result.poem_id for result in results}


def test_hybrid_retriever_uses_poetry_form_when_no_author_or_period():
    retriever = HybridRetrieverService(chroma_store=LeakyChroma(), bm25_index=EmptyBM25())
    results = retriever.search(
        query="nắng hồng",
        genre="Lục bát",
        top_k=10,
        embedding_k=20,
        bm25_k=20,
        alpha=0.65,
    )

    assert {result.poem_id for result in results} == {"form", "period", "author"}
    assert "none" not in {result.poem_id for result in results}
