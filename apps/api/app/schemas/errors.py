from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class ErrorResponse(BaseModel):
    success: bool = Field(default=False, description="Always false for error responses")
    code: str = Field(..., description="Application/library/HTTP error code")
    message: str = Field(..., description="Human readable error message")
    details: Optional[Any] = Field(default=None, description="Optional structured details")

