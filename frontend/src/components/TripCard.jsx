import { Calendar, DollarSign, Eye, MapPin, Trash2, Users } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import Card from './Card'
import { formatCurrency, getTripDateRange, parseItinerary } from '../utils/formatters'

export default function TripCard({ trip, onDelete, className = '', compact = false }) {
  const navigate = useNavigate()
  const itinerary = parseItinerary(trip.itinerary_json)
  const hasActions = Boolean(onDelete || !compact)

  const handleDelete = event => {
    event.stopPropagation()
    onDelete?.(trip)
  }

  return (
    <Card
      className={`group cursor-pointer p-5 transition-all hover:border-blue-500/40 dark:hover:border-blue-500/30 hover:shadow-md dark:hover:shadow-blue-500/5 ${className}`}
      onClick={() => navigate(`/trips/${trip.id}`)}
      onKeyDown={!hasActions ? event => {
        if (event.key === 'Enter' || event.key === ' ') navigate(`/trips/${trip.id}`)
      } : undefined}
      role={!hasActions ? 'button' : undefined}
      tabIndex={!hasActions ? 0 : undefined}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-sky-400 shadow-md shadow-blue-500/20">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs text-gray-400 dark:text-zinc-400">{new Date(trip.created_at).toLocaleDateString()}</span>
      </div>

      <h3 className="font-semibold text-textDark dark:text-zinc-100 transition-colors group-hover:text-blue-600 dark:group-hover:text-blue-400">{trip.destination}</h3>
      <p className="mt-1 line-clamp-2 min-h-8 text-xs text-gray-500 dark:text-zinc-300">
        {itinerary.summary || 'AI-generated travel plan'}
      </p>

      <div className="mt-4 space-y-2 border-t border-gray-100 dark:border-zinc-700 pt-3 text-xs text-gray-500 dark:text-zinc-300">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{getTripDateRange(trip)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5 font-semibold text-emerald-600 dark:text-emerald-400">
            <DollarSign className="h-3.5 w-3.5" />
            {formatCurrency(trip.budget)}
          </span>
          <span className="flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5" />
            {trip.travelers} traveler{trip.travelers === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {!compact && trip.interests && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {trip.interests.split(',').map(item => item.trim()).filter(Boolean).slice(0, 3).map(item => (
            <span key={item} className="rounded-full bg-blue-50 dark:bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-600 dark:text-blue-400">
              {item}
            </span>
          ))}
        </div>
      )}

      {hasActions && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={event => { event.stopPropagation(); navigate(`/trips/${trip.id}`) }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-blue-500/30 dark:border-blue-500/20 px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 transition-colors hover:bg-blue-50 dark:hover:bg-blue-500/10"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          {onDelete && (
            <button
              type="button"
              aria-label={`Delete ${trip.destination}`}
              onClick={handleDelete}
              className="rounded-lg border border-red-200 dark:border-red-500/20 p-2 text-red-500 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
