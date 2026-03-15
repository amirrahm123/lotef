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

    fetch(`${API}/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => {
        if (res.ok) setIsAdmin(true)
        else localStorage.removeItem(TOKEN_KEY)
      })
      .catch(() => localStorage.removeItem(TOKEN_KEY))
      .finally(() => setLoading(false))
  }, [])

  const login = async (password) => {
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) return false
      const { token } = await res.json()
      localStorage.setItem(TOKEN_KEY, token)
      setIsAdmin(true)
      return true
    } catch {
      return false
    }
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setIsAdmin(false)
  }

  const getToken = () => localStorage.getItem(TOKEN_KEY)

  return { isAdmin, loading, login, logout, getToken }
}
