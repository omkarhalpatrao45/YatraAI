import { useEffect, useState } from 'react';

import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import TripCard from '../components/ui/TripCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

import { getMyTrips } from '../lib/api/yatraApi.js';

function MyTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadTrips() {
      try {
        setLoading(true);
        setError('');
        const data = await getMyTrips();
        if (mounted) setTrips(Array.isArray(data) ? data : data?.trips ?? []);
      } catch (e) {
        if (mounted) setError(e?.message || 'Failed to load trips.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTrips();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
            My Trips
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Trips</h1>
          <p className="mt-1 text-sm text-zinc-600">All your generated itineraries</p>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner label="Loading trips..." />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trips.map((trip) => (
              <TripCard key={trip.id ?? trip._id ?? JSON.stringify(trip)} trip={trip} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default MyTrips;

