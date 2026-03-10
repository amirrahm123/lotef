import { motion } from 'framer-motion'

export default function ProductCard({ product, index = 0 }) {
  return (
    <motion.div
      className={`product-card ${!product.available ? 'unavailable' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
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
        </div>
      </div>
    </motion.div>
  )
}
