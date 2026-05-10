'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../lib/api'

const C = {
  serif: "'Newsreader', Georgia, serif",
  sans: "'Plus Jakarta Sans', sans-serif",
  primary: '#9f402d',
  primaryLight: '#e2725b',
  surface: '#fff8f1',
  surfaceLow: '#faf2ea',
  surfaceDim: '#ede7df',
  surfaceHigh: '#e8e1da',
  onSurface: '#1e1b17',
  muted: '#6b6560',
}

const statusColors: Record<string, string> = {
  pending: '#b5860d',
  paid: '#5a7a4a',
  shipped: '#2471a3',
  delivered: '#5a7a4a',
  cancelled: '#9f402d',
}

export default function BuyerDashboard() {
  const { user, setUser, wishlist, cart, cartTotal, darkMode } = useApp()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'orders'|'wishlist'|'profile'>('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [wishlistProducts, setWishlistProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const sideBg = dm ? '#211c16' : C.surfaceLow
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const border = 'rgba(30,27,23,0.08)'

  useEffect(() => {
  const stored = localStorage.getItem('user')
  if (!stored) { router.push('/login'); return }
  const storedUser = JSON.parse(stored)
  if (storedUser.role === 'seller') { router.push('/dashboard'); return }
  fetchOrders()
  fetchWishlistProducts()
}, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token') || ''
      const data = await apiRequest('/api/orders/my', 'GET', undefined as any, token)
      setOrders(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchWishlistProducts = async () => {
    try {
      const all = await apiRequest('/api/products')
      setWishlistProducts(all.filter((p: any) => wishlist.includes(p._id)))
    } catch (e) { console.error(e) }
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    router.push('/')
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex' }}>

      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: sideBg, borderRight: `1px solid ${border}`, padding: '2.5rem 1.5rem', position: 'sticky', top: '80px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '2rem' }}>
          My Account
        </p>

        {[
          { key: 'orders', label: 'My Orders', icon: '📦' },
          { key: 'wishlist', label: 'Wishlist', icon: '♡' },
          { key: 'profile', label: 'Profile', icon: '◯' },
        ].map(tab => (
          <div key={tab.key} onClick={() => setActiveTab(tab.key as any)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', marginBottom: '0.4rem', background: activeTab === tab.key ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : 'transparent', transition: 'background 0.2s' }}>
            <span style={{ fontSize: '0.9rem' }}>{tab.icon}</span>
            <span style={{ fontFamily: C.sans, fontSize: '0.85rem', fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? 'white' : muted }}>
              {tab.label}
            </span>
          </div>
        ))}

        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: `1px solid ${border}`, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.8rem', color: muted }}>
            Browse Products →
          </Link>
          <Link href="/cart" style={{ fontFamily: C.sans, fontSize: '0.8rem', color: muted }}>
            Cart ({cart.length} items)
          </Link>
          <button onClick={logout} style={{ fontFamily: C.sans, fontSize: '0.8rem', color: C.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left' }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, padding: '2.5rem 3rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2.5rem' }}>
          <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.4rem' }}>
            Welcome back
          </p>
          <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 400, color: text }}>
            {user?.name?.split(' ')[0]}'s Account
          </h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Orders', value: String(orders.length) },
            { label: 'Wishlist Items', value: String(wishlist.length) },
            { label: 'Cart Total', value: `₹${cartTotal}` },
          ].map(stat => (
            <div key={stat.label} style={{ background: cardBg, borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(30,27,23,0.05)' }}>
              <p style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted, marginBottom: '0.5rem' }}>{stat.label}</p>
              <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.75rem', fontWeight: 400, color: text }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 400, color: text, marginBottom: '1.5rem' }}>
              Order History
            </h2>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[...Array(3)].map((_, i) => <div key={i} className="skeleton" style={{ height: '100px' }} />)}
              </div>
            ) : orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', background: cardBg, borderRadius: '1.25rem' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</p>
                <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: muted, marginBottom: '1rem' }}>
                  No orders yet
                </p>
                <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: 'white', borderRadius: '9999px', padding: '0.875rem 2rem', display: 'inline-block' }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {orders.map((order: any) => (
                  <div key={order._id} style={{ background: cardBg, borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(30,27,23,0.05)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: '0.3rem' }}>Order</p>
                        <p style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: text, fontWeight: 600 }}>#{order._id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontFamily: C.sans, fontSize: '0.75rem', fontWeight: 600, padding: '0.3rem 0.875rem', borderRadius: '9999px', background: `${statusColors[order.status]}20`, color: statusColors[order.status] }}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                        <span style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 700, color: text }}>₹{order.totalAmount}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                      <div>
                        <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.2rem' }}>Artisan</p>
                        <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: text, fontWeight: 500 }}>{order.seller?.name || 'Artisan'}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.2rem' }}>Items</p>
                        <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: text }}>{order.items?.map((i: any) => i.title).join(', ')}</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.2rem' }}>Ship to</p>
                        <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: text }}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                      </div>
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      <Link href={`/orders/${order._id}`} style={{ fontFamily: C.sans, fontSize: '0.78rem', color: C.primary, fontWeight: 500 }}>
                        View Details →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div>
            <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 400, color: text, marginBottom: '1.5rem' }}>
              Saved Items
            </h2>
            {wishlistProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '5rem 0', background: cardBg, borderRadius: '1.25rem' }}>
                <p style={{ fontSize: '3rem', marginBottom: '1rem' }}>♡</p>
                <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: muted, marginBottom: '1rem' }}>
                  No saved items yet
                </p>
                <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: 'white', borderRadius: '9999px', padding: '0.875rem 2rem', display: 'inline-block' }}>
                  Browse Collection
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                {wishlistProducts.map((product: any, i: number) => (
                  <Link key={product._id} href={`/products/${product._id}`} style={{ background: cardBg, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,27,23,0.06)', display: 'block', transition: 'transform 0.3s ease' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                  >
                    <div style={{ height: '160px', overflow: 'hidden', background: ['#e8d5c4','#d4c5b0','#c9b99a','#d4b896'][i % 4] }}>
                      <img src={product.image || 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&q=80'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.3rem' }}>{product.category}</p>
                      <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1rem', fontWeight: 400, color: text, marginBottom: '0.4rem' }}>{product.title}</h3>
                      <p style={{ fontFamily: C.sans, fontSize: '0.9rem', fontWeight: 600, color: text }}>₹{product.price}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div>
            <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 400, color: text, marginBottom: '1.5rem' }}>
              My Profile
            </h2>
            <div style={{ background: cardBg, borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 8px 40px rgba(30,27,23,0.07)', maxWidth: '480px' }}>

              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.75rem', color: 'white', fontWeight: 400 }}>
                    {user?.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div>
                  <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.25rem', color: text, fontWeight: 400 }}>{user?.name}</h3>
                  <p style={{ fontFamily: C.sans, fontSize: '0.78rem', color: muted }}>{user?.email}</p>
                  <span style={{ fontFamily: C.sans, fontSize: '0.7rem', fontWeight: 600, padding: '0.2rem 0.75rem', borderRadius: '9999px', background: 'rgba(159,64,45,0.1)', color: C.primary, marginTop: '0.4rem', display: 'inline-block' }}>
                    Buyer
                  </span>
                </div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { label: 'Full Name', value: user?.name },
                  { label: 'Email', value: user?.email },
                  { label: 'Account Type', value: 'Buyer — Direct from Artisan' },
                  { label: 'Member Since', value: new Date().getFullYear().toString() },
                ].map(item => (
                  <div key={item.label} style={{ borderBottom: `1px solid ${border}`, paddingBottom: '0.875rem' }}>
                    <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</p>
                    <p style={{ fontFamily: C.sans, fontSize: '0.9rem', color: text, fontWeight: 500 }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <button onClick={logout} style={{ marginTop: '2rem', width: '100%', padding: '0.875rem', borderRadius: '9999px', border: `1.5px solid rgba(159,64,45,0.3)`, background: 'transparent', fontFamily: C.sans, fontSize: '0.875rem', color: C.primary, cursor: 'pointer', fontWeight: 500 }}>
                Sign Out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}