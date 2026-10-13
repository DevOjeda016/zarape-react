import { useCallback, useState } from 'react'
import { api } from '../api/client'
import { useAsync } from '../hooks'
import CrudManager from '../components/CrudManager'
import { formatMoney } from '../format'

const TYPE_LABEL = { FOOD: 'Alimento', DRINK: 'Bebida' }
const typeOptions = [{ value: 'FOOD', label: 'Alimento' }, { value: 'DRINK', label: 'Bebida' }]

const numberOrNull = (v) => (v === '' || v == null ? null : Number(v))

export default function Admin() {
  const [tab, setTab] = useState('products')
  const categories = useAsync(() => api.categories())
  const loadProducts = useCallback(() => api.products(), [])
  const loadCategories = useCallback(() => api.categories(), [])
  const loadBranches = useCallback(() => api.branches(), [])

  return (
    <>
      <h1>Administración</h1>
      <div className="filters">
        {[['products', 'Productos'], ['categories', 'Categorías'], ['branches', 'Sucursales']].map(([k, l]) => (
          <button key={k} className={`chip ${tab === k ? 'active' : ''}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {tab === 'products' && (
        <CrudManager key="products" resource="products" label="Productos" load={loadProducts}
          emptyItem={{ name: '', description: '', photo: '', price: '', categoryId: '' }}
          fields={[
            { name: 'name', label: 'Nombre', required: true },
            { name: 'description', label: 'Descripción', type: 'textarea' },
            { name: 'photo', label: 'Imagen (URL o ruta, ej. /img/products/pozole.jpg)' },
            { name: 'price', label: 'Precio', type: 'number', step: '0.01', min: '0.01', required: true },
            { name: 'categoryId', label: 'Categoría', type: 'select', required: true,
              options: (categories.data || []).map((c) => ({ value: c.id, label: `${c.description} (${TYPE_LABEL[c.type]})` })) },
          ]}
          columns={[
            { header: 'Producto', render: (p) => p.name },
            { header: 'Categoría', render: (p) => p.category.description },
            { header: 'Precio', render: (p) => formatMoney(p.price) },
          ]}
          toPayload={(f) => ({ name: f.name, description: f.description, photo: f.photo, price: Number(f.price), categoryId: Number(f.categoryId) })} />
      )}

      {tab === 'categories' && (
        <CrudManager key="categories" resource="categories" label="Categorías" load={loadCategories}
          emptyItem={{ description: '', type: '' }}
          fields={[
            { name: 'description', label: 'Descripción', required: true },
            { name: 'type', label: 'Tipo', type: 'select', required: true, options: typeOptions },
          ]}
          columns={[
            { header: 'Descripción', render: (c) => c.description },
            { header: 'Tipo', render: (c) => TYPE_LABEL[c.type] },
          ]}
          toPayload={(f) => ({ description: f.description, type: f.type })} />
      )}

      {tab === 'branches' && (
        <CrudManager key="branches" resource="branches" label="Sucursales" load={loadBranches}
          emptyItem={{ name: '', address: '', city: '', hours: '', latitude: '', longitude: '', photo: '' }}
          fields={[
            { name: 'name', label: 'Nombre', required: true },
            { name: 'address', label: 'Dirección' },
            { name: 'city', label: 'Ciudad' },
            { name: 'hours', label: 'Horario' },
            { name: 'latitude', label: 'Latitud', type: 'number', step: 'any' },
            { name: 'longitude', label: 'Longitud', type: 'number', step: 'any' },
            { name: 'photo', label: 'Imagen (URL o ruta)' },
          ]}
          columns={[
            { header: 'Sucursal', render: (b) => b.name },
            { header: 'Ciudad', render: (b) => b.city },
            { header: 'Horario', render: (b) => b.hours },
          ]}
          toPayload={(f) => ({ name: f.name, address: f.address, city: f.city, hours: f.hours,
            latitude: numberOrNull(f.latitude), longitude: numberOrNull(f.longitude), photo: f.photo })} />
      )}
    </>
  )
}
