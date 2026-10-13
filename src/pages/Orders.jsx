import { useLocation } from 'react-router-dom'
import { api } from '../api/client'
import { useAsync } from '../hooks'
import OrderCard from '../components/OrderCard'

export default function Orders() {
  const location = useLocation()
  const { data, loading, error } = useAsync(() => api.myOrders())
  return (
    <>
      <h1>Mis pedidos</h1>
      {location.state?.placed && <p className="success">¡Pedido enviado a cocina!</p>}
      {loading && <p className="state">Cargando…</p>}
      {error && <p className="error">{error}</p>}
      {data?.length === 0 && <p className="state">Aún no tienes pedidos.</p>}
      <div className="grid">{(data || []).map((o) => <OrderCard key={o.id} order={o} />)}</div>
    </>
  )
}
