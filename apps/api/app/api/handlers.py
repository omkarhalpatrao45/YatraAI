from __future__ import annotations

from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import http_exception_handler
from pydantic import ValidationError
from starlette import status
from starlette.exceptions import HTTPException as StarletteHTTPException

from app.schemas.errors import ErrorResponse


def _error(code: str, message: str, details: Any | None = None, *, status_code: int):
    payload = ErrorResponse(code=code, message=message, details=details).model_dump()
    return JSONResponse(status_code=status_code, content=payload)


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(StarletteHTTPException)
    async def http_exc_handler(request: Request, exc: StarletteHTTPException):
        # Keep FastAPI/Starlette behaviour but normalize the response.
        return _error(
            code=f"http_{exc.status_code}",
            message=str(getattr(exc, "detail", "HTTP error")),
            details=None,
            status_code=exc.status_code,
        )

    @app.exception_handler(RequestValidationError)
    async def validation_exc_handler(request: Request, exc: RequestValidationError):
        return _error(
            code="validation_error",
            message="Request validation failed",
            details=exc.errors(),
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        )

    @app.exception_handler(Exception)
    async def unhandled_exc_handler(request: Request, exc: Exception):
        # Do not leak internal exception strings.
        return _error(
            code="internal_error",
            message="Internal server error",
            details=None,
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

