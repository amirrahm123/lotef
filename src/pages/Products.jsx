import { useState, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import AnimatedSection from '../components/AnimatedSection'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import useProducts from '../hooks/useProducts'
import { CATEGORIES } from '../data/defaultProducts'

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initQ = searchParams.get('q') || ''
  const initCat = searchParams.get('cat') || 'הכל'

  const [search, setSearch] = useState(initQ)
  const [category, setCategory] = useState(initCat)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { products } = useProducts()

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCat = category === 'הכל' || p.category === category
      const matchSearch = !search.trim() ||
        p.name.includes(search.trim()) ||
        p.description.includes(search.trim())
      return matchCat && matchSearch
    })
  }, [products, search, category])

  const handleCategoryChange = (cat) => {
    setCategory(cat)
    const params = {}
    if (search) params.q = search
    if (cat !== 'הכל') params.cat = cat
    setSearchParams(params)
  }

  const handleSearchChange = (val) => {
    setSearch(val)
    const params = {}
    if (val) params.q = val
    if (category !== 'הכל') params.cat = category
    setSearchParams(params)
  }

  return (
    <PageTransition>
      <section className="page-hero-simple">
        <div className="container">
          <h1>המוצרים שלנו</h1>
          <p>מצאו את מה שאתם צריכים מתוך מגוון רחב של מוצרים</p>
        </div>
      </section>

      <section className="section products-page">
        <div className="container">
          <div className="products-toolbar">
            <SearchBar value={search} onChange={handleSearchChange} variant="inline" />
            <CategoryFilter categories={CATEGORIES} active={category} onSelect={handleCategoryChange} />
          </div>

          <p className="products-count">{filtered.length} מוצרים נמצאו</p>

          {filtered.length > 0 ? (
            <div className="products-grid">
              {filtered.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} onClick={setSelectedProduct} />
              ))}
            </div>
          ) : (
            <AnimatedSection className="no-results">
              <span className="no-results-icon">🔍</span>
              <h3>לא נמצאו מוצרים</h3>
              <p>נסו לשנות את מילות החיפוש או לבחור קטגוריה אחרת</p>
            </AnimatedSection>
          )}
        </div>
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </PageTransition>
  )
}
