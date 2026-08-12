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