import axios from 'axios'

const axiosInstance = axios.create({ baseURL: '', timeout: 120000 })

axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const isAuthRequest =
        error.config?.url?.startsWith('/auth/login') ||
        error.config?.url?.startsWith('/auth/register')
      const isPublicPage = ['/login', '/register'].includes(window.location.pathname)

      if (!isAuthRequest && !isPublicPage) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  }
)

export default axiosInstance
