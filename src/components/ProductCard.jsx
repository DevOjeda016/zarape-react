import { formatMoney } from '../format'

export default function ProductCard({ product, onAdd }) {
  return (
    <article className="card product">
      <img src={product.photo || '/img/products/default.png'} alt={product.name}
        onError={(e) => { e.currentTarget.src = '/img/products/default.png' }} loading="lazy" />
      <div className="card-body">
        <h3>{product.name}</h3>
        <p className="muted">{product.description}</p>
        <div className="row">
          <strong>{formatMoney(product.price)}</strong>
          <button className="btn" onClick={() => onAdd(product)}>Agregar</button>
        </div>
      </div>
    </article>
  )
}
