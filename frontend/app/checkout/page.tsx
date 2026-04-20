'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../lib/api'
import Link from 'next/link'

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

export default function Checkout() {
  const router = useRouter()
  const { cart, cartTotal, clearCart, darkMode, showToast, user } = useApp()
  const [loading, setLoading] = useState(false)
  const [address, setAddress] = useState({
    street: '', city: '', state: '', pincode: ''
  })

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const inputBg = dm ? '#211c16' : C.surfaceDim
  const sideBg = dm ? '#211c16' : C.surfaceLow

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (cart.length === 0) { router.push('/cart'); return }
  }, [user, cart])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress({ ...address, [e.target.name]: e.target.value })
  }

  const handleOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      showToast('Please fill in all address fields', 'error')
      return
    }
    setLoading(true)
    try {
      const token = localStorage.getItem('token') || ''
      const items = cart.map((item: any) => ({
        productId: item._id,
        quantity: item.quantity
      }))
      const order = await apiRequest('/api/orders', 'POST', {
        items,
        shippingAddress: address
      } as any, token)
      showToast('Order placed successfully!')
      localStorage.removeItem('cart')
      window.dispatchEvent(new Event('cartUpdated'))
      router.push(`/orders/${order._id}`)
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', padding: '6rem 5rem 4rem' }}>
      <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.5rem' }}>
        Final Step
      </p>
      <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.75rem', fontWeight: 400, color: text, marginBottom: '3rem' }}>
        Complete Your Order
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>

        {/* Address form */}
        <div style={{ background: cardBg, borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 8px 40px rgba(30,27,23,0.07)' }}>
          <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 400, color: text, marginBottom: '2rem' }}>
            Shipping Address
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Street Address', name: 'street', placeholder: '123 MG Road, Apartment 4B' },
              { label: 'City', name: 'city', placeholder: 'Delhi' },
              { label: 'State', name: 'state', placeholder: 'Delhi' },
              { label: 'Pincode', name: 'pincode', placeholder: '110001' },
            ].map(field => (
              <div key={field.name}>
                <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>
                  {field.label}
                </label>
                <input
                  name={field.name}
                  value={(address as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none' }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div style={{ background: sideBg, borderRadius: '1.25rem', padding: '2rem', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.4rem', fontWeight: 400, color: text, marginBottom: '1.5rem' }}>
              Order Summary
            </h2>
            {cart.map((item: any) => (
              <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: C.sans, fontSize: '0.82rem', color: muted, marginBottom: '0.6rem' }}>
                <span>{item.title} ×{item.quantity}</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div style={{ borderTop: '1px solid rgba(30,27,23,0.08)', marginTop: '1rem', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontFamily: C.sans, fontWeight: 700, fontSize: '1.1rem', color: text }}>
              <span>Total</span>
              <span style={{ color: C.primary }}>₹{cartTotal}</span>
            </div>
          </div>

          {/* Direct artisan badge */}
          <div style={{ background: 'rgba(159,64,45,0.06)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.25rem' }}>🤝</span>
            <div>
              <p style={{ fontFamily: C.sans, fontSize: '0.82rem', fontWeight: 600, color: text, marginBottom: '0.2rem' }}>Direct from artisan</p>
              <p style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted }}>Your payment goes directly to the maker — zero platform commission</p>
            </div>
          </div>

          <button
            onClick={handleOrder}
            disabled={loading}
            style={{
              width: '100%', padding: '1.1rem', borderRadius: '9999px', border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: C.sans, fontSize: '0.95rem', fontWeight: 700,
              background: loading ? C.surfaceDim : `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
              color: loading ? muted : 'white',
              transition: 'opacity 0.2s',
              opacity: loading ? 0.7 : 1
            }}>
            {loading ? 'Placing Order...' : `Place Order — ₹${cartTotal}`}
          </button>

          <Link href="/cart" style={{ display: 'block', textAlign: 'center', fontFamily: C.sans, fontSize: '0.82rem', color: muted, marginTop: '0.875rem' }}>
            ← Back to Cart
          </Link>
        </div>
      </div>
    </div>
  )
}