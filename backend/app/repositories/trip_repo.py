import json
from sqlalchemy.orm import Session
from app.models.models import Trip
from app.schemas.trip import TripCreate

def create_trip(db: Session, trip: TripCreate, user_id: int, itinerary: dict) -> Trip:
    db_trip = Trip(
        user_id=user_id,
        destination=trip.destination,
        budget=trip.budget,
        start_date=trip.start_date,
        end_date=trip.end_date,
        travelers=trip.travelers,
        interests=trip.interests,
        itinerary_json=json.dumps(itinerary)
    )
    db.add(db_trip)
    db.commit()
    db.refresh(db_trip)
    return db_trip

def get_trips_by_user(db: Session, user_id: int):
    return db.query(Trip).filter(Trip.user_id == user_id).order_by(Trip.created_at.desc()).all()

def get_trip(db: Session, trip_id: int, user_id: int):
    return db.query(Trip).filter(Trip.id == trip_id, Trip.user_id == user_id).first()

def delete_trip(db: Session, trip_id: int, user_id: int) -> bool:
    trip = get_trip(db, trip_id, user_id)
    if not trip:
        return False
    db.delete(trip)
    db.commit()
    return True
