import { useState, useMemo } from 'react'
import PageTransition from '../components/PageTransition'
import AdminGate from '../components/AdminGate'
import useProducts from '../hooks/useProducts'
import useAdmin from '../hooks/useAdmin'

export default function Admin() {
  const { products, toggleAvailability, resetProducts } = useProducts()
  const { logout } = useAdmin()
  const [search, setSearch] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

  const filtered = useMemo(() => {
    if (!search.trim()) return products
    return products.filter(p =>
      p.name.includes(search.trim()) || p.category.includes(search.trim())
    )
  }, [products, search])

  const availableCount = products.filter(p => p.available).length
  const unavailableCount = products.filter(p => !p.available).length

  const handleReset = () => {
    resetProducts()
    setShowConfirm(false)
  }

  return (
    <PageTransition>
      <AdminGate>
        <section className="page-hero-simple admin-hero">
          <div className="container">
            <h1>🔧 ניהול מוצרים</h1>
            <p>הפעילו או כבו זמינות מוצרים</p>
          </div>
        </section>

        <section className="section admin-section">
          <div className="container">
            <div className="admin-header">
              <div className="admin-stats">
                <span className="admin-stat green">✅ {availableCount} זמינים</span>
                <span className="admin-stat coral">❌ {unavailableCount} לא זמינים</span>
              </div>
              <div className="admin-actions">
                <button onClick={() => setShowConfirm(true)} className="btn-outline-coral">
                  איפוס לברירת מחדל
                </button>
                <button onClick={logout} className="btn-outline">
                  🚪 התנתקות
                </button>
              </div>
            </div>

            {showConfirm && (
              <div className="admin-confirm">
                <p>האם לאפס את כל המוצרים לברירת המחדל?</p>
                <button onClick={handleReset} className="btn-green">כן, אפס</button>
                <button onClick={() => setShowConfirm(false)} className="btn-outline">ביטול</button>
              </div>
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
                <span>סטטוס</span>
                <span>פעולה</span>
              </div>
              {filtered.map(p => (
                <div key={p.id} className={`admin-row ${!p.available ? 'row-unavailable' : ''}`}>
                  <span className="admin-cell product-name">
                    <span className="admin-icon">{p.icon}</span>
                    {p.name}
                  </span>
                  <span className="admin-cell">{p.category}</span>
                  <span className="admin-cell">
                    <span className={`badge-small ${p.available ? 'badge-available' : 'badge-unavailable'}`}>
                      {p.available ? 'זמין' : 'לא זמין'}
                    </span>
                  </span>
                  <span className="admin-cell">
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={p.available}
                        onChange={() => toggleAvailability(p.id)}
                      />
                      <span className="toggle-slider" />
                    </label>
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
