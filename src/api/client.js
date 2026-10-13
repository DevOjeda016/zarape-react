const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
const TOKEN_KEY = 'zarape.token'

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (t) => localStorage.setItem(TOKEN_KEY, t),
  clear: () => localStorage.removeItem(TOKEN_KEY),
}

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

let onUnauthorized = () => {}
export const setUnauthorizedHandler = (fn) => { onUnauthorized = fn }

async function request(path, { method = 'GET', body } = {}) {
  const headers = {}
  const token = tokenStore.get()
  if (token) headers.Authorization = `Bearer ${token}`
  if (body !== undefined) headers['Content-Type'] = 'application/json'

  let res
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body !== undefined ? JSON.stringify(body) : undefined })
  } catch {
    throw new ApiError('No se pudo conectar con el servidor', 0)
  }
  if (res.status === 204) return null
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    // 401 con sesión iniciada = token vencido o usuario desactivado
    if (res.status === 401 && token) onUnauthorized()
    throw new ApiError(data?.error || 'Ocurrió un error inesperado', res.status)
  }
  return data
}

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } }),
  signup: (data) => request('/auth/signup', { method: 'POST', body: data }),
  me: () => request('/auth/me'),

  categories: () => request('/categories'),
  products: (params = {}) => {
    const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v)).toString()
    return request(`/products${qs ? `?${qs}` : ''}`)
  },
  branches: () => request('/branches'),

  create: (resource, data) => request(`/${resource}`, { method: 'POST', body: data }),
  update: (resource, id, data) => request(`/${resource}/${id}`, { method: 'PUT', body: data }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: 'DELETE' }),

  createOrder: (data) => request('/orders', { method: 'POST', body: data }),
  myOrders: () => request('/orders/mine'),
  allOrders: () => request('/orders'),
  setOrderStatus: (id, status) => request(`/orders/${id}/status`, { method: 'PATCH', body: { status } }),
}
