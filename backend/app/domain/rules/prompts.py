from app.core.resources import DomainResources


class PromptBuilder:
    def __init__(self, resources: DomainResources):
        self._resources = resources

    @property
    def version(self) -> str:
        return self._resources.prompt_version

    def build(
        self,
        first_verse: str,
        genre: str,
        author_style: str,
        period_style: str,
        retrieved_context: str,
        retry_feedback: str,
    ) -> str:
        try:
            poetry_rules = self._resources.poetry_form_specs[genre].prompt_rule
        except KeyError as exc:
            raise ValueError(f"No prompt rule configured for poetry form: {genre}") from exc

        unspecified = self._resources.fallbacks["unspecifiedStyle"]
        return self._resources.prompt_template.format(
            first_verse=first_verse,
            poetry_form=genre,
            poetry_rules=poetry_rules,
            author_style=author_style or unspecified,
            period_style=period_style or unspecified,
            retrieved_context=retrieved_context,
            retry_feedback=retry_feedback,
        )