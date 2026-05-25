from __future__ import annotations

import uuid
from typing import Any, Dict, List, Optional, TypedDict

from fastapi import HTTPException, status

# google-cloud-firestore must be in requirements.txt for these to resolve.
# All concrete types come from google.cloud.firestore_v1, not firebase_admin.firestore.
from google.cloud.firestore_v1 import Client as FirestoreClient
from google.cloud.firestore_v1.base_document import DocumentSnapshot
from google.cloud.firestore_v1.document import DocumentReference

from app.db.firestore import get_firestore_client


# ---------------------------------------------------------------------------
# Typed payloads
# ---------------------------------------------------------------------------

class TripData(TypedDict, total=False):
    id: str
    destination: str
    startDate: Optional[str]
    days: Optional[int]
    travelers: Optional[int]
    budget: Optional[str]
    interests: Optional[str]
    status: Optional[str]
    userUid: str
    aiResult: Optional[Dict[str, Any]]
    createdAt: Optional[str]
    created_at: Optional[str]


class TripSaveResult(TypedDict):
    trip_id: str
    trip: Dict[str, Any]


class TripListResult(TypedDict):
    trips: List[Dict[str, Any]]


class TripDeleteResult(TypedDict):
    deleted: bool
    trip_id: str


# ---------------------------------------------------------------------------
# Repository
# ---------------------------------------------------------------------------

class TripRepository:
    """Firestore persistence layer for trips.

    Design decisions:
    - Document key format: <user_uid>__<trip_id>
    - All Firestore types are sourced from google.cloud.firestore_v1 so
      Pylance can resolve them without stubs.
    - firebase_admin.firestore.client() returns a google.cloud.firestore.Client
      at runtime; the cast in db/firestore.py bridges the type gap.
    """

    _COLLECTION = "trips"

    def __init__(self, client: Optional[FirestoreClient] = None) -> None:
        self._client: FirestoreClient = client or get_firestore_client()

    # ------------------------------------------------------------------
    # Private helpers
    # ------------------------------------------------------------------

    @staticmethod
    def _get_uid(user: Dict[str, Any]) -> str:
        uid: Optional[Any] = user.get("uid") or user.get("sub")
        if not uid:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid user",
            )
        return str(uid)

    @staticmethod
    def _doc_key(uid: str, trip_id: str) -> str:
        return f"{uid}__{trip_id}"

    def _collection(self):  # type: ignore[return]
        # CollectionReference generic typing is complex; kept untyped intentionally.
        return self._client.collection(self._COLLECTION)

    def _doc_ref(self, uid: str, trip_id: str) -> DocumentReference:
        return self._collection().document(self._doc_key(uid, trip_id))  # type: ignore[return-value]

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def save_trip(
        self,
        *,
        user: Dict[str, Any],
        trip: Dict[str, Any],
        ai_result: Optional[Dict[str, Any]],
    ) -> TripSaveResult:
        """Persist (create or merge) a trip for the authenticated user."""
        uid = self._get_uid(user)

        raw_id: Optional[Any] = trip.get("id") or trip.get("trip_id")
        trip_id: str = str(raw_id) if raw_id else str(uuid.uuid4())

        data: Dict[str, Any] = {**trip, "id": trip_id, "userUid": uid, "aiResult": ai_result}

        # merge=True preserves pre-existing fields on the document.
        self._doc_ref(uid, trip_id).set(data, merge=True)
        return {"trip_id": trip_id, "trip": data}

    def list_trips(self, *, user: Dict[str, Any]) -> TripListResult:
        """Return all trips belonging to the authenticated user."""
        uid = self._get_uid(user)

        trips: List[Dict[str, Any]] = []
        for doc in self._collection().stream():
            snap: DocumentSnapshot = doc  # type: ignore[assignment]
            data: Dict[str, Any] = snap.to_dict() or {}
            if data.get("userUid") == uid:
                trips.append(data)

        trips.sort(
            key=lambda t: str(t.get("createdAt") or t.get("created_at") or ""),
            reverse=True,
        )
        return {"trips": trips}

    def get_trip(self, *, user: Dict[str, Any], trip_id: str) -> Dict[str, Any]:
        """Fetch a single trip by trip_id for the authenticated user."""
        uid = self._get_uid(user)
        snap: DocumentSnapshot = self._doc_ref(uid, trip_id).get()  # type: ignore[assignment]

        if not snap.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

        return snap.to_dict() or {}

    def delete_trip(self, *, user: Dict[str, Any], trip_id: str) -> TripDeleteResult:
        """Delete a trip by trip_id for the authenticated user."""
        uid = self._get_uid(user)
        ref: DocumentReference = self._doc_ref(uid, trip_id)
        snap: DocumentSnapshot = ref.get()  # type: ignore[assignment]

        if not snap.exists:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Trip not found")

        ref.delete()
        return {"deleted": True, "trip_id": trip_id}
