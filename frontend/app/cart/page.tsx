'use client'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'

const C = {
  serif: "'Newsreader', Georgia, serif",
  sans: "'Plus Jakarta Sans', sans-serif",
  primary: '#9f402d',
  primaryLight: '#e2725b',
  surface: '#fff8f1',
  surfaceLow: '#faf2ea',
  surfaceDim: '#ede7df',
  onSurface: '#1e1b17',
  muted: '#6b6560',
}

export default function Cart() {
  const { cart, removeFromCart, cartTotal, darkMode } = useApp()
  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const sideBg = dm ? '#211c16' : C.surfaceLow

  if (cart.length === 0) return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.25rem' }}>
      <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '3.5rem', color: 'rgba(30,27,23,0.15)' }}>∅</p>
      <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2rem', fontWeight: 400, color: text }}>Your collection is empty</h2>
      <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: muted }}>Browse our handmade artifacts and add some to your bag</p>
      <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 500, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: 'white', borderRadius: '9999px', padding: '0.875rem 2.25rem', display: 'inline-block', marginTop: '0.5rem' }}>
        Browse Collection
      </Link>
    </div>
  )

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', padding: '6rem 5rem 4rem' }}>
      <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.5rem' }}>
        Your Selection
      </p>
      <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.75rem', fontWeight: 400, color: text, marginBottom: '3rem' }}>
        The Collection Cart
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2.5rem', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {cart.map(item => (
            <div key={item._id} style={{ background: cardBg, borderRadius: '1rem', padding: '1.5rem', display: 'flex', gap: '1.5rem', boxShadow: '0 4px 20px rgba(30,27,23,0.05)' }}>
              <div style={{ width: '100px', height: '100px', borderRadius: '0.875rem', overflow: 'hidden', flexShrink: 0 }}>
                <img src={item.image || 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=200&q=80'} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.3rem' }}>{item.category}</p>
                <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.15rem', fontWeight: 400, color: text, marginBottom: '0.2rem' }}>{item.title}</h3>
                <p style={{ fontFamily: C.sans, fontSize: '0.73rem', color: muted, marginBottom: '0.75rem' }}>by {item.seller?.name || 'Artisan'}</p>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                  <span style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 600, color: text }}>₹{item.price}</span>
                  <span style={{ fontFamily: C.sans, fontSize: '0.8rem', color: muted }}>× {item.quantity}</span>
                  <span style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 700, color: C.primary }}>₹{item.price * item.quantity}</span>
                </div>
              </div>
              <button onClick={() => removeFromCart(item._id)} style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted, background: 'none', border: 'none', cursor: 'pointer', alignSelf: 'flex-start', padding: 0 }}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <div style={{ background: sideBg, borderRadius: '1rem', padding: '2rem', position: 'sticky', top: '96px' }}>
          <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 400, color: text, marginBottom: '1.5rem' }}>Order Summary</h2>
          {cart.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: C.sans, fontSize: '0.82rem', color: muted, marginBottom: '0.5rem' }}>
              <span>{item.title} ×{item.quantity}</span><span>₹{item.price * item.quantity}</span>
            </div>
          ))}
          <div style={{ borderTop: '1px solid rgba(30,27,23,0.08)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: C.sans, fontWeight: 700, fontSize: '1.1rem', color: text }}>
            <span>Total</span><span style={{ color: C.primary }}>₹{cartTotal}</span>
          </div>
          <div style={{ marginTop: '1rem', padding: '0.875rem', background: 'rgba(159,64,45,0.06)', borderRadius: '0.75rem', fontFamily: C.sans, fontSize: '0.75rem', color: muted, display: 'flex', gap: '0.5rem' }}>
            <span>🤝</span> Payment goes directly to artisan — zero commission
          </div>
          <Link href="/checkout" style={{ display: 'block', textAlign: 'center', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: 'white', padding: '1rem', borderRadius: '9999px', fontFamily: C.sans, fontWeight: 600, fontSize: '0.9rem', marginTop: '1.25rem' }}>
            Proceed to Checkout →
          </Link>
          <Link href="/products" style={{ display: 'block', textAlign: 'center', fontFamily: C.sans, fontSize: '0.82rem', color: muted, marginTop: '0.875rem' }}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}