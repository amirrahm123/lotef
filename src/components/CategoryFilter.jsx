export default function CategoryFilter({ categories, active, onSelect }) {
  return (
    <div className="category-filter">
      {categories.map(cat => (
        <button
          key={cat}
          className={`cat-pill ${active === cat ? 'active' : ''}`}
          onClick={() => onSelect(cat)}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
