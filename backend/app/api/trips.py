from __future__ import annotations
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database.db import get_db
from app.schemas.trip import TripCreate, TripOut
from app.repositories.trip_repo import create_trip, get_trips_by_user, get_trip, delete_trip
from app.services.ai_service import generate_itinerary
from app.core.security import get_current_user
from app.models.models import User
import json

router = APIRouter(prefix="/trips", tags=["trips"])

@router.post("/create", response_model=TripOut)
async def create_new_trip(trip: TripCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        itinerary = generate_itinerary(
            trip.destination, trip.budget, trip.start_date,
            trip.end_date, trip.travelers, trip.interests
        )
    except Exception as e:
        # Fallback itinerary if AI fails
        itinerary = {
            "summary": f"Your trip to {trip.destination}",
            "total_estimated_cost": trip.budget,
            "days": [], "hotels": [], "flights": []
        }
    return create_trip(db, trip, current_user.id, itinerary)

@router.get("", response_model=List[TripOut])
def list_trips(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_trips_by_user(db, current_user.id)

@router.get("/{trip_id}", response_model=TripOut)
def get_single_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    trip = get_trip(db, trip_id, current_user.id)
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip

@router.delete("/{trip_id}")
def remove_trip(trip_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if not delete_trip(db, trip_id, current_user.id):
        raise HTTPException(status_code=404, detail="Trip not found")
    return {"message": "Trip deleted"}
