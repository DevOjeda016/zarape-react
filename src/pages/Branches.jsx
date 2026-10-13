import { api } from '../api/client'
import { useAsync } from '../hooks'

export default function Branches() {
  const { data, loading, error } = useAsync(() => api.branches())
  return (
    <>
      <h1>Sucursales</h1>
      {loading && <p className="state">Cargando…</p>}
      {error && <p className="error">{error}</p>}
      <div className="grid">
        {(data || []).map((b) => (
          <article key={b.id} className="card">
            <img src={b.photo || '/img/restaurant/default.png'} alt={b.name}
              onError={(e) => { e.currentTarget.src = '/img/restaurant/default.png' }} />
            <div className="card-body">
              <h3>{b.name}</h3>
              <p className="muted">{[b.address, b.city].filter(Boolean).join(', ')}</p>
              {b.hours && <p>🕒 {b.hours}</p>}
              {b.latitude != null && b.longitude != null && (
                <a href={`https://www.google.com/maps?q=${b.latitude},${b.longitude}`} target="_blank" rel="noreferrer">Ver en mapa</a>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  )
}
