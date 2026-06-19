from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class TripCreate(BaseModel):
    destination: str
    budget: float
    start_date: str
    end_date: str
    travelers: int = 1
    interests: str = ""

class TripOut(BaseModel):
    id: int
    destination: str
    budget: float
    start_date: str
    end_date: str
    travelers: int
    interests: str
    itinerary_json: str
    created_at: datetime

    class Config:
        from_attributes = True
