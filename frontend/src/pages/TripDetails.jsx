import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  Cloud,
  DollarSign,
  Download,
  Hotel,
  MapIcon,
  MapPin,
  Plane,
  ReceiptText,
  Star,
  Trash2,
  Users,
  Wallet,
} from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import ExpenseTable from '../components/ExpenseTable'
import LoadingSpinner from '../components/LoadingSpinner'
import MapView from '../components/MapView'
import WeatherCard from '../components/WeatherCard'
import { listExpenses } from '../services/expenseService'
import { getTrip, removeTrip } from '../services/tripService'
import { getWeather } from '../services/weatherService'
import { getApiError } from '../utils/apiError'
import { exportTripPDF } from '../utils/pdfExport'
import { formatCurrency, getTripDateRange, parseItinerary } from '../utils/formatters'

export default function TripDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [weather, setWeather] = useState(null)
  const [expenses, setExpenses] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('itinerary')

  useEffect(() => {
    let active = true

    async function loadTrip() {
      setLoading(true)
      try {
        const tripData = await getTrip(id)
        const city = tripData.destination.split(',')[0].trim()
        const [weatherResult, expensesResult] = await Promise.allSettled([
          getWeather(city),
          listExpenses(id),
        ])

        if (!active) return
        setTrip(tripData)
        setWeather(weatherResult.status === 'fulfilled' ? weatherResult.value : null)
        setExpenses(expensesResult.status === 'fulfilled' ? expensesResult.value : [])
      } catch (error) {
        if (active) {
          setTrip(null)
          toast.error(getApiError(error, 'Failed to load trip.'))
        }
      } finally {
        if (active) setLoading(false)
      }
    }

    loadTrip()
    return () => {
      active = false
    }
  }, [id])

  const itinerary = useMemo(() => parseItinerary(trip?.itinerary_json), [trip])
  const expenseTotal = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
  const estimatedCost = Number(itinerary.total_estimated_cost || 0)
  const remainingAfterExpenses = Number(trip?.budget || 0) - expenseTotal

  const handleDelete = async () => {
    if (!trip || !window.confirm(`Delete trip to ${trip.destination}?`)) return

    try {
      await removeTrip(trip.id)
      toast.success('Trip deleted')
      navigate('/trips')
    } catch (error) {
      toast.error(getApiError(error, 'Failed to delete trip.'))
    }
  }

  if (loading) return <LoadingSpinner size="lg" label="Loading trip" />

  if (!trip) {
    return (
      <Card className="mx-auto max-w-2xl p-6">
        <EmptyState
          icon={MapPin}
          title="Trip not found"
          description="The selected trip could not be loaded."
          action={
            <button
              type="button"
              onClick={() => navigate('/trips')}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Back to Trips
            </button>
          }
        />
      </Card>
    )
  }

  const tabs = [
    { id: 'itinerary', label: 'Itinerary', icon: Calendar },
    { id: 'budget', label: 'Budget', icon: Wallet },
    { id: 'weather', label: 'Weather', icon: Cloud },
    { id: 'map', label: 'Map', icon: MapIcon },
    { id: 'hotels', label: 'Hotels', icon: Hotel },
    { id: 'flights', label: 'Flights', icon: Plane },
  ]

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => navigate('/trips')}
            className="mb-2 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Trips
          </button>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-textDark">
            <MapPin className="h-6 w-6 flex-shrink-0 text-primary" />
            <span className="truncate">{trip.destination}</span>
          </h1>
          {itinerary.summary && <p className="mt-1 max-w-3xl text-sm text-gray-500">{itinerary.summary}</p>}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => navigate(`/expenses?tripId=${trip.id}`)}
            className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-blue-50"
          >
            <ReceiptText className="h-4 w-4" />
            Expenses
          </button>
          <button
            type="button"
            onClick={() => exportTripPDF(trip, itinerary, weather)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export PDF
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { icon: Calendar, label: 'Dates', value: getTripDateRange(trip) },
          { icon: DollarSign, label: 'Budget', value: formatCurrency(trip.budget) },
          { icon: Users, label: 'Travelers', value: trip.travelers },
          { icon: ReceiptText, label: 'Expenses', value: formatCurrency(expenseTotal) },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label} className="flex min-w-0 items-center gap-3 p-4">
            <Icon className="h-5 w-5 flex-shrink-0 text-primary" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">{label}</p>
              <p className="truncate text-sm font-semibold text-textDark">{value}</p>
            </div>
          </Card>
        ))}
      </div>

      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(({ id: tabId, label, icon: Icon }) => (
            <button
              key={tabId}
              type="button"
              onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === tabId ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-textDark'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'itinerary' && (
        <div className="space-y-4">
          {itinerary.days?.length > 0 ? itinerary.days.map((day, index) => (
            <Card key={`${day.day || index}-${day.date || index}`} className="p-5">
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-bold text-textDark">Day {day.day || index + 1}: {day.theme || 'Trip Plan'}</h3>
                  <p className="text-sm text-gray-400">{day.date || 'Date not set'}</p>
                </div>
                <span className="w-fit rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                  {formatCurrency(day.estimated_cost || 0)}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-3">
                <ItineraryList icon={MapPin} title="Places" items={day.places} />
                <ItineraryList icon={Star} title="Activities" items={day.activities} />
                <ItineraryList icon={Calendar} title="Timing" items={day.timing} />
              </div>

              {day.tips && (
                <p className="mt-4 rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">
                  {day.tips}
                </p>
              )}
            </Card>
          )) : (
            <Card className="p-6">
              <EmptyState
                icon={Calendar}
                title="No itinerary details"
                description="The backend created the trip, but no day-wise itinerary was returned."
              />
            </Card>
          )}
        </div>
      )}

      {activeTab === 'budget' && (
        <div className="space-y-4">
          <Card className="p-5">
            <h3 className="mb-4 font-semibold text-textDark">Budget Summary</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <BudgetMetric label="Trip Budget" value={formatCurrency(trip.budget)} />
              <BudgetMetric label="AI Estimate" value={estimatedCost ? formatCurrency(estimatedCost) : 'N/A'} />
              <BudgetMetric label="Actual Expenses" value={formatCurrency(expenseTotal)} />
              <BudgetMetric label="Remaining" value={formatCurrency(remainingAfterExpenses)} tone={remainingAfterExpenses >= 0 ? 'positive' : 'negative'} />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-gray-400">
                <span>Spent</span>
                <span>{Math.min(100, Math.round((expenseTotal / Number(trip.budget || 1)) * 100))}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div
                  className={`h-2 rounded-full ${expenseTotal <= Number(trip.budget || 0) ? 'bg-primary' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (expenseTotal / Number(trip.budget || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </Card>

          <Card>
            <div className="border-b border-gray-100 p-4">
              <h3 className="font-semibold text-textDark">Trip Expenses</h3>
            </div>
            <ExpenseTable expenses={expenses} />
          </Card>
        </div>
      )}

      {activeTab === 'weather' && <WeatherCard weather={weather} destination={trip.destination} />}
      {activeTab === 'map' && <MapView destination={trip.destination} days={itinerary.days || []} />}

      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {itinerary.hotels?.length > 0 ? itinerary.hotels.map((hotel, index) => (
            <Card key={`${hotel.name}-${index}`} className="p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-semibold text-textDark">{hotel.name}</h3>
                <span className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />
                  {hotel.rating || 'N/A'}
                </span>
              </div>
              <p className="text-sm font-semibold text-primary">{hotel.price_range || 'Price not listed'}</p>
              <p className="mt-2 text-sm text-gray-500">{hotel.description || 'No description provided.'}</p>
              <p className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />
                {hotel.location || trip.destination}
              </p>
            </Card>
          )) : (
            <Card className="p-6 md:col-span-2">
              <EmptyState icon={Hotel} title="No hotel recommendations" description="Hotel suggestions were not returned for this itinerary." />
            </Card>
          )}
        </div>
      )}

      {activeTab === 'flights' && (
        <div className="space-y-3">
          {itinerary.flights?.length > 0 ? itinerary.flights.map((flight, index) => (
            <Card key={`${flight.airline}-${index}`} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-textDark">{flight.airline || 'Airline'}</p>
                    <p className="text-sm text-gray-500">{flight.departure_city || 'Origin'} to {flight.destination_city || trip.destination}</p>
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold text-green-600">{formatCurrency(flight.estimated_cost || 0)}</p>
                  <p className="text-xs text-gray-400">{flight.duration || 'Duration not listed'}</p>
                </div>
              </div>
            </Card>
          )) : (
            <Card className="p-6">
              <EmptyState icon={Plane} title="No flight suggestions" description="Flight suggestions were not returned for this itinerary." />
            </Card>
          )}
        </div>
      )}
    </div>
  )
}

function ItineraryList({ icon: Icon, title, items = [] }) {
  return (
    <div>
      <p className="mb-2 flex items-center gap-1 font-medium text-gray-700">
        <Icon className="h-3.5 w-3.5 text-primary" />
        {title}
      </p>
      {items?.length ? (
        <ul className="space-y-1 text-gray-600">
          {items.map(item => <li key={item}>{item}</li>)}
        </ul>
      ) : (
        <p className="text-xs text-gray-400">Not specified</p>
      )}
    </div>
  )
}

function BudgetMetric({ label, value, tone = 'neutral' }) {
  const toneClass = tone === 'positive' ? 'text-green-600' : tone === 'negative' ? 'text-red-600' : 'text-textDark'

  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</p>
    </div>
  )
}
