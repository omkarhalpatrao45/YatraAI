import json
from openai import OpenAI
from app.core.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

def generate_itinerary(destination: str, budget: float, start_date: str, end_date: str, travelers: int, interests: str) -> dict:
    prompt = f"""Create a detailed travel itinerary for:
- Destination: {destination}
- Budget: ${budget} USD total for {travelers} traveler(s)
- Dates: {start_date} to {end_date}
- Interests: {interests}

Return ONLY valid JSON in this exact format:
{{
  "summary": "Brief trip summary",
  "total_estimated_cost": 1000,
  "days": [
    {{
      "day": 1,
      "date": "{start_date}",
      "theme": "Arrival & Exploration",
      "places": ["Place 1", "Place 2"],
      "activities": ["Activity 1", "Activity 2"],
      "timing": ["9 AM - Visit Place 1", "2 PM - Activity 1"],
      "estimated_cost": 150,
      "tips": "Useful tip for the day"
    }}
  ],
  "hotels": [
    {{
      "name": "Hotel Name",
      "rating": 4.5,
      "price_range": "$100-150/night",
      "description": "Brief description",
      "location": "Area/District"
    }}
  ],
  "flights": [
    {{
      "airline": "Airline Name",
      "estimated_cost": 300,
      "departure_city": "Origin",
      "destination_city": "{destination}",
      "duration": "2h 30m"
    }}
  ]
}}"""

    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.7,
        max_tokens=3000
    )
    content = response.choices[0].message.content.strip()
    # Extract JSON if wrapped in code blocks
    if "```json" in content:
        content = content.split("```json")[1].split("```")[0].strip()
    elif "```" in content:
        content = content.split("```")[1].split("```")[0].strip()
    return json.loads(content)
