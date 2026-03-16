import { useState, useEffect, useMemo, useRef } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import useProducts from '../hooks/useProducts'
import useCart from '../context/CartContext'

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
  const [showDropdown, setShowDropdown] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const { products } = useProducts()
  const { totalItems, openCart } = useCart()
  const searchRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false); setSearch(''); setShowDropdown(false) }, [location])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const results = useMemo(() => {
    if (!search.trim()) return []
    const q = search.trim()
    const startsWithName = products.filter(p => p.name.startsWith(q))
    const containsName = products.filter(p => !p.name.startsWith(q) && (p.name.includes(q) || p.category.includes(q) || p.description.includes(q)))
    return [...startsWithName, ...containsName].slice(0, 6)
  }, [search, products])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/products?q=${encodeURIComponent(search.trim())}`)
      setShowDropdown(false)
    }
  }

  const handleInputChange = (e) => {
    setSearch(e.target.value)
    setShowDropdown(e.target.value.trim().length > 0)
  }

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="nav-logo-icon">💊</span>
          <div>
            <span className="nav-logo-name">לוטף</span>
            <span className="nav-logo-sub">בית מרקחת בריאות והומאופתיה</span>
          </div>
        </Link>

        <button className="nav-cart-btn" onClick={openCart} aria-label="סל קניות">
          🛒
          {totalItems > 0 && <span className="nav-cart-badge">{totalItems}</span>}
        </button>

        <div className="nav-search-wrap" ref={searchRef}>
          <form className="nav-search" onSubmit={handleSearch}>
            <span className="nav-search-icon">🔍</span>
            <input
              type="text"
              value={search}
              onChange={handleInputChange}
              onFocus={() => search.trim() && setShowDropdown(true)}
              placeholder="חיפוש מוצרים..."
            />
            {search && (
              <button type="button" className="nav-search-clear" onClick={() => { setSearch(''); setShowDropdown(false) }}>✕</button>
            )}
          </form>

          {showDropdown && (
            <div className="search-dropdown">
              {results.length > 0 ? (
                <>
                  {results.map(p => (
                    <Link
                      key={p._id}
                      to={`/products?q=${encodeURIComponent(p.name)}`}
                      className="search-result"
                      onClick={() => setShowDropdown(false)}
                    >
                      <span className="search-result-icon">{p.icon}</span>
                      <div>
                        <span className="search-result-name">{p.name}</span>
                        <span className="search-result-cat">{p.category}</span>
                      </div>
                    </Link>
                  ))}
                  <Link
                    to={`/products?q=${encodeURIComponent(search.trim())}`}
                    className="search-all"
                    onClick={() => setShowDropdown(false)}
                  >
                    הצג את כל התוצאות ({products.filter(p => p.name.includes(search.trim()) || p.category.includes(search.trim()) || p.description.includes(search.trim())).length})
                  </Link>
                </>
              ) : (
                <div className="search-no-results">לא נמצאו מוצרים</div>
              )}
            </div>
          )}
        </div>

        <ul className="nav-links">
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} end={l.to === '/'}>
                {l.label}
              </NavLink>
            </li>
          ))}
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
            onChange={handleInputChange}
            placeholder="חיפוש מוצרים..."
          />
        </form>
        {menuOpen && search.trim() && results.length > 0 && (
          <div className="mobile-search-results">
            {results.map(p => (
              <Link
                key={p._id}
                to={`/products?q=${encodeURIComponent(p.name)}`}
                className="search-result"
              >
                <span className="search-result-icon">{p.icon}</span>
                <span className="search-result-name">{p.name}</span>
              </Link>
            ))}
          </div>
        )}
        <ul>
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} className={({ isActive }) => isActive ? 'active' : ''} end={l.to === '/'}>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
