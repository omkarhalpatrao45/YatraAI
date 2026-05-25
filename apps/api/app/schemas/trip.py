from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class TripGenerateRequest(BaseModel):
    destination: str = Field(..., min_length=2, max_length=120)
    start_date: Optional[str] = Field(
        default=None, description="ISO date string (YYYY-MM-DD)"
    )
    days: int = Field(..., ge=1, le=60)
    travelers: int = Field(..., ge=1, le=20)
    budget: str = Field(..., description="budget tier")
    interests: Optional[str] = Field(default=None)


class TripGenerateResponse(BaseModel):
    trip: dict[str, Any]
    ai_result: dict[str, Any]


class TripSaveRequest(BaseModel):
    trip: dict[str, Any] = Field(..., description="Trip payload to persist")
    ai_result: Optional[dict[str, Any]] = None


class TripSaveResponse(BaseModel):
    trip_id: str
    trip: dict[str, Any]


class TripListResponse(BaseModel):
    trips: list[dict[str, Any]]


class TripDeleteResponse(BaseModel):
    deleted: bool
    trip_id: str

