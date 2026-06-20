import axiosInstance from '../api/axios'

export async function listTrips() {
  console.log('📤 [tripService] Fetching trips from /trips endpoint')
  try {
    const response = await axiosInstance.get('/trips')
    console.log('📥 [tripService] Raw axios response:', response)
    console.log('   Response.data:', response.data)
    console.log('   Type of response.data:', typeof response.data)
    console.log('   Is array:', Array.isArray(response.data))

    const { data } = response
    console.log('✅ [tripService] Extracted data:', data)
    return data
  } catch (error) {
    console.error('❌ [tripService] Error in listTrips:', error)
    throw error
  }
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
