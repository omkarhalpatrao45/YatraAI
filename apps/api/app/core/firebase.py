import json
from functools import lru_cache

try:
    import firebase_admin
    from firebase_admin import credentials
except Exception:  # pragma: no cover
    firebase_admin = None  # type: ignore
    credentials = None  # type: ignore

from app.core.config import get_settings



@lru_cache
def initialize_firebase_app() -> firebase_admin.App:
    try:
        return firebase_admin.get_app()
    except ValueError:
        settings = get_settings()

        options = {}
        if settings.firebase_project_id:
            options["projectId"] = settings.firebase_project_id

        if settings.firebase_service_account_json:
            service_account = json.loads(settings.firebase_service_account_json)
            credential = credentials.Certificate(service_account)
        elif settings.firebase_service_account_path:
            credential = credentials.Certificate(settings.firebase_service_account_path)
        else:
            credential = credentials.ApplicationDefault()

        return firebase_admin.initialize_app(credential, options or None)
