from pydantic import BaseModel, ConfigDict
from typing import Optional, Generic, TypeVar

T = TypeVar('T')

class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None
    error_code: Optional[str] = None
    
    model_config = ConfigDict(populate_by_name=True)