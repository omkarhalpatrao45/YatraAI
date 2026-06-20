import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft, Calendar, Cloud, DollarSign, Download, Hotel,
  MapIcon, MapPin, Plane, ReceiptText, Star, Trash2, Users, Wallet, Utensils, Bus, ShoppingBag, Clock,
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

const CATEGORY_COLORS = [
  'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500', 'bg-orange-500'
]

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
        if (active) { setTrip(null); toast.error(getApiError(error, 'Failed to load trip.')) }
      } finally {
        if (active) setLoading(false)
      }
    }
    loadTrip()
    return () => { active = false }
  }, [id])

  const itinerary = useMemo(() => parseItinerary(trip?.itinerary_json), [trip])
  const expenseTotal = expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0)
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
  if (!trip) return (
    <Card className="mx-auto max-w-2xl p-6">
      <EmptyState icon={MapPin} title="Trip not found" description="The selected trip could not be loaded."
        action={<button type="button" onClick={() => navigate('/trips')} className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white">Back to Trips</button>} />
    </Card>
  )

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
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <button type="button" onClick={() => navigate('/trips')}
            className="mb-2 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to Trips
          </button>
          <h1 className="flex items-center gap-2 text-2xl font-bold text-textDark">
            <MapPin className="h-6 w-6 flex-shrink-0 text-primary" />
            <span className="truncate">{trip.destination}</span>
          </h1>
          {itinerary.summary && <p className="mt-1 max-w-3xl text-sm text-gray-500">{itinerary.summary}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => navigate(`/expenses?tripId=${trip.id}`)}
            className="flex items-center gap-2 rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-blue-50">
            <ReceiptText className="h-4 w-4" /> Expenses
          </button>
          <button type="button" onClick={() => exportTripPDF(trip, itinerary, weather)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700">
            <Download className="h-4 w-4" /> Export PDF
          </button>
          <button type="button" onClick={handleDelete}
            className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-500 transition-colors hover:bg-red-50">
            <Trash2 className="h-4 w-4" /> Delete
          </button>
        </div>
      </div>

      {/* Summary Cards */}
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

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map(({ id: tabId, label, icon: Icon }) => (
            <button key={tabId} type="button" onClick={() => setActiveTab(tabId)}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tabId ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-textDark'}`}>
              <Icon className="h-4 w-4" />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Itinerary Tab */}
      {activeTab === 'itinerary' && (
        <div className="space-y-4">
          {itinerary.days?.length > 0 ? itinerary.days.map((day, index) => (
            <Card key={`${day.day || index}-${day.date || index}`} className="overflow-hidden">
              {/* Day Header */}
              <div className="flex items-start justify-between bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
                <div>
                  <h3 className="font-bold text-textDark">Day {day.day || index + 1}: {day.theme || 'Trip Plan'}</h3>
                  <p className="text-sm text-gray-400">{day.date || 'Date not set'}</p>
                </div>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {formatCurrency(day.estimated_cost || 0)}
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Places with individual costs */}
                {day.places?.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <MapPin className="h-4 w-4 text-primary" /> Places to Visit
                    </p>
                    <div className="space-y-2">
                      {day.places.map((place, i) => {
                        const isObj = typeof place === 'object' && place !== null
                        return (
                          <div key={i} className="flex items-start justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-medium text-textDark">{isObj ? place.name : place}</p>
                              {isObj && place.type && <p className="text-xs text-gray-400">{place.type}</p>}
                              {isObj && place.timing && (
                                <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />{place.timing}
                                </p>
                              )}
                              {isObj && place.description && <p className="mt-1 text-xs text-gray-500">{place.description}</p>}
                              {isObj && place.tips && <p className="mt-1 text-xs text-blue-600 italic">{place.tips}</p>}
                            </div>
                            {isObj && place.estimated_cost != null && (
                              <span className="ml-3 shrink-0 text-sm font-semibold text-green-600">
                                {formatCurrency(place.estimated_cost)}
                              </span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Activities */}
                {day.activities?.length > 0 && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <Star className="h-4 w-4 text-primary" /> Activities
                    </p>
                    <ul className="space-y-1">
                      {day.activities.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{a}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Meals */}
                {day.meals && (
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-sm font-semibold text-gray-700">
                      <Utensils className="h-4 w-4 text-primary" /> Meals
                    </p>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                      {['breakfast', 'lunch', 'dinner'].map(meal => day.meals[meal] && (
                        <div key={meal} className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                          <p className="text-xs font-semibold capitalize text-gray-500">{meal}</p>
                          <p className="text-sm text-textDark">{day.meals[meal].place}</p>
                          {day.meals[meal].estimated_cost != null && (
                            <p className="text-xs font-medium text-green-600">{formatCurrency(day.meals[meal].estimated_cost)}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transport */}
                {day.transport && (
                  <div className="flex items-center gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
                    <Bus className="h-4 w-4 shrink-0 text-primary" />
                    <div className="flex-1">
                      <p className="text-sm text-textDark">{day.transport.mode}</p>
                    </div>
                    {day.transport.estimated_cost != null && (
                      <span className="text-sm font-semibold text-green-600">{formatCurrency(day.transport.estimated_cost)}</span>
                    )}
                  </div>
                )}

                {/* Day tip */}
                {day.tips && (
                  <p className="rounded-lg bg-blue-50 px-3 py-2 text-xs text-blue-700">💡 {day.tips}</p>
                )}
              </div>
            </Card>
          )) : (
            <Card className="p-6">
              <EmptyState icon={Calendar} title="No itinerary details" description="Create a new trip to get a full AI-generated day-wise itinerary." />
            </Card>
          )}
        </div>
      )}

      {/* Budget Tab */}
      {activeTab === 'budget' && (
        <div className="space-y-4">
          {/* Summary metrics */}
          <Card className="p-5">
            <h3 className="mb-4 font-semibold text-textDark">Budget Summary</h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <BudgetMetric label="Trip Budget" value={formatCurrency(trip.budget)} />
              <BudgetMetric label="AI Estimate" value={itinerary.total_estimated_cost ? formatCurrency(itinerary.total_estimated_cost) : 'N/A'} />
              <BudgetMetric label="Actual Expenses" value={formatCurrency(expenseTotal)} />
              <BudgetMetric label="Remaining" value={formatCurrency(remainingAfterExpenses)} tone={remainingAfterExpenses >= 0 ? 'positive' : 'negative'} />
            </div>
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-xs text-gray-400">
                <span>Spent</span>
                <span>{Math.min(100, Math.round((expenseTotal / Number(trip.budget || 1)) * 100))}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100">
                <div className={`h-2 rounded-full ${expenseTotal <= Number(trip.budget) ? 'bg-primary' : 'bg-red-500'}`}
                  style={{ width: `${Math.min(100, (expenseTotal / Number(trip.budget || 1)) * 100)}%` }} />
              </div>
            </div>
          </Card>

          {/* AI Budget Breakdown by category */}
          {itinerary.budget_breakdown?.length > 0 && (
            <Card className="p-5">
              <h3 className="mb-4 font-semibold text-textDark">AI Estimated Budget Breakdown</h3>
              <div className="space-y-3">
                {itinerary.budget_breakdown.map((item, i) => (
                  <div key={item.category}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-gray-600">{item.category}</span>
                      <span className="font-semibold text-textDark">
                        {formatCurrency(item.estimated_cost)}
                        <span className="ml-2 text-xs text-gray-400">({item.percentage}%)</span>
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div className={`h-2 rounded-full ${CATEGORY_COLORS[i % CATEGORY_COLORS.length]}`}
                        style={{ width: `${Math.min(100, item.percentage || 0)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Per-day cost breakdown */}
          {itinerary.days?.length > 0 && (
            <Card className="p-5">
              <h3 className="mb-4 font-semibold text-textDark">Day-wise Estimated Cost</h3>
              <div className="space-y-2">
                {itinerary.days.map((day, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-medium text-textDark">Day {day.day || i + 1}: {day.theme}</p>
                      <p className="text-xs text-gray-400">{day.date}</p>
                    </div>
                    <span className="text-sm font-semibold text-green-600">{formatCurrency(day.estimated_cost || 0)}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Actual expense table */}
          <Card>
            <div className="border-b border-gray-100 p-4">
              <h3 className="font-semibold text-textDark">Actual Trip Expenses</h3>
            </div>
            <ExpenseTable expenses={expenses} />
          </Card>
        </div>
      )}

      {activeTab === 'weather' && <WeatherCard weather={weather} destination={trip.destination} />}
      {activeTab === 'map' && <MapView destination={trip.destination} days={itinerary.days || []} />}

      {/* Hotels Tab */}
      {activeTab === 'hotels' && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {itinerary.hotels?.length > 0 ? itinerary.hotels.map((hotel, index) => (
            <Card key={`${hotel.name}-${index}`} className="p-5">
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="font-semibold text-textDark">{hotel.name}</h3>
                <span className="flex items-center gap-1 text-sm text-yellow-500">
                  <Star className="h-4 w-4 fill-current" />{hotel.rating || 'N/A'}
                </span>
              </div>
              <p className="text-sm font-semibold text-primary">{hotel.price_range || 'Price not listed'}</p>
              {hotel.price_per_night && <p className="text-xs text-gray-400">${hotel.price_per_night}/night</p>}
              <p className="mt-2 text-sm text-gray-500">{hotel.description}</p>
              {hotel.amenities?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {hotel.amenities.map(a => (
                    <span key={a} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-600">{a}</span>
                  ))}
                </div>
              )}
              <p className="mt-3 flex items-center gap-1 text-xs text-gray-400">
                <MapPin className="h-3 w-3" />{hotel.location || trip.destination}
              </p>
            </Card>
          )) : (
            <Card className="p-6 md:col-span-2">
              <EmptyState icon={Hotel} title="No hotel recommendations" description="Hotel suggestions were not returned for this itinerary." />
            </Card>
          )}
        </div>
      )}

      {/* Flights Tab */}
      {activeTab === 'flights' && (
        <div className="space-y-3">
          {itinerary.flights?.length > 0 ? itinerary.flights.map((flight, index) => (
            <Card key={`${flight.airline}-${index}`} className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50">
                    <Plane className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-textDark">{flight.airline}</p>
                    <p className="text-sm text-gray-500">{flight.departure_city} → {flight.destination_city || trip.destination}</p>
                    {flight.type && <p className="text-xs text-gray-400">{flight.type}</p>}
                  </div>
                </div>
                <div className="sm:text-right">
                  <p className="font-bold text-green-600">{formatCurrency(flight.estimated_cost || 0)}</p>
                  <p className="text-xs text-gray-400">{flight.duration}</p>
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

function BudgetMetric({ label, value, tone = 'neutral' }) {
  const toneClass = tone === 'positive' ? 'text-green-600' : tone === 'negative' ? 'text-red-600' : 'text-textDark'
  return (
    <div className="rounded-lg bg-gray-50 p-4">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`mt-1 text-lg font-bold ${toneClass}`}>{value}</p>
    </div>
  )
}
