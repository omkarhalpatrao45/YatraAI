import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/useAuth'
import LoadingSpinner from '../components/LoadingSpinner'

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <LoadingSpinner size="lg" label="Checking session" />
      </div>
    )
  }

  return token ? children : <Navigate to="/login" replace state={{ from: location }} />
}
