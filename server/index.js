const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const jwt = require('jsonwebtoken')
try { require('dotenv').config() } catch (e) { /* dotenv not needed on Render */ }

const app = express()
app.use(cors())
app.use(express.json())

// ---------- DB ----------
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error:', err))

const productSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  icon:        { type: String, default: '📦' },
  available:   { type: Boolean, default: true },
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

// ---------- Routes ----------

// Public
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Admin login
app.post('/api/admin/login', (req, res) => {
  const { password } = req.body
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '7d' })
    res.json({ token })
  } else {
    res.status(401).json({ error: 'Wrong password' })
  }
})

// Verify token
app.get('/api/admin/verify', auth, (req, res) => {
  res.json({ valid: true })
})

// Protected
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
    product.available = !product.available
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

// ---------- Seed ----------
const defaultProducts = [
  { name: 'אקמול 500 מ"ג',       category: 'תרופות ללא מרשם', description: 'משכך כאבים ומוריד חום, 20 טבליות',         icon: '💊', available: true },
  { name: 'נורופן 200 מ"ג',       category: 'תרופות ללא מרשם', description: 'נוגד דלקת ומשכך כאבים, 20 טבליות',       icon: '💊', available: true },
  { name: 'אופטלגין טיפות',       category: 'תרופות ללא מרשם', description: 'טיפות למבוגרים, 20 מ"ל',                  icon: '💧', available: true },
  { name: 'דקסמול קידס',          category: 'תרופות ללא מרשם', description: 'סירופ להורדת חום לילדים, 100 מ"ל',        icon: '🍼', available: true },
  { name: 'סטופר שלשולים',        category: 'תרופות ללא מרשם', description: 'קפסולות נגד שלשולים, 8 קפסולות',          icon: '💊', available: true },
  { name: 'רנני אנטאסיד',         category: 'תרופות ללא מרשם', description: 'לטיפול בצרבת, 24 טבליות לעיסה',           icon: '🟢', available: true },
  { name: 'ויטמין C 1000',        category: 'ויטמינים ותוספים', description: 'תוסף ויטמין C, 30 כמוסות',                icon: '🍊', available: true },
  { name: 'ויטמין D3 1000',       category: 'ויטמינים ותוספים', description: 'ויטמין D לחיזוק העצמות, 60 כמוסות',       icon: '☀️', available: true },
  { name: 'אומגה 3',              category: 'ויטמינים ותוספים', description: 'שמן דגים, 90 כמוסות רכות',                icon: '🐟', available: true },
  { name: 'מגנזיום 400',          category: 'ויטמינים ותוספים', description: 'מגנזיום להרפיית שרירים, 60 טבליות',       icon: '✨', available: true },
  { name: 'מולטי ויטמין',         category: 'ויטמינים ותוספים', description: 'מולטי ויטמין יומי, 30 טבליות',            icon: '💪', available: true },
  { name: 'פרוביוטיקה',           category: 'ויטמינים ותוספים', description: 'תוסף פרוביוטי, 30 כמוסות',               icon: '🦠', available: true },
  { name: 'קרם לחות לפנים',       category: 'טיפוח ויופי', description: 'קרם לחות יומי SPF30, 50 מ"ל',                icon: '🧴', available: true },
  { name: 'קרם הגנה SPF50',       category: 'טיפוח ויופי', description: 'הגנה מהשמש לכל המשפחה, 200 מ"ל',             icon: '🌞', available: true },
  { name: 'שמפו טיפולי',          category: 'טיפוח ויופי', description: 'שמפו נגד קשקשים, 250 מ"ל',                   icon: '🧴', available: true },
  { name: 'סבון פנים עדין',       category: 'טיפוח ויופי', description: 'ניקוי עדין לעור רגיש, 150 מ"ל',              icon: '🫧', available: true },
  { name: 'מד חום דיגיטלי',       category: 'ציוד רפואי', description: 'מד חום מהיר ומדויק',                           icon: '🌡️', available: true },
  { name: 'מד לחץ דם',            category: 'ציוד רפואי', description: 'מד לחץ דם אוטומטי לזרוע',                     icon: '❤️', available: true },
  { name: 'ערכת עזרה ראשונה',     category: 'ציוד רפואי', description: 'ערכה מלאה לבית, 50 פריטים',                    icon: '🩹', available: true },
  { name: 'פלסטרים מגוון',        category: 'ציוד רפואי', description: 'פלסטרים בגדלים שונים, 40 יחידות',             icon: '🩹', available: true },
  { name: 'טיטולים מידה 3',       category: 'תינוקות וילדים', description: 'חיתולים לתינוקות 4-9 ק"ג, 50 יחידות',     icon: '👶', available: true },
  { name: 'מגבונים לתינוק',       category: 'תינוקות וילדים', description: 'מגבונים לחים עדינים, 72 יחידות',           icon: '🧻', available: true },
  { name: 'שמן תינוקות',          category: 'תינוקות וילדים', description: 'שמן עיסוי לתינוק, 200 מ"ל',               icon: '🍼', available: true },
  { name: 'ג\'ל חיטוי ידיים',     category: 'היגיינה', description: 'ג\'ל אלכוהולי 70%, 250 מ"ל',                     icon: '🧼', available: true },
  { name: 'מסכות פנים',           category: 'היגיינה', description: 'מסכות חד פעמיות, 50 יחידות',                      icon: '😷', available: true },
  { name: 'משחת שיניים',          category: 'היגיינה', description: 'משחת שיניים עם פלואוריד, 100 מ"ל',                icon: '🦷', available: true },
]

async function seed() {
  const count = await Product.countDocuments()
  if (count === 0) {
    await Product.insertMany(defaultProducts)
    console.log('Seeded', defaultProducts.length, 'products')
  }
}

// ---------- Start ----------
const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  seed()
})
