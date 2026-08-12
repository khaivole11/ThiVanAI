import sqlite3
import json
from typing import List, Optional
from app.ports.result_repository import IResultRepository
from app.domain.entities.generation import GenerationResult
from app.domain.enums.generation_status import GenerationStatus

class SQLiteResultRepository(IResultRepository):
    def __init__(self, db_path: str):
        clean_path = db_path.replace("sqlite:///", "")
        self.db_path = clean_path
        self._init_db()

    def _init_db(self):
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS generations (
                    id TEXT PRIMARY KEY,
                    status TEXT,
                    title TEXT,
                    lines TEXT,
                    full_text TEXT,
                    sources TEXT,
                    validation_passed INTEGER,
                    validation_errors TEXT,
                    attempt_count INTEGER,
                    provider TEXT,
                    model TEXT,
                    prompt_version TEXT,
                    corpus_version TEXT,
                    created_at TEXT
                )
            """)
            conn.commit()

    async def save_generation(self, gen: GenerationResult) -> None:
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                INSERT OR REPLACE INTO generations VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                gen.id,
                gen.status.value,
                gen.title,
                json.dumps(gen.lines, ensure_ascii=False),
                gen.full_text,
                json.dumps([s.__dict__ for s in gen.sources], ensure_ascii=False),
                1 if gen.validation_passed else 0,
                json.dumps(gen.validation_errors, ensure_ascii=False),
                gen.attempt_count,
                gen.provider,
                gen.model,
                gen.prompt_version,
                gen.corpus_version,
                gen.created_at.isoformat()
            ))
            conn.commit()

    async def get_generation(self, generation_id: str) -> Optional[GenerationResult]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM generations WHERE id = ?", (generation_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return GenerationResult(
                id=row[0],
                status=GenerationStatus(row[1]),
                title=row[2],
                lines=json.loads(row[3]),
                full_text=row[4],
                sources=[],
                validation_passed=bool(row[6]),
                validation_errors=json.loads(row[7]),
                attempt_count=row[8],
                provider=row[9],
                model=row[10],
                prompt_version=row[11],
                corpus_version=row[12]
            )

    async def list_generations(self, *, limit: int, offset: int) -> List[GenerationResult]:
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id, status, title, lines, full_text, validation_passed, attempt_count, provider, model, prompt_version, corpus_version FROM generations ORDER BY created_at DESC LIMIT ? OFFSET ?", (limit, offset))
            rows = cursor.fetchall()
            results = []
            for r in rows:
                results.append(GenerationResult(
                    id=r[0],
                    status=GenerationStatus(r[1]),
                    title=r[2],
                    lines=json.loads(r[3]),
                    full_text=r[4],
                    sources=[],
                    validation_passed=bool(r[5]),
                    validation_errors=[],
                    attempt_count=r[6],
                    provider=r[7],
                    model=r[8],
                    prompt_version=r[9],
                    corpus_version=r[10]
                ))
            return results