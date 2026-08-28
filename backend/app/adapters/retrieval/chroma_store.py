import chromadb
from typing import List, Dict, Any
from app.ports.vector_store import IVectorStore
from app.adapters.embeddings.sentence_transformers import SentenceTransformersAdapter
from app.domain.rules.metadata_filters import build_chroma_metadata_or_filter

class ChromaStoreAdapter(IVectorStore):
    def __init__(
        self,
        path: str,
        collection_name: str,
        embedding_model_name: str,
        metadata_aliases: Dict[str, tuple[str, ...]],
        *,
        create_if_missing: bool,
    ):
        self.client = chromadb.PersistentClient(path=path)
        self.collection_name = collection_name
        self.metadata_aliases = metadata_aliases
        self.embedder = SentenceTransformersAdapter(embedding_model_name)
        if create_if_missing:
            self.collection = self.client.get_or_create_collection(name=collection_name)
        else:
            self.collection = self.client.get_collection(name=collection_name)

    def search(
        self,
        query: str,
        genre: str = None,
        author: str = None,
        period: str = None,
        *,
        limit: int,
    ) -> List[Dict[str, Any]]:
        query_vec = self.embedder.embed_queries([query])[0]
        where_clause = build_chroma_metadata_or_filter(
            genre=genre,
            author=author,
            period=period,
            metadata_aliases=self.metadata_aliases,
        )

        results = self.collection.query(
            query_embeddings=[query_vec],
            n_results=limit,
            where=where_clause
        )
        
        parsed = []
        if results and results.get('ids') and results['ids'][0]:
            ids = results['ids'][0]
            documents = results['documents'][0]
            metadatas = results['metadatas'][0]
            distances = results['distances'][0]
            
            for i in range(len(ids)):
                parsed.append({
                    'id': ids[i],
                    'content': documents[i],
                    'metadata': metadatas[i],
                    'distance': distances[i]
                })
        return parsed
