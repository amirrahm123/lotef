import { useState, useEffect } from 'react'
import API_BASE from '../config'

const TOKEN_KEY = 'lotef-admin-token'
const API = `${API_BASE}/admin`

export default function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // On mount, check if saved token is still valid
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY)
    if (!token) { setLoading(false); return }

    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 3000)

    fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    })
      .then(res => {
        if (res.ok) setIsAdmin(true)
        else localStorage.removeItem(TOKEN_KEY)
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => { clearTimeout(timeout); setLoading(false) })
  }, [])

  const login = async (password) => {
    try {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 30000)
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
        signal: controller.signal,
      })
      clearTimeout(timeout)
      if (!res.ok) return 'wrong'
      const { token } = await res.json()
      localStorage.setItem(TOKEN_KEY, token)
      setIsAdmin(true)
      return true
    } catch {
      return 'timeout'
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setIsAdmin(false)
  }

  const getToken = () => localStorage.getItem(TOKEN_KEY)

  return { isAdmin, loading, login, logout, getToken }
}
