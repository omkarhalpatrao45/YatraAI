from __future__ import annotations

from functools import lru_cache

from app.core.config import get_settings


@lru_cache
def get_gemini_client():
    """Return a Gemini client.

    Uses `google-generativeai` for compatibility.
    Falls back to raising if GEMINI_API_KEY missing.
    """
    settings = get_settings()
    if not settings.gemini_api_key:
        raise RuntimeError("GEMINI_API_KEY is not configured")

    # Local import so the app can start even if the dependency isn't installed.
    try:
        import google.generativeai as genai  # type: ignore
    except Exception as e:
        raise RuntimeError("Gemini dependency is not installed") from e

    genai.configure(api_key=settings.gemini_api_key)
    return genai



def get_gemini_model_name() -> str:
    return get_settings().gemini_model

