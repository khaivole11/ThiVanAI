from fastapi import APIRouter, Request
from app.schemas.common import ApiResponse
from app.domain.enums.poetry_form import PoetryForm

router = APIRouter(prefix="/metadata", tags=["Metadata"])

@router.get("/poetry-forms", response_model=ApiResponse[list])
async def get_poetry_forms():
    forms = [{"key": form.name, "value": form.value} for form in PoetryForm]
    return ApiResponse(data=forms)

@router.get("/periods", response_model=ApiResponse[list])
async def get_periods(request: Request):
    return ApiResponse(data=list(request.app.state.resources.periods))