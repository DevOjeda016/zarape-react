import { useState } from 'react'
import { api } from '../api/client'
import { useAsync } from '../hooks'
import { useCart } from '../context/CartContext'
import ProductCard from '../components/ProductCard'

const TYPES = [
  { value: '', label: 'Todo' },
  { value: 'FOOD', label: 'Alimentos' },
  { value: 'DRINK', label: 'Bebidas' },
]

export default function Menu() {
  const { add } = useCart()
  const [type, setType] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [toast, setToast] = useState('')
  const categories = useAsync(() => api.categories())
  const products = useAsync(() => api.products({ type, categoryId }), [type, categoryId])

  const visibleCategories = (categories.data || []).filter((c) => !type || c.type === type)

  function handleAdd(p) {
    add(p)
    setToast(`${p.name} agregado al carrito`)
    setTimeout(() => setToast(''), 1500)
  }

  return (
    <>
      <h1>Menú</h1>
      <div className="filters">
        {TYPES.map((t) => (
          <button key={t.value} className={`chip ${type === t.value ? 'active' : ''}`}
            onClick={() => { setType(t.value); setCategoryId('') }}>{t.label}</button>
        ))}
        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} aria-label="Categoría">
          <option value="">Todas las categorías</option>
          {visibleCategories.map((c) => <option key={c.id} value={c.id}>{c.description}</option>)}
        </select>
      </div>
      {products.loading && <p className="state">Cargando menú…</p>}
      {products.error && <p className="error">{products.error}</p>}
      {products.data?.length === 0 && <p className="state">No hay productos en esta categoría.</p>}
      <div className="grid">
        {(products.data || []).map((p) => <ProductCard key={p.id} product={p} onAdd={handleAdd} />)}
      </div>
      {toast && <div className="toast" role="status">{toast}</div>}
    </>
  )
}
