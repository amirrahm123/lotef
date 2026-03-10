import { useState } from 'react'
import PageTransition from '../components/PageTransition'
import AnimatedSection from '../components/AnimatedSection'

const info = [
  { icon: '📞', label: 'טלפון', value: '04-1234567', href: 'tel:041234567' },
  { icon: '📧', label: 'אימייל', value: 'info@lotef.co.il', href: 'mailto:info@lotef.co.il' },
  { icon: '📍', label: 'כתובת', value: 'רחוב הרצל 15, חיפה' },
  { icon: '🕐', label: 'שעות פתיחה', value: 'א-ה: 08:00-20:00 | ו: 08:00-14:00' },
]

export default function Contact() {
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
    setForm({ name: '', phone: '', message: '' })
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <PageTransition>
      <section className="page-hero-simple">
        <div className="container">
          <h1>צור קשר</h1>
          <p>נשמח לשמוע מכם!</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <AnimatedSection className="contact-info-cards">
              {info.map((item, i) => (
                <div key={i} className="contact-info-card">
                  <span className="contact-info-icon">{item.icon}</span>
                  <div>
                    <strong>{item.label}</strong>
                    {item.href ? (
                      <a href={item.href}>{item.value}</a>
                    ) : (
                      <p>{item.value}</p>
                    )}
                  </div>
                </div>
              ))}
            </AnimatedSection>

            <AnimatedSection className="contact-form-wrap" delay={0.15}>
              <h2>שלחו לנו הודעה</h2>
              {sent ? (
                <div className="contact-success">
                  <span>✅</span>
                  <p>ההודעה נשלחה בהצלחה! נחזור אליכם בהקדם.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="contact-form">
                  <input
                    type="text"
                    placeholder="שם מלא"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    required
                  />
                  <input
                    type="tel"
                    placeholder="טלפון"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="הודעה"
                    rows={5}
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    required
                  />
                  <button type="submit" className="btn-green">שלחו הודעה</button>
                </form>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>
    </PageTransition>
  )
}
