import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const CartContext = createContext()

const STORAGE_KEY = 'lotef-cart'

function loadCart() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch { return [] }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadCart)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === product._id)
      if (existing) {
        return prev.map(i => i._id === product._id ? { ...i, qty: i.qty + 1 } : i)
      }
      return [...prev, { ...product, qty: 1 }]
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => prev.filter(i => i._id !== id))
  }, [])

  const updateQty = useCallback((id, qty) => {
    if (qty < 1) {
      setItems(prev => prev.filter(i => i._id !== id))
      return
    }
    setItems(prev => prev.map(i => i._id === id ? { ...i, qty } : i))
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = items.reduce((s, i) => s + i.qty, 0)

  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, totalItems, isOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  )
}

export default function useCart() {
  return useContext(CartContext)
}
