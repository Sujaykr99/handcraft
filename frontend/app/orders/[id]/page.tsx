'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { apiRequest } from '../../../lib/api'
import { useApp } from '../../../context/AppContext'

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

export default function OrderConfirmation() {
  const { id } = useParams()
  const { darkMode } = useApp()
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const sideBg = dm ? '#211c16' : C.surfaceLow

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem('token') || ''
        const data = await apiRequest(`/api/orders/${id}`, 'GET', undefined as any, token)
        setOrder(data)
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (id) fetchOrder()
  }, [id])

  if (loading) return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="skeleton" style={{ width: '400px', height: '300px' }} />
    </div>
  )

  if (!order) return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: muted }}>Order not found</p>
    </div>
  )

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
      <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>

        {/* Success icon */}
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(90,122,74,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem', fontSize: '2.5rem' }}>
          ✓
        </div>

        <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.75rem' }}>
          Order Confirmed
        </p>
        <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.75rem', fontWeight: 400, color: text, marginBottom: '0.75rem' }}>
          Thank you!
        </h1>
        <p style={{ fontFamily: C.sans, fontSize: '0.9rem', color: muted, marginBottom: '2.5rem', lineHeight: 1.7 }}>
          Your order has been placed. The artisan will begin crafting your piece and ship it directly to you.
        </p>

        {/* Order details */}
        <div style={{ background: cardBg, borderRadius: '1.25rem', padding: '2rem', boxShadow: '0 8px 40px rgba(30,27,23,0.07)', marginBottom: '1.5rem', textAlign: 'left' }}>
          <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 400, color: text, marginBottom: '1.25rem' }}>
            Order Details
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Order ID', value: `#${order._id.slice(-8).toUpperCase()}` },
              { label: 'Status', value: order.status.charAt(0).toUpperCase() + order.status.slice(1) },
              { label: 'Artisan', value: order.seller?.name || 'Handmade Artisan' },
              { label: 'Total', value: `₹${order.totalAmount}` },
            ].map(item => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: C.sans, fontSize: '0.85rem' }}>
                <span style={{ color: muted }}>{item.label}</span>
                <span style={{ color: item.label === 'Total' ? C.primary : text, fontWeight: item.label === 'Total' ? 700 : 500 }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(30,27,23,0.08)', paddingTop: '1.25rem' }}>
            <p style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Items</p>
            {order.items?.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: C.sans, fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                <span style={{ color: text }}>{item.title} ×{item.quantity}</span>
                <span style={{ color: muted }}>₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(30,27,23,0.08)', paddingTop: '1.25rem', marginTop: '0.75rem' }}>
            <p style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Shipping to</p>
            <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: text }}>
              {order.shippingAddress?.street}, {order.shippingAddress?.city}, {order.shippingAddress?.state} — {order.shippingAddress?.pincode}
            </p>
          </div>
        </div>

        {/* Artisan note */}
        <div style={{ background: sideBg, borderRadius: '1rem', padding: '1.5rem', marginBottom: '2rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', textAlign: 'left' }}>
          <span style={{ fontSize: '1.25rem' }}>🤝</span>
          <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted, lineHeight: 1.65 }}>
            Your payment has gone directly to <strong style={{ color: text }}>{order.seller?.name || 'the artisan'}</strong>. No platform cut. Thank you for supporting handmade craft.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/products" style={{
            fontFamily: C.sans, fontSize: '0.875rem', fontWeight: 600,
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
            color: 'white', borderRadius: '9999px', padding: '0.875rem 2rem',
            display: 'inline-block'
          }}>
            Continue Shopping
          </Link>
          <Link href="/" style={{
            fontFamily: C.sans, fontSize: '0.875rem', fontWeight: 500,
            border: `1.5px solid ${C.primary}`, color: C.primary,
            borderRadius: '9999px', padding: '0.875rem 2rem',
            display: 'inline-block', background: 'transparent'
          }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}