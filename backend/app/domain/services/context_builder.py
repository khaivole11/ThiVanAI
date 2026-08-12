from typing import List
from app.core.resources import DomainResources
from app.domain.entities.source_poem import SourcePoem

class ContextBuilderService:
    def __init__(self, resources: DomainResources, max_characters: int):
        self._resources = resources
        self._max_characters = max_characters

    def build_context(self, sources: List[SourcePoem]) -> str:
        if not sources:
            return self._resources.fallbacks["noSources"]

        context_parts: list[str] = []
        current_length = 0
        for i, src in enumerate(sources, 1):
            fields = {
                "rank": i,
                "title": src.title,
                "author": src.author,
                "genre": src.genre,
                "period": src.period,
                "url": src.url or "",
            }
            part = self._resources.context_source_template.format(
                **fields,
                content=src.content_excerpt,
            ).strip()
            separator_length = len(self._resources.context_separator) if context_parts else 0
            available = self._max_characters - current_length - separator_length
            if available <= 0:
                break
            if len(part) > available:
                metadata_only = self._resources.context_source_template.format(
                    **fields,
                    content="",
                ).strip()
                content_budget = available - len(metadata_only)
                if content_budget <= 0:
                    break
                part = self._resources.context_source_template.format(
                    **fields,
                    content=src.content_excerpt[:content_budget],
                ).strip()

            context_parts.append(part)
            current_length += separator_length + len(part)
            if len(part) == available:
                break

        if not context_parts:
            return self._resources.fallbacks["noSources"]
        return self._resources.context_separator.join(context_parts)