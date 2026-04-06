const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')

const app = express()
app.use(cors())
app.use(express.json())

// ---------- DB ----------
const MONGODB_URI = process.env.MONGODB_URI
let dbReady = false

if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    serverSelectionTimeoutMS: 10000,
  }).then(() => { dbReady = true; seed() })
    .catch(err => console.error('MongoDB error:', err.message))
}

// ---------- Schema ----------
const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String, default: '📦' },
  available:   { type: Boolean, default: true },
  stock:       { type: Number, default: 0 },
})
const Product = mongoose.model('Product', productSchema)

// ---------- Auth middleware ----------
function auth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token' })
  try {
    jwt.verify(token, process.env.JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}

// ---------- Email transporter ----------
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

// ---------- Routes ----------

app.get('/api/healthz', (req, res) => {
  res.json({ status: 'ok', db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' })
})

app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/admin/login', (req, res) => {
  const { password } = req.body
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Wrong password' })
  }
})

app.get('/api/admin/verify', auth, (req, res) => {
  res.json({ valid: true })
})

app.post('/api/products', auth, async (req, res) => {
  try {
    const product = await Product.create(req.body)
    res.status(201).json(product)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
})

app.patch('/api/products/:id', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) return res.status(404).json({ error: 'Not found' })
    if (req.body && Object.keys(req.body).length > 0) {
      if (req.body.available !== undefined) product.available = req.body.available
      if (req.body.stock !== undefined) product.stock = req.body.stock
    } else {
      product.available = !product.available
    }
    await product.save()
    res.json(product)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/api/products/:id', auth, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/api/orders', async (req, res) => {
  const { items, customerName, customerPhone } = req.body
  if (!items || !items.length) {
    return res.status(400).json({ error: 'No items in order' })
  }

  const now = new Date().toLocaleString('he-IL', { timeZone: 'Asia/Jerusalem' })

  const itemRows = items.map((item, i) =>
    `<tr>
      <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;">${i + 1}</td>
      <td style="padding:8px 12px;border:1px solid #ddd;text-align:right;">${item.icon || '📦'} ${item.name}</td>
      <td style="padding:8px 12px;border:1px solid #ddd;text-align:right;">${item.category || ''}</td>
      <td style="padding:8px 12px;border:1px solid #ddd;text-align:center;">${item.qty}</td>
    </tr>`
  ).join('')

  const totalItems = items.reduce((sum, item) => sum + item.qty, 0)

  const html = `
    <div dir="rtl" style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#0d9488;color:white;padding:20px;border-radius:8px 8px 0 0;text-align:center;">
        <h1 style="margin:0;">🛒 הזמנה חדשה מלוטף</h1>
        <p style="margin:8px 0 0;opacity:0.9;">${now}</p>
      </div>
      ${customerName || customerPhone ? `
      <div style="background:#f0fdfa;padding:16px;border:1px solid #ddd;border-top:none;">
        <h3 style="margin:0 0 8px;color:#0d9488;">פרטי הלקוח</h3>
        ${customerName ? `<p style="margin:4px 0;"><strong>שם:</strong> ${customerName}</p>` : ''}
        ${customerPhone ? `<p style="margin:4px 0;"><strong>טלפון:</strong> ${customerPhone}</p>` : ''}
      </div>
      ` : ''}
      <table style="width:100%;border-collapse:collapse;margin-top:0;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:10px 12px;border:1px solid #ddd;text-align:center;width:40px;">#</th>
            <th style="padding:10px 12px;border:1px solid #ddd;text-align:right;">מוצר</th>
            <th style="padding:10px 12px;border:1px solid #ddd;text-align:right;">קטגוריה</th>
            <th style="padding:10px 12px;border:1px solid #ddd;text-align:center;width:60px;">כמות</th>
          </tr>
        </thead>
        <tbody>
          ${itemRows}
        </tbody>
      </table>
      <div style="background:#f3f4f6;padding:16px;border:1px solid #ddd;border-top:none;text-align:center;border-radius:0 0 8px 8px;">
        <strong>סה״כ פריטים: ${totalItems}</strong>
      </div>
    </div>
  `

  try {
    await transporter.sendMail({
      from: `"לוטף - בית מרקחת" <${process.env.EMAIL_USER}>`,
      to: process.env.ORDER_EMAIL || process.env.EMAIL_USER,
      subject: `הזמנה חדשה מלוטף — ${totalItems} פריטים — ${now}`,
      html,
    })
    res.json({ success: true })
  } catch (err) {
    console.error('Email send error:', err.message)
    res.status(500).json({ error: 'Failed to send email' })
  }
})

