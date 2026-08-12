from importlib.metadata import metadata, version

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

from app.core.config import settings
from app.core.lifespan import lifespan
from app.core.errors import AppError
from app.api.router import api_router

PACKAGE_NAME = "thivan-ai-backend"
package_metadata = metadata(PACKAGE_NAME)

app = FastAPI(
    title=package_metadata["Name"],
    description=package_metadata["Summary"],
    version=version(PACKAGE_NAME),
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(AppError)
async def custom_app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "data": None,
            "message": exc.message,
            "error_code": exc.code,
            "details": exc.details,
            "retryable": exc.retryable
        }
    )

app.include_router(api_router)

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.APP_HOST,
        port=settings.APP_PORT,
        reload=(settings.APP_ENV == "development")
    )