import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from scripts.ingest_corpus import run_ingestion

if __name__ == "__main__":
    print("=== Rebuilding Vector & BM25 Indexes ===")
    run_ingestion()