import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar, DollarSign, MapPin, Sparkles, Tag, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import Card from '../components/Card'
import { createTrip } from '../services/tripService'
import { getApiError } from '../utils/apiError'

const INTERESTS = ['Adventure', 'Nature', 'Food', 'Historical', 'Beach', 'Shopping', 'Culture', 'Nightlife']

const initialForm = {
  destination: '',
  start_date: '',
  end_date: '',
  budget: '',
  travelers: 1,
  interests: [],
}

export default function CreateTrip() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState(initialForm)

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: '' }))
  }

  const toggleInterest = interest => {
    setForm(current => ({
      ...current,
      interests: current.interests.includes(interest)
        ? current.interests.filter(item => item !== interest)
        : [...current.interests, interest],
    }))
  }

  const validate = () => {
    const nextErrors = {}
    if (form.destination.trim().length < 2) nextErrors.destination = 'Destination is required.'
    if (!form.start_date) nextErrors.start_date = 'Start date is required.'
    if (!form.end_date) nextErrors.end_date = 'End date is required.'
    if (form.start_date && form.end_date && form.start_date > form.end_date) nextErrors.end_date = 'End date must be after the start date.'
    if (!Number(form.budget) || Number(form.budget) <= 0) nextErrors.budget = 'Enter a budget greater than 0.'
    if (!Number(form.travelers) || Number(form.travelers) < 1) nextErrors.travelers = 'At least one traveler is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    const loadingToast = toast.loading('Generating your AI itinerary...')
    try {
      const data = await createTrip({
        destination: form.destination.trim(),
        budget: Number(form.budget),
        start_date: form.start_date,
        end_date: form.end_date,
        travelers: Number(form.travelers),
        interests: form.interests.join(', '),
      })
      toast.dismiss(loadingToast)
      toast.success('Trip itinerary generated')
      navigate(`/trips/${data.id}`)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(getApiError(error, 'Failed to create trip.'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-textDark">Plan Your Trip</h1>
        <p className="text-sm text-gray-400">Enter the core details and generate an itinerary.</p>
      </div>

      <Card className="p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="destination">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" /> Destination</span>
            </label>
            <input
              id="destination"
              type="text"
              value={form.destination}
              onChange={event => updateField('destination', event.target.value)}
              aria-invalid={Boolean(errors.destination)}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                errors.destination ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Paris, France"
            />
            {errors.destination && <p className="mt-1 text-xs text-red-500">{errors.destination}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="startDate">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> Start Date</span>
              </label>
              <input
                id="startDate"
                type="date"
                value={form.start_date}
                onChange={event => updateField('start_date', event.target.value)}
                aria-invalid={Boolean(errors.start_date)}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.start_date ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.start_date && <p className="mt-1 text-xs text-red-500">{errors.start_date}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="endDate">
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4 text-primary" /> End Date</span>
              </label>
              <input
                id="endDate"
                type="date"
                value={form.end_date}
                onChange={event => updateField('end_date', event.target.value)}
                aria-invalid={Boolean(errors.end_date)}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.end_date ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.end_date && <p className="mt-1 text-xs text-red-500">{errors.end_date}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="budget">
                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4 text-primary" /> Budget</span>
              </label>
              <input
                id="budget"
                type="number"
                min="1"
                step="1"
                value={form.budget}
                onChange={event => updateField('budget', event.target.value)}
                aria-invalid={Boolean(errors.budget)}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.budget ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="2000"
              />
              {errors.budget && <p className="mt-1 text-xs text-red-500">{errors.budget}</p>}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700" htmlFor="travelers">
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" /> Travelers</span>
              </label>
              <input
                id="travelers"
                type="number"
                min="1"
                max="20"
                value={form.travelers}
                onChange={event => updateField('travelers', event.target.value)}
                aria-invalid={Boolean(errors.travelers)}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.travelers ? 'border-red-300' : 'border-gray-200'
                }`}
              />
              {errors.travelers && <p className="mt-1 text-xs text-red-500">{errors.travelers}</p>}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              <span className="flex items-center gap-1.5"><Tag className="h-4 w-4 text-primary" /> Interests</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {INTERESTS.map(interest => {
                const active = form.interests.includes(interest)
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
                      active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Generating AI Trip...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate AI Trip
              </>
            )}
          </button>
        </form>
      </Card>
    </div>
  )
}
