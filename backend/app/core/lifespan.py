from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.core.logging import logger
from app.core.config import settings
from app.core.resources import load_domain_resources
from app.adapters.retrieval.chroma_store import ChromaStoreAdapter
from app.adapters.retrieval.bm25_index import BM25IndexAdapter
from app.adapters.retrieval.artifact_manifest import ManifestManager
from app.adapters.persistence.sqlite_repository import SQLiteResultRepository
from app.domain.rules.prompts import PromptBuilder
from app.domain.rules.validators import PoetryValidator
from app.domain.services.context_builder import ContextBuilderService
from app.domain.services.generation_orchestrator import GenerationOrchestrator
from app.domain.services.hybrid_retriever import HybridRetrieverService
from app.domain.services.request_normalizer import RequestNormalizer

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("=== Starting FastAPI Lifespan initialization ===")
    resources = load_domain_resources()

    # 1. Check Manifest
    manifest_mgr = ManifestManager(settings.CORPUS_MANIFEST_PATH)
    manifest = manifest_mgr.load_manifest()
    if not manifest:
        raise RuntimeError("Corpus manifest is missing; run the ingestion command first")

    # 2. Init retrieval artifacts; runtime must never create an empty collection.
    chroma_adapter = ChromaStoreAdapter(
        path=settings.CHROMA_PATH,
        collection_name=settings.CHROMA_COLLECTION,
        embedding_model_name=settings.EMBEDDING_MODEL,
        metadata_aliases=dict(resources.period_aliases),
        create_if_missing=False,
    )
    bm25_adapter = BM25IndexAdapter(artifact_path=settings.BM25_INDEX_PATH)
    bm25_adapter.load()

    if settings.RESULT_STORE != "sqlite":
        raise RuntimeError("RESULT_STORE=mongo is unavailable until the Mongo repository is implemented")

    # 3. Create the selected generator once. Optional packages load only here.
    if settings.GENERATION_PROVIDER == "openai":
        from openai import AsyncOpenAI
        from app.adapters.generators.openai_responses import OpenAIResponsesAdapter

        client = AsyncOpenAI(api_key=settings.openai_api_key_value)
        generator = OpenAIResponsesAdapter(client=client, model_name=settings.OPENAI_MODEL)
    else:
        import httpx
        from app.adapters.generators.ollama import OllamaAdapter

        client = httpx.AsyncClient()
        generator = OllamaAdapter(
            client=client,
            base_url=settings.OLLAMA_BASE_URL,
            model_name=settings.OLLAMA_MODEL,
        )

    repository = SQLiteResultRepository(db_path=settings.SQLITE_URL)

    retriever = HybridRetrieverService(chroma_store=chroma_adapter, bm25_index=bm25_adapter)
    orchestrator = GenerationOrchestrator(
        retriever_service=retriever,
        context_builder=ContextBuilderService(resources, settings.CONTEXT_MAX_CHARACTERS),
        generator_adapter=generator,
        repository=repository,
        request_normalizer=RequestNormalizer(resources),
        prompt_builder=PromptBuilder(resources),
        validator=PoetryValidator(resources),
        resources=resources,
        corpus_version=manifest["corpusVersion"],
        max_validation_retries=settings.GENERATION_MAX_VALIDATION_RETRIES,
        title_excerpt_characters=settings.GENERATION_TITLE_EXCERPT_CHARACTERS,
    )
    app.state.manifest = manifest
    app.state.resources = resources
    app.state.retriever = retriever
    app.state.repository = repository
    app.state.orchestrator = orchestrator

    logger.info("=== FastAPI Lifespan initialization completed successfully ===")
    try:
        yield
    finally:
        await generator.close()
        logger.info("=== Closing FastAPI Lifespan resources ===")