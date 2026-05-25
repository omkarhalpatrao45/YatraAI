from functools import lru_cache

from firebase_admin import firestore
from google.cloud.firestore_v1 import Client as FirestoreClient

from app.core.firebase import initialize_firebase_app


@lru_cache
def get_firestore_client() -> FirestoreClient:
    initialize_firebase_app()
    # firebase_admin.firestore.client() returns google.cloud.firestore.Client
    return firestore.client()  # type: ignore[return-value]
