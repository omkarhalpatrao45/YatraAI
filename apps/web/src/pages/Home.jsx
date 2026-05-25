import { Link } from 'react-router-dom';

import TripPlannerForm from '../components/trips/TripPlannerForm.jsx';

import { createTripAndRunAI } from '../lib/api/yatraApi.js';

function Home() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(16,185,129,0.18),transparent_40%),radial-gradient(circle_at_80%_30%,rgba(20,184,166,0.16),transparent_45%),radial-gradient(circle_at_50%_90%,rgba(2,132,199,0.10),transparent_35%)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-10 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-emerald-700">
                YatraAI
              </p>
              <h1 className="mt-4 text-4xl font-semibold leading-tight sm:text-5xl">
                Plan smarter trips with AI.
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-zinc-600">
                Describe your destination and preferences. Get a polished itinerary
                in seconds—then save it to your dashboard.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  Log in to start
                </Link>
                <div className="rounded-xl border border-zinc-200 bg-white/70 px-4 py-3 text-sm text-zinc-700">
                  <span className="font-semibold text-zinc-900">Fast</span> •
                  itinerary • AI suggestions
                </div>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Personal
                  </p>
                  <p className="mt-2 text-sm font-semibold">Tailored plans</p>
                  <p className="mt-1 text-sm text-zinc-600">Based on your vibe</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Practical
                  </p>
                  <p className="mt-2 text-sm font-semibold">Day-by-day</p>
                  <p className="mt-1 text-sm text-zinc-600">Clear activities</p>
                </div>
                <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
                    Save
                  </p>
                  <p className="mt-2 text-sm font-semibold">Your trips</p>
                  <p className="mt-1 text-sm text-zinc-600">Keep everything handy</p>
                </div>
              </div>
            </div>

            <div className="lg:pl-6">
              <TripPlannerForm
                onSubmit={async (payload) => {
                  // Public landing: attempt create/run for preview. Protected users should
                  // create from inside protected pages too.
                  await createTripAndRunAI(payload);
                }}
              />
             
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:pb-20">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Your itinerary, upgraded</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Generate a structured plan with activities, pacing, and a clean
              summary you can act on immediately.
            </p>
          </div>
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Made for mobile</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Responsive cards, modern spacing, and touch-friendly controls.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;

