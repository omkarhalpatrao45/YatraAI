import { useMemo, useState } from 'react';

import LoadingSpinner from '../ui/LoadingSpinner.jsx';

function TripPlannerForm({ onSubmit, initialValues }) {
  const defaults = useMemo(
    () =>
      initialValues || {
        destination: '',
        startDate: '',
        days: 4,
        travelers: 2,
        budget: 'mid',
        interests: '',
      },
    [initialValues],
  );

  const [form, setForm] = useState(defaults);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((cur) => ({ ...cur, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        destination: form.destination,
        startDate: form.startDate || undefined,
        days: Number(form.days),
        travelers: Number(form.travelers),
        budget: form.budget,
        interests: form.interests || undefined,
      };
      await onSubmit(payload);
    } catch (err) {
      setError(err?.message || 'Unable to generate trip right now.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-200/70 bg-white p-6 shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
            Trip planner
          </p>
          <h2 className="mt-2 text-lg font-semibold text-zinc-900">
            Tell us your vibe
          </h2>
          <p className="mt-1 text-sm text-zinc-600">
            We’ll craft an itinerary and AI suggestions.
          </p>
        </div>
        {isSubmitting ? <LoadingSpinner label="Generating..." /> : null}
      </div>

      {error ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Destination</span>
          <input
            name="destination"
            value={form.destination}
            onChange={updateField}
            placeholder="e.g., Dubai"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Start date</span>
          <input
            name="startDate"
            value={form.startDate}
            onChange={updateField}
            type="date"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Days</span>
          <input
            name="days"
            type="number"
            min={1}
            value={form.days}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Travelers</span>
          <input
            name="travelers"
            type="number"
            min={1}
            value={form.travelers}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </label>

        <label className="block">
          <span className="text-sm font-semibold text-zinc-800">Budget</span>
          <select
            name="budget"
            value={form.budget}
            onChange={updateField}
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="budget">Budget</option>
            <option value="mid">Mid-range</option>
            <option value="premium">Premium</option>
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="text-sm font-semibold text-zinc-800">Interests (optional)</span>
          <input
            name="interests"
            value={form.interests}
            onChange={updateField}
            placeholder="food, beaches, museums, adventure..."
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-zinc-500">
          You can review results and save your trip from the dashboard.
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isSubmitting ? 'Planning...' : 'Generate trip'}
        </button>
      </div>
    </form>
  );
}

export default TripPlannerForm;

