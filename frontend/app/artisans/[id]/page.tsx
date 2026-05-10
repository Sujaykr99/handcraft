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
  surfaceHigh: '#e8e1da',
  onSurface: '#1e1b17',
  muted: '#6b6560',
}

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

const artisanAvatars = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80',
]

export default function ArtisanProfile() {
  const { id } = useParams()
  const { addToCart, wishlist, toggleWishlist, darkMode } = useApp()
  const [products, setProducts] = useState<any[]>([])
  const [seller, setSeller] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const dimBg = dm ? '#211c16' : C.surfaceDim
  const sideBg = dm ? '#211c16' : C.surfaceLow

  useEffect(() => {
    const fetchSellerProducts = async () => {
      try {
        const allProducts = await apiRequest('/api/products')
        const sellerProducts = allProducts.filter((p: any) => p.seller?._id === id || p.seller === id)
        setProducts(sellerProducts)
        if (sellerProducts.length > 0) {
          setSeller(sellerProducts[0].seller)
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    if (id) fetchSellerProducts()
  }, [id])

  if (loading) return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="skeleton" style={{ width: '600px', height: '400px' }} />
    </div>
  )

  const sellerName = seller?.name || 'The Artisan'
  const avatarUrl = artisanAvatars[sellerName.length % 3]

  return (
    <div style={{ background: bg }}>

      {/* HERO — artisan intro */}
      <section style={{ paddingTop: '80px', background: dimBg }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '5rem 5rem 0', display: 'grid', gridTemplateColumns: '280px 1fr', gap: '5rem', alignItems: 'flex-start' }}>

          {/* Avatar */}
          <div>
            <div style={{ width: '240px', height: '280px', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 20px 60px rgba(30,27,23,0.15)' }}>
              <img src={avatarUrl} alt={sellerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.4rem' }}>
                Master Artisan
              </p>
              <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted, lineHeight: 1.6 }}>
                ✦ Verified Craftsperson<br />
                ✦ Direct seller — no middlemen<br />
                ✦ {products.length} works available
              </p>
            </div>
          </div>

          {/* Bio */}
          <div style={{ paddingBottom: '4rem' }}>
            <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '1rem' }}>
              Artisan Profile
            </p>
            <h1 style={{ fontFamily: C.serif, fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 400, color: text, marginBottom: '0.5rem', lineHeight: 1.05 }}>
              {sellerName}
            </h1>
            <p style={{ fontFamily: C.sans, fontSize: '0.9rem', fontStyle: 'italic', color: muted, marginBottom: '2rem' }}>
              "The earth has its own rhythm. To work with craft is to learn the art of waiting, listening, and eventually, breathing with the material."
            </p>
            <p style={{ fontFamily: C.sans, fontSize: '0.88rem', color: muted, lineHeight: 1.85, marginBottom: '1.5rem', maxWidth: '580px' }}>
              Based in the heart of India, {sellerName.split(' ')[0]} has spent years refining a technique that blends traditional methods with a contemporary, mindful approach. Each piece created is a dialogue between the tactile memory of their ancestors and the functional clarity required by modern living.
            </p>
            <p style={{ fontFamily: C.sans, fontSize: '0.88rem', color: muted, lineHeight: 1.85, maxWidth: '580px' }}>
              Their workshop serves as a sanctuary for slow craft — a space where every item is made by hand, with intention, and sold directly to those who appreciate the story behind the object.
            </p>
          </div>
        </div>
      </section>

      {/* PROCESS — the alchemy section */}
      <section style={{ background: bg, padding: '6rem 5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 400, color: text }}>
              The Alchemy of Form
            </h2>
            <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted, maxWidth: '260px', textAlign: 'right', lineHeight: 1.6 }}>
              A step-by-step journey through the creation of each piece
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {[
              { step: 'Step 01', title: 'The Awakening', img: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80' },
              { step: 'Step 02', title: 'Centering', img: 'https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=700&q=80' },
              { step: 'Step 03', title: 'Thermal Breath', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=700&q=80' },
              { step: 'Step 04', title: 'The Final Veil', img: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=700&q=80' },
            ].map((item, i) => (
              <div key={i} style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', height: i < 2 ? '300px' : '240px' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
                  onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,14,10,0.75) 0%, transparent 50%)' }} />
                <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                  <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.primaryLight, marginBottom: '0.3rem' }}>
                    {item.step}
                  </p>
                  <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.25rem', color: '#fff8f1', fontWeight: 400 }}>
                    {item.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIMELINE */}
      <section style={{ background: sideBg, padding: '6rem 5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2rem', fontWeight: 400, color: text, textAlign: 'center', marginBottom: '3.5rem' }}>
            A Life in Craft
          </h2>
          <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { year: '2008', title: 'Apprenticeship', desc: 'Studied under a master craftsperson, learning the secret techniques passed through generations.' },
              { year: '2014', title: 'First Solo Exhibition', desc: 'Debuted at a regional craft fair, showcasing an experimental line of hand-finished pieces.' },
              { year: '2019', title: 'HandArt Partnership', desc: 'Joined HandArt to sell directly to buyers who appreciate authentic handmade work.' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: C.primary, marginTop: '4px' }} />
                  {i < 2 && <div style={{ width: '1px', height: '60px', background: 'rgba(159,64,45,0.2)', marginTop: '6px' }} />}
                </div>
                <div style={{ paddingBottom: '0.5rem' }}>
                  <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.3rem' }}>{item.year}</p>
                  <h3 style={{ fontFamily: C.sans, fontSize: '0.9rem', fontWeight: 600, color: text, marginBottom: '0.3rem' }}>{item.title}</h3>
                  <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted, lineHeight: 1.65 }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AVAILABLE WORKS */}
      <section style={{ background: bg, padding: '6rem 5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem' }}>
            <div>
              <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(2rem, 3vw, 3rem)', fontWeight: 400, color: text, marginBottom: '0.4rem' }}>
                Available Works
              </h2>
              <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted }}>
                Limited pieces from the current making
              </p>
            </div>
            <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.82rem', color: C.primary, fontWeight: 500 }}>
              View Full Collection →
            </Link>
          </div>

          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 0', background: sideBg, borderRadius: '1.25rem' }}>
              <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.25rem', color: muted }}>
                No works listed yet
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {products.map((product: any, i: number) => (
                <div key={product._id} style={{ background: cardBg, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 20px rgba(30,27,23,0.06)', position: 'relative', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-5px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 16px 40px rgba(30,27,23,0.12)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(30,27,23,0.06)' }}
                >
                  {/* Wishlist button */}
                  <button onClick={() => toggleWishlist(product._id)} style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2, background: 'rgba(255,248,241,0.92)', border: 'none', borderRadius: '50%', width: '34px', height: '34px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 10px rgba(30,27,23,0.12)' }}>
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
                      <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.35rem' }}>
                        {product.category}
                      </p>
                      <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.05rem', fontWeight: 400, color: text, marginBottom: '0.25rem', lineHeight: 1.3 }}>
                        {product.title}
                      </h3>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.6rem' }}>
                        <span style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 600, color: text }}>₹{product.price}</span>
                        <span style={{ fontFamily: C.sans, fontSize: '0.7rem', color: product.stock > 0 ? '#5a7a4a' : C.primary, fontWeight: 600 }}>
                          {product.stock > 0 ? `${product.stock} left` : 'Sold out'}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div style={{ padding: '0 1.25rem 1.25rem' }}>
                    <button onClick={() => addToCart(product)} disabled={product.stock === 0}
                      style={{ width: '100%', padding: '0.65rem', borderRadius: '9999px', border: 'none', cursor: product.stock > 0 ? 'pointer' : 'not-allowed', fontFamily: C.sans, fontSize: '0.8rem', fontWeight: 600, background: product.stock > 0 ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : C.surfaceHigh, color: product.stock > 0 ? 'white' : muted }}>
                      {product.stock > 0 ? 'Add to Collection' : 'Sold Out'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ARTISAN QUOTE */}
      <section style={{ background: dimBg, padding: '8rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: C.serif, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontStyle: 'italic', fontWeight: 400, color: text, maxWidth: '720px', margin: '0 auto 1.5rem', lineHeight: 1.45 }}>
          "My goal is not to achieve perfection, but to capture the moment where human intention meets the wild nature of the material."
        </p>
        <p style={{ fontFamily: C.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted }}>
          — {sellerName}
        </p>
      </section>

    </div>
  )
}