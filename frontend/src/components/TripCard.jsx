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
      className={`group cursor-pointer p-5 transition-all hover:border-primary/30 hover:shadow-md ${className}`}
      onClick={() => navigate(`/trips/${trip.id}`)}
      onKeyDown={!hasActions ? event => {
        if (event.key === 'Enter' || event.key === ' ') navigate(`/trips/${trip.id}`)
      } : undefined}
      role={!hasActions ? 'button' : undefined}
      tabIndex={!hasActions ? 0 : undefined}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary">
          <MapPin className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs text-gray-400">{new Date(trip.created_at).toLocaleDateString()}</span>
      </div>

      <h3 className="font-semibold text-textDark transition-colors group-hover:text-primary">{trip.destination}</h3>
      <p className="mt-1 line-clamp-2 min-h-8 text-xs text-gray-500">
        {itinerary.summary || 'AI-generated travel plan'}
      </p>

      <div className="mt-4 space-y-2 border-t border-gray-100 pt-3 text-xs text-gray-500">
        <div className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" />
          <span>{getTripDateRange(trip)}</span>
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="flex items-center gap-1.5 font-semibold text-green-600">
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
        <div className="mt-3 flex flex-wrap gap-2">
          {trip.interests.split(',').map(item => item.trim()).filter(Boolean).slice(0, 3).map(item => (
            <span key={item} className="rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-primary">
              {item}
            </span>
          ))}
        </div>
      )}

      {hasActions && (
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={event => {
              event.stopPropagation()
              navigate(`/trips/${trip.id}`)
            }}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-primary px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-blue-50"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
          {onDelete && (
            <button
              type="button"
              aria-label={`Delete ${trip.destination}`}
              onClick={handleDelete}
              className="rounded-lg border border-red-200 p-2 text-red-500 transition-colors hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </Card>
  )
}