// ---------- Seed ----------
const defaultProducts = [
  { name: 'אקמול 500 מ"ג',       category: 'תרופות ללא מרשם', description: 'משכך כאבים ומוריד חום, 20 טבליות',         icon: '💊', available: true, stock: 50 },
  { name: 'נורופן 200 מ"ג',       category: 'תרופות ללא מרשם', description: 'נוגד דלקת ומשכך כאבים, 20 טבליות',       icon: '💊', available: true, stock: 40 },
  { name: 'אופטלגין טיפות',       category: 'תרופות ללא מרשם', description: 'טיפות למבוגרים, 20 מ"ל',                  icon: '💧', available: true, stock: 30 },
  { name: 'דקסמול קידס',          category: 'תרופות ללא מרשם', description: 'סירופ להורדת חום לילדים, 100 מ"ל',        icon: '🍼', available: true, stock: 25 },
  { name: 'סטופר שלשולים',        category: 'תרופות ללא מרשם', description: 'קפסולות נגד שלשולים, 8 קפסולות',          icon: '💊', available: true, stock: 35 },
  { name: 'רנני אנטאסיד',         category: 'תרופות ללא מרשם', description: 'לטיפול בצרבת, 24 טבליות לעיסה',           icon: '🟢', available: true, stock: 20 },
  { name: 'ויטמין C 1000',        category: 'ויטמינים ותוספים', description: 'תוסף ויטמין C, 30 כמוסות',                icon: '🍊', available: true, stock: 60 },
  { name: 'ויטמין D3 1000',       category: 'ויטמינים ותוספים', description: 'ויטמין D לחיזוק העצמות, 60 כמוסות',       icon: '☀️', available: true, stock: 45 },
  { name: 'אומגה 3',              category: 'ויטמינים ותוספים', description: 'שמן דגים, 90 כמוסות רכות',                icon: '🐟', available: true, stock: 30 },
  { name: 'מגנזיום 400',          category: 'ויטמינים ותוספים', description: 'מגנזיום להרפיית שרירים, 60 טבליות',       icon: '✨', available: true, stock: 40 },
  { name: 'מולטי ויטמין',         category: 'ויטמינים ותוספים', description: 'מולטי ויטמין יומי, 30 טבליות',            icon: '💪', available: true, stock: 55 },
  { name: 'פרוביוטיקה',           category: 'ויטמינים ותוספים', description: 'תוסף פרוביוטי, 30 כמוסות',               icon: '🦠', available: true, stock: 20 },
  { name: 'קרם לחות לפנים',       category: 'טיפוח ויופי', description: 'קרם לחות יומי SPF30, 50 מ"ל',                icon: '🧴', available: true, stock: 15 },
  { name: 'קרם הגנה SPF50',       category: 'טיפוח ויופי', description: 'הגנה מהשמש לכל המשפחה, 200 מ"ל',             icon: '🌞', available: true, stock: 25 },
  { name: 'שמפו טיפולי',          category: 'טיפוח ויופי', description: 'שמפו נגד קשקשים, 250 מ"ל',                   icon: '🧴', available: true, stock: 30 },
  { name: 'סבון פנים עדין',       category: 'טיפוח ויופי', description: 'ניקוי עדין לעור רגיש, 150 מ"ל',              icon: '🫧', available: true, stock: 20 },
  { name: 'מד חום דיגיטלי',       category: 'ציוד רפואי', description: 'מד חום מהיר ומדויק',                           icon: '🌡️', available: true, stock: 10 },
  { name: 'מד לחץ דם',            category: 'ציוד רפואי', description: 'מד לחץ דם אוטומטי לזרוע',                     icon: '❤️', available: true, stock: 8 },
  { name: 'ערכת עזרה ראשונה',     category: 'ציוד רפואי', description: 'ערכה מלאה לבית, 50 פריטים',                    icon: '🩹', available: true, stock: 12 },
  { name: 'פלסטרים מגוון',        category: 'ציוד רפואי', description: 'פלסטרים בגדלים שונים, 40 יחידות',             icon: '🩹', available: true, stock: 50 },
  { name: 'טיטולים מידה 3',       category: 'תינוקות וילדים', description: 'חיתולים לתינוקות 4-9 ק"ג, 50 יחידות',     icon: '👶', available: true, stock: 30 },
  { name: 'מגבונים לתינוק',       category: 'תינוקות וילדים', description: 'מגבונים לחים עדינים, 72 יחידות',           icon: '🧻', available: true, stock: 40 },
  { name: 'שמן תינוקות',          category: 'תינוקות וילדים', description: 'שמן עיסוי לתינוק, 200 מ"ל',               icon: '🍼', available: true, stock: 20 },
  { name: 'ג\'ל חיטוי ידיים',     category: 'היגיינה', description: 'ג\'ל אלכוהולי 70%, 250 מ"ל',                     icon: '🧼', available: true, stock: 35 },
  { name: 'מסכות פנים',           category: 'היגיינה', description: 'מסכות חד פעמיות, 50 יחידות',                      icon: '😷', available: true, stock: 100 },
  { name: 'משחת שיניים',          category: 'היגיינה', description: 'משחת שיניים עם פלואוריד, 100 מ"ל',                icon: '🦷', available: true, stock: 45 },
]

async function seed() {
  try {
    const count = await Product.countDocuments()
    if (count === 0) {
      await Product.insertMany(defaultProducts)
      console.log('Seeded', defaultProducts.length, 'products')
    }
  } catch (err) {
    console.error('Seed error:', err.message)
  }
}

module.exports = app
