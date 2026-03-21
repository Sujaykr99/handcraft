'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getCartCount } from '../lib/cart'

const s = {
  serif: { fontFamily: "'Newsreader', Georgia, serif" } as React.CSSProperties,
  sans: { fontFamily: "'Plus Jakarta Sans', sans-serif" } as React.CSSProperties,
  primary: '#9f402d',
  surface: '#fff8f1',
  onSurface: '#1e1b17',
  onSurfaceMuted: '#6b6560',
}

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [cartCount, setCartCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) setUser(JSON.parse(userData))
    setCartCount(getCartCount())
    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const logout = () => {
    localStorage.clear()
    window.location.href = '/'
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 50,
      padding: '1.25rem 4rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background 0.4s ease, backdrop-filter 0.4s ease',
      background: scrolled ? 'rgba(255,248,241,0.88)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(30,27,23,0.08)' : 'none',
    }}>

      {/* Logo */}
      <Link href="/" style={{ ...s.serif, fontSize: '1.1rem', fontStyle: 'italic', color: s.onSurface, fontWeight: 400 }}>
        The HandArt
      </Link>

      {/* Center nav links */}
      <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
        {[
          { label: 'Collections', href: '/products' },
          { label: 'Artisans', href: '/' },
          { label: 'Our Story', href: '/' },
          { label: 'Journal', href: '/' },
        ].map((item) => (
          <Link key={item.label} href={item.href} style={{
            ...s.sans,
            fontSize: '0.8rem',
            color: s.onSurface,
            letterSpacing: '0.01em',
            fontWeight: 400,
            position: 'relative',
          }}>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Right icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

        {/* Cart */}
        <Link href="/cart" style={{ position: 'relative', color: s.onSurface, display: 'flex' }}>
          <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && (
            <span style={{
              position: 'absolute', top: '-6px', right: '-8px',
              width: '16px', height: '16px',
              background: s.primary,
              color: 'white',
              borderRadius: '50%',
              fontSize: '9px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontWeight: 600
            }}>
              {cartCount}
            </span>
          )}
        </Link>

        {/* User */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            {user.role === 'seller' && (
              <Link href="/dashboard" style={{ ...s.sans, fontSize: '0.8rem', color: s.onSurfaceMuted }}>
                Dashboard
              </Link>
            )}
            <button onClick={logout} style={{
              ...s.sans,
              fontSize: '0.8rem',
              color: s.onSurfaceMuted,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0
            }}>
              {user.name}
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ color: s.onSurface, display: 'flex' }}>
            <svg width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        )}
      </div>
    </nav>
  )
}