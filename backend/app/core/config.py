from pathlib import Path
from typing import List, Literal, Self

from pydantic import Field, SecretStr, field_validator, model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    APP_ENV: Literal["development", "test", "production"] = "development"
    APP_HOST: str = "127.0.0.1"
    APP_PORT: int = Field(default=8001, ge=1, le=65535)
    LOG_LEVEL: Literal["DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL"] = "INFO"

    FRONTEND_ORIGINS: str
    DATA_DIR: str
    CORPUS_PATH: str
    NORMALIZED_CORPUS_PATH: str
    CORPUS_MANIFEST_PATH: str

    EMBEDDING_MODEL: str
    CHROMA_MODE: Literal["embedded", "http"] = "embedded"
    CHROMA_PATH: str
    CHROMA_COLLECTION: str
    CHROMA_HOST: str | None = None
    CHROMA_PORT: int | None = Field(default=None, ge=1, le=65535)
    BM25_INDEX_PATH: str

    GENERATION_PROVIDER: Literal["openai", "ollama"]
    OPENAI_API_KEY: SecretStr | None = None
    OPENAI_MODEL: str | None = None
    OLLAMA_BASE_URL: str | None = None
    OLLAMA_MODEL: str | None = None

    RESULT_STORE: Literal["sqlite", "mongo"] = "sqlite"
    SQLITE_URL: str | None = None
    MONGODB_URI: SecretStr | None = None
    MONGODB_DATABASE: str | None = None

    RETRIEVAL_TOP_K: int = Field(default=5, ge=1, le=20)
    RETRIEVAL_MAX_TOP_K: int = Field(default=20, ge=1, le=100)
    RETRIEVAL_EMBEDDING_K: int = Field(default=20, ge=1, le=100)
    RETRIEVAL_BM25_K: int = Field(default=20, ge=1, le=100)
    RETRIEVAL_MAX_CANDIDATE_K: int = Field(default=100, ge=1, le=1000)
    RETRIEVAL_ALPHA: float = Field(default=0.65, ge=0.0, le=1.0)
    CONTEXT_MAX_CHARACTERS: int = Field(default=12000, ge=1000, le=100000)
    GENERATION_TEMPERATURE: float = Field(default=0.7, ge=0.0, le=2.0)
    GENERATION_MAX_OUTPUT_TOKENS: int = Field(default=512, ge=64, le=8192)
    GENERATION_MAX_VALIDATION_RETRIES: int = Field(default=3, ge=0, le=5)
    GENERATION_TIMEOUT_SECONDS: int = Field(default=90, ge=1, le=600)
    GENERATION_TITLE_EXCERPT_CHARACTERS: int = Field(default=24, ge=8, le=120)
    HISTORY_DEFAULT_PAGE_SIZE: int = Field(default=20, ge=1, le=100)
    HISTORY_MAX_PAGE_SIZE: int = Field(default=100, ge=1, le=500)
    INGEST_BATCH_SIZE: int = Field(default=500, ge=1, le=5000)
    FILE_HASH_CHUNK_BYTES: int = Field(default=1048576, ge=4096, le=16777216)

    model_config = SettingsConfigDict(
        env_file=BASE_DIR / ".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        env_ignore_empty=True,
        extra="forbid",
        validate_default=True,
    )

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.FRONTEND_ORIGINS.split(",") if origin.strip()]

    @property
    def openai_api_key_value(self) -> str | None:
        return self.OPENAI_API_KEY.get_secret_value() if self.OPENAI_API_KEY else None

    @property
    def mongodb_uri_value(self) -> str | None:
        return self.MONGODB_URI.get_secret_value() if self.MONGODB_URI else None

    @field_validator(
        "DATA_DIR",
        "CORPUS_PATH",
        "NORMALIZED_CORPUS_PATH",
        "CORPUS_MANIFEST_PATH",
        "CHROMA_PATH",
        "BM25_INDEX_PATH",
        mode="after",
    )
    @classmethod
    def resolve_backend_path(cls, value: str) -> str:
        path = Path(value).expanduser()
        if not path.is_absolute():
            path = BASE_DIR / path
        return str(path.resolve())

    @field_validator("FRONTEND_ORIGINS", mode="after")
    @classmethod
    def validate_frontend_origins(cls, value: str) -> str:
        origins = [origin.strip().rstrip("/") for origin in value.split(",") if origin.strip()]
        if not origins:
            raise ValueError("FRONTEND_ORIGINS must contain at least one origin")
        if any(not origin.startswith(("http://", "https://")) for origin in origins):
            raise ValueError("Each FRONTEND_ORIGINS value must start with http:// or https://")
        return ",".join(origins)

    @field_validator("SQLITE_URL", mode="after")
    @classmethod
    def resolve_sqlite_url(cls, value: str | None) -> str | None:
        if value is None:
            return None
        prefix = "sqlite:///"
        if not value.startswith(prefix):
            raise ValueError("SQLITE_URL must start with sqlite:///")
        db_path = Path(value.removeprefix(prefix)).expanduser()
        if not db_path.is_absolute():
            db_path = BASE_DIR / db_path
        return f"{prefix}{db_path.resolve().as_posix()}"

    @model_validator(mode="after")
    def validate_selected_services(self) -> Self:
        errors: list[str] = []

        if self.RETRIEVAL_TOP_K > self.RETRIEVAL_MAX_TOP_K:
            errors.append("RETRIEVAL_TOP_K must not exceed RETRIEVAL_MAX_TOP_K")
        if self.RETRIEVAL_EMBEDDING_K > self.RETRIEVAL_MAX_CANDIDATE_K:
            errors.append("RETRIEVAL_EMBEDDING_K must not exceed RETRIEVAL_MAX_CANDIDATE_K")
        if self.RETRIEVAL_BM25_K > self.RETRIEVAL_MAX_CANDIDATE_K:
            errors.append("RETRIEVAL_BM25_K must not exceed RETRIEVAL_MAX_CANDIDATE_K")
        if self.HISTORY_DEFAULT_PAGE_SIZE > self.HISTORY_MAX_PAGE_SIZE:
            errors.append("HISTORY_DEFAULT_PAGE_SIZE must not exceed HISTORY_MAX_PAGE_SIZE")

        if self.CHROMA_MODE == "http" and (not self.CHROMA_HOST or not self.CHROMA_PORT):
            errors.append("CHROMA_HOST and CHROMA_PORT are required when CHROMA_MODE=http")

        if self.GENERATION_PROVIDER == "openai":
            if self.OPENAI_API_KEY is None:
                errors.append("OPENAI_API_KEY is required when GENERATION_PROVIDER=openai")
            if not self.OPENAI_MODEL:
                errors.append("OPENAI_MODEL is required when GENERATION_PROVIDER=openai")

        if self.GENERATION_PROVIDER == "ollama":
            if not self.OLLAMA_BASE_URL:
                errors.append("OLLAMA_BASE_URL is required when GENERATION_PROVIDER=ollama")
            if not self.OLLAMA_MODEL:
                errors.append("OLLAMA_MODEL is required when GENERATION_PROVIDER=ollama")

        if self.RESULT_STORE == "sqlite" and not self.SQLITE_URL:
            errors.append("SQLITE_URL is required when RESULT_STORE=sqlite")

        if self.RESULT_STORE == "mongo":
            if self.MONGODB_URI is None:
                errors.append("MONGODB_URI is required when RESULT_STORE=mongo")
            if not self.MONGODB_DATABASE:
                errors.append("MONGODB_DATABASE is required when RESULT_STORE=mongo")

        if errors:
            raise ValueError("; ".join(errors))
        return self


settings = Settings()