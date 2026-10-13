import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const { user, isStaff, isAdmin, logout } = useAuth()
  const { count } = useCart()
  const navigate = useNavigate()

  return (
    <header className="navbar">
      <Link to="/" className="brand">
        <img src="/img/restaurant/logo-el-zarape.png" alt="" />
        <span>El Zarape</span>
      </Link>
      <nav>
        <NavLink to="/menu">Menú</NavLink>
        <NavLink to="/sucursales">Sucursales</NavLink>
        {user && <NavLink to="/pedidos">Mis pedidos</NavLink>}
        {isStaff && <NavLink to="/cocina">Cocina</NavLink>}
        {isAdmin && <NavLink to="/admin">Admin</NavLink>}
        <NavLink to="/carrito" className="cart-link">Carrito{count > 0 && <b>{count}</b>}</NavLink>
        {user ? (
          <button className="btn btn-ghost" onClick={() => { logout(); navigate('/') }}>
            Salir ({user.username})
          </button>
        ) : (
          <NavLink to="/login" className="btn">Iniciar sesión</NavLink>
        )}
      </nav>
    </header>
  )
}
