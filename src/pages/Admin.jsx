import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import AdminGate from '../components/AdminGate'
import useProducts from '../hooks/useProducts'
import useAdmin from '../hooks/useAdmin'
import { CATEGORIES } from '../data/defaultProducts'

const ICONS = ['💊', '💧', '🍼', '🟢', '🍊', '☀️', '🐟', '✨', '💪', '🦠', '🧴', '🌞', '🫧', '🌡️', '❤️', '🩹', '👶', '🧻', '🧼', '😷', '🦷', '📦']

export default function Admin() {
  const { products, loading, toggleAvailability, updateStock, addProduct, deleteProduct } = useProducts()
  const { logout } = useAdmin()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [newProduct, setNewProduct] = useState({
    name: '', category: '', description: '', icon: '📦', available: true, stock: 0,
  })

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    return products.filter(p =>
      p.name.includes(search.trim()) || p.category.includes(search.trim())
    )
  }, [products, search])

  const availableCount = products.filter(p => p.available).length
  const unavailableCount = products.filter(p => !p.available).length
  const categories = CATEGORIES.filter(c => c !== 'הכל')

  const handleAdd = async (e) => {
    e.preventDefault()
    const success = await addProduct(newProduct)
    if (success) {
      setNewProduct({ name: '', category: '', description: '', icon: '📦', available: true, stock: 0 })
      setShowAdd(false)
    }
  }

  const handleDelete = async (id) => {
    await deleteProduct(id)
    setDeleteConfirm(null)
  }

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>טוען...</div>

  return (
    <PageTransition>
      <AdminGate>
        <section className="page-hero-simple admin-hero">
          <div className="container">
            <h1>🔧 ניהול מוצרים</h1>
            <p>הוסיפו, מחקו ונהלו זמינות מוצרים</p>
          </div>
        </section>

        <section className="section admin-section">
          <div className="container">
            <div className="admin-header">
              <div className="admin-stats">
                <span className="admin-stat green">✅ {availableCount} זמינים</span>
                <span className="admin-stat coral">❌ {unavailableCount} לא זמינים</span>
                <span className="admin-stat" style={{ color: '#555' }}>📦 {products.length} סה"כ</span>
              </div>
              <div className="admin-actions">
                <button onClick={() => setShowAdd(!showAdd)} className="btn-green">
                  {showAdd ? '✕ סגור' : '➕ הוסף מוצר'}
                </button>
                <button onClick={() => { logout(); navigate('/'); }} className="btn-outline">
                  🚪 התנתקות
                </button>
              </div>
            </div>

            {showAdd && (
              <form className="admin-add-form" onSubmit={handleAdd}>
                <h3>הוספת מוצר חדש</h3>
                <div className="admin-form-grid">
                  <div className="admin-form-group">
                    <label>שם המוצר</label>
                    <input
                      type="text"
                      required
                      value={newProduct.name}
                      onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                      placeholder="לדוגמה: אקמול 500 מ״ג"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>קטגוריה</label>
                    <select
                      required
                      value={newProduct.category}
                      onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    >
                      <option value="" disabled>בחרו קטגוריה</option>
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>תיאור</label>
                    <input
                      type="text"
                      required
                      value={newProduct.description}
                      onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                      placeholder="תיאור קצר של המוצר"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>כמות במלאי</label>
                    <input
                      type="number"
                      min="0"
                      required
                      value={newProduct.stock}
                      onChange={e => setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                    />
                  </div>
                  <div className="admin-form-group">
                    <label>אייקון</label>
                    <div className="icon-picker">
                      {ICONS.map(icon => (
                        <button
                          type="button"
                          key={icon}
                          className={`icon-option ${newProduct.icon === icon ? 'active' : ''}`}
                          onClick={() => setNewProduct({ ...newProduct, icon })}
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <button type="submit" className="btn-green">הוסף מוצר</button>
              </form>
            )}

            <div className="admin-search">
              <input
                type="text"
                placeholder="🔍 חפשו מוצר..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>

            <div className="admin-table">
              <div className="admin-table-header">
                <span>מוצר</span>
                <span>קטגוריה</span>
                <span>מלאי</span>
                <span>סטטוס</span>
                <span>פעולות</span>
              </div>
              {filtered.map(p => (
                <div key={p._id} className={`admin-row ${!p.available ? 'row-unavailable' : ''}`}>
                  <span className="admin-cell product-name">
                    <span className="admin-icon">{p.icon}</span>
                    {p.name}
                  </span>
                  <span className="admin-cell">{p.category}</span>
                  <span className="admin-cell">
                    <input
                      type="number"
                      min="0"
                      className="stock-input"
                      value={p.stock ?? 0}
                      onChange={e => updateStock(p._id, parseInt(e.target.value) || 0)}
                    />
                  </span>
                  <span className="admin-cell">
                    <span className={`badge-small ${p.available ? 'badge-available' : 'badge-unavailable'}`}>
                      {p.available ? 'זמין' : 'לא זמין'}
                    </span>
                  </span>
                  <span className="admin-cell admin-cell-actions">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={p.available}
                        onChange={() => toggleAvailability(p._id)}
                      />
                      <span className="toggle-slider" />
                    </label>
                    {deleteConfirm === p._id ? (
                      <span className="delete-confirm">
                        <button onClick={() => handleDelete(p._id)} className="btn-delete-yes">מחק</button>
                        <button onClick={() => setDeleteConfirm(null)} className="btn-delete-no">ביטול</button>
                      </span>
                    ) : (
                      <button onClick={() => setDeleteConfirm(p._id)} className="btn-delete">🗑️</button>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AdminGate>
    </PageTransition>
  )
}
