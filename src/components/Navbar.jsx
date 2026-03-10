import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'

const links = [
  { to: '/',         label: 'דף הבית' },
  { to: '/products', label: 'מוצרים' },
  { to: '/about',    label: 'אודות' },
  { to: '/contact',  label: 'צור קשר' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [search, setSearch] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setSearch('') }, [location])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/products?q=${encodeURIComponent(search.trim())}`)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">💊</span>
          <div>
            <span className="nav-logo-name">לוטף</span>
            <span className="nav-logo-sub">בית מרקחת</span>
          </div>
        </Link>

        <form className="nav-search" onSubmit={handleSearch}>
          <span className="nav-search-icon">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש מוצרים..."
          />
          {search && (
            <button type="button" className="nav-search-clear" onClick={() => setSearch('')}>✕</button>
          )}
        </form>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} end={l.to === '/'}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/admin" className="nav-admin" title="ניהול">🔒</Link>
          </li>
        </ul>

        <button className={`hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label="תפריט">
          <span /><span /><span />
        </button>
      </div>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <form className="mobile-search" onSubmit={handleSearch}>
          <span className="nav-search-icon">🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש מוצרים..."
          />
        </form>
        <ul>
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} end={l.to === '/'}>
                {l.label}
              </NavLink>
            </li>
          ))}
          <li>
            <Link to="/admin" className="nav-admin-mobile">🔒 ניהול</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
