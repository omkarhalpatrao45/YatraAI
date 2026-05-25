import { Link } from 'react-router-dom';

function TripCard({ trip }) {
  const title = trip?.title || trip?.destination || 'Untitled trip';
  const status = trip?.status || 'Ready';
  const from = trip?.createdAt || trip?.created_at;

  return (
    <Link
      to={`/trip/${trip?.id ?? trip?._id}`}
      className="group relative block overflow-hidden rounded-2xl border border-zinc-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-md"
    >
      <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-600/10 to-teal-500/10 blur-2xl" />

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-700">
              Trip
            </p>
            <h3 className="mt-2 line-clamp-2 text-base font-semibold text-zinc-900">
              {title}
            </h3>
          </div>

          <div className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs font-semibold text-zinc-700">
            {status}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {trip?.days ? (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800">
              {trip.days} days
            </span>
          ) : null}
          {trip?.budget ? (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800">
              {trip.budget}
            </span>
          ) : null}
          {from ? (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-800">
              {typeof from === 'string' ? from.slice(0, 10) : String(from)}
            </span>
          ) : null}
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-sm font-semibold text-zinc-600">
            View trip details
          </p>
          <span className="rounded-full bg-emerald-700 px-3 py-2 text-white opacity-0 transition group-hover:opacity-100">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}

export default TripCard;

