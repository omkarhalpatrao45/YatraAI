import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Check, DollarSign, Plus, ReceiptText, X } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import EmptyState from '../components/EmptyState'
import ExpenseTable from '../components/ExpenseTable'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  createExpense,
  listExpenses,
  removeExpense,
  updateExpense,
} from '../services/expenseService'
import { listTrips } from '../services/tripService'
import { getApiError } from '../utils/apiError'
import { CATEGORY_COLORS, EXPENSE_CATEGORIES } from '../utils/expenseConstants'
import { formatCurrency } from '../utils/formatters'

const today = new Date().toISOString().split('T')[0]
const emptyForm = { title: '', amount: '', category: 'Food', expense_date: today }

export default function ExpenseTracker() {
  const { id: routeTripId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const queryTripId = searchParams.get('tripId')
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [selectedTripId, setSelectedTripId] = useState(queryTripId || routeTripId || '')
  const [expenses, setExpenses] = useState([])
  const [loadingTrips, setLoadingTrips] = useState(true)
  const [loadingExpenses, setLoadingExpenses] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    let active = true

    async function loadTrips() {
      try {
        const data = await listTrips()
        if (!active) return

        setTrips(data)
        const requestedId = queryTripId || routeTripId
        const fallbackId = data[0]?.id ? String(data[0].id) : ''
        const validRequestedId = data.some(trip => String(trip.id) === String(requestedId))
        setSelectedTripId(validRequestedId ? String(requestedId) : fallbackId)
      } catch (error) {
        if (active) toast.error(getApiError(error, 'Failed to load trips.'))
      } finally {
        if (active) setLoadingTrips(false)
      }
    }

    loadTrips()
    return () => {
      active = false
    }
  }, [routeTripId, queryTripId])

  useEffect(() => {
    if (!selectedTripId) {
      setExpenses([])
      return
    }

    let active = true
    setLoadingExpenses(true)

    async function loadExpenses() {
      try {
        const data = await listExpenses(selectedTripId)
        if (active) setExpenses(data)
      } catch (error) {
        if (active) toast.error(getApiError(error, 'Failed to load expenses.'))
      } finally {
        if (active) setLoadingExpenses(false)
      }
    }

    loadExpenses()
    return () => {
      active = false
    }
  }, [selectedTripId])

  const selectedTrip = useMemo(
    () => trips.find(trip => String(trip.id) === String(selectedTripId)) || null,
    [trips, selectedTripId]
  )

  const totals = useMemo(() => {
    const total = expenses.reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
    const byCategory = EXPENSE_CATEGORIES.reduce((acc, category) => {
      acc[category] = expenses
        .filter(expense => expense.category === category)
        .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
      return acc
    }, {})

    return {
      total,
      remaining: Number(selectedTrip?.budget || 0) - total,
      byCategory,
    }
  }, [expenses, selectedTrip])

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: '' }))
  }

  const handleTripChange = event => {
    const nextId = event.target.value
    setSelectedTripId(nextId)
    setShowForm(false)
    setEditId(null)
    setForm(emptyForm)
    if (nextId) setSearchParams({ tripId: nextId })
    else setSearchParams({})
  }

  const validate = () => {
    const nextErrors = {}
    if (!selectedTripId) nextErrors.trip = 'Select a trip.'
    if (form.title.trim().length < 2) nextErrors.title = 'Expense title is required.'
    if (!Number(form.amount) || Number(form.amount) <= 0) nextErrors.amount = 'Amount must be greater than 0.'
    if (!form.expense_date) nextErrors.expense_date = 'Date is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSave = async event => {
    event.preventDefault()
    if (!validate()) return

    setSaving(true)
    const payload = {
      title: form.title.trim(),
      amount: Number(form.amount),
      category: form.category,
      expense_date: form.expense_date,
    }

    try {
      if (editId) {
        const data = await updateExpense(editId, payload)
        setExpenses(current => current.map(expense => expense.id === editId ? data : expense))
        toast.success('Expense updated')
      } else {
        const data = await createExpense({ trip_id: Number(selectedTripId), ...payload })
        setExpenses(current => [data, ...current])
        toast.success('Expense added')
      }
      setForm(emptyForm)
      setEditId(null)
      setShowForm(false)
    } catch (error) {
      toast.error(getApiError(error, 'Failed to save expense.'))
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = expense => {
    setForm({
      title: expense.title,
      amount: String(expense.amount),
      category: expense.category,
      expense_date: expense.expense_date,
    })
    setEditId(expense.id)
    setShowForm(true)
    setErrors({})
  }

  const handleDelete = async expense => {
    if (!window.confirm(`Delete expense "${expense.title}"?`)) return

    try {
      await removeExpense(expense.id)
      setExpenses(current => current.filter(item => item.id !== expense.id))
      toast.success('Expense deleted')
    } catch (error) {
      toast.error(getApiError(error, 'Failed to delete expense.'))
    }
  }

  if (loadingTrips) return <LoadingSpinner size="lg" label="Loading expenses" />

  if (!trips.length) {
    return (
      <Card className="mx-auto max-w-2xl p-6">
        <EmptyState
          icon={ReceiptText}
          title="No trips yet"
          description="Create a trip before adding expenses."
          action={
            <button
              type="button"
              onClick={() => navigate('/create-trip')}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white"
            >
              Plan a Trip
            </button>
          }
        />
      </Card>
    )
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          {selectedTrip && (
            <button
              type="button"
              onClick={() => navigate(`/trips/${selectedTrip.id}`)}
              className="mb-1 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Trip
            </button>
          )}
          <h1 className="text-2xl font-bold text-textDark">Expense Tracker</h1>
          <p className="text-sm text-gray-400">{selectedTrip?.destination || 'Select a trip to manage spending'}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedTripId}
            onChange={handleTripChange}
            className="rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {trips.map(trip => (
              <option key={trip.id} value={trip.id}>{trip.destination}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => {
              setForm(emptyForm)
              setEditId(null)
              setErrors({})
              setShowForm(true)
            }}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
            Add Expense
          </button>
        </div>
      </div>

      {errors.trip && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{errors.trip}</p>}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-xs text-gray-400">Trip Budget</p>
          <p className="mt-1 text-2xl font-bold text-textDark">{formatCurrency(selectedTrip?.budget || 0)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400">Total Expenses</p>
          <p className="mt-1 text-2xl font-bold text-textDark">{formatCurrency(totals.total)}</p>
        </Card>
        <Card className="p-4">
          <p className="text-xs text-gray-400">Remaining Budget</p>
          <p className={`mt-1 text-2xl font-bold ${totals.remaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totals.remaining)}
          </p>
        </Card>
      </div>

      {totals.total > 0 && (
        <Card className="p-5">
          <h3 className="mb-3 font-semibold text-textDark">Expense Breakdown</h3>
          <div className="space-y-2">
            {Object.entries(totals.byCategory).filter(([, amount]) => amount > 0).map(([category, amount]) => (
              <div key={category} className="flex flex-wrap items-center gap-3">
                <span className={`rounded-full px-2 py-1 text-xs font-medium ${CATEGORY_COLORS[category]}`}>
                  {category}
                </span>
                <div className="h-2 min-w-32 flex-1 rounded-full bg-gray-100">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${(amount / totals.total) * 100}%` }} />
                </div>
                <span className="w-24 text-right text-sm font-semibold text-textDark">{formatCurrency(amount)}</span>
                <span className="w-12 text-right text-xs text-gray-400">{((amount / totals.total) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {showForm && (
        <Card className="p-5">
          <h3 className="mb-4 font-semibold text-textDark">{editId ? 'Edit Expense' : 'Add Expense'}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2" noValidate>
            <Field label="Title" error={errors.title}>
              <input
                type="text"
                value={form.title}
                onChange={event => updateField('title', event.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.title ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="Dinner, train tickets, museum pass"
              />
            </Field>
            <Field label="Amount" error={errors.amount}>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.amount}
                onChange={event => updateField('amount', event.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.amount ? 'border-red-300' : 'border-gray-200'}`}
                placeholder="0.00"
              />
            </Field>
            <Field label="Category">
              <select
                value={form.category}
                onChange={event => updateField('category', event.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {EXPENSE_CATEGORIES.map(category => <option key={category}>{category}</option>)}
              </select>
            </Field>
            <Field label="Date" error={errors.expense_date}>
              <input
                type="date"
                value={form.expense_date}
                onChange={event => updateField('expense_date', event.target.value)}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${errors.expense_date ? 'border-red-300' : 'border-gray-200'}`}
              />
            </Field>
            <div className="flex flex-wrap gap-2 sm:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
              >
                <Check className="h-4 w-4" />
                {saving ? 'Saving...' : editId ? 'Update' : 'Add'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false)
                  setEditId(null)
                  setErrors({})
                  setForm(emptyForm)
                }}
                className="flex items-center gap-1 rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            </div>
          </form>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h3 className="font-semibold text-textDark">All Expenses ({expenses.length})</h3>
          <DollarSign className="h-4 w-4 text-gray-300" />
        </div>
        {loadingExpenses ? (
          <LoadingSpinner label="Loading trip expenses" />
        ) : (
          <ExpenseTable expenses={expenses} onEdit={handleEdit} onDelete={handleDelete} />
        )}
      </Card>
    </div>
  )
}

function Field({ label, error, children }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-gray-600">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  )
}
