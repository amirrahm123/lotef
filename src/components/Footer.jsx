import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-col">
          <div className="footer-brand">
            <span className="footer-logo-icon">💊</span>
            <h3>לוטף</h3>
          </div>
          <p>בית מרקחת לוטף — מגוון רחב של תרופות, ויטמינים ומוצרי בריאות במחירים הוגנים ושירות אישי.</p>
        </div>

        <div className="footer-col">
          <h4>קישורים</h4>
          <ul>
            <li><Link to="/">דף הבית</Link></li>
            <li><Link to="/products">מוצרים</Link></li>
            <li><Link to="/about">אודות</Link></li>
            <li><Link to="/contact">צור קשר</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>שעות פתיחה</h4>
          <ul className="footer-hours">
            <li>ראשון – חמישי: 08:00 – 20:00</li>
            <li>שישי: 08:00 – 14:00</li>
            <li>שבת: סגור</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>צור קשר</h4>
          <ul>
            <li>📞 04-1234567</li>
            <li>📧 info@lotef.co.il</li>
            <li>📍 רחוב הרצל 15, חיפה</li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} לוטף בית מרקחת. כל הזכויות שמורות.</p>
      </div>
    </footer>
  )
}
