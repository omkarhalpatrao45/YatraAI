import axiosInstance from '../api/axios'

export async function getWeather(city) {
  const { data } = await axiosInstance.get(`/weather/${encodeURIComponent(city)}`)
  return data
}
