from typing import Optional, Any, Dict
from fastapi import HTTPException, status

class AppError(HTTPException):
    def __init__(
        self,
        status_code: int,
        code: str,
        message: str,
        details: Optional[Dict[str, Any]] = None,
        retryable: bool = False
    ):
        super().__init__(status_code=status_code, detail=message)
        self.code = code
        self.message = message
        self.details = details or {}
        self.retryable = retryable

class PoetryConstraintError(AppError):
    def __init__(self, message: str, details: Optional[Dict[str, Any]] = None):
        super().__init__(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            code="POETRY_CONSTRAINT_ERROR",
            message=message,
            details=details,
            retryable=False
        )

class RetrievalNotReadyError(AppError):
    def __init__(self, message: str = "Retriever index vector/sparse not ready yet."):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            code="RETRIEVAL_NOT_READY",
            message=message,
            retryable=True
        )

class GeneratorUnavailableError(AppError):
    def __init__(self, message: str = "LLM generation service unavailable"):
        super().__init__(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            code="GENERATOR_UNAVAILABLE",
            message=message,
            retryable=True
        )