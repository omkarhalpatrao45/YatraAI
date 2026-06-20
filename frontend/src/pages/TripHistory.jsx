import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Filter, MapPin, PlusCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import TripCard from '../components/TripCard'
import { listTrips, removeTrip } from '../services/tripService'
import { getApiError } from '../utils/apiError'

export default function TripHistory() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function loadTrips() {
      try {
        const data = await listTrips()
        if (active) setTrips(data)
      } catch (error) {
        if (active) toast.error(getApiError(error, 'Failed to load trips.'))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadTrips()
    return () => {
      active = false
    }
  }, [])

  const handleDelete = async trip => {
    if (!window.confirm(`Delete trip to ${trip.destination}?`)) return

    try {
      await removeTrip(trip.id)
      setTrips(current => current.filter(item => item.id !== trip.id))
      toast.success('Trip deleted')
    } catch (error) {
      toast.error(getApiError(error, 'Failed to delete trip.'))
    }
  }

  const filteredTrips = useMemo(() => {
    const term = search.trim().toLowerCase()
    return trips
      .filter(trip => {
        if (!term) return true
        return [trip.destination, trip.interests].some(value => value?.toLowerCase().includes(term))
      })
      .sort((a, b) => {
        if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at)
        if (sortBy === 'budget') return Number(b.budget || 0) - Number(a.budget || 0)
        if (sortBy === 'destination') return a.destination.localeCompare(b.destination)
        return new Date(b.created_at) - new Date(a.created_at)
      })
  }, [trips, search, sortBy])

  if (loading) return <LoadingSpinner size="lg" label="Loading trips" />

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-textDark">Trip History</h1>
          <p className="text-sm text-gray-400 dark:text-zinc-400">{trips.length} trip{trips.length === 1 ? '' : 's'} planned</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/create-trip')}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          Plan Trip
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-400" />
          <input
            type="text"
            value={search}
            onChange={event => setSearch(event.target.value)}
            placeholder="Search destinations or interests"
            className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-100 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="relative sm:w-56">
          <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-zinc-400" />
          <select
            value={sortBy}
            onChange={event => setSortBy(event.target.value)}
            className="w-full rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 dark:text-zinc-100 py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="budget">Highest Budget</option>
            <option value="destination">Destination A-Z</option>
          </select>
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={MapPin}
            title={search ? 'No trips found' : 'No trips yet'}
            description={search ? 'Try another destination or interest.' : 'Create a trip to start building your history.'}
            action={!search && (
              <button
                type="button"
                onClick={() => navigate('/create-trip')}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Plan a Trip
              </button>
            )}
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
