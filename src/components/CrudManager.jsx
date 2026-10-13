import { useState } from 'react'
import { api } from '../api/client'
import { useAsync } from '../hooks'

/**
 * CRUD genérico para recursos del catálogo.
 * fields: [{ name, label, type?: 'text'|'number'|'select'|'textarea', required?, options?: [{value,label}], step? }]
 * columns: [{ header, render(item) }]
 */
export default function CrudManager({ resource, load, fields, columns, emptyItem, toPayload, label }) {
  const { data, loading, error, reload } = useAsync(load, [load])
  const [editing, setEditing] = useState(null) // null | { id?, ...form }
  const [formError, setFormError] = useState('')
  const [busy, setBusy] = useState(false)

  const set = (name) => (e) => setEditing({ ...editing, [name]: e.target.value })

  async function save(e) {
    e.preventDefault()
    setFormError('')
    setBusy(true)
    try {
      const payload = toPayload(editing)
      if (editing.id) await api.update(resource, editing.id, payload)
      else await api.create(resource, payload)
      setEditing(null)
      await reload(true)
    } catch (err) {
      setFormError(err.message)
    } finally {
      setBusy(false)
    }
  }

  async function remove(item) {
    if (!window.confirm(`¿Eliminar "${item.name || item.description}"?`)) return
    try {
      await api.remove(resource, item.id)
      await reload(true)
    } catch (err) {
      window.alert(err.message)
    }
  }

  return (
    <section>
      <div className="row">
        <h2>{label}</h2>
        <button className="btn" onClick={() => { setFormError(''); setEditing({ ...emptyItem }) }}>Nuevo</button>
      </div>
      {loading && <p className="state">Cargando…</p>}
      {error && <p className="error">{error}</p>}

      {editing && (
        <form className="panel" onSubmit={save}>
          <h3>{editing.id ? 'Editar' : 'Nuevo'}</h3>
          {fields.map((f) => (
            <label key={f.name}>{f.label}
              {f.type === 'select' ? (
                <select required={f.required} value={editing[f.name] ?? ''} onChange={set(f.name)}>
                  <option value="">Selecciona…</option>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === 'textarea' ? (
                <textarea required={f.required} maxLength={500} value={editing[f.name] ?? ''} onChange={set(f.name)} />
              ) : (
                <input type={f.type || 'text'} step={f.step} min={f.min} required={f.required}
                  value={editing[f.name] ?? ''} onChange={set(f.name)} />
              )}
            </label>
          ))}
          {formError && <p className="error">{formError}</p>}
          <div className="actions">
            <button className="btn" disabled={busy}>{busy ? 'Guardando…' : 'Guardar'}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
          </div>
        </form>
      )}

      <div className="table-wrap">
        <table className="table">
          <thead><tr>{columns.map((c) => <th key={c.header}>{c.header}</th>)}<th /></tr></thead>
          <tbody>
            {(data || []).map((item) => (
              <tr key={item.id}>
                {columns.map((c) => <td key={c.header}>{c.render(item)}</td>)}
                <td className="actions">
                  <button className="btn btn-ghost" onClick={() => { setFormError(''); setEditing({ ...emptyItem, ...item, ...(item.category ? { categoryId: item.category.id } : {}) }) }}>Editar</button>
                  <button className="btn btn-danger" onClick={() => remove(item)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
