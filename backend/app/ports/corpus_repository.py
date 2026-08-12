from abc import ABC, abstractmethod
from typing import List
from app.domain.entities.poem import Poem

class ICorpusRepository(ABC):
    @abstractmethod
    def load_poems(self) -> List[Poem]:
        pass