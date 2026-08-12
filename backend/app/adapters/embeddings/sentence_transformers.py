from typing import List
from sentence_transformers import SentenceTransformer
from app.ports.embedding_provider import IEmbeddingProvider

class SentenceTransformersAdapter(IEmbeddingProvider):
    def __init__(self, model_name: str):
        self.model = SentenceTransformer(model_name)

    def embed_queries(self, texts: List[str]) -> List[List[float]]:
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        embeddings = self.model.encode(texts, convert_to_numpy=True)
        return embeddings.tolist()