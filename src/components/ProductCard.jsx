import { motion } from 'framer-motion'
import useCart from '../context/CartContext'

export default function ProductCard({ product, index = 0, onClick }) {
  const { addItem, openCart } = useCart()

  const handleAdd = (e) => {
    e.stopPropagation()
    if (!product.available) return
    addItem(product)
    openCart()
  }

  return (
    <motion.div
      className={`product-card ${!product.available ? 'unavailable' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      onClick={() => onClick?.(product)}
      style={{ cursor: 'pointer' }}
    >
      <div className="pc-image">
        <span className="pc-emoji">{product.icon}</span>
      </div>
      <div className="pc-body">
        <span className="pc-cat">{product.category}</span>
        <h3 className="pc-name">{product.name}</h3>
        <p className="pc-desc">{product.description}</p>
        <div className="pc-footer">
          <span className={`pc-status ${product.available ? 'in-stock' : 'out-of-stock'}`}>
            <span className="pc-dot" />
            {product.available ? 'במלאי' : 'אזל מהמלאי'}
          </span>
          {product.available && (
            <button className="pc-add-btn" onClick={handleAdd} aria-label="הוסף לסל">
              🛒
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
