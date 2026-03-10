import { useState } from 'react'
import { defaultProducts } from '../data/defaultProducts'

const STORAGE_KEY = 'lotef-products'

export default function useProducts() {
  const [products, setProducts] = useState(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts))
    return defaultProducts
  })

  const persist = (updated) => {
    setProducts(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  const toggleAvailability = (id) => {
    persist(products.map(p => p.id === id ? { ...p, available: !p.available } : p))
  }

  const resetProducts = () => persist([...defaultProducts])

  return { products, toggleAvailability, resetProducts }
}
