import { useState } from 'react'
import AuthContext from './authContextValue'

function readStoredSession() {
  const storedToken = localStorage.getItem('token')
  const storedUser = localStorage.getItem('user')

  if (!storedToken || !storedUser) return { token: null, user: null }

  try {
    return { token: storedToken, user: JSON.parse(storedUser) }
  } catch {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    return { token: null, user: null }
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(readStoredSession)

  const login = (tokenVal, userData) => {
    setSession({ token: tokenVal, user: userData })
    localStorage.setItem('token', tokenVal)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    setSession({ token: null, user: null })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider
      value={{
        user: session.user,
        token: session.token,
        login,
        logout,
        loading: false,
        isAuthenticated: Boolean(session.token),
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
