import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/** role: 'staff' (ADMIN o EMPLOYEE), 'admin', o undefined (cualquier usuario autenticado). */
export default function ProtectedRoute({ role, children }) {
  const { user, loading, isStaff, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) return <p className="state">Cargando…</p>
  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if ((role === 'staff' && !isStaff) || (role === 'admin' && !isAdmin)) return <Navigate to="/" replace />
  return children
}
