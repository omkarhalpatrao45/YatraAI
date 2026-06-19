import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MapPin, PiggyBank, Plane, PlusCircle, ReceiptText, Wallet } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import LoadingSpinner from '../components/LoadingSpinner'
import StatCard from '../components/StatCard'
import TripCard from '../components/TripCard'
import { listExpensesForTrips } from '../services/expenseService'
import { listTrips } from '../services/tripService'
import { formatCurrency } from '../utils/formatters'
import { getApiError } from '../utils/apiError'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [expenseTotal, setExpenseTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true

    async function loadDashboard() {
      try {
        const tripData = await listTrips()
        const expenses = await listExpensesForTrips(tripData)
        if (!active) return

        setTrips(tripData)
        setExpenseTotal(expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0))
      } catch (error) {
        if (active) toast.error(getApiError(error, 'Failed to load dashboard data.'))
      } finally {
        if (active) setLoading(false)
      }
    }

    loadDashboard()
    return () => {
      active = false
    }
  }, [])

  const totalBudget = trips.reduce((sum, trip) => sum + Number(trip.budget || 0), 0)
  const remainingBudget = totalBudget - expenseTotal
  const recentTrips = trips.slice(0, 6)

  if (loading) return <LoadingSpinner size="lg" label="Loading dashboard" />

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textDark">Dashboard</h1>
        <p className="text-sm text-gray-400">Your travel planning overview</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Plane} label="Trips" value={trips.length} color="blue" />
        <StatCard icon={Wallet} label="Budget" value={formatCurrency(totalBudget)} color="green" />
        <StatCard icon={ReceiptText} label="Expenses" value={formatCurrency(expenseTotal)} color="orange" />
        <StatCard icon={PiggyBank} label="Remaining" value={formatCurrency(remainingBudget)} color={remainingBudget >= 0 ? 'purple' : 'orange'} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-textDark">Recent Trips</h2>
          <p className="text-sm text-gray-400">Latest AI-generated itineraries</p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/create-trip')}
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <PlusCircle className="h-4 w-4" />
          New Trip
        </button>
      </div>

      {recentTrips.length === 0 ? (
        <Card className="p-6">
          <EmptyState
            icon={Plane}
            title="No trips yet"
            description="Create your first AI-powered itinerary."
            action={
              <button
                type="button"
                onClick={() => navigate('/create-trip')}
                className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
              >
                Plan a Trip
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {recentTrips.map(trip => (
            <TripCard key={trip.id} trip={trip} compact />
          ))}
        </div>
      )}

      <Card className="p-5">
        <h3 className="mb-4 text-base font-semibold text-textDark">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: 'Plan Trip', icon: PlusCircle, to: '/create-trip', color: 'bg-blue-50 text-primary' },
            { label: 'Trip History', icon: MapPin, to: '/trips', color: 'bg-purple-50 text-purple-600' },
            { label: 'Expenses', icon: ReceiptText, to: '/expenses', color: 'bg-green-50 text-green-600' },
            { label: 'Profile', icon: Plane, to: '/profile', color: 'bg-orange-50 text-orange-600' },
          ].map(({ label, icon: Icon, to, color }) => (
            <Link
              key={label}
              to={to}
              className={`flex min-h-24 flex-col items-center justify-center gap-2 rounded-lg p-4 text-center transition-opacity hover:opacity-80 ${color}`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-semibold">{label}</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
