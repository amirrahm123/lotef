import { useState } from 'react'
import useAdmin from '../hooks/useAdmin'

export default function AdminGate({ children }) {
  const { isAdmin, login } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  if (isAdmin) return children

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!login(password)) {
      setError(true)
      setTimeout(() => setError(false), 2000)
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
          />
          <button type="submit" className="btn-green">כניסה</button>
          {error && <p className="admin-error">סיסמה שגויה</p>}
        </form>
      </div>
    </div>
  )
}
