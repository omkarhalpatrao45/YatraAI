import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Navbar from '../components/layout/Navbar.jsx';
import Footer from '../components/layout/Footer.jsx';
import TripPlannerForm from '../components/trips/TripPlannerForm.jsx';
import AIResultCard from '../components/ui/AIResultCard.jsx';
import LoadingSpinner from '../components/ui/LoadingSpinner.jsx';

import { createTripAndRunAI, getTripDetails } from '../lib/api/yatraApi.js';

function TripDetails() {
  const { tripId } = useParams();

  const [trip, setTrip] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function loadTrip() {
      try {
        setLoading(true);
        setError('');
        const data = await getTripDetails(tripId);
        if (!mounted) return;
        setTrip(data?.trip ?? data);
        setAiResult(data?.aiResult ?? data?.result ?? data);
      } catch (e) {
        if (mounted) setError(e?.message || 'Failed to load trip.');
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadTrip();
    return () => {
      mounted = false;
    };
  }, [tripId]);

  return (
    <div className="min-h-screen bg-zinc-50">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:py-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
            Trip Details
          </p>
          <h1 className="mt-2 text-3xl font-semibold">{trip?.title || trip?.destination || 'Your itinerary'}</h1>
          <p className="mt-1 text-sm text-zinc-600">Trip ID: {tripId}</p>
        </div>

        {loading ? (
          <div className="mt-8 flex justify-center">
            <LoadingSpinner label="Loading trip..." />
          </div>
        ) : error ? (
          <div className="mt-8 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-semibold text-red-700">
            {error}
          </div>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-5">
            <div className="lg:col-span-2">
              <TripPlannerForm
                initialValues={
                  trip
                    ? {
                        destination: trip?.destination ?? '',
                        startDate: trip?.startDate ?? '',
                        days: trip?.days ?? 4,
                        travelers: trip?.travelers ?? 2,
                        budget: trip?.budget ?? 'mid',
                        interests: trip?.interests ?? '',
                      }
                    : undefined
                }
                onSubmit={async (payload) => {
                  const data = await createTripAndRunAI({ tripId, ...payload });
                  setAiResult(data?.aiResult ?? data?.result ?? data);
                  setTrip(data?.trip ?? trip);
                }}
              />
              <p className="mt-3 text-xs text-zinc-500">
                Use the planner to regenerate itinerary (placeholder endpoints).
              </p>
            </div>

            <div className="lg:col-span-3">
              <AIResultCard result={aiResult} />
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default TripDetails;

