import { useState } from 'react'

const ADMIN_PASSWORD = 'lotef2024'
const ADMIN_KEY = 'lotef-admin-auth'

export default function useAdmin() {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === 'true')

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem(ADMIN_KEY, 'true')
      setIsAdmin(true)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem(ADMIN_KEY)
    setIsAdmin(false)
  }

  return { isAdmin, login, logout }
}
