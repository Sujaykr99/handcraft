'use client'
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

interface CartItem { _id: string; title: string; price: number; image: string; category: string; quantity: number; seller?: any }
interface Toast { id: number; message: string; type: 'success'|'error'|'info' }
interface Ctx {
  cart: CartItem[]; addToCart: (p: any, qty?: number) => void; removeFromCart: (id: string) => void; clearCart: () => void
  cartCount: number; cartTotal: number
  user: any; setUser: (u: any) => void
  wishlist: string[]; toggleWishlist: (id: string) => void
  toasts: Toast[]; showToast: (msg: string, type?: 'success'|'error'|'info') => void
  darkMode: boolean; toggleDarkMode: () => void
}
const AppContext = createContext<Ctx>({} as Ctx)

export function AppProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [user, setUserState] = useState<any>(null)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [toasts, setToasts] = useState<Toast[]>([])
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const c = localStorage.getItem('cart'); if (c) setCart(JSON.parse(c))
    const u = localStorage.getItem('user'); if (u) setUserState(JSON.parse(u))
    const w = localStorage.getItem('wishlist'); if (w) setWishlist(JSON.parse(w))
    const d = localStorage.getItem('darkMode'); if (d) setDarkMode(JSON.parse(d))
  }, [])

  const showToast = useCallback((message: string, type: 'success'|'error'|'info' = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200)
  }, [])

  const addToCart = useCallback((product: any, qty = 1) => {
    setCart(prev => {
      const exists = prev.find(i => i._id === product._id)
      const updated = exists
        ? prev.map(i => i._id === product._id ? { ...i, quantity: i.quantity + qty } : i)
        : [...prev, { ...product, quantity: qty }]
      localStorage.setItem('cart', JSON.stringify(updated))
      return updated
    })
    showToast(`${product.title} added to cart`)
  }, [showToast])

  const removeFromCart = useCallback((id: string) => {
    setCart(prev => { const u = prev.filter(i => i._id !== id); localStorage.setItem('cart', JSON.stringify(u)); return u })
    showToast('Removed from cart', 'info')
  }, [showToast])
  const clearCart = () => {
  setCart([])
  localStorage.removeItem('cart')
}

  const setUser = (u: any) => { setUserState(u); u ? localStorage.setItem('user', JSON.stringify(u)) : localStorage.removeItem('user') }

  const toggleWishlist = useCallback((id: string) => {
    setWishlist(prev => {
      const u = prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
      localStorage.setItem('wishlist', JSON.stringify(u))
      showToast(prev.includes(id) ? 'Removed from wishlist' : 'Saved to wishlist', 'info')
      return u
    })
  }, [showToast])

  const toggleDarkMode = () => setDarkMode(prev => { localStorage.setItem('darkMode', JSON.stringify(!prev)); return !prev })

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)
  const cartTotal = cart.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <AppContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, cartCount, cartTotal, user, setUser, wishlist, toggleWishlist, toasts, showToast, darkMode, toggleDarkMode }}>
      {children}
      <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '0.9rem 1.25rem', borderRadius: '10px',
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '0.82rem', fontWeight: 500,
            color: '#fff8f1', minWidth: '220px', animation: 'slideInRight 0.3s ease',
            background: t.type === 'success' ? '#5a7a4a' : t.type === 'error' ? '#9f402d' : '#7a6a5a',
            boxShadow: '0 8px 32px rgba(30,27,23,0.18)'
          }}>
            {t.type === 'success' ? '✓ ' : t.type === 'error' ? '✕ ' : 'ℹ '}{t.message}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  )
}
export const useApp = () => useContext(AppContext)