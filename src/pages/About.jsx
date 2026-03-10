import PageTransition from '../components/PageTransition'
import AnimatedSection from '../components/AnimatedSection'

const values = [
  { icon: '💚', title: 'בריאות הלקוח', desc: 'בריאות הלקוחות שלנו היא בראש סדר העדיפויות. אנחנו מקפידים על ייעוץ מקצועי ומדויק.' },
  { icon: '🤝', title: 'שירות אישי', desc: 'כל לקוח מקבל יחס אישי וחם. אנחנו מכירים את הלקוחות שלנו בשם.' },
  { icon: '✅', title: 'מקצועיות', desc: 'צוות רוקחים מוסמכים עם ניסיון רב שנים בתחום הפארמה.' },
  { icon: '💰', title: 'מחירים הוגנים', desc: 'מאמינים בשקיפות ובמחירים הוגנים. ללא הפתעות, ללא עלויות נסתרות.' },
]

export default function About() {
  return (
    <PageTransition>
      <section className="page-hero-simple">
        <div className="container">
          <h1>אודות לוטף</h1>
          <p>הכירו את בית המרקחת שלכם</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <AnimatedSection className="about-intro">
            <h2>מי אנחנו</h2>
            <p>
              בית מרקחת לוטף פועל כבר שנים רבות ומשרת את תושבי האזור במסירות ובמקצועיות.
              אנו מציעים מגוון רחב של תרופות, ויטמינים, מוצרי טיפוח וציוד רפואי,
              ומלווים את לקוחותינו בייעוץ מקצועי וחם.
            </p>
            <p>
              הצוות שלנו כולל רוקחים מוסמכים בעלי ניסיון רב, שמקפידים על מתן שירות
              מצוין ומידע מהימן. אנו מאמינים שכל לקוח ראוי לקבל את הטיפול הטוב ביותר.
            </p>
          </AnimatedSection>
        </div>
      </section>

      <section className="section section-alt">
        <div className="container">
          <AnimatedSection>
            <h2 className="section-title">הערכים שלנו</h2>
          </AnimatedSection>
          <div className="values-grid">
            {values.map((v, i) => (
              <AnimatedSection key={i} className="value-card" delay={i * 0.1}>
                <span className="value-icon">{v.icon}</span>
                <h3>{v.title}</h3>
                <p>{v.desc}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band">
        <div className="container">
          <AnimatedSection>
            <h2>בואו לבקר אותנו</h2>
            <p>נשמח לראות אתכם בסניף שלנו ולסייע בכל שאלה</p>
            <a href="tel:041234567" className="btn-white">📞 04-1234567</a>
          </AnimatedSection>
        </div>
      </section>
    </PageTransition>
  )
}
