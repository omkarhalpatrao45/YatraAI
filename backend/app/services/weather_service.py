import httpx

GEO_URL = "https://geocoding-api.open-meteo.com/v1/search"
WEATHER_URL = "https://api.open-meteo.com/v1/forecast"

WEATHER_CODES = {
    0: "Clear sky", 1: "Mainly clear", 2: "Partly cloudy", 3: "Overcast",
    45: "Foggy", 48: "Icy fog", 51: "Light drizzle", 53: "Drizzle", 55: "Heavy drizzle",
    61: "Light rain", 63: "Rain", 65: "Heavy rain", 71: "Light snow", 73: "Snow",
    75: "Heavy snow", 80: "Rain showers", 81: "Showers", 82: "Heavy showers",
    95: "Thunderstorm", 96: "Thunderstorm with hail", 99: "Heavy thunderstorm"
}

async def get_weather(city: str) -> dict:
    async with httpx.AsyncClient() as client:
        geo = await client.get(GEO_URL, params={"name": city, "count": 1, "language": "en", "format": "json"})
        geo.raise_for_status()
        results = geo.json().get("results")
        if not results:
            raise ValueError(f"City '{city}' not found")
        loc = results[0]
        lat, lon = loc["latitude"], loc["longitude"]

        weather = await client.get(WEATHER_URL, params={
            "latitude": lat, "longitude": lon,
            "current": "temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code",
            "daily": "weather_code,temperature_2m_max,temperature_2m_min",
            "timezone": "auto", "forecast_days": 5
        })
        weather.raise_for_status()
        w = weather.json()

    cur = w["current"]
    daily = w["daily"]
    code = cur["weather_code"]

    forecast = [
        {
            "date": daily["time"][i],
            "temp_min": daily["temperature_2m_min"][i],
            "temp_max": daily["temperature_2m_max"][i],
            "description": WEATHER_CODES.get(daily["weather_code"][i], "Unknown"),
            "icon": str(daily["weather_code"][i])
        }
        for i in range(len(daily["time"]))
    ]

    return {
        "city": loc["name"],
        "country": loc.get("country", ""),
        "temperature": cur["temperature_2m"],
        "feels_like": cur["apparent_temperature"],
        "humidity": cur["relative_humidity_2m"],
        "wind_speed": cur["wind_speed_10m"],
        "description": WEATHER_CODES.get(code, "Unknown"),
        "icon": str(code),
        "forecast": forecast
    }
