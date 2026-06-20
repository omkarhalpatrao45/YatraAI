import axios from 'axios'

const axiosInstance = axios.create({ baseURL: '', timeout: 120000 })

axiosInstance.interceptors.request.use(config => {
  console.log(`📤 [axios] ${config.method.toUpperCase()} ${config.url}`)
  const token = localStorage.getItem('token')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  response => {
    console.log(`✅ [axios] Response ${response.status} from ${response.config.method.toUpperCase()} ${response.config.url}`)
    console.log('   Response data:', response.data)
    return response
  },
  error => {
    console.error(`❌ [axios] Error from ${error.config?.method?.toUpperCase()} ${error.config?.url}`)
    console.error('   Status:', error.response?.status)
    console.error('   Error:', error.response?.data)

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
