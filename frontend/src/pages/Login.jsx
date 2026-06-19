import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Mail, Plane } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/useAuth'
import { loginUser } from '../services/authService'
import { getApiError } from '../utils/apiError'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, token } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true })
  }, [token, navigate])

  const updateField = (field, value) => {
    setForm(current => ({ ...current, [field]: value }))
    setErrors(current => ({ ...current, [field]: '' }))
    setFormError('')
  }

  const validate = () => {
    const nextErrors = {}
    if (!emailPattern.test(form.email.trim())) nextErrors.email = 'Enter a valid email address.'
    if (!form.password) nextErrors.password = 'Password is required.'
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      })
      login(data.access_token, data.user)
      toast.success(`Welcome back, ${data.user.name}!`)
      navigate(from, { replace: true })
    } catch (error) {
      const message = getApiError(error, 'Login failed. Check your credentials and try again.')
      setFormError(message)
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-600 via-sky-500 to-emerald-400 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-lg">
            <Plane className="h-8 w-8 text-white" />
          </div>
        </div>
        <h2 className="mb-1 text-center text-2xl font-bold text-textDark">Welcome to YatraAI</h2>
        <p className="mb-8 text-center text-sm text-gray-400">Sign in to continue planning</p>

        {formError && (
          <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={event => updateField('email', event.target.value)}
                aria-invalid={Boolean(errors.email)}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.email ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="you@example.com"
              />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                autoComplete="current-password"
                value={form.password}
                onChange={event => updateField('password', event.target.value)}
                aria-invalid={Boolean(errors.password)}
                className={`w-full rounded-lg border py-2.5 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="Your password"
              />
              <button
                type="button"
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                onClick={() => setShowPwd(current => !current)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />}
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Do not have an account?{' '}
          <Link to="/register" className="font-semibold text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
