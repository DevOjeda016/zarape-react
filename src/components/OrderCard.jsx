import { STATUS_LABEL, formatDate, formatMoney } from '../format'

export default function OrderCard({ order, actions }) {
  return (
    <article className="card order">
      <div className="card-body">
        <div className="row">
          <h3>Pedido #{order.id}</h3>
          <span className={`badge ${order.status}`}>{STATUS_LABEL[order.status]}</span>
        </div>
        <p className="muted">
          {formatDate(order.createdAt)} · {order.branch} · {order.client}
          <br />{order.paymentMethod === 'CARD' ? 'Tarjeta' : 'Efectivo'} · {order.paid ? 'Pagado' : 'Pago pendiente'}
        </p>
        <ul>
          {order.items.map((i) => <li key={i.productId}>{i.quantity} × {i.product}</li>)}
        </ul>
        <div className="row">
          <strong>{formatMoney(order.total)}</strong>
          <div className="actions">{actions}</div>
        </div>
      </div>
    </article>
  )
}
