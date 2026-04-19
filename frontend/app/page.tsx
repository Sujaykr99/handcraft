'use client'
import Link from 'next/link'
import { useApp } from '../context/AppContext'

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

const craftImages = [
  { url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=800&q=80', cat: 'Pottery' },
  { url: 'https://images.unsplash.com/photo-1617195737496-bc30194e3a19?w=800&q=80', cat: 'Textiles' },
  { url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80', cat: 'Jewellery' },
]

export default function Home() {
  const { darkMode } = useApp()
  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const dimBg = dm ? '#211c16' : C.surfaceDim

  return (
    <div style={{ background: bg }}>

      {/* HERO — full bleed real photo */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}>
        <img
          src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=1600&q=85"
          alt="Artisan at work"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(20,14,10,0.72) 0%, rgba(20,14,10,0.3) 60%, transparent 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 5rem 5rem' }}>
          <p style={{ fontFamily: C.sans, fontSize: '11px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,248,241,0.7)', marginBottom: '1.25rem' }}>
            Heritage Collection — India
          </p>
          <h1 style={{ fontFamily: C.serif, fontSize: 'clamp(3.5rem, 7vw, 6rem)', fontStyle: 'italic', fontWeight: 400, color: '#fff8f1', lineHeight: 1.05, marginBottom: '1.5rem', maxWidth: '700px' }}>
            Every product<br />carries a story.
          </h1>
          <p style={{ fontFamily: C.sans, fontSize: '1rem', color: 'rgba(255,248,241,0.75)', maxWidth: '440px', lineHeight: 1.75, marginBottom: '2.5rem' }}>
            Handcrafted by artisans across India. Sold directly — no middlemen, just the maker and you.
          </p>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/products" style={{
              fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 500,
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
              color: 'white', borderRadius: '9999px', padding: '0.875rem 2.25rem',
              display: 'inline-block', letterSpacing: '0.02em', transition: 'opacity 0.2s'
            }}>
              Explore the Collection
            </Link>
            <Link href="/signup" style={{
              fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 500,
              background: 'rgba(255,248,241,0.12)', color: '#fff8f1',
              borderRadius: '9999px', padding: '0.875rem 2.25rem',
              display: 'inline-block', border: '1px solid rgba(255,248,241,0.25)'
            }}>
              Sell Your Craft
            </Link>
          </div>
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{ background: dimBg, padding: '6rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '2rem' }}>
          The Manifesto
        </p>
        <blockquote style={{ fontFamily: C.serif, fontSize: 'clamp(1.6rem, 3vw, 2.75rem)', fontStyle: 'italic', fontWeight: 400, color: text, maxWidth: '820px', margin: '0 auto', lineHeight: 1.45 }}>
          "We believe in objects that breathe. Each piece is a dialogue between the hands of an artisan and the raw spirit of the earth."
        </blockquote>
        <div style={{ width: '1px', height: '3.5rem', background: `rgba(30,27,23,0.15)`, margin: '2.5rem auto 0' }} />
      </section>

      {/* CULTURAL NARRATIVES — asymmetric editorial grid */}
      <section style={{ padding: '6rem 5rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(2.25rem, 4vw, 3.75rem)', fontWeight: 400, color: text, marginBottom: '0.6rem' }}>
            Cultural Narratives
          </h2>
          <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: muted }}>
            Curated movements defining heritage through tactile exploration
          </p>
        </div>

        {/* Big asymmetric layout — like reference image */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', height: '480px' }}>
            <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=900&q=80" alt="Loom of Ancestors" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
              onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'}
              onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,14,10,0.75) 0%, transparent 55%)' }} />
            <div style={{ position: 'absolute', bottom: '2rem', left: '2rem' }}>
              <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,248,241,0.65)', marginBottom: '0.4rem' }}>Origin · Dasada</p>
              <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', color: '#fff8f1', fontWeight: 400 }}>The Loom of Ancestors</h3>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ position: 'relative', borderRadius: '1rem', overflow: 'hidden', flex: 1 }}>
              <img src="https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=700&q=80" alt="Fired Earth" style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease' }}
                onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.04)'}
                onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(20,14,10,0.65) 0%, transparent 50%)' }} />
              <div style={{ position: 'absolute', bottom: '1.5rem', left: '1.5rem' }}>
                <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,248,241,0.65)', marginBottom: '0.3rem' }}>New Narrative</p>
                <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.2rem', color: '#fff8f1', fontWeight: 400 }}>Fired Earth</h3>
              </div>
            </div>
            <div style={{ background: dm ? '#2a2218' : C.surfaceLow, borderRadius: '1rem', padding: '2rem' }}>
              <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.5rem' }}>New Narrative</p>
              <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.35rem', color: text, fontWeight: 400, marginBottom: '0.75rem' }}>Fired Earth</h3>
              <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted, lineHeight: 1.7, marginBottom: '1rem' }}>
                The raw, sun-baked ceramics of the High Atlas, where every kiln-firing is a communal ritual of fire and earth.
              </p>
              <Link href="/products?category=Pottery" style={{ fontFamily: C.sans, fontSize: '0.78rem', color: C.primary, fontWeight: 500 }}>
                Enter the Kiln →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED STORIES */}
      <section style={{ background: dm ? '#211c16' : C.surfaceLow, padding: '6rem 5rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem' }}>
            <div>
              <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 400, color: text, marginBottom: '0.5rem' }}>
                Featured Stories
              </h2>
              <p style={{ fontFamily: C.sans, fontSize: '0.83rem', color: muted }}>
                Exceptional pieces hand-selected for their depth of character
              </p>
            </div>
            <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.82rem', color: C.primary, fontWeight: 500 }}>
              View All Artisans →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              {
                img: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=600&q=80',
                cat: 'Pottery', artisan: 'Elena Rossi · Italy', title: 'The Solitude Pitcher', price: '₹1,850',
                desc: 'Each pitcher is hand-thrown with a unique glaze inspired by morning mist.'
              },
              {
                img: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=600&q=80',
                cat: 'Textiles', artisan: 'Malick Diallo · Mali', title: 'Indigo Soul Throw', price: '₹3,200',
                desc: 'Hand-woven using traditional indigo vat dyeing passed down four generations.'
              },
              {
                img: 'https://images.unsplash.com/photo-1481009137526-5a453fdd1f65?w=600&q=80',
                cat: 'Woodwork', artisan: 'Kaito Sato · Japan', title: 'Imperfection Vessel', price: '₹2,450',
                desc: 'Salvaged cedar finished with real 24k gold lacquer joinery.'
              },
            ].map((item, i) => (
              <div key={i} style={{ background: cardBg, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(30,27,23,0.06)' }}>
                <div style={{ height: '260px', overflow: 'hidden' }}>
                  <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    onMouseEnter={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1.05)'}
                    onMouseLeave={e => (e.currentTarget as HTMLImageElement).style.transform = 'scale(1)'}
                  />
                </div>
                <div style={{ padding: '1.5rem 1.5rem 2rem' }}>
                  <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.12em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.4rem' }}>
                    {item.cat}
                  </p>
                  <h3 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.2rem', fontWeight: 400, color: text, marginBottom: '0.3rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: muted, marginBottom: '0.75rem' }}>
                    BY {item.artisan.toUpperCase()}
                  </p>
                  <p style={{ fontFamily: C.sans, fontSize: '0.8rem', color: muted, lineHeight: 1.65, marginBottom: '1.25rem' }}>
                    {item.desc}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: C.sans, fontSize: '1rem', fontWeight: 600, color: text }}>{item.price}</span>
                    <Link href="/products" style={{ fontFamily: C.sans, fontSize: '0.75rem', color: C.primary, fontWeight: 500 }}>
                      View Provenance →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ARTISAN QUOTE */}
      <section style={{ background: dimBg, padding: '8rem 2rem', textAlign: 'center' }}>
        <p style={{ fontFamily: C.serif, fontSize: 'clamp(1.75rem, 3.5vw, 3rem)', fontStyle: 'italic', fontWeight: 400, color: text, maxWidth: '820px', margin: '0 auto 1.5rem', lineHeight: 1.4 }}>
          "Every thread we pull is a link to our ancestors. We do not just weave fabric; we weave the memory of the desert winds."
        </p>
        <p style={{ fontFamily: C.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: muted }}>
          — Mohan Lal, Master Weaver of Jodhpur
        </p>
      </section>

      {/* THE GEOMETRY OF HERITAGE */}
      <section style={{ padding: '6rem 5rem', maxWidth: '1300px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&q=80',
              'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?w=400&q=80',
            ].map((url, i) => (
              <div key={i} style={{ borderRadius: '0.75rem', overflow: 'hidden', height: i === 0 ? '280px' : '220px', marginTop: i === 1 ? '3rem' : 0 }}>
                <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
            ))}
          </div>
          <div>
            <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '1rem' }}>
              The Philosophy
            </p>
            <h2 style={{ fontFamily: C.serif, fontSize: 'clamp(1.75rem, 3vw, 2.75rem)', fontStyle: 'italic', fontWeight: 400, color: text, marginBottom: '1.25rem', lineHeight: 1.25 }}>
              The Geometry<br />of Heritage
            </h2>
            <p style={{ fontFamily: C.sans, fontSize: '0.88rem', color: muted, lineHeight: 1.85, marginBottom: '2rem' }}>
              Every pattern used in our collections is a geographical marker. Your purchase goes directly to the artisan — no commission, no platform cut. Just the maker, the craft, and you.
            </p>
            <Link href="/products" style={{
              fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 500,
              background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
              color: 'white', borderRadius: '9999px', padding: '0.875rem 2.25rem', display: 'inline-block'
            }}>
              Explore the Symbology →
            </Link>
          </div>
        </div>
      </section>

      {/* JOIN EDITORIAL */}
      <section style={{ background: dm ? '#211c16' : C.surfaceHigh, padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.25rem', fontWeight: 400, color: text, marginBottom: '0.75rem' }}>
          Join the Editorial
        </h2>
        <p style={{ fontFamily: C.sans, fontSize: '0.85rem', color: muted, marginBottom: '2rem' }}>
          Stay connected with our global artisan journeys and collection previews.
        </p>
        <div style={{ display: 'flex', maxWidth: '420px', margin: '0 auto', gap: '0.75rem' }}>
          <input type="email" placeholder="Enter your email" style={{
            flex: 1, background: dm ? '#2a2218' : C.surfaceDim, border: 'none',
            borderRadius: '0.75rem', padding: '0.875rem 1.25rem',
            fontFamily: C.sans, fontSize: '0.85rem', color: text, outline: 'none'
          }} />
          <button style={{
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
            color: 'white', border: 'none', borderRadius: '9999px',
            padding: '0.875rem 1.75rem', fontFamily: C.sans, fontSize: '0.85rem',
            fontWeight: 500, cursor: 'pointer'
          }}>
            Subscribe
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: C.onSurface, padding: '4rem 5rem 2.5rem' }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '3rem', marginBottom: '3rem' }}>
            <div>
              <p style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.1rem', color: C.surface, marginBottom: '0.875rem', fontWeight: 400 }}>
                The HandArt
              </p>
              <p style={{ fontFamily: C.sans, fontSize: '0.78rem', color: 'rgba(255,248,241,0.45)', lineHeight: 1.75 }}>
                Honoring the tactile, the human, and the storied. A digital curator for the modern conscious explorer.
              </p>
            </div>
            {[
              { title: 'Philosophy', links: ['The Manifesto', 'Artisan Grants', 'Ethical Standards'] },
              { title: 'Service', links: ['Shipping & Origin', 'Contact'] },
              { title: 'Connect', links: ['Instagram', 'Journal'] },
            ].map(col => (
              <div key={col.title}>
                <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,248,241,0.3)', marginBottom: '1.25rem' }}>
                  {col.title}
                </p>
                {col.links.map(l => (
                  <p key={l} style={{ fontFamily: C.sans, fontSize: '0.78rem', color: 'rgba(255,248,241,0.55)', marginBottom: '0.6rem', cursor: 'pointer' }}>{l}</p>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,248,241,0.08)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: 'rgba(255,248,241,0.3)' }}>
              © 2026 The HandArt. All rights reserved.
            </p>
            <p style={{ fontFamily: C.sans, fontSize: '0.72rem', color: 'rgba(255,248,241,0.3)' }}>
              Honoring the tactile, the former, and the storied.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}