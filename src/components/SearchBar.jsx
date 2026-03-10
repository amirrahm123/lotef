export default function SearchBar({ value, onChange, variant = 'inline', placeholder, onSubmit }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSubmit) onSubmit(value)
  }

  return (
    <div className={`search-bar ${variant}`}>
      <span className="search-icon">🔍</span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder || 'חפשו תרופה, ויטמין, מוצר...'}
      />
      {value && (
        <button className="search-clear" onClick={() => onChange('')} aria-label="נקה חיפוש">✕</button>
      )}
    </div>
  )
}
