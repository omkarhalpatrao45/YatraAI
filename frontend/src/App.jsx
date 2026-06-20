import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './routes/ProtectedRoute'
import MainLayout from './layouts/MainLayout'
import LoadingSpinner from './components/LoadingSpinner'

const Login = lazy(() => import('./pages/Login'))
const Register = lazy(() => import('./pages/Register'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const CreateTrip = lazy(() => import('./pages/CreateTrip'))
const TripDetails = lazy(() => import('./pages/TripDetails'))
const TripHistory = lazy(() => import('./pages/TripHistory'))
const ExpenseTracker = lazy(() => import('./pages/ExpenseTracker'))
const Profile = lazy(() => import('./pages/Profile'))

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="create-trip" element={<CreateTrip />} />
                <Route path="trips" element={<TripHistory />} />
                <Route path="trips/:id" element={<TripDetails />} />
                <Route path="trips/:id/expenses" element={<ExpenseTracker />} />
                <Route path="expenses" element={<ExpenseTracker />} />
                <Route path="history" element={<Navigate to="/trips" replace />} />
                <Route path="profile" element={<Profile />} />
              </Route>
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
