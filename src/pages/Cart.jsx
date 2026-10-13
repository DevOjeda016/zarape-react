import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { useAsync } from '../hooks'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { formatMoney } from '../format'

export default function Cart() {
  const { items, total, setQuantity, clear } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const branches = useAsync(() => api.branches())
  const [branchId, setBranchId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('CARD')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (items.length === 0) {
    return <p className="state">Tu carrito está vacío. <Link to="/menu">Ver el menú</Link></p>
  }

  async function checkout(e) {
    e.preventDefault()
    if (!user) return navigate('/login', { state: { from: '/carrito' } })
    setError('')
    setBusy(true)
    try {
      await api.createOrder({
        branchId: Number(branchId),
        paymentMethod,
        items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      })
      clear()
      navigate('/pedidos', { state: { placed: true } })
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <>
      <h1>Tu carrito</h1>
      <table className="table">
        <thead><tr><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Subtotal</th></tr></thead>
        <tbody>
          {items.map(({ product, quantity }) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{formatMoney(product.price)}</td>
              <td className="qty">
                <button aria-label="Quitar uno" onClick={() => setQuantity(product.id, quantity - 1)}>−</button>
                <span>{quantity}</span>
                <button aria-label="Agregar uno" onClick={() => setQuantity(product.id, quantity + 1)}>+</button>
              </td>
              <td>{formatMoney(product.price * quantity)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot><tr><td colSpan={3}>Total</td><td><strong>{formatMoney(total)}</strong></td></tr></tfoot>
      </table>

      <form className="panel" onSubmit={checkout}>
        <label>Sucursal
          <select required value={branchId} onChange={(e) => setBranchId(e.target.value)}>
            <option value="">Selecciona una sucursal</option>
            {(branches.data || []).map((b) => <option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </label>
        <label>Forma de pago
          <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
            <option value="CARD">Tarjeta (simulado)</option>
            <option value="CASH">Efectivo al recoger</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-lg" disabled={busy}>
          {busy ? 'Enviando…' : user ? 'Confirmar pedido' : 'Inicia sesión para pedir'}
        </button>
      </form>
    </>
  )
}
