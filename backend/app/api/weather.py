from fastapi import APIRouter, HTTPException
from app.services.weather_service import get_weather

router = APIRouter(prefix="/weather", tags=["weather"])

@router.get("/{city}")
async def weather(city: str):
    try:
        return await get_weather(city)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Weather data not found for {city}")
