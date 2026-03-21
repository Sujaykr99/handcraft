import Link from 'next/link'

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

export default function Home() {
  return (
    <div style={{ background: s.surface }}>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #ede0d0 0%, #ddc9b0 50%, #ceb090 100%)',
        display: 'flex',
        alignItems: 'flex-end',
        paddingBottom: '6rem',
        paddingLeft: '5rem',
        paddingRight: '5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '700px', position: 'relative', zIndex: 2 }}>
          <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: s.onSurfaceMuted, marginBottom: '1.5rem' }}>
            Heritage Collection — India
          </p>
          <h1 style={{ ...s.serif, fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1, fontStyle: 'italic', color: s.onSurface, marginBottom: '1.5rem', fontWeight: 400 }}>
            Every product<br />carries a story.
          </h1>
          <p style={{ ...s.sans, fontSize: '1rem', color: s.onSurfaceMuted, marginBottom: '2.5rem', maxWidth: '420px', lineHeight: 1.7 }}>
            Handcrafted by artisans across India. Sold directly — no middlemen, just the maker and you.
          </p>
          <Link href="/products" style={{
            ...s.sans,
            background: `linear-gradient(135deg, ${s.primary}, #e2725b)`,
            color: 'white',
            borderRadius: '9999px',
            padding: '0.875rem 2.5rem',
            fontSize: '0.875rem',
            fontWeight: 500,
            display: 'inline-block',
            letterSpacing: '0.02em'
          }}>
            Explore the Collection
          </Link>
        </div>
      </section>

      {/* MANIFESTO */}
      <section style={{ background: s.surfaceDim, padding: '6rem 2rem', textAlign: 'center' }}>
        <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: s.primary, marginBottom: '2rem' }}>
          The Manifesto
        </p>
        <blockquote style={{ ...s.serif, fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', maxWidth: '800px', margin: '0 auto', lineHeight: 1.5, color: s.onSurface, fontStyle: 'italic', fontWeight: 400 }}>
          "We believe in objects that breathe. Each piece is a dialogue between the hands of an artisan and the raw spirit of the earth."
        </blockquote>
        <div style={{ width: '1px', height: '3rem', background: 'rgba(30,27,23,0.2)', margin: '2.5rem auto 0' }} />
      </section>

      {/* CATEGORIES */}
      <section style={{ padding: '6rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <h2 style={{ ...s.serif, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: s.onSurface, marginBottom: '0.75rem', fontWeight: 400 }}>
            Cultural Narratives
          </h2>
          <p style={{ ...s.sans, fontSize: '0.875rem', color: s.onSurfaceMuted }}>
            Curated crafts defining heritage through tactile exploration
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { name: 'Pottery', subtitle: 'Earth & Fire', bg: '#e8d5c4' },
            { name: 'Textiles', subtitle: 'Thread & Loom', bg: '#d4c5b0' },
            { name: 'Jewellery', subtitle: 'Metal & Stone', bg: '#c9b99a' },
            { name: 'Paintings', subtitle: 'Pigment & Hand', bg: '#bfaa88' },
            { name: 'Woodwork', subtitle: 'Grain & Chisel', bg: '#d4b896' },
            { name: 'Candles', subtitle: 'Wax & Wick', bg: '#e2cdb5' },
            { name: 'Baskets', subtitle: 'Weave & Form', bg: '#cab49a' },
            { name: 'Leather', subtitle: 'Hide & Craft', bg: '#c4a882' },
          ].map((cat, i) => (
            <Link key={cat.name} href={`/products?category=${cat.name}`} style={{
              background: cat.bg,
              borderRadius: '1rem',
              padding: '2rem 1.5rem 2.5rem',
              display: 'block',
              transition: 'transform 0.3s ease',
              textDecoration: 'none'
            }}>
              <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: s.onSurfaceMuted, marginBottom: '0.75rem' }}>
                0{i + 1}
              </p>
              <h3 style={{ ...s.serif, fontSize: '1.25rem', color: s.onSurface, fontStyle: i % 2 === 0 ? 'italic' : 'normal', fontWeight: 400, marginBottom: '0.25rem' }}>
                {cat.name}
              </h3>
              <p style={{ ...s.sans, fontSize: '0.75rem', color: s.onSurfaceMuted }}>
                {cat.subtitle}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED */}
      <section style={{ background: s.surfaceLow, padding: '6rem 5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <h2 style={{ ...s.serif, fontSize: 'clamp(2rem, 4vw, 3.5rem)', color: s.onSurface, marginBottom: '0.75rem', fontWeight: 400 }}>
                Featured Stories
              </h2>
              <p style={{ ...s.sans, fontSize: '0.875rem', color: s.onSurfaceMuted }}>
                Pieces selected for their connection to land and maker
              </p>
            </div>
            <Link href="/products" style={{ ...s.sans, fontSize: '0.875rem', color: s.primary }}>
              View All →
            </Link>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
            {[
              { title: 'The Clay Matka', artisan: 'Ramesh Kumar', origin: 'Rajasthan', price: '₹850', category: 'Pottery', bg: '#e8d5c4' },
              { title: 'Indigo Soul Throw', artisan: 'Meera Devi', origin: 'Gujarat', price: '₹2,200', category: 'Textiles', bg: '#c5d4c4' },
              { title: 'Terracotta Jhumka', artisan: 'Aruna Devi', origin: 'West Bengal', price: '₹450', category: 'Jewellery', bg: '#d4c5b0' },
            ].map((item) => (
              <div key={item.title} style={{ background: s.surface, borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 24px rgba(30,27,23,0.06)' }}>
                <div style={{ height: '220px', background: item.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ ...s.serif, fontSize: '5rem', fontStyle: 'italic', color: 'rgba(30,27,23,0.12)', fontWeight: 400 }}>
                    {item.category[0]}
                  </span>
                </div>
                <div style={{ padding: '1.5rem 1.5rem 2rem' }}>
                  <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.12em', textTransform: 'uppercase', color: s.primary, marginBottom: '0.5rem' }}>
                    {item.category}
                  </p>
                  <h3 style={{ ...s.serif, fontSize: '1.25rem', fontStyle: 'italic', color: s.onSurface, marginBottom: '0.4rem', fontWeight: 400 }}>
                    {item.title}
                  </h3>
                  <p style={{ ...s.sans, fontSize: '0.75rem', color: s.onSurfaceMuted, marginBottom: '1rem' }}>
                    by {item.artisan} · {item.origin}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ ...s.sans, fontWeight: 600, color: s.onSurface, fontSize: '1rem' }}>{item.price}</span>
                    <Link href="/products" style={{ ...s.sans, fontSize: '0.75rem', color: s.primary }}>
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
      <section style={{ background: s.surfaceDim, padding: '8rem 2rem', textAlign: 'center' }}>
        <p style={{ ...s.serif, fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontStyle: 'italic', color: s.onSurface, maxWidth: '800px', margin: '0 auto 1.5rem', fontWeight: 400, lineHeight: 1.4 }}>
          "Every thread we pull is a link to our ancestors."
        </p>
        <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: s.onSurfaceMuted }}>
          — Mohan Lal, Master Weaver of Jodhpur
        </p>
      </section>

      {/* WHY */}
      <section style={{ padding: '6rem 5rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <div>
            <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: s.primary, marginBottom: '1rem' }}>
              The Philosophy
            </p>
            <h2 style={{ ...s.serif, fontSize: 'clamp(2rem, 3vw, 3rem)', fontStyle: 'italic', color: s.onSurface, marginBottom: '1.5rem', fontWeight: 400 }}>
              The Geometry<br />of Heritage
            </h2>
            <p style={{ ...s.sans, fontSize: '0.9rem', color: s.onSurfaceMuted, lineHeight: 1.9, marginBottom: '2.5rem' }}>
              Every pattern used in our collections is a geographical marker. Your purchase goes directly to the artisan — no commission, no platform cut. Just the maker, the craft, and you.
            </p>
            <Link href="/products" style={{
              ...s.sans,
              background: `linear-gradient(135deg, ${s.primary}, #e2725b)`,
              color: 'white',
              borderRadius: '9999px',
              padding: '0.875rem 2.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              display: 'inline-block'
            }}>
              Explore the Symbology →
            </Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            {[
              { label: 'Direct from artisan', desc: 'Zero commission. Your money goes straight to the maker.' },
              { label: 'Unique & handmade', desc: 'Every piece is one of a kind, made with skill.' },
              { label: 'Support local craft', desc: 'Directly supports Indian artisans and their families.' },
              { label: 'Verified heritage', desc: 'Every item comes with its story and provenance.' },
            ].map((item) => (
              <div key={item.label} style={{ background: s.surfaceLow, padding: '1.5rem', borderRadius: '1rem' }}>
                <h4 style={{ ...s.serif, fontStyle: 'italic', fontSize: '1rem', color: s.onSurface, marginBottom: '0.5rem', fontWeight: 400 }}>
                  {item.label}
                </h4>
                <p style={{ ...s.sans, fontSize: '0.75rem', color: s.onSurfaceMuted, lineHeight: 1.6 }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: s.surfaceHigh, padding: '5rem 2rem', textAlign: 'center' }}>
        <h2 style={{ ...s.serif, fontSize: '2rem', fontStyle: 'italic', color: s.onSurface, marginBottom: '0.75rem', fontWeight: 400 }}>
          Join the Editorial
        </h2>
        <p style={{ ...s.sans, fontSize: '0.875rem', color: s.onSurfaceMuted, marginBottom: '2rem' }}>
          Stay connected with our global artisan journeys
        </p>
        <div style={{ display: 'flex', maxWidth: '440px', margin: '0 auto', gap: '0.75rem' }}>
          <input type="email" placeholder="Enter your email" style={{
            flex: 1,
            background: s.surfaceDim,
            border: 'none',
            borderRadius: '0.75rem',
            padding: '0.875rem 1.25rem',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.875rem',
            color: s.onSurface,
            outline: 'none'
          }} />
          <button style={{
            background: `linear-gradient(135deg, ${s.primary}, #e2725b)`,
            color: 'white',
            borderRadius: '9999px',
            padding: '0.875rem 1.75rem',
            border: 'none',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: '0.875rem',
            fontWeight: 500,
            cursor: 'pointer'
          }}>
            Subscribe
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ background: s.onSurface, padding: '4rem 5rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3rem' }}>
          <div>
            <p style={{ ...s.serif, fontStyle: 'italic', fontSize: '1.25rem', color: s.surface, marginBottom: '1rem', fontWeight: 400 }}>
              The HandArt
            </p>
            <p style={{ ...s.sans, fontSize: '0.75rem', color: 'rgba(255,248,241,0.5)', lineHeight: 1.7 }}>
              Honoring the tactile, the human, and the storied.
            </p>
          </div>
          {[
            { title: 'Philosophy', links: ['The Manifesto', 'Artisan Grants', 'Ethical Standards'] },
            { title: 'Service', links: ['Shipping & Origin', 'Contact'] },
            { title: 'Connect', links: ['Instagram', 'Journal'] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ ...s.sans, fontSize: '11px', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,248,241,0.35)', marginBottom: '1.25rem' }}>
                {col.title}
              </p>
              {col.links.map((link) => (
                <p key={link} style={{ ...s.sans, fontSize: '0.8rem', color: 'rgba(255,248,241,0.55)', marginBottom: '0.6rem' }}>
                  {link}
                </p>
              ))}
            </div>
          ))}
        </div>
      </footer>

    </div>
  )
}