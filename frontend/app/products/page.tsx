'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { apiRequest } from '../../lib/api'
import { useApp } from '../../context/AppContext'

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

const categories = ['All','Pottery','Jewellery','Textiles','Paintings','Woodwork','Candles','Baskets','Leather']

const placeholderImgs: Record<string, string> = {
  Pottery: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=500&q=80',
  Textiles: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=500&q=80',
  Jewellery: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&q=80',
  Paintings: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=500&q=80',
  Woodwork: 'https://images.unsplash.com/photo-1481009137526-5a453fdd1f65?w=500&q=80',
  Candles: 'https://images.unsplash.com/photo-1602607144655-c63d4d47f86a?w=500&q=80',
  Baskets: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=500&q=80',
  Leather: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&q=80',
}

function ProductsContent() {
  const { addToCart, wishlist, toggleWishlist, darkMode } = useApp()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [category, setCategory] = useState(searchParams.get('category') || '')
  const [sortBy, setSortBy] = useState('newest')
  const [priceMax, setPriceMax] = useState(10000)

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const sideBg = dm ? '#211c16' : C.surfaceLow
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted

  useEffect(() => { fetchProducts() }, [search, category, sortBy])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let endpoint = '/api/products?'
      if (search) endpoint += `search=${search}&`
      if (category && category !== 'All') endpoint += `category=${category}`
      const data = await apiRequest(endpoint)
      let sorted = [...data]
      if (sortBy === 'price-low') sorted.sort((a: any, b: any) => a.price - b.price)
      if (sortBy === 'price-high') sorted.sort((a: any, b: any) => b.price - a.price)
      setProducts(sorted)
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  const filtered = products.filter((p: any) => p.price <= priceMax)

  return (
    <div style={{ background: bg, minHeight: '100vh', display: 'flex', paddingTop: '80px' }}>

      {/* Sidebar */}
      <aside style={{ width: '210px', flexShrink: 0, padding: '2.5rem 1.5rem', background: sideBg, borderRight: '1px solid rgba(30,27,23,0.06)', minHeight: 'calc(100vh - 80px)', position: 'sticky', top: '80px', alignSelf: 'flex-start' }}>
        <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '2rem' }}>
          Refine
        </p>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1rem', color: text, marginBottom: '1rem', fontWeight: 400 }}>Category</p>
          {categories.map(cat => (
            <div key={cat} onClick={() => setCategory(cat === 'All' ? '' : cat)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0', cursor: 'pointer' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '2px', flexShrink: 0, transition: 'all 0.15s', background: (cat === 'All' && !category) || category === cat ? C.primary : 'transparent', border: `1.5px solid ${(cat === 'All' && !category) || category === cat ? C.primary : 'rgba(30,27,23,0.2)'}` }} />
              <span style={{ fontFamily: C.sans, fontSize: '0.82rem', color: (cat === 'All' && !category) || category === cat ? C.primary : muted, fontWeight: (cat === 'All' && !category) || category === cat ? 600 : 400, transition: 'color 0.15s' }}>
                {cat}
              </span>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1rem', color: text, marginBottom: '0.5rem', fontWeight: 400 }}>Max Price</p>
          <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: C.primary, fontWeight: 600, marginBottom: '0.75rem' }}>₹{priceMax.toLocaleString()}</p>
          <input type="range" min={100} max={10000} step={100} value={priceMax} onChange={e => setPriceMax(Number(e.target.value))} style={{ width: '100%', accentColor: C.primary }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: C.sans, fontSize: '0.7rem', color: muted, marginTop: '0.25rem' }}>
            <span>₹100</span><span>₹10,000</span>
          </div>
        </div>

        <div>
          <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1rem', color: text, marginBottom: '0.75rem', fontWeight: 400 }}>Sort By</p>
          {[{ val: 'newest', label: 'Newest First' }, { val: 'price-low', label: 'Price ↑' }, { val: 'price-high', label: 'Price ↓' }].map(opt => (
            <div key={opt.val} onClick={() => setSortBy(opt.val)} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.35rem 0', cursor: 'pointer' }}>
              <div style={{ width: '11px', height: '11px', borderRadius: '50%', flexShrink: 0, background: sortBy === opt.val ? C.primary : 'transparent', border: `1.5px solid ${sortBy === opt.val ? C.primary : 'rgba(30,27,23,0.2)'}` }} />
              <span style={{ fontFamily: C.sans, fontSize: '0.82rem', color: sortBy === opt.val ? C.primary : muted, fontWeight: sortBy === opt.val ? 600 : 400 }}>{opt.label}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, padding: '2.5rem 3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
          <div>
            <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.4rem' }}>The Collection</p>
            <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: 'clamp(2rem, 3vw, 2.75rem)', fontWeight: 400, color: text }}>
              {category || 'The Curated Artifacts'}
            </h1>
            <p style={{ fontFamily: C.sans, fontSize: '0.78rem', color: muted, marginTop: '0.3rem' }}>{filtered.length} pieces found</p>
          </div>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search artifacts..."
            style={{ fontFamily: C.sans, background: sideBg, border: 'none', borderRadius: '0.75rem', padding: '0.6rem 1.1rem', fontSize: '0.82rem', color: text, outline: 'none', width: '190px' }}
          />
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {[...Array(6)].map((_, i) => <div key={i} className="skeleton" style={{ height: '360px' }} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '6rem 0' }}>
            <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: muted }}>No artifacts found</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.5rem' }}>
            {filtered.map((product: any, i: number) => (
              <div key={product._id} className="fade-up" style={{ background: cardBg, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,27,23,0.06)', animationDelay: `${i * 0.04}s`, position: 'relative', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(30,27,23,0.13)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(30,27,23,0.06)' }}
              >
                {/* Wishlist */}
                <button onClick={() => toggleWishlist(product._id)} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, background: 'rgba(255,248,241,0.92)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(30,27,23,0.12)', transition: 'transform 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1.1)'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = 'scale(1)'}
                >
                  <svg width="14" height="14" fill={wishlist.includes(product._id) ? C.primary : 'none'} stroke={C.primary} strokeWidth="1.5" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
                  </svg>
                </button>

                <Link href={`/products/${product._id}`} style={{ display: 'block' }}>
                  <div style={{ height: '220px', overflow: 'hidden' }}>
                    <img
                      src={product.image || placeholderImgs[product.category] || placeholderImgs.Pottery}
                      alt={product.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.06)'}
                      onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                    />
                  </div>
                  <div style={{ padding: '1.1rem 1.25rem 0.75rem' }}>
                    <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.35rem' }}>{product.category}</p>
                    <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.05rem', fontWeight: 400, color: text, marginBottom: '0.25rem', lineHeight: 1.3 }}>{product.title}</h3>
                    <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.75rem' }}>by {product.seller?.name || 'Artisan'}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 600, color: text }}>₹{product.price}</span>
                      <span style={{ fontFamily: C.sans, fontSize: '0.7rem', color: product.stock > 0 ? '#5a7a4a' : C.primary, fontWeight: 600 }}>
                        {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                      </span>
                    </div>
                  </div>
                </Link>

                <div style={{ padding: '0 1.25rem 1.25rem' }}>
                  <button onClick={() => addToCart(product)} disabled={product.stock === 0}
                    style={{ width: '100%', padding: '0.65rem', borderRadius: '9999px', border: 'none', cursor: product.stock > 0 ? 'pointer' : 'not-allowed', fontFamily: C.sans, fontSize: '0.8rem', fontWeight: 600, transition: 'opacity 0.2s, transform 0.15s', background: product.stock > 0 ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : C.surfaceHigh, color: product.stock > 0 ? 'white' : muted }}
                    onMouseEnter={e => { if (product.stock > 0) (e.currentTarget as HTMLElement).style.opacity = '0.88' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
                  >
                    {product.stock > 0 ? 'Add to Collection' : 'Sold Out'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function Products() {
  return (
    <Suspense fallback={<div style={{ padding: '4rem', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#6b6560' }}>Loading...</div>}>
      <ProductsContent />
    </Suspense>
  )
}