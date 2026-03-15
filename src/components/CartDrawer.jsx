import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useCart from '../context/CartContext'

export default function CartDrawer() {
  const { items, removeItem, updateQty, clearCart, totalItems, isOpen, closeCart } = useCart()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeCart}
          />
          <motion.div
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="cart-header">
              <h2>🛒 סל הקניות</h2>
              <button className="cart-close" onClick={closeCart} aria-label="סגור">✕</button>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <span className="cart-empty-icon">🛒</span>
                <p>הסל ריק</p>
                <span className="cart-empty-sub">הוסיפו מוצרים כדי להתחיל</span>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {items.map(item => (
                    <div key={item._id} className="cart-item">
                      <div className="cart-item-icon">{item.icon}</div>
                      <div className="cart-item-info">
                        <span className="cart-item-name">{item.name}</span>
                        <span className="cart-item-cat">{item.category}</span>
                      </div>
                      <div className="cart-item-qty">
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item._id, item.qty - 1)}
                          aria-label="הפחת"
                        >−</button>
                        <span className="qty-num">{item.qty}</span>
                        <button
                          className="qty-btn"
                          onClick={() => updateQty(item._id, item.qty + 1)}
                          aria-label="הוסף"
                        >+</button>
                      </div>
                      <button
                        className="cart-item-remove"
                        onClick={() => removeItem(item._id)}
                        aria-label="הסר"
                      >🗑️</button>
                    </div>
                  ))}
                </div>

                <div className="cart-footer">
                  <div className="cart-total">
                    <span>סה״כ פריטים:</span>
                    <strong>{totalItems}</strong>
                  </div>
                  <a
                    href={`https://wa.me/972542223923?text=${encodeURIComponent(buildWhatsAppMessage(items))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-green cart-order-btn"
                  >
                    💬 שלח הזמנה בוואטסאפ
                  </a>
                  <button className="btn-outline cart-clear-btn" onClick={clearCart}>
                    🗑️ נקה סל
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

function buildWhatsAppMessage(items) {
  let msg = 'שלום, אשמח להזמין את המוצרים הבאים:\n\n'
  items.forEach((item, i) => {
    msg += `${i + 1}. ${item.name} — כמות: ${item.qty}\n`
  })
  msg += '\nתודה!'
  return msg
}
