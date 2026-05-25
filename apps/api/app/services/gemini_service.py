from __future__ import annotations

import json
from typing import Any

from app.core.config import get_settings


class GeminiItineraryService:
    """Generate India-focused itineraries.

    Output is structured JSON (no markdown).
    If Gemini dependencies/config are missing, returns a deterministic placeholder.
    """

    def __init__(self) -> None:
        self.settings = get_settings()

    def _build_prompt(self, payload: dict[str, Any]) -> str:
        destination = payload.get("destination")
        days = payload.get("days")
        travelers = payload.get("travelers")
        budget = payload.get("budget")
        interests = payload.get("interests")
        start_date = payload.get("start_date")

        return (
            "You are YatraAI, an expert India trip planner.\n"
            "Generate a travel itinerary strictly in JSON.\n\n"
            "INPUTS:\n"
            f"destination: {destination}\n"
            f"start_date: {start_date}\n"
            f"days: {days}\n"
            f"travelers: {travelers}\n"
            f"budget: {budget}\n"
            f"interests: {interests}\n\n"
            "REQUIREMENTS:\n"
            "1) Output MUST be valid JSON only (no markdown, no extra text).\n"
            "2) Structure:\n"
            "{\n"
            '  "title": string,\n'
            '  "summary": string,\n'
            '  "itinerary": [\n'
            '    {\n'
            '      "day": number,\n'
            '      "date": string | null,\n'
            '      "location": string,\n'
            '      "plan": [string, ...],\n'
            '      "food_recommendations": [string, ...],\n'
            '      "travel_tips": [string, ...],\n'
            '      "approx_cost_per_person_inr": number,\n'
            '      "key_takeaways": [string, ...]\n'
            "    }\n"
            "  ],\n"
            '  "budget_estimate": {\n'
            '    "currency": "INR",\n'
            '    "total_trip_cost_inr": number,\n'
            '    "cost_breakdown": {\n'
            '      "stay": number,\n'
            '      "local_transport": number,\n'
            '      "food": number,\n'
            '      "attractions": number,\n'
            '      "misc": number\n'
            "    }\n"
            "  },\n"
            '  "safety_notes": [string, ...],\n'
            '  "booking_checklist": [string, ...]\n'
            "}\n"
            "3) Make it India-focused: include Indian regions, realistic local transit, and food.\n"
            "4) Budget: estimate costs in INR. If budget tier is vague, infer a reasonable mid-range estimate.\n"
            "5) Ensure each day has food + travel tips + per-person cost.\n"
            "6) If you cannot determine exact dates, set `date` to null.\n"
        )

    def generate(self, payload: dict[str, Any]) -> dict[str, Any]:
        prompt = self._build_prompt(payload)

        # Best-effort Gemini integration (SDK availability may vary in your env).
        if not self.settings.gemini_api_key:
            return self._placeholder(payload)

        try:
            import google.generativeai as genai  # type: ignore

            genai.configure(api_key=self.settings.gemini_api_key)
            model = genai.GenerativeModel(self.settings.gemini_model)
            resp = model.generate_content(prompt)

            text = getattr(resp, "text", None) or getattr(resp, "result", None) or str(resp)
            text = text.strip()

            # Some models wrap JSON in code-fences; strip defensively.
            if text.startswith("```"):
                text = text.strip("`")
                text = text.split("\n", 1)[-1]

            return json.loads(text)
        except Exception:
            return self._placeholder(payload)

    def _placeholder(self, payload: dict[str, Any]) -> dict[str, Any]:
        destination = payload.get("destination")
        days = int(payload.get("days") or 2)
        budget = payload.get("budget")
        travelers = int(payload.get("travelers") or 1)

        base_per_person = 6500 if str(budget).lower() in {"budget", "low"} else 9500
        itinerary: list[dict[str, Any]] = []

        for i in range(1, days + 1):
            itinerary.append(
                {
                    "day": i,
                    "date": None,
                    "location": f"{destination} - Day {i}",
                    "plan": [
                        f"Morning: Explore key spots around {destination}",
                        "Afternoon: Local market + cultural walk",
                        "Evening: Relax + sightseeing",
                    ],
                    "food_recommendations": [
                        "Try regional thali / street snacks",
                        "Local café or authentic restaurant",
                    ],
                    "travel_tips": [
                        "Carry cash + water",
                        "Start early to avoid crowds",
                    ],
                    "approx_cost_per_person_inr": base_per_person,
                    "key_takeaways": [
                        "Good mix of culture + food",
                        "Plan flexible slots for weather",
                    ],
                }
            )

        total_trip_cost = base_per_person * max(travelers, 1) * days

        return {
            "title": f"{destination} • India Itinerary",
            "summary": f"A {days}-day, India-focused itinerary with day-wise planning, food, tips, and INR budget estimates.",
            "itinerary": itinerary,
            "budget_estimate": {
                "currency": "INR",
                "total_trip_cost_inr": total_trip_cost,
                "cost_breakdown": {
                    "stay": int(total_trip_cost * 0.35),
                    "local_transport": int(total_trip_cost * 0.15),
                    "food": int(total_trip_cost * 0.25),
                    "attractions": int(total_trip_cost * 0.2),
                    "misc": int(total_trip_cost * 0.05),
                },
            },
            "safety_notes": [
                "Use official taxis/ride apps where possible",
                "Keep digital copies of documents",
            ],
            "booking_checklist": [
                "Confirm stay + local transport",
                "Book top attractions early if needed",
            ],
        }

