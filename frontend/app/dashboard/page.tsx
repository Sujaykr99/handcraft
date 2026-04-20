'use client'
import { useState, useEffect, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../lib/api'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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

const categories = ['Pottery','Jewellery','Textiles','Paintings','Woodwork','Candles','Baskets','Leather']
const emptyForm = { title: '', description: '', price: '', category: 'Pottery', stock: '', image: '' }

export default function Dashboard() {
  const { user, showToast, darkMode } = useApp()
  const router = useRouter()
  const [products, setProducts] = useState<any[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState<string|null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState('')
  const [activeTab, setActiveTab] = useState<'products'|'orders'>('products')
  const fileRef = useRef<HTMLInputElement>(null)

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const sideBg = dm ? '#211c16' : C.surfaceLow
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const inputBg = dm ? '#1a1410' : C.surfaceDim

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (user.role !== 'seller') { router.push('/'); return }
    fetchProducts()
    fetchOrders()
  }, [user])

  const getToken = () => localStorage.getItem('token') || ''

  const fetchProducts = async () => {
    try {
      const data = await apiRequest('/api/products/seller/my', 'GET', undefined as any, getToken())
      setProducts(data)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const fetchOrders = async () => {
    try {
      const data = await apiRequest('/api/orders/seller', 'GET', undefined as any, getToken())
      setOrders(data)
    } catch (e) { console.error(e) }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('image', file)
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products/upload-image`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${getToken()}` },
        body: fd
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message)
      setForm(prev => ({ ...prev, image: data.url }))
      setPreview(data.url)
      showToast('Photo uploaded!')
    } catch (err: any) {
      showToast(err.message, 'error')
    } finally { setUploading(false) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
      if (editId) {
        await apiRequest(`/api/products/${editId}`, 'PUT', payload as any, getToken())
        showToast('Product updated')
      } else {
        await apiRequest('/api/products', 'POST', payload as any, getToken())
        showToast('Product listed!')
      }
      setForm(emptyForm); setPreview(''); setEditId(null); setShowForm(false)
      fetchProducts()
    } catch (err: any) { showToast(err.message, 'error') }
    finally { setSubmitting(false) }
  }

  const handleEdit = (product: any) => {
    setForm({ title: product.title, description: product.description, price: String(product.price), category: product.category, stock: String(product.stock), image: product.image || '' })
    setPreview(product.image || '')
    setEditId(product._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this product?')) return
    try {
      await apiRequest(`/api/products/${id}`, 'DELETE', undefined as any, getToken())
      showToast('Product removed', 'info')
      fetchProducts()
    } catch (err: any) { showToast(err.message, 'error') }
  }

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await apiRequest(`/api/orders/${orderId}/status`, 'PUT', { status } as any, getToken())
      showToast('Order updated')
      fetchOrders()
    } catch (err: any) { showToast(err.message, 'error') }
  }

  const totalRevenue = orders
    .filter(o => o.status === 'paid' || o.status === 'delivered')
    .reduce((s, o) => s + o.totalAmount, 0)

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex' }}>

      {/* Sidebar */}
      <aside style={{ width: '220px', flexShrink: 0, background: sideBg, borderRight: '1px solid rgba(30,27,23,0.08)', padding: '2.5rem 1.5rem', position: 'sticky', top: '80px', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
        <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '2rem' }}>
          Artisan Studio
        </p>
        {[{ key: 'products', label: 'My Products' }, { key: 'orders', label: 'Incoming Orders' }].map(tab => (
          <div key={tab.key} onClick={() => setActiveTab(tab.key as any)} style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', cursor: 'pointer', marginBottom: '0.4rem', background: activeTab === tab.key ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : 'transparent', transition: 'background 0.2s' }}>
            <span style={{ fontFamily: C.sans, fontSize: '0.85rem', fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? 'white' : muted }}>
              {tab.label}
            </span>
          </div>
        ))}
        <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid rgba(30,27,23,0.08)' }}>
          <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.8rem', color: muted }}>← View Store</Link>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, padding: '2.5rem 3rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.4rem' }}>Welcome back</p>
            <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 400, color: text }}>
              {user?.name?.split(' ')[0]}'s Studio
            </h1>
          </div>
          {activeTab === 'products' && (
            <button onClick={() => { setShowForm(!showForm); setForm(emptyForm); setPreview(''); setEditId(null) }}
              style={{ fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 600, background: showForm ? C.surfaceHigh : `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: showForm ? muted : 'white', border: 'none', borderRadius: '9999px', padding: '0.875rem 1.75rem', cursor: 'pointer' }}>
              {showForm ? '✕ Cancel' : '+ List New Product'}
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '2.5rem' }}>
          {[
            { label: 'Total Products', value: String(products.length) },
            { label: 'Total Orders', value: String(orders.length) },
            { label: 'Revenue', value: `₹${totalRevenue.toLocaleString()}` },
          ].map(stat => (
            <div key={stat.label} style={{ background: cardBg, borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(30,27,23,0.05)' }}>
              <p style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted, marginBottom: '0.5rem' }}>{stat.label}</p>
              <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.75rem', fontWeight: 400, color: text }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Product Form */}
        {showForm && activeTab === 'products' && (
          <div style={{ background: cardBg, borderRadius: '1.25rem', padding: '2.5rem', marginBottom: '2.5rem', boxShadow: '0 8px 40px rgba(30,27,23,0.08)' }}>
            <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.6rem', fontWeight: 400, color: text, marginBottom: '2rem' }}>
              {editId ? 'Edit Product' : 'List New Product'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>

                {/* Image upload */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.75rem' }}>Product Photo</label>
                  <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                    <div onClick={() => fileRef.current?.click()} style={{ width: '160px', height: '160px', borderRadius: '1rem', overflow: 'hidden', cursor: 'pointer', border: '2px dashed rgba(159,64,45,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: inputBg, flexShrink: 0, position: 'relative' }}>
                      {preview ? (
                        <img src={preview} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</p>
                          <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted }}>Click to upload</p>
                        </div>
                      )}
                      {uploading && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,248,241,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <p style={{ fontFamily: C.sans, fontSize: '0.75rem', color: C.primary }}>Uploading...</p>
                        </div>
                      )}
                    </div>
                    <div>
                      <p style={{ fontFamily: C.sans, fontSize: '0.78rem', color: muted, lineHeight: 1.7, marginBottom: '0.75rem' }}>Upload a high-quality photo. Max 5MB. JPG or PNG.</p>
                      <button type="button" onClick={() => fileRef.current?.click()} style={{ fontFamily: C.sans, fontSize: '0.8rem', fontWeight: 500, padding: '0.6rem 1.25rem', borderRadius: '9999px', border: `1.5px solid ${C.primary}`, background: 'transparent', color: C.primary, cursor: 'pointer' }}>
                        {preview ? 'Change Photo' : 'Choose Photo'}
                      </button>
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                    </div>
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>Product Title *</label>
                  <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Handthrown Clay Mug" required
                    style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none' }} />
                </div>

                {/* Category */}
                <div>
                  <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>Category *</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none', cursor: 'pointer' }}>
                    {categories.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>Price (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="450" required min="1"
                    style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none' }} />
                </div>

                {/* Stock */}
                <div>
                  <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>Stock *</label>
                  <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="10" required min="0"
                    style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none' }} />
                </div>

                {/* Description */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>Description *</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Tell the story of your craft..." required rows={4}
                    style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none', resize: 'vertical' }} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                <button type="submit" disabled={submitting || uploading}
                  style={{ padding: '0.9rem 2.5rem', borderRadius: '9999px', border: 'none', cursor: submitting ? 'not-allowed' : 'pointer', fontFamily: C.sans, fontSize: '0.9rem', fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: 'white', opacity: submitting ? 0.7 : 1 }}>
                  {submitting ? 'Saving...' : editId ? 'Save Changes' : 'Publish Listing'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); setPreview(''); setEditId(null) }}
                  style={{ padding: '0.9rem 1.75rem', borderRadius: '9999px', border: '1.5px solid rgba(30,27,23,0.15)', background: 'transparent', fontFamily: C.sans, fontSize: '0.9rem', color: muted, cursor: 'pointer' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Products grid */}
        {activeTab === 'products' && (
          <div>
            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
                {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: '320px' }} />)}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '6rem 0', background: cardBg, borderRadius: '1.25rem' }}>
                <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: muted, marginBottom: '1rem' }}>No products listed yet</p>
                <button onClick={() => setShowForm(true)} style={{ fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: 'white', border: 'none', borderRadius: '9999px', padding: '0.875rem 2rem', cursor: 'pointer' }}>
                  + List Your First Product
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                {products.map((product: any) => (
                  <div key={product._id} style={{ background: cardBg, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,27,23,0.06)' }}>
                    <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                      <img src={product.image || 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=500&q=80'} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '10px', left: '10px', background: product.stock > 0 ? 'rgba(90,122,74,0.9)' : 'rgba(159,64,45,0.9)', borderRadius: '9999px', padding: '0.25rem 0.75rem' }}>
                        <span style={{ fontFamily: C.sans, fontSize: '0.68rem', fontWeight: 600, color: 'white' }}>
                          {product.stock > 0 ? `${product.stock} in stock` : 'Sold out'}
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: '1.1rem 1.25rem' }}>
                      <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.3rem' }}>{product.category}</p>
                      <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.05rem', fontWeight: 400, color: text, marginBottom: '0.4rem', lineHeight: 1.3 }}>{product.title}</h3>
                      <p style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 600, color: text, marginBottom: '1rem' }}>₹{product.price}</p>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button onClick={() => handleEdit(product)} style={{ flex: 1, padding: '0.6rem', borderRadius: '9999px', border: `1.5px solid ${C.primary}`, background: 'transparent', fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: C.primary, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(product._id)} style={{ flex: 1, padding: '0.6rem', borderRadius: '9999px', border: '1.5px solid rgba(30,27,23,0.15)', background: 'transparent', fontFamily: C.sans, fontSize: '0.78rem', color: muted, cursor: 'pointer' }}>Remove</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders list */}
        {activeTab === 'orders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '6rem 0', background: cardBg, borderRadius: '1.25rem' }}>
                <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: muted }}>No orders yet</p>
                <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: muted, marginTop: '0.5rem' }}>Orders from buyers will appear here</p>
              </div>
            ) : orders.map((order: any) => (
              <div key={order._id} style={{ background: cardBg, borderRadius: '1rem', padding: '1.5rem', boxShadow: '0 4px 20px rgba(30,27,23,0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: muted, marginBottom: '0.3rem' }}>Order ID</p>
                    <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: muted }}>{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 700, color: text }}>₹{order.totalAmount}</span>
                    <select value={order.status} onChange={e => updateOrderStatus(order._id, e.target.value)}
                      style={{ fontFamily: C.sans, fontSize: '0.78rem', padding: '0.4rem 0.75rem', borderRadius: '9999px', border: `1.5px solid ${C.primary}`, background: 'transparent', color: C.primary, cursor: 'pointer', outline: 'none' }}>
                      {['pending','paid','shipped','delivered','cancelled'].map(s => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div>
                    <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.2rem' }}>Buyer</p>
                    <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: text, fontWeight: 500 }}>{order.buyer?.name || 'Customer'}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.2rem' }}>Ship to</p>
                    <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: text }}>{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.2rem' }}>Items</p>
                    {order.items?.map((item: any, i: number) => (
                      <p key={i} style={{ fontFamily: C.sans, fontSize: '0.85rem', color: text }}>{item.title} ×{item.quantity}</p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}