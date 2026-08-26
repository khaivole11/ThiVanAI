from fastapi import APIRouter
from app.core.constants import API_V1_PREFIX
from app.api.routes import health, metadata, retrieval, generations, history, feedback

api_router = APIRouter(prefix=API_V1_PREFIX)

api_router.include_router(health.router)
api_router.include_router(metadata.router)
api_router.include_router(retrieval.router)
api_router.include_router(generations.router)
api_router.include_router(history.router)
api_router.include_router(feedback.router)
