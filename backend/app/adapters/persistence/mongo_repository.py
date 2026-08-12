from typing import List, Optional
from app.ports.result_repository import IResultRepository
from app.domain.entities.generation import GenerationResult

class MongoResultRepository(IResultRepository):
    def __init__(self, uri: str, db_name: str):
        self.uri = uri
        self.db_name = db_name

    async def save_generation(self, generation: GenerationResult) -> None:
        pass

    async def get_generation(self, generation_id: str) -> Optional[GenerationResult]:
        return None

    async def list_generations(self, *, limit: int, offset: int) -> List[GenerationResult]:
        return []