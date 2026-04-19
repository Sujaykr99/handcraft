'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useApp } from '../context/AppContext'

export default function Navbar() {
  const { cartCount, user, setUser, wishlist, darkMode, toggleDarkMode } = useApp()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const logout = () => { localStorage.clear(); setUser(null); window.location.href = '/' }

  const dm = darkMode
  const C = {
    serif: "'Newsreader', Georgia, serif",
    sans: "'Plus Jakarta Sans', sans-serif",
    primary: '#9f402d',
    surface: '#fff8f1',
    onSurface: '#1e1b17',
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '1.1rem 4rem',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      transition: 'all 0.35s ease',
      background: scrolled ? (dm ? 'rgba(26,20,16,0.92)' : 'rgba(255,248,241,0.92)') : 'transparent',
      backdropFilter: scrolled ? 'blur(16px)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(30,27,23,0.07)' : 'none',
    }}>
      <Link href="/" style={{ fontFamily: C.serif, fontSize: '1rem', fontStyle: 'italic', color: dm ? C.surface : C.onSurface, fontWeight: 400, letterSpacing: '0.01em' }}>
        The HandArt
      </Link>

      <div style={{ display: 'flex', gap: '2.5rem' }}>
        {[{ label: 'Collections', href: '/products' }, { label: 'Artisans', href: '/' }, { label: 'Our Story', href: '/' }, { label: 'Journal', href: '/' }].map(item => (
          <Link key={item.label} href={item.href} style={{ fontFamily: C.sans, fontSize: '0.78rem', color: dm ? 'rgba(255,248,241,0.75)' : '#3a3530', fontWeight: 400, letterSpacing: '0.01em', transition: 'color 0.2s' }}>
            {item.label}
          </Link>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <button onClick={toggleDarkMode} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.95rem', color: dm ? C.surface : C.onSurface, padding: 0, lineHeight: 1 }}>
          {dm ? '☀' : '◐'}
        </button>

        <Link href="/wishlist" style={{ position: 'relative', display: 'flex', color: dm ? C.surface : C.onSurface }}>
          <svg width="17" height="17" fill={wishlist.length > 0 ? C.primary : 'none'} stroke={wishlist.length > 0 ? C.primary : (dm ? C.surface : C.onSurface)} strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
          {wishlist.length > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-7px', background: C.primary, color: 'white', borderRadius: '50%', width: '13px', height: '13px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.sans, fontWeight: 700 }}>{wishlist.length}</span>}
        </Link>

        <Link href="/cart" style={{ position: 'relative', display: 'flex', color: dm ? C.surface : C.onSurface }}>
          <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          {cartCount > 0 && <span style={{ position: 'absolute', top: '-5px', right: '-7px', background: C.primary, color: 'white', borderRadius: '50%', width: '15px', height: '15px', fontSize: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: C.sans, fontWeight: 700 }}>{cartCount}</span>}
        </Link>

        {user ? (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {user.role === 'seller' && <Link href="/dashboard" style={{ fontFamily: C.sans, fontSize: '0.75rem', color: dm ? 'rgba(255,248,241,0.6)' : '#6b6560' }}>Dashboard</Link>}
            <button onClick={logout} style={{ fontFamily: C.sans, fontSize: '0.75rem', color: dm ? 'rgba(255,248,241,0.6)' : '#6b6560', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              {user.name?.split(' ')[0]}
            </button>
          </div>
        ) : (
          <Link href="/login" style={{ display: 'flex', color: dm ? C.surface : C.onSurface }}>
            <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.4" viewBox="0 0 24 24">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </Link>
        )}
      </div>
    </nav>
  )
}