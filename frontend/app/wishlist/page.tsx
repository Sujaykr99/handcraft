'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useApp } from '../../context/AppContext'
import { apiRequest } from '../../lib/api'

const s = {
  serif: { fontFamily: "'Newsreader', Georgia, serif" } as React.CSSProperties,
  sans: { fontFamily: "'Plus Jakarta Sans', sans-serif" } as React.CSSProperties,
  primary: '#9f402d',
}

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart, darkMode } = useApp()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const bg = darkMode ? '#1a1410' : '#fff8f1'
  const cardBg = darkMode ? '#2a2218' : '#ffffff'
  const text = darkMode ? '#fff8f1' : '#1e1b17'
  const muted = darkMode ? '#b5a898' : '#6b6560'

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        const all = await apiRequest('/api/products')
        setProducts(all.filter((p: any) => wishlist.includes(p._id)))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    fetchWishlistItems()
  }, [wishlist])

  return (
    <div style={{ background: bg, minHeight: '100vh', padding: '6rem 5rem 4rem' }}>
      <p style={{ ...s.sans, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: s.primary, marginBottom: '0.5rem' }}>
        Saved Items
      </p>
      <h1 style={{ ...s.serif, fontSize: '2.5rem', fontStyle: 'italic', color: text, fontWeight: 400, marginBottom: '2.5rem' }}>
        Your Wishlist
      </h1>

      {loading ? (
        <p style={{ ...s.sans, color: muted }}>Loading...</p>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <p style={{ ...s.serif, fontSize: '1.5rem', fontStyle: 'italic', color: muted, marginBottom: '1rem' }}>No saved items yet</p>
          <Link href="/products" style={{ ...s.sans, fontSize: '0.875rem', color: s.primary }}>Browse Collection →</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
          {products.map((product: any, i: number) => (
            <div key={product._id} style={{ background: cardBg, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,27,23,0.06)', position: 'relative' }}>
              <button onClick={() => toggleWishlist(product._id)} style={{
                position: 'absolute', top: '10px', right: '10px', zIndex: 2,
                background: 'rgba(255,248,241,0.9)', border: 'none', borderRadius: '50%',
                width: '32px', height: '32px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: '0 2px 8px rgba(30,27,23,0.1)'
              }}>
                <svg width="14" height="14" fill={s.primary} stroke={s.primary} strokeWidth="1.5" viewBox="0 0 24 24">
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                </svg>
              </button>
              <Link href={`/products/${product._id}`}>
                <div style={{ height: '200px', background: ['#e8d5c4','#d4c5b0','#c9b99a','#d4b896'][i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {product.image ? <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" /> : <span style={{ ...s.serif, fontSize: '4rem', fontStyle: 'italic', color: 'rgba(30,27,23,0.12)', fontWeight: 400 }}>{product.category?.[0]}</span>}
                </div>
                <div style={{ padding: '1rem 1.25rem 0.75rem' }}>
                  <p style={{ ...s.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: s.primary, marginBottom: '0.3rem' }}>{product.category}</p>
                  <h3 style={{ ...s.serif, fontSize: '1.05rem', fontStyle: 'italic', color: text, fontWeight: 400, marginBottom: '0.25rem' }}>{product.title}</h3>
                  <p style={{ ...s.sans, fontSize: '0.72rem', color: muted }}>by {product.seller?.name || 'Artisan'}</p>
                  <p style={{ ...s.sans, fontSize: '1rem', fontWeight: 600, color: text, marginTop: '0.6rem' }}>₹{product.price}</p>
                </div>
              </Link>
              <div style={{ padding: '0 1.25rem 1.25rem' }}>
                <button onClick={() => addToCart(product)} className="btn-press" style={{
                  width: '100%', padding: '0.65rem', borderRadius: '9999px',
                  background: `linear-gradient(135deg, ${s.primary}, #e2725b)`,
                  color: 'white', border: 'none', cursor: 'pointer',
                  ...s.sans, fontSize: '0.8rem', fontWeight: 600
                }}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}