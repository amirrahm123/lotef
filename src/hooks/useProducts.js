import { useState, useEffect } from 'react'
import { defaultProducts } from '../data/defaultProducts'
import API_BASE from '../config'

const API = `${API_BASE}/products`
const TOKEN_KEY = 'lotef-admin-token'

function authHeaders() {
  const token = localStorage.getItem(TOKEN_KEY)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export default function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchProducts = async () => {
    try {
      const res = await fetch(API)
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('API unavailable, using default products')
      setProducts(defaultProducts.map(p => ({ ...p, _id: String(p.id) })))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchProducts() }, [])

  const toggleAvailability = async (id) => {
    setProducts(prev => prev.map(p => p._id === id ? { ...p, available: !p.available } : p))
    try {
      await fetch(`${API}/${id}`, { method: 'PATCH', headers: authHeaders() })
    } catch (err) {
      console.error('Toggle error:', err)
      fetchProducts()
    }
  }

  const addProduct = async (product) => {
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify(product),
      })
      if (!res.ok) return false
      const newProduct = await res.json()
      setProducts(prev => [...prev, newProduct])
      return true
    } catch (err) {
      console.error('Add error:', err)
      return false
    }
  }

  const deleteProduct = async (id) => {
    setProducts(prev => prev.filter(p => p._id !== id))
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE', headers: authHeaders() })
    } catch (err) {
      console.error('Delete error:', err)
      fetchProducts()
    }
  }

  return { products, loading, toggleAvailability, addProduct, deleteProduct, refetch: fetchProducts }
}
