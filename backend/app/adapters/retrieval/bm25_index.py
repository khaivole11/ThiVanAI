import pickle
import re
from pathlib import Path
from typing import List, Dict, Any
from rank_bm25 import BM25Okapi

def tokenize_vi(text: str) -> List[str]:
    text = str(text).lower()
    text = re.sub(r"[^\wÀ-ỹ\s]", " ", text, flags=re.UNICODE)
    return [token for token in text.split() if token]

def same_text(a: Any, b: Any) -> bool:
    return str(a or "").strip().casefold() == str(b or "").strip().casefold()

def metadata_matches_or(metadata: dict, genre: str = None, author: str = None, period: str = None) -> bool:
    conditions = []
    if genre:
        conditions.append(
            same_text(metadata.get("genre"), genre) or same_text(metadata.get("specific_genre"), genre)
        )
    if author:
        conditions.append(same_text(metadata.get("author"), author))
    if period:
        conditions.append(same_text(metadata.get("period"), period))

    if not conditions:
        return True
    return any(conditions)

class BM25IndexAdapter:
    def __init__(self, artifact_path: str):
        self.artifact_path = Path(artifact_path)
        self.bm25: BM25Okapi = None
        self.documents: List[Dict[str, Any]] = []

    def load(self):
        if not self.artifact_path.exists():
            return
        with open(self.artifact_path, "rb") as f:
            data = pickle.load(f)
            self.bm25 = data["bm25"]
            self.documents = data["documents"]

    def build_and_save(self, documents: List[Dict[str, Any]]):
        self.documents = documents
        corpus_tokens = []
        for doc in documents:
            text = f"{doc.get('title', '')}\n{doc.get('author', '')}\n{doc.get('genre', '')}\n{doc.get('specific_genre', '')}\n{doc.get('period', '')}\n{doc.get('content', '')}"
            corpus_tokens.append(tokenize_vi(text))
            
        self.bm25 = BM25Okapi(corpus_tokens)
        
        self.artifact_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self.artifact_path, "wb") as f:
            pickle.dump({"bm25": self.bm25, "documents": self.documents}, f)

    def search(
        self,
        query: str,
        genre: str = None,
        author: str = None,
        period: str = None,
        *,
        limit: int,
    ) -> List[Dict[str, Any]]:
        if not self.bm25 or not self.documents:
            return []

        tokens = tokenize_vi(query)
        scores = self.bm25.get_scores(tokens)

        candidate_indices = [
            i for i, doc in enumerate(self.documents)
            if metadata_matches_or(doc.get('metadata', doc), genre=genre, author=author, period=period)
        ]

        top_indices = sorted(
            candidate_indices,
            key=lambda i: scores[i],
            reverse=True
        )[:limit]

        results = []
        for i in top_indices:
            doc = dict(self.documents[i])
            doc["score"] = float(scores[i])
            results.append(doc)

        return results