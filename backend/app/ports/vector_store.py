from abc import ABC, abstractmethod
from typing import List, Dict, Any

class IVectorStore(ABC):
    @abstractmethod
    def search(
        self,
        query: str,
        genre: str = None,
        author: str = None,
        period: str = None,
        *,
        limit: int,
    ) -> List[Dict[str, Any]]:
        pass