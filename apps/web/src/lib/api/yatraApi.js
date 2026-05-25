import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

export const yatraApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export async function getMyTrips() {
  // Backend: GET /api/v1/trip/list
  const res = await yatraApi.get('/api/v1/trip/list');
  return res.data;
}

export async function createTripAndRunAI(payload) {
  // Backend: POST /api/v1/trip/generate
  const res = await yatraApi.post('/api/v1/trip/generate', payload);
  return res.data;
}

export async function saveTrip({ trip, aiResult }) {
  // Backend: POST /api/v1/trip/save
  const res = await yatraApi.post('/api/v1/trip/save', { trip, ai_result: aiResult });
  return res.data;
}

export async function deleteTrip(tripId) {
  // Backend: DELETE /api/v1/trip/delete/{trip_id}
  const res = await yatraApi.delete(`/api/v1/trip/delete/${tripId}`);
  return res.data;
}

export async function getTripDetails(tripId) {
  // No backend endpoint yet for single trip details.
  // UI can still work using tripId as reference if needed.
  const res = await yatraApi.get(`/api/v1/trip/list?trip_id=${tripId}`);
  return res.data;
}


