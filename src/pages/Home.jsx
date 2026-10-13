import { Link } from 'react-router-dom'
import { api } from '../api/client'
import { useAsync } from '../hooks'
import ProductCard from '../components/ProductCard'
import { useCart } from '../context/CartContext'

export default function Home() {
  const { add } = useCart()
  const { data: products } = useAsync(() => api.products())

  return (
    <>
      <section className="hero">
        <img src="/img/restaurant/logo-el-zarape.png" alt="El Zarape" />
        <div>
          <h1>Sabor mexicano, directo a tu mesa</h1>
          <p>Pozole, chiles en nogada, tacos y más. Arma tu comanda en línea y recógela en tu sucursal.</p>
          <Link to="/menu" className="btn btn-lg">Ver el menú</Link>
        </div>
      </section>
      <section>
        <h2>Platillos destacados</h2>
        <div className="grid">
          {(products || []).slice(0, 4).map((p) => <ProductCard key={p.id} product={p} onAdd={add} />)}
        </div>
      </section>
    </>
  )
}
