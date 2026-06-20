import json
from groq import Groq
from app.core.config import settings


def _get_client() -> Groq:
    api_key = settings.GROQ_API_KEY.strip()
    if not api_key:
        raise ValueError("Groq API key is not configured. Please set GROQ_API_KEY in your .env file.")
    return Groq(api_key=api_key)


def _call_llm(client: Groq, system: str, user: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.7,
        max_tokens=8000,
    )
    content = response.choices[0].message.content.strip()
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    start = content.find("{")
    end = content.rfind("}") + 1
    if start != -1 and end > start:
        content = content[start:end]
    try:
        return json.loads(content)
    except json.JSONDecodeError as e:
        raise ValueError(f"AI returned invalid JSON: {e}")


def generate_itinerary(destination: str, budget: float, start_date: str, end_date: str, travelers: int, interests: str) -> dict:
    client = _get_client()

    # --- Agent Step 1: Generate day-by-day itinerary ---
    itinerary_prompt = f"""Create a detailed day-by-day travel itinerary for:
- Destination: {destination}
- Total Budget: ${budget} USD for {travelers} traveler(s)
- Dates: {start_date} to {end_date}
- Interests: {interests}

Return ONLY a valid JSON object. Use this exact structure:
{{
  "summary": "2-3 sentence trip overview",
  "total_estimated_cost": <number>,
  "budget_breakdown": [
    {{ "category": "Accommodation", "estimated_cost": <number>, "percentage": <number> }},
    {{ "category": "Food & Dining", "estimated_cost": <number>, "percentage": <number> }},
    {{ "category": "Transportation", "estimated_cost": <number>, "percentage": <number> }},
    {{ "category": "Sightseeing & Activities", "estimated_cost": <number>, "percentage": <number> }},
    {{ "category": "Shopping & Misc", "estimated_cost": <number>, "percentage": <number> }}
  ],
  "days": [
    {{
      "day": 1,
      "date": "{start_date}",
      "theme": "Arrival & City Exploration",
      "estimated_cost": <number>,
      "places": [
        {{
          "name": "Place Name",
          "type": "Museum / Temple / Market / Restaurant / etc",
          "timing": "9:00 AM - 11:00 AM",
          "estimated_cost": <number>,
          "description": "1 sentence about this place",
          "tips": "Entry fee or practical tip"
        }}
      ],
      "activities": ["Activity description 1", "Activity description 2"],
      "meals": {{
        "breakfast": {{ "place": "Restaurant or Hotel", "estimated_cost": <number> }},
        "lunch": {{ "place": "Restaurant Name", "estimated_cost": <number> }},
        "dinner": {{ "place": "Restaurant Name", "estimated_cost": <number> }}
      }},
      "transport": {{ "mode": "Metro / Taxi / Walk", "estimated_cost": <number> }},
      "tips": "Key tip for the day"
    }}
  ]
}}"""

    itinerary_data = _call_llm(
        client,
        system="You are a travel planning assistant. Always respond with valid JSON only, no extra text.",
        user=itinerary_prompt,
    )

    # --- Agent Step 2: Recommend flights & hotels based on actual places ---
    all_places = []
    for day in itinerary_data.get("days", []):
        for place in day.get("places", []):
            if isinstance(place, dict):
                all_places.append(place.get("name", ""))
            elif isinstance(place, str):
                all_places.append(place)

    places_list = ", ".join(filter(None, all_places[:15]))  # cap to avoid token overflow

    recommendations_prompt = f"""A traveler is visiting {destination} from {start_date} to {end_date} with a budget of ${budget} USD for {travelers} traveler(s).

They will be visiting these places: {places_list}

Based on the proximity to these places and the overall budget, recommend:
1. 3-4 hotels that are well-located for this itinerary
2. 2-3 flight options to reach {destination}

Return ONLY a valid JSON object with this exact structure:
{{
  "hotels": [
    {{
      "name": "Hotel Name",
      "rating": <number like 4.2>,
      "price_per_night": <number>,
      "price_range": "$80-120/night",
      "description": "Why this hotel suits this itinerary",
      "location": "Area/District close to visited places",
      "amenities": ["WiFi", "Breakfast", "Pool"],
      "nearby_places": ["Place 1", "Place 2"]
    }}
  ],
  "flights": [
    {{
      "airline": "Airline Name",
      "estimated_cost": <number>,
      "departure_city": "Major nearby hub city",
      "destination_city": "{destination}",
      "duration": "2h 30m",
      "type": "One-way",
      "notes": "Best time to book or any tip"
    }}
  ]
}}"""

    recommendations_data = _call_llm(
        client,
        system="You are a travel recommendations agent. Always respond with valid JSON only, no extra text.",
        user=recommendations_prompt,
    )

    # --- Merge both agent outputs ---
    return {
        **itinerary_data,
        "hotels": recommendations_data.get("hotels", []),
        "flights": recommendations_data.get("flights", []),
    }
