from abc import ABC, abstractmethod

from app.domain.entities.feedback import GenerationFeedback


class IFeedbackRepository(ABC):
    @abstractmethod
    async def save_feedback(
        self,
        *,
        generation_id: str,
        rating: int,
        labels: list[str],
        comment: str | None,
    ) -> GenerationFeedback:
        pass

    async def close(self) -> None:
        pass
