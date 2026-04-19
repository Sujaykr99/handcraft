'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { apiRequest } from '../../../lib/api'
import { useApp } from '../../../context/AppContext'
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

const placeholderImgs: Record<string, string> = {
  Pottery: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=800&q=85',
  Textiles: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=800&q=85',
  Jewellery: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=85',
  Paintings: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=85',
  Woodwork: 'https://images.unsplash.com/photo-1481009137526-5a453fdd1f65?w=800&q=85',
  Candles: 'https://images.unsplash.com/photo-1602607144655-c63d4d47f86a?w=800&q=85',
  Baskets: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=85',
  Leather: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=85',
}

export default function ProductDetail() {
  const { id } = useParams()
  const router = useRouter()
  const { addToCart, toggleWishlist, wishlist, darkMode } = useApp()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const sideBg = dm ? '#211c16' : C.surfaceLow

  useEffect(() => {
    const fetch = async () => {
      try { const d = await apiRequest(`/api/products/${id}`); setProduct(d) }
      catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (id) fetch()
  }, [id])

  if (loading) return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="skeleton" style={{ width: '600px', height: '400px' }} />
    </div>
  )

  if (!product) return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: muted }}>Product not found</p>
    </div>
  )

  const imgSrc = product.image || placeholderImgs[product.category] || placeholderImgs.Pottery

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px' }}>

      {/* Breadcrumb */}
      <div style={{ padding: '1.5rem 5rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <Link href="/" style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted }}>Home</Link>
        <span style={{ color: muted, fontSize: '0.75rem' }}>·</span>
        <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.75rem', color: muted }}>Collections</Link>
        <span style={{ color: muted, fontSize: '0.75rem' }}>·</span>
        <span style={{ fontFamily: C.sans, fontSize: '0.75rem', color: text }}>{product.title}</span>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem 5rem 6rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }}>

        {/* Image */}
        <div>
          <div style={{ borderRadius: '1.25rem', overflow: 'hidden', height: '520px', position: 'relative' }}>
            <img src={imgSrc} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <button onClick={() => toggleWishlist(product._id)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'rgba(255,248,241,0.92)', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(30,27,23,0.12)' }}>
              <svg width="18" height="18" fill={wishlist.includes(product._id) ? C.primary : 'none'} stroke={C.primary} strokeWidth="1.5" viewBox="0 0 24 24">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
          {/* Artisan quote below image */}
          <div style={{ background: sideBg, borderRadius: '1rem', padding: '1.5rem 2rem', marginTop: '1.25rem' }}>
            <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1rem', color: text, lineHeight: 1.65, marginBottom: '0.75rem', fontWeight: 400 }}>
              "Each piece I make is a conversation with the earth — a story told through fire and hands."
            </p>
            <p style={{ fontFamily: C.sans, fontSize: '0.72rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: muted }}>
              — {product.seller?.name || 'The Artisan'}
            </p>
          </div>
        </div>

        {/* Info */}
        <div>
          <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.75rem' }}>
            Heritage Series — 01
          </p>
          <h1 style={{ fontFamily: C.serif, fontSize: 'clamp(2rem, 3vw, 3rem)', fontStyle: 'italic', fontWeight: 400, color: text, lineHeight: 1.1, marginBottom: '0.5rem' }}>
            {product.title}
          </h1>
          <p style={{ fontFamily: C.sans, fontSize: '0.78rem', fontStyle: 'italic', color: muted, marginBottom: '1.5rem' }}>
            A story of scorched earth and silk.
          </p>

          <p style={{ fontFamily: C.sans, fontSize: '0.88rem', color: muted, lineHeight: 1.85, marginBottom: '2rem' }}>
            {product.description}
          </p>

          {/* Specs */}
          <div style={{ borderTop: '1px solid rgba(30,27,23,0.08)', borderBottom: '1px solid rgba(30,27,23,0.08)', padding: '1.25rem 0', marginBottom: '2rem' }}>
            {[
              { label: 'Category', value: product.category },
              { label: 'Artisan', value: product.seller?.name || 'Handmade' },
              { label: 'Stock', value: product.stock > 0 ? `${product.stock} available` : 'Sold out' },
            ].map(spec => (
              <div key={spec.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span style={{ fontFamily: C.sans, fontSize: '0.78rem', color: muted }}>{spec.label}</span>
                <span style={{ fontFamily: C.sans, fontSize: '0.78rem', color: text, fontWeight: 500 }}>{spec.value}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '2rem' }}>
            <span style={{ fontFamily: C.sans, fontSize: '2rem', fontWeight: 600, color: text }}>₹{product.price}</span>
            <span style={{ fontFamily: C.sans, fontSize: '0.8rem', color: muted }}>Direct from artisan</span>
          </div>

          {/* Quantity */}
          {product.stock > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <span style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted }}>Quantity</span>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(30,27,23,0.15)', borderRadius: '9999px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.sans, fontSize: '1.1rem', color: text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontFamily: C.sans, fontSize: '0.88rem', fontWeight: 500, color: text, padding: '0 0.75rem' }}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ width: '36px', height: '36px', background: 'none', border: 'none', cursor: 'pointer', fontFamily: C.sans, fontSize: '1.1rem', color: text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <button onClick={() => { addToCart(product, quantity); router.push('/cart') }} disabled={product.stock === 0}
              style={{ padding: '1rem', borderRadius: '9999px', border: 'none', cursor: product.stock > 0 ? 'pointer' : 'not-allowed', fontFamily: C.sans, fontSize: '0.9rem', fontWeight: 600, background: product.stock > 0 ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : C.surfaceDim, color: product.stock > 0 ? 'white' : muted, transition: 'opacity 0.2s' }}>
              {product.stock > 0 ? 'Add to Bag' : 'Sold Out'}
            </button>
            <button onClick={() => addToCart(product, quantity)} disabled={product.stock === 0}
              style={{ padding: '1rem', borderRadius: '9999px', border: `1.5px solid ${C.primary}`, cursor: product.stock > 0 ? 'pointer' : 'not-allowed', fontFamily: C.sans, fontSize: '0.9rem', fontWeight: 500, background: 'transparent', color: C.primary, transition: 'background 0.2s' }}>
              Add to Collection
            </button>
          </div>

          {/* Trust */}
          <div style={{ marginTop: '1.75rem', display: 'flex', gap: '1.5rem' }}>
            {['✦ Sustainable Craft', '✦ Direct to Artisan'].map(badge => (
              <span key={badge} style={{ fontFamily: C.sans, fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: muted }}>{badge}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}