import httpx
from app.core.config import settings

BASE_URL = "https://api.openweathermap.org/data/2.5"

async def get_weather(city: str) -> dict:
    async with httpx.AsyncClient() as client:
        # Current weather
        current_resp = await client.get(
            f"{BASE_URL}/weather",
            params={"q": city, "appid": settings.OPENWEATHER_API_KEY, "units": "metric"}
        )
        current_resp.raise_for_status()
        current = current_resp.json()

        # 5-day forecast
        forecast_resp = await client.get(
            f"{BASE_URL}/forecast",
            params={"q": city, "appid": settings.OPENWEATHER_API_KEY, "units": "metric", "cnt": 40}
        )
        forecast_resp.raise_for_status()
        forecast = forecast_resp.json()

    # Process forecast - one entry per day
    daily = {}
    for item in forecast["list"]:
        date = item["dt_txt"].split(" ")[0]
        if date not in daily:
            daily[date] = {
                "date": date,
                "temp_min": item["main"]["temp_min"],
                "temp_max": item["main"]["temp_max"],
                "description": item["weather"][0]["description"],
                "icon": item["weather"][0]["icon"]
            }

    return {
        "city": current["name"],
        "country": current["sys"]["country"],
        "temperature": current["main"]["temp"],
        "feels_like": current["main"]["feels_like"],
        "humidity": current["main"]["humidity"],
        "wind_speed": current["wind"]["speed"],
        "description": current["weather"][0]["description"],
        "icon": current["weather"][0]["icon"],
        "forecast": list(daily.values())[:5]
    }
