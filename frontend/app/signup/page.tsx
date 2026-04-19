'use client'
import { useState } from 'react'
import Link from 'next/link'
import { apiRequest } from '../../lib/api'
import { useApp } from '../../context/AppContext'

const C = { serif: "'Newsreader', Georgia, serif", sans: "'Plus Jakarta Sans', sans-serif", primary: '#9f402d', primaryLight: '#e2725b', surface: '#fff8f1', surfaceDim: '#ede7df', onSurface: '#1e1b17', muted: '#6b6560' }

export default function Signup() {
  const { setUser, showToast, darkMode } = useApp()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'buyer' })
  const [loading, setLoading] = useState(false)
  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const inputBg = dm ? '#211c16' : C.surfaceDim

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    try {
      const data = await apiRequest('/api/auth/signup', 'POST', form as any)
      localStorage.setItem('token', data.token)
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role })
      showToast(`Welcome, ${data.name.split(' ')[0]}!`)
      window.location.href = data.role === 'seller' ? '/dashboard' : '/'
    } catch (err: any) { showToast(err.message, 'error') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem' }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.75rem', textAlign: 'center' }}>Join HandArt</p>
        <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.5rem', fontWeight: 400, color: text, marginBottom: '0.5rem', textAlign: 'center' }}>Create Account</h1>
        <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted, textAlign: 'center', marginBottom: '2.5rem' }}>Be part of the artisan community</p>
        <div style={{ background: cardBg, borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 8px 40px rgba(30,27,23,0.07)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {[
              { label: 'Full Name', key: 'name', type: 'text', ph: 'Your name' },
              { label: 'Email', key: 'email', type: 'email', ph: 'you@example.com' },
              { label: 'Password', key: 'password', type: 'password', ph: 'Min 6 characters' },
            ].map(f => (
              <div key={f.key}>
                <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>{f.label}</label>
                <input type={f.type} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.ph} required
                  style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none' }} />
              </div>
            ))}
            <div>
              <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.75rem' }}>I want to</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[{ val: 'buyer', label: 'Buy Crafts' }, { val: 'seller', label: 'Sell Crafts' }].map(opt => (
                  <button key={opt.val} type="button" onClick={() => setForm({ ...form, role: opt.val })}
                    style={{ padding: '0.875rem', borderRadius: '0.75rem', fontFamily: C.sans, fontSize: '0.85rem', fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', background: form.role === opt.val ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})` : inputBg, color: form.role === opt.val ? 'white' : muted, border: 'none' }}>
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button type="submit" disabled={loading} style={{ marginTop: '0.5rem', padding: '1rem', borderRadius: '9999px', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: C.sans, fontSize: '0.9rem', fontWeight: 600, background: `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`, color: 'white', opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
        <p style={{ textAlign: 'center', fontFamily: C.sans, fontSize: '0.82rem', color: muted, marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: C.primary, fontWeight: 500 }}>Sign in →</Link>
        </p>
      </div>
    </div>
  )
}