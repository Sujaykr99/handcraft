'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiRequest } from '../../lib/api'

const s = {
  serif: { fontFamily: "'Newsreader', Georgia, serif" } as React.CSSProperties,
  sans: { fontFamily: "'Plus Jakarta Sans', sans-serif" } as React.CSSProperties,
  primary: '#9f402d',
  surface: '#fff8f1',
  surfaceLow: '#faf2ea',
  surfaceHigh: '#e8e1da',
  surfaceDim: '#ede7df',
  onSurface: '#1e1b17',
  onSurfaceMuted: '#6b6560',
}

const categories = ['All', 'Pottery', 'Jewellery', 'Textiles', 'Paintings', 'Woodwork', 'Candles', 'Baskets', 'Leather']

export default function Products() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  useEffect(() => { fetchProducts() }, [search, category])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      let endpoint = '/api/products?'
      if (search) endpoint += `search=${search}&`
      if (category && category !== 'All') endpoint += `category=${category}`
      const data = await apiRequest(endpoint)
      setProducts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: s.surface, minHeight: '100vh', paddingTop: '5rem' }}>

      {/* Header */}
      <section style={{ background: s.surfaceDim, padding: '5rem 5rem 4rem' }}>
        <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: s.primary, marginBottom: '1rem' }}>
          The Collection
        </p>
        <h1 style={{ ...s.serif, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontStyle: 'italic', color: s.onSurface, fontWeight: 400, marginBottom: '1rem' }}>
          The Curated Artifacts
        </h1>
        <p style={{ ...s.sans, fontSize: '0.9rem', color: s.onSurfaceMuted, maxWidth: '480px', lineHeight: 1.7 }}>
          Pieces selected for their connection to the land and the hands that shaped them.
        </p>
      </section>

      {/* Filters */}
      <section style={{ background: s.surfaceLow, padding: '1.5rem 5rem', display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap', borderBottom: `1px solid rgba(30,27,23,0.08)` }}>
        <input
          type="text"
          placeholder="Search artifacts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            ...s.sans,
            background: s.surfaceHigh,
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.6rem 1.25rem',
            fontSize: '0.8rem',
            color: s.onSurface,
            outline: 'none',
            width: '220px',
          }}
        />
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat === 'All' ? '' : cat)}
              style={{
                ...s.sans,
                fontSize: '0.75rem',
                padding: '0.5rem 1.25rem',
                borderRadius: '9999px',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 500,
                background: (cat === 'All' && !category) || category === cat
                  ? `linear-gradient(135deg, ${s.primary}, #e2725b)`
                  : s.surfaceHigh,
                color: (cat === 'All' && !category) || category === cat
                  ? 'white'
                  : s.onSurfaceMuted,
                transition: 'all 0.2s'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Products */}
      <section style={{ padding: '4rem 5rem', maxWidth: '1400px', margin: '0 auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '8rem 0', ...s.sans, color: s.onSurfaceMuted, fontSize: '0.9rem' }}>
            Loading artifacts...
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '8rem 0' }}>
            <p style={{ ...s.serif, fontSize: '1.5rem', fontStyle: 'italic', color: s.onSurfaceMuted }}>No artifacts found</p>
            <Link href="/" style={{ ...s.sans, fontSize: '0.85rem', color: s.primary, display: 'inline-block', marginTop: '1rem' }}>
              Return home →
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {products.map((product: any, i: number) => (
              <Link key={product._id} href={`/products/${product._id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: s.surface,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 4px 24px rgba(30,27,23,0.05)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  cursor: 'pointer'
                }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(30,27,23,0.12)'
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                    ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(30,27,23,0.05)'
                  }}
                >
                  {/* Image area */}
                  <div style={{
                    height: '240px',
                    background: ['#e8d5c4', '#d4c5b0', '#c9b99a', '#d4b896'][i % 4],
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {product.image ? (
                      <img src={product.image} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ ...s.serif, fontSize: '5rem', fontStyle: 'italic', color: 'rgba(30,27,23,0.1)', fontWeight: 400 }}>
                        {product.category?.[0] || 'A'}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ padding: '1.25rem 1.5rem 1.75rem' }}>
                    <p style={{ ...s.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: s.primary, marginBottom: '0.4rem' }}>
                      {product.category}
                    </p>
                    <h3 style={{ ...s.serif, fontSize: '1.15rem', fontStyle: 'italic', color: s.onSurface, marginBottom: '0.3rem', fontWeight: 400 }}>
                      {product.title}
                    </h3>
                    <p style={{ ...s.sans, fontSize: '0.75rem', color: s.onSurfaceMuted, marginBottom: '1rem' }}>
                      by {product.seller?.name || 'Artisan'}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ ...s.sans, fontSize: '1.1rem', fontWeight: 600, color: s.onSurface }}>
                        ₹{product.price}
                      </span>
                      <span style={{ ...s.sans, fontSize: '0.7rem', color: product.stock > 0 ? '#5a7a5a' : '#9f402d' }}>
                        {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
                      </span>
                    </div>
                    <p style={{ ...s.sans, fontSize: '0.7rem', color: s.onSurfaceMuted, marginTop: '0.5rem' }}>
                      View Provenance →
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}