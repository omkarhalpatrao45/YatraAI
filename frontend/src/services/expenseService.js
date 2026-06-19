import axiosInstance from '../api/axios'

export async function listExpenses(tripId) {
  const { data } = await axiosInstance.get(`/expenses/${tripId}`)
  return data
}

export async function createExpense(payload) {
  const { data } = await axiosInstance.post('/expenses', payload)
  return data
}

export async function updateExpense(id, payload) {
  const { data } = await axiosInstance.put(`/expenses/${id}`, payload)
  return data
}

export async function removeExpense(id) {
  const { data } = await axiosInstance.delete(`/expenses/${id}`)
  return data
}

export async function listExpensesForTrips(trips) {
  const results = await Promise.allSettled(trips.map(trip => listExpenses(trip.id)))
  return results.flatMap((result, index) => {
    if (result.status !== 'fulfilled') return []
    return result.value.map(expense => ({
      ...expense,
      trip_destination: trips[index]?.destination,
    }))
  })
}
