import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import useScrollTop from './hooks/useScrollTop'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import Home from './pages/Home'
import Products from './pages/Products'
import About from './pages/About'
import Contact from './pages/Contact'
import Admin from './pages/Admin'

export default function App() {
  const location = useLocation()
  useScrollTop()

  return (
    <CartProvider>
      <Navbar />
      <main>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/manage-x7k2" element={<Admin />} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <CartDrawer />
      <a
        href="https://wa.me/972542223923"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 32 32" width="32" height="32" fill="#fff">
          <path d="M16.004 0C7.165 0 .002 7.163.002 16c0 2.825.737 5.576 2.137 8.004L.057 32l8.19-2.147A15.908 15.908 0 0016.004 32C24.837 32 32 24.837 32 16S24.837 0 16.004 0zm0 29.32a13.28 13.28 0 01-7.205-2.117l-.517-.307-5.357 1.404 1.43-5.222-.337-.535A13.25 13.25 0 012.68 16c0-7.348 5.98-13.32 13.324-13.32S29.32 8.652 29.32 16s-5.972 13.32-13.316 13.32zm7.304-9.975c-.4-.2-2.367-1.168-2.734-1.301-.367-.134-.634-.2-.9.2-.268.4-1.034 1.301-1.268 1.568-.234.268-.467.3-.867.1-.4-.2-1.69-.623-3.22-1.987-1.19-1.062-1.993-2.374-2.227-2.774-.234-.4-.025-.616.176-.815.18-.18.4-.468.6-.7.2-.234.267-.4.4-.668.134-.268.067-.5-.033-.7-.1-.2-.9-2.168-1.234-2.968-.325-.78-.655-.674-.9-.687l-.767-.013c-.267 0-.7.1-1.067.5-.367.4-1.4 1.368-1.4 3.336 0 1.968 1.434 3.87 1.634 4.137.2.268 2.823 4.31 6.84 6.043.955.413 1.7.659 2.282.844.959.305 1.832.262 2.522.159.77-.115 2.367-.968 2.7-1.902.334-.935.334-1.735.234-1.902-.1-.168-.367-.268-.767-.468z"/>
        </svg>
      </a>
    </CartProvider>
  )
}
