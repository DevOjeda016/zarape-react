import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const CartContext = createContext(null)
const KEY = 'zarape.cart'

function load() {
  try {
    const items = JSON.parse(localStorage.getItem(KEY))
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(load) // [{ product, quantity }]

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(items)) } catch { /* almacenamiento no disponible */ }
  }, [items])

  const value = useMemo(() => ({
    items,
    count: items.reduce((n, i) => n + i.quantity, 0),
    total: items.reduce((t, i) => t + i.quantity * i.product.price, 0),
    add: (product) => setItems((cur) => {
      const found = cur.find((i) => i.product.id === product.id)
      if (!found) return [...cur, { product, quantity: 1 }]
      return cur.map((i) => i.product.id === product.id ? { ...i, quantity: Math.min(99, i.quantity + 1) } : i)
    }),
    setQuantity: (id, quantity) => setItems((cur) =>
      quantity <= 0 ? cur.filter((i) => i.product.id !== id)
        : cur.map((i) => i.product.id === id ? { ...i, quantity: Math.min(99, quantity) } : i)),
    clear: () => setItems([]),
  }), [items])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => useContext(CartContext)
