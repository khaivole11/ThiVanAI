import numpy as np
from typing import List, Dict, Any
from app.domain.entities.source_poem import SourcePoem

def doc_key(item: dict) -> str:
    meta = item.get("metadata", item)
    key = item.get("id") or meta.get("id") or meta.get("url")
    if not key:
        raise ValueError("Retrieved document must contain a stable id or URL")
    return str(key)

def normalize_score_dict(score_dict: Dict[str, float]) -> Dict[str, float]:
    if not score_dict:
        return {}
    values = np.array(list(score_dict.values()), dtype=float)
    min_score = values.min()
    max_score = values.max()

    if max_score == min_score:
        return {key: 1.0 for key in score_dict}

    return {
        key: float((val - min_score) / (max_score - min_score))
        for key, val in score_dict.items()
    }

class HybridRetrieverService:
    def __init__(self, chroma_store, bm25_index):
        self.chroma_store = chroma_store
        self.bm25_index = bm25_index

    def search(
        self,
        query: str,
        genre: str = None,
        author: str = None,
        period: str = None,
        *,
        top_k: int,
        embedding_k: int,
        bm25_k: int,
        alpha: float,
    ) -> List[SourcePoem]:
        dense_results = self.chroma_store.search(
            query=query,
            genre=genre,
            author=author,
            period=period,
            limit=embedding_k
        )
        
        embedding_docs = {}
        embedding_scores = {}
        for item in dense_results:
            key = doc_key(item)
            embedding_docs[key] = item
            dist = item['distance']
            embedding_scores[key] = 1.0 / (1.0 + float(dist))

        sparse_results = self.bm25_index.search(
            query=query,
            genre=genre,
            author=author,
            period=period,
            limit=bm25_k
        )
        
        bm25_docs = {}
        bm25_scores = {}
        for item in sparse_results:
            key = doc_key(item)
            bm25_docs[key] = item
            bm25_scores[key] = float(item['score'])

        norm_embedding = normalize_score_dict(embedding_scores)
        norm_bm25 = normalize_score_dict(bm25_scores)

        all_keys = set(embedding_docs.keys()) | set(bm25_docs.keys())
        fused_list = []

        for key in all_keys:
            raw_item = embedding_docs.get(key) or bm25_docs.get(key)
            meta = raw_item.get('metadata', raw_item)
            
            e_score = norm_embedding.get(key, 0.0)
            b_score = norm_bm25.get(key, 0.0)
            h_score = alpha * e_score + (1.0 - alpha) * b_score
            
            content = raw_item.get('content', raw_item.get('page_content', ''))

            fused_list.append(SourcePoem(
                poem_id=key,
                title=str(meta['title']),
                author=str(meta['author']),
                genre=str(meta.get('genre', '')),
                period=str(meta.get('period', '')),
                content_excerpt=content,
                url=str(meta.get('url', '')),
                dense_score=e_score,
                bm25_score=b_score,
                hybrid_score=h_score,
            ))

        fused_list.sort(key=lambda x: (-x.hybrid_score, x.poem_id))
        top_sources = fused_list[:top_k]
        
        for rank, src in enumerate(top_sources, 1):
            src.rank = rank
            src.dense_score = round(src.dense_score, 4)
            src.bm25_score = round(src.bm25_score, 4)
            src.hybrid_score = round(src.hybrid_score, 4)
            
        return top_sources