import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, setUnauthorizedHandler, tokenStore } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(Boolean(tokenStore.get()))

  const logout = useCallback(() => {
    tokenStore.clear()
    setUser(null)
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(logout)
    if (!tokenStore.get()) return
    api.me().then(setUser).catch(logout).finally(() => setLoading(false))
  }, [logout])

  const authenticate = useCallback(async (promise) => {
    const { token, user } = await promise
    tokenStore.set(token)
    setUser(user)
    return user
  }, [])

  const value = useMemo(() => ({
    user,
    loading,
    isStaff: user?.role === 'ADMIN' || user?.role === 'EMPLOYEE',
    isAdmin: user?.role === 'ADMIN',
    login: (u, p) => authenticate(api.login(u, p)),
    signup: (data) => authenticate(api.signup(data)),
    logout,
  }), [user, loading, authenticate, logout])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
