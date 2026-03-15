import { useState } from 'react'
import useAdmin from '../hooks/useAdmin'

export default function AdminGate({ children }) {
  const { isAdmin, loading, login } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div style={{ padding: '100px', textAlign: 'center' }}>טוען...</div>
  if (isAdmin) return children

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const result = await login(password)
    setSubmitting(false)
    if (result !== true) {
      setError(result === 'timeout' ? 'timeout' : 'wrong')
      setTimeout(() => setError(''), 3000)
    }
  }

  return (
    <div className="admin-gate">
      <div className="admin-gate-box">
        <span className="admin-gate-icon">🔒</span>
        <h2>כניסת מנהל</h2>
        <p>הזינו את הסיסמה כדי לגשת לפאנל הניהול</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="סיסמה"
            autoFocus
            disabled={submitting}
          />
          <button type="submit" className="btn-green" disabled={submitting}>
            {submitting ? 'מתחבר... (יכול לקחת עד 30 שניות)' : 'כניסה'}
          </button>
          {error === 'wrong' && <p className="admin-error">סיסמה שגויה</p>}
          {error === 'timeout' && <p className="admin-error">השרת מתעורר, נסו שוב בעוד כמה שניות...</p>}
        </form>
      </div>
    </div>
  )
}
