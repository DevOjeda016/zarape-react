import { useCallback, useEffect, useState } from 'react'

/** Carga datos de una función async y expone { data, error, loading, reload }. */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, error: null, loading: true })

  const run = useCallback(async (silent = false) => {
    if (!silent) setState((s) => ({ ...s, loading: true }))
    try {
      const data = await fn()
      setState({ data, error: null, loading: false })
    } catch (e) {
      setState((s) => ({ data: silent ? s.data : null, error: e.message, loading: false }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])
  return { ...state, reload: run }
}
