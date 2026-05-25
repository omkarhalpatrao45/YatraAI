from fastapi import APIRouter

from app.api.v1.endpoints import health, trip

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(trip.router, tags=["trip"])

