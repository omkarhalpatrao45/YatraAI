import { useEffect, useState } from 'react';

import { useAuth } from '../context/AuthContext';
import { getMyTrips } from '../lib/api/yatraApi.js';

import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import TripCard from '../components/ui/TripCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

function Dashboard() {
  const { currentUser, logout } = useAuth();
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold">Welcome back</h1>
            <p className="mt-1 text-sm text-zinc-600">
              Signed in as {currentUser?.displayName || currentUser?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={logout}
            className="w-fit rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
          >
            Log out
          </button>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg font-semibold">Your trips</h2>
            <p className="text-sm text-zinc-500">{trips.length} saved</p>
          </div>

          {loading ? (
            <div className="mt-6 flex justify-center">
              <LoadingSpinner label="Loading trips..." />
            </div>
          ) : error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
              {error}
            </div>
          ) : trips.length === 0 ? (
            <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-8">
              <p className="text-sm font-semibold text-zinc-900">
                No trips yet.
              </p>
              <p className="mt-2 text-sm leading-6 text-zinc-600">
                Generate a trip from the planner and it will show up here.
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {trips.map((trip) => (
                <TripCard key={trip.id ?? trip._id ?? JSON.stringify(trip)} trip={trip} />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Dashboard;

