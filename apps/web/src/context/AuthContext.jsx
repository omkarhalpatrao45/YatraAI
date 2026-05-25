import { createContext, useContext, useEffect, useMemo, useState } from 'react';

import {
  loginWithEmail,
  logoutUser,
  registerWithEmail,
  subscribeToAuthChanges,
} from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const unsubscribe = subscribeToAuthChanges((user) => {
        setCurrentUser(user);
        setLoading(false);
      });

      return unsubscribe;
    } catch (authError) {
      setError(authError);
      setLoading(false);
      return undefined;
    }
  }, []);

  async function register(credentials) {
    setError(null);
    const user = await registerWithEmail(credentials);
    setCurrentUser(user);
    return user;
  }

  async function login(credentials) {
    setError(null);
    const user = await loginWithEmail(credentials);
    setCurrentUser(user);
    return user;
  }

  async function logout() {
    setError(null);
    await logoutUser();
    setCurrentUser(null);
  }

  const value = useMemo(
    () => ({
      currentUser,
      error,
      isAuthenticated: Boolean(currentUser),
      loading,
      login,
      logout,
      register,
    }),
    [currentUser, error, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider.');
  }

  return context;
}
