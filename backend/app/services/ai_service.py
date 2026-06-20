import json
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_itinerary(destination: str, budget: float, start_date: str, end_date: str, travelers: int, interests: str) -> dict:
    prompt = f"""You are a travel planner. Create a detailed day-by-day itinerary for:
- Destination: {destination}
- Total Budget: ${budget} USD for {travelers} traveler(s)
- Dates: {start_date} to {end_date}
- Interests: {interests}

Return ONLY a valid JSON object with NO extra text, NO markdown, NO code blocks. Use this exact structure:
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
  ],
  "hotels": [
    {{
      "name": "Hotel Name",
      "rating": 4.2,
      "price_per_night": <number>,
      "price_range": "$80-120/night",
      "description": "Brief description",
      "location": "Area/District",
      "amenities": ["WiFi", "Breakfast", "Pool"]
    }}
  ],
  "flights": [
    {{
      "airline": "Airline Name",
      "estimated_cost": <number>,
      "departure_city": "Origin City",
      "destination_city": "{destination}",
      "duration": "2h 30m",
      "type": "One-way"
    }}
  ]
}}"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "You are a travel planning assistant. Always respond with valid JSON only, no extra text."},
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=4000
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
    return json.loads(content)
