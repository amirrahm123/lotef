import { useState } from 'react'
import { Link } from 'react-router-dom'
import PageTransition from '../components/PageTransition'
import AnimatedSection from '../components/AnimatedSection'
import ProductCard from '../components/ProductCard'
import ProductModal from '../components/ProductModal'
import useProducts from '../hooks/useProducts'
import { CATEGORIES } from '../data/defaultProducts'

const categoryIcons = {
  'תרופות ללא מרשם': '💊',
  'ויטמינים ותוספים': '🍊',
  'טיפוח ויופי': '🧴',
  'ציוד רפואי': '🩹',
  'תינוקות וילדים': '👶',
  'היגיינה': '🧼',
}

const features = [
  { icon: '🤝', title: 'שירות אישי', desc: 'צוות מקצועי שזמין עבורכם תמיד' },
  { icon: '📦', title: 'מגוון מוצרים', desc: 'אלפי מוצרים מהמותגים המובילים' },
  { icon: '💰', title: 'מחירים הוגנים', desc: 'מחירים תחרותיים והטבות מיוחדות' },
]

export default function Home() {
  const { products } = useProducts()
  const featured = products.filter(p => p.available).slice(0, 8)
  const [selectedProduct, setSelectedProduct] = useState(null)

  return (
    <PageTransition>
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-content">
          <AnimatedSection>
            <span className="hero-badge">💊 בית מרקחת</span>
            <h1>בית מרקחת בריאות והומאופתיה <span className="text-green">לוטף</span></h1>
            <p className="hero-sub">מגוון רחב של תרופות, ויטמינים ומוצרי בריאות — הכל במקום אחד</p>
            <Link to="/products" className="btn-green">צפו במוצרים שלנו ←</Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="section features-section">
        <div className="container">
          <div className="features-grid">
            {features.map((f, i) => (
              <AnimatedSection key={i} className="feature-card" delay={i * 0.1}>
                <span className="feature-icon">{f.icon}</span>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">קטגוריות</h2>
            <p className="section-sub">מצאו את המוצר שאתם מחפשים לפי קטגוריה</p>
          </AnimatedSection>
          <div className="categories-grid">
            {CATEGORIES.filter(c => c !== 'הכל').map((cat, i) => (
              <AnimatedSection key={cat} delay={i * 0.08}>
                <Link to={`/products?cat=${encodeURIComponent(cat)}`} className="category-card">
                  <span className="category-icon">{categoryIcons[cat]}</span>
                  <span className="category-name">{cat}</span>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section featured-section">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">מוצרים נבחרים</h2>
            <p className="section-sub">מבחר מהמוצרים הפופולריים שלנו</p>
          </AnimatedSection>
          <div className="products-grid">
            {featured.map((p, i) => (
              <ProductCard key={p._id} product={p} index={i} onClick={setSelectedProduct} />
            ))}
          </div>
          <AnimatedSection className="text-center" delay={0.3}>
            <Link to="/products" className="btn-green">לכל המוצרים ←</Link>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <div className="container">
          <AnimatedSection>
            <h2>צריכים עזרה? אנחנו כאן בשבילכם</h2>
            <p>צוות הרוקחים המקצועי שלנו ישמח לייעץ לכם</p>
            <div className="cta-buttons">
              <a href="tel:041234567" className="btn-white">📞 התקשרו עכשיו</a>
              <Link to="/contact" className="btn-green-outline">צור קשר</Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
    </PageTransition>
  )
}
