import { motion, AnimatePresence } from 'framer-motion'
import useCart from '../context/CartContext'

export default function ProductModal({ product, onClose }) {
  const { addItem, openCart } = useCart()

  if (!product) return null

  const handleAdd = () => {
    addItem(product)
    onClose()
    openCart()
  }

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="modal-card"
            initial={{ opacity: 0, scale: 0.92, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 30 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            onClick={e => e.stopPropagation()}
          >
            <button className="modal-close" onClick={onClose} aria-label="סגור">✕</button>

            <div className="modal-image">
              <span className="modal-emoji">{product.icon}</span>
            </div>

            <div className="modal-body">
              <span className="modal-cat">{product.category}</span>
              <h2 className="modal-name">{product.name}</h2>
              <p className="modal-desc">{product.description}</p>

              <div className="modal-status-row">
                <span className={`pc-status ${product.available ? 'in-stock' : 'out-of-stock'}`}>
                  <span className="pc-dot" />
                  {product.available ? 'במלאי' : 'אזל מהמלאי'}
                </span>
              </div>

              <div className="modal-actions">
                {product.available ? (
                  <button className="btn-green modal-add-btn" onClick={handleAdd}>
                    🛒 הוסף לסל
                  </button>
                ) : (
                  <button className="btn-green modal-add-btn" disabled>
                    המוצר אזל מהמלאי
                  </button>
                )}
                <a
                  href={`https://wa.me/972542223923?text=${encodeURIComponent('שלום, אני מעוניין במוצר: ' + product.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline modal-wa-btn"
                >
                  💬 שאלו אותנו
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
