import { useEffect, useState } from 'react'
import { api } from '../api/client'
import { useAsync } from '../hooks'
import OrderCard from '../components/OrderCard'

const NEXT = {
  IN_SERVICE: [{ to: 'READY', label: 'Marcar lista' }, { to: 'CANCELLED', label: 'Cancelar', danger: true }],
  READY: [{ to: 'DELIVERED', label: 'Entregar' }, { to: 'CANCELLED', label: 'Cancelar', danger: true }],
}

export default function Kitchen() {
  const { data, loading, error, reload } = useAsync(() => api.allOrders())
  const [actionError, setActionError] = useState('')
  const [showDone, setShowDone] = useState(false)

  // Refresco automático cada 10 s para ver pedidos nuevos.
  useEffect(() => {
    const id = setInterval(() => reload(true), 10000)
    return () => clearInterval(id)
  }, [reload])

  async function change(order, status) {
    setActionError('')
    try {
      await api.setOrderStatus(order.id, status)
      await reload(true)
    } catch (e) {
      setActionError(e.message)
      reload(true)
    }
  }

  const orders = (data || []).filter((o) => showDone || NEXT[o.status])

  return (
    <>
      <div className="row">
        <h1>Cocina</h1>
        <label className="inline"><input type="checkbox" checked={showDone} onChange={(e) => setShowDone(e.target.checked)} /> Ver finalizados</label>
      </div>
      {loading && <p className="state">Cargando…</p>}
      {(error || actionError) && <p className="error">{error || actionError}</p>}
      {data && orders.length === 0 && <p className="state">No hay comandas pendientes.</p>}
      <div className="grid">
        {orders.map((o) => (
          <OrderCard key={o.id} order={o} actions={(NEXT[o.status] || []).map((a) => (
            <button key={a.to} className={`btn ${a.danger ? 'btn-danger' : ''}`} onClick={() => change(o, a.to)}>{a.label}</button>
          ))} />
        ))}
      </div>
    </>
  )
}
