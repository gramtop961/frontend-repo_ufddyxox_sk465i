import { useState, useCallback } from 'react'

export function useApi(base = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000') {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const get = useCallback(async (path) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${base}${path}`)
      if (!res.ok) throw new Error(`${res.status}`)
      return await res.json()
    } catch (e) {
      setError(e)
      return null
    } finally {
      setLoading(false)
    }
  }, [base])

  const post = useCallback(async (path, body) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch(`${base}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      if (!res.ok) throw new Error(`${res.status}`)
      return await res.json()
    } catch (e) {
      setError(e)
      return null
    } finally {
      setLoading(false)
    }
  }, [base])

  return { get, post, loading, error, base }
}
