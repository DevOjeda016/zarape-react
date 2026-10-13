const money = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' })
export const formatMoney = (n) => money.format(n)

export const formatDate = (iso) =>
  new Date(iso).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })

export const STATUS_LABEL = {
  IN_SERVICE: 'En preparación',
  READY: 'Lista',
  DELIVERED: 'Entregada',
  CANCELLED: 'Cancelada',
}
