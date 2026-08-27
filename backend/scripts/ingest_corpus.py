import sys
import hashlib
import pandas as pd
from pathlib import Path
from datetime import datetime, timezone

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.core.config import settings
from app.core.constants import FUSION_VERSION, TOKENIZER_VERSION
from app.core.resources import load_domain_resources
from app.adapters.retrieval.chroma_store import ChromaStoreAdapter
from app.adapters.retrieval.bm25_index import BM25IndexAdapter
from app.adapters.retrieval.artifact_manifest import ManifestManager

def compute_file_hash(filepath: str) -> str:
    hasher = hashlib.sha256()
    with open(filepath, 'rb') as f:
        for chunk in iter(lambda: f.read(settings.FILE_HASH_CHUNK_BYTES), b""):
            hasher.update(chunk)
    return hasher.hexdigest()

def run_ingestion():
    resources = load_domain_resources()
    print(f"=== Starting Ingestion Corpus from CSV: {settings.CORPUS_PATH} ===")
    
    if not Path(settings.CORPUS_PATH).is_file():
        raise FileNotFoundError(f"Corpus file was not found: {settings.CORPUS_PATH}")

    df = pd.read_csv(settings.CORPUS_PATH, low_memory=False)
    total_raw = len(df)
    print(f"Total rows in raw CSV: {total_raw}")
    
    required_cols = resources.corpus_required_columns
    missing = [c for c in required_cols if c not in df.columns]
    if missing:
        raise ValueError(f"Dataset is missing required columns: {missing}")

    df = df.dropna(subset=['content'])
    df['Id'] = df['Id'].astype(str)
    df['title'] = df['title'].fillna(resources.fallbacks['untitled'])
    df['genre'] = df['genre'].fillna('').astype(str).str.strip()
    df['period'] = df['period'].fillna('').astype(str).str.strip()
    df['specific_genre'] = df['specific_genre'].fillna('').astype(str).str.strip()
    df['author'] = df['author'].fillna(resources.fallbacks['anonymous']).astype(str).str.strip()
    df['url'] = df['url'].fillna('')
    
    valid_count = len(df)
    print(f"Valid rows after normalization: {valid_count}")
    
    parquet_path = Path(settings.NORMALIZED_CORPUS_PATH)
    parquet_path.parent.mkdir(parents=True, exist_ok=True)
    df.to_parquet(parquet_path, index=False)
    print(f"Parquet saved at {parquet_path}")

    print(f"Starting upsert into Chroma DB at {settings.CHROMA_PATH}...")
    chroma_adapter = ChromaStoreAdapter(
        path=settings.CHROMA_PATH,
        collection_name=settings.CHROMA_COLLECTION,
        embedding_model_name=settings.EMBEDDING_MODEL,
        metadata_aliases=dict(resources.period_aliases),
        create_if_missing=True,
    )
    
    documents = df['content'].tolist()
    ids = df['Id'].tolist()
    metadatas = df[['title', 'genre', 'specific_genre', 'author', 'period', 'url']].to_dict(orient='records')
    
    batch_size = settings.INGEST_BATCH_SIZE
    for i in range(0, len(documents), batch_size):
        b_docs = documents[i:i+batch_size]
        b_ids = ids[i:i+batch_size]
        b_meta = metadatas[i:i+batch_size]
        
        b_embeddings = chroma_adapter.embedder.embed_documents(b_docs)
        chroma_adapter.collection.upsert(
            documents=b_docs,
            ids=b_ids,
            metadatas=b_meta,
            embeddings=b_embeddings
        )
        print(f"Completed upsert for Chroma batch {i} -> {i + len(b_docs)}")

    print("Starting to build BM25 Sparse Index...")
    bm25_docs = []
    for idx, row in df.iterrows():
        bm25_docs.append({
            'id': row['Id'],
            'content': row['content'],
            'title': row['title'],
            'genre': row['genre'],
            'specific_genre': row['specific_genre'],
            'author': row['author'],
            'period': row['period'],
            'url': row['url']
        })
        
    bm25_adapter = BM25IndexAdapter(
        artifact_path=settings.BM25_INDEX_PATH,
        metadata_aliases=dict(resources.period_aliases),
    )
    bm25_adapter.build_and_save(bm25_docs)
    print(f"Completed saving BM25 artifact at {settings.BM25_INDEX_PATH}")

    sha256 = compute_file_hash(settings.CORPUS_PATH)
    manifest_mgr = ManifestManager(settings.CORPUS_MANIFEST_PATH)
    manifest_data = {
        "corpusVersion": sha256,
        "corpusSha256": sha256,
        "rowCount": total_raw,
        "validRowCount": valid_count,
        "embeddingModel": settings.EMBEDDING_MODEL,
        "catalogVersion": resources.catalog_version,
        "promptVersion": resources.prompt_version,
        "tokenizerVersion": TOKENIZER_VERSION,
        "fusionVersion": FUSION_VERSION,
        "chromaCollection": settings.CHROMA_COLLECTION,
        "chromaCount": len(df),
        "bm25DocumentCount": len(bm25_docs),
        "builtAt": datetime.now(timezone.utc).isoformat(),
        "status": "ready"
    }
    manifest_mgr.save_manifest(manifest_data)
    print(f"=== INGESTION COMPLETED SUCCESSFULLY! Manifest saved at {settings.CORPUS_MANIFEST_PATH} ===")

if __name__ == "__main__":
    run_ingestion()
