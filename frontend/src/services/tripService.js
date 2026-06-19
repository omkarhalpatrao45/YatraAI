import axiosInstance from '../api/axios'

export async function listTrips() {
  const { data } = await axiosInstance.get('/trips')
  return data
}

export async function getTrip(id) {
  const { data } = await axiosInstance.get(`/trips/${id}`)
  return data
}

export async function createTrip(payload) {
  const { data } = await axiosInstance.post('/trips/create', payload)
  return data
}

export async function removeTrip(id) {
  const { data } = await axiosInstance.delete(`/trips/${id}`)
  return data
}
