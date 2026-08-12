from abc import ABC, abstractmethod
from typing import List, Optional
from app.domain.entities.generation import GenerationResult

class IResultRepository(ABC):
    @abstractmethod
    async def save_generation(self, generation: GenerationResult) -> None:
        pass

    @abstractmethod
    async def get_generation(self, generation_id: str) -> Optional[GenerationResult]:
        pass

    @abstractmethod
    async def list_generations(self, *, limit: int, offset: int) -> List[GenerationResult]:
        pass