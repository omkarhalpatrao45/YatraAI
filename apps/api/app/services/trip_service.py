from __future__ import annotations

from typing import Any

from fastapi import HTTPException, status

from app.core.gemini import get_gemini_client, get_gemini_model_name
from app.repositories.trip_repository import TripRepository


class TripService:
    """Business logic for trip generation + persistence."""

    def __init__(self, repo: TripRepository | None = None) -> None:
        self.repo = repo or TripRepository()

    async def generate_trip(self, user: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
        destination = payload.get("destination")
        if not destination:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="destination is required",
            )

        # Gemini integration (best-effort). If not configured, return placeholder.
        ai_result: dict[str, Any] = {}
        try:
            model_name = get_gemini_model_name()

            prompt = (


                "You are an expert travel planner. "
                "Generate a structured itinerary in JSON with: title, summary, itinerary (array of days). "
                f"Destination: {destination}. "
                f"Days: {payload.get('days')}. Travelers: {payload.get('travelers')}. "
                f"Budget: {payload.get('budget')}. Interests: {payload.get('interests')}. "
            )

            # The gemini client shape may vary; use placeholder if dependency isn't available.
            genai = get_gemini_client()
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)


            text = getattr(response, "text", None) or getattr(response, "result", None) or str(response)
            ai_result = {"raw": text}

        except Exception:
            ai_result = {
                "title": f"{destination} • AI Itinerary",
                "summary": "Gemini is not configured or failed. Returning a placeholder itinerary.",
                "itinerary": [
                    f"Day 1: Arrive and explore {destination}",
                    f"Day 2: Local highlights + food tour",
                ],
            }

        trip = {
            "id": None,  # to be assigned on save
            "destination": destination,
            "startDate": payload.get("start_date"),
            "days": payload.get("days"),
            "travelers": payload.get("travelers"),
            "budget": payload.get("budget"),
            "interests": payload.get("interests"),
            "status": "generated",
            "userUid": user.get("uid") or user.get("sub"),
        }

        return {"trip": trip, "ai_result": ai_result}

    async def save_trip(
        self,
        user: dict[str, Any],
        trip: dict[str, Any],
        ai_result: dict[str, Any] | None,
    ) -> dict[str, Any]:
        return await self.repo.save_trip(user=user, trip=trip, ai_result=ai_result)

    async def list_trips(self, user: dict[str, Any]) -> dict[str, Any]:
        return await self.repo.list_trips(user=user)

    async def delete_trip(self, user: dict[str, Any], trip_id: str) -> dict[str, Any]:
        return await self.repo.delete_trip(user=user, trip_id=trip_id)

