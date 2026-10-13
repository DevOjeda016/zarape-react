import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const empty = { username: '', password: '', name: '', lastName: '', phone: '' }

export default function Login() {
  const { user, login, signup } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(empty)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={location.state?.from || '/'} replace />

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  async function submit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      const u = mode === 'login' ? await login(form.username, form.password) : await signup(form)
      const staff = u.role === 'ADMIN' || u.role === 'EMPLOYEE'
      navigate(location.state?.from || (staff ? (u.role === 'ADMIN' ? '/admin' : '/cocina') : '/menu'), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form className="panel narrow" onSubmit={submit}>
      <h1>{mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}</h1>
      {mode === 'signup' && (
        <>
          <label>Nombre<input required maxLength={80} value={form.name} onChange={set('name')} /></label>
          <label>Apellidos<input required maxLength={80} value={form.lastName} onChange={set('lastName')} /></label>
          <label>Teléfono<input maxLength={20} value={form.phone} onChange={set('phone')} /></label>
        </>
      )}
      <label>Usuario<input required minLength={mode === 'signup' ? 3 : 1} value={form.username} onChange={set('username')} autoComplete="username" /></label>
      <label>Contraseña<input required type="password" minLength={mode === 'signup' ? 6 : 1} value={form.password} onChange={set('password')}
        autoComplete={mode === 'login' ? 'current-password' : 'new-password'} /></label>
      {error && <p className="error">{error}</p>}
      <button className="btn" disabled={busy}>{busy ? 'Enviando…' : mode === 'login' ? 'Entrar' : 'Registrarme'}</button>
      <button type="button" className="link" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
        {mode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
      </button>
    </form>
  )
}
