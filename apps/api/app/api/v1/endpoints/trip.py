from __future__ import annotations

from typing import Any

from fastapi import APIRouter, Depends

from app.dependencies.firebase_auth import verify_firebase_token
from app.schemas.trip import (
    TripDeleteResponse,
    TripGenerateRequest,
    TripGenerateResponse,
    TripListResponse,
    TripSaveRequest,
    TripSaveResponse,
)
from app.services.trip_service import TripService

router = APIRouter()
service = TripService()


@router.post("/trip/generate", response_model=TripGenerateResponse, status_code=201)
async def trip_generate(
    req: TripGenerateRequest,
    user: dict[str, Any] = Depends(verify_firebase_token),
):
    return await service.generate_trip(user=user, payload=req.model_dump())


@router.post("/trip/save", response_model=TripSaveResponse, status_code=200)
async def trip_save(
    req: TripSaveRequest,
    user: dict[str, Any] = Depends(verify_firebase_token),
):
    return await service.save_trip(user=user, trip=req.trip, ai_result=req.ai_result)


@router.get("/trip/list", response_model=TripListResponse, status_code=200)
async def trip_list(user: dict[str, Any] = Depends(verify_firebase_token)):
    return await service.list_trips(user=user)


@router.delete("/trip/delete/{trip_id}", response_model=TripDeleteResponse)
async def trip_delete(
    trip_id: str,
    user: dict[str, Any] = Depends(verify_firebase_token),
):
    return await service.delete_trip(user=user, trip_id=trip_id)

