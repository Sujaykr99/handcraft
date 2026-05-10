'use client'
import { useState } from 'react'
import Link from 'next/link'
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

const roles = [
  {
    value: 'buyer',
    emoji: '🛍️',
    title: 'I am a Buyer',
    subtitle: 'Shop handmade crafts',
    perks: [
      'Browse thousands of handmade items',
      'Buy directly from artisans',
      'Save items to wishlist',
      'Track your orders',
    ],
    bg: '#faf2ea',
    border: '#e8d5c4',
  },
  {
    value: 'seller',
    emoji: '🏺',
    title: 'I am an Artisan',
    subtitle: 'Sell your handmade crafts',
    perks: [
      'List your handmade products',
      'Receive payments directly',
      'Manage your orders',
      'Build your artisan profile',
    ],
    bg: 'rgba(159,64,45,0.05)',
    border: 'rgba(159,64,45,0.25)',
  },
]

export default function Signup() {
  const { setUser, showToast, darkMode } = useApp()
  const [step, setStep] = useState<'role'|'details'>('role')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: '' })
  const [loading, setLoading] = useState(false)

  const dm = darkMode
  const bg = dm ? '#1a1410' : C.surface
  const cardBg = dm ? '#2a2218' : '#ffffff'
  const text = dm ? '#fff8f1' : C.onSurface
  const muted = dm ? '#b5a898' : C.muted
  const inputBg = dm ? '#211c16' : C.surfaceDim
  const dimBg = dm ? '#211c16' : C.surfaceLow

  const handleRoleSelect = (role: string) => {
    setForm({ ...form, role })
    setStep('details')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await apiRequest('/api/auth/signup', 'POST', form as any)
      localStorage.setItem('token', data.token)
      setUser({ _id: data._id, name: data.name, email: data.email, role: data.role })
      showToast(`Welcome to HandArt, ${data.name.split(' ')[0]}!`)
      if (data.role === 'seller') {
        window.location.href = '/dashboard'
      } else {
        window.location.href = '/my-account'
      }
    } catch (err: any) { showToast(err.message, 'error') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ background: bg, minHeight: '100vh', paddingTop: '80px' }}>

      {/* Step indicator */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', padding: '2rem 0 0' }}>
        {['Choose Role', 'Your Details'].map((label, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '28px', height: '28px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: C.sans, fontSize: '0.75rem', fontWeight: 700,
              background: (step === 'role' && i === 0) || (step === 'details' && i <= 1)
                ? `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`
                : C.surfaceHigh,
              color: (step === 'role' && i === 0) || (step === 'details' && i <= 1) ? 'white' : muted,
              transition: 'all 0.3s'
            }}>
              {step === 'details' && i === 0 ? '✓' : i + 1}
            </div>
            <span style={{ fontFamily: C.sans, fontSize: '0.78rem', color: i === (step === 'role' ? 0 : 1) ? text : muted }}>
              {label}
            </span>
            {i === 0 && <div style={{ width: '40px', height: '1px', background: step === 'details' ? C.primary : C.surfaceHigh, transition: 'background 0.3s' }} />}
          </div>
        ))}
      </div>

      {/* STEP 1 — Role selection */}
      {step === 'role' && (
        <div style={{ maxWidth: '760px', margin: '0 auto', padding: '3rem 2rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <p style={{ fontFamily: C.sans, fontSize: '10px', letterSpacing: '0.18em', textTransform: 'uppercase', color: C.primary, marginBottom: '0.75rem' }}>
              Join HandArt
            </p>
            <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.75rem', fontWeight: 400, color: text, marginBottom: '0.5rem' }}>
              Who are you?
            </h1>
            <p style={{ fontFamily: C.sans, fontSize: '0.88rem', color: muted }}>
              Choose your role to get started
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            {roles.map(role => (
              <div key={role.value}
                onClick={() => handleRoleSelect(role.value)}
                style={{
                  background: dm ? '#2a2218' : role.bg,
                  border: `2px solid ${dm ? 'rgba(159,64,45,0.2)' : role.border}`,
                  borderRadius: '1.25rem', padding: '2.5rem 2rem',
                  cursor: 'pointer', transition: 'all 0.25s',
                  position: 'relative', overflow: 'hidden'
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = '0 16px 48px rgba(30,27,23,0.12)'
                  ;(e.currentTarget as HTMLElement).style.borderColor = C.primary
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLElement).style.boxShadow = 'none'
                  ;(e.currentTarget as HTMLElement).style.borderColor = dm ? 'rgba(159,64,45,0.2)' : role.border
                }}
              >
                <div style={{ fontSize: '3rem', marginBottom: '1.25rem' }}>{role.emoji}</div>
                <h2 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '1.5rem', fontWeight: 400, color: text, marginBottom: '0.3rem' }}>
                  {role.title}
                </h2>
                <p style={{ fontFamily: C.sans, fontSize: '0.8rem', color: C.primary, fontWeight: 500, marginBottom: '1.5rem' }}>
                  {role.subtitle}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                  {role.perks.map(perk => (
                    <div key={perk} style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
                      <span style={{ color: C.primary, fontSize: '0.75rem', marginTop: '2px', flexShrink: 0 }}>✦</span>
                      <span style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted, lineHeight: 1.5 }}>{perk}</span>
                    </div>
                  ))}
                </div>
                <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', fontFamily: C.sans, fontSize: '0.78rem', color: C.primary, fontWeight: 500 }}>
                  Select →
                </div>
              </div>
            ))}
          </div>

          <p style={{ textAlign: 'center', fontFamily: C.sans, fontSize: '0.82rem', color: muted, marginTop: '2rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: C.primary, fontWeight: 500 }}>Sign in →</Link>
          </p>
        </div>
      )}

      {/* STEP 2 — Details form */}
      {step === 'details' && (
        <div style={{ maxWidth: '480px', margin: '0 auto', padding: '3rem 2rem 4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: dimBg, borderRadius: '9999px', padding: '0.5rem 1.25rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '1.25rem' }}>
                {form.role === 'seller' ? '🏺' : '🛍️'}
              </span>
              <span style={{ fontFamily: C.sans, fontSize: '0.82rem', color: text, fontWeight: 500 }}>
                {form.role === 'seller' ? 'Artisan Account' : 'Buyer Account'}
              </span>
              <button onClick={() => setStep('role')} style={{ fontFamily: C.sans, fontSize: '0.72rem', color: C.primary, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                Change
              </button>
            </div>
            <h1 style={{ fontFamily: C.serif, fontStyle: 'italic', fontSize: '2.25rem', fontWeight: 400, color: text, marginBottom: '0.4rem' }}>
              Your Details
            </h1>
            <p style={{ fontFamily: C.sans, fontSize: '0.82rem', color: muted }}>
              {form.role === 'seller'
                ? 'Set up your artisan studio account'
                : 'Create your buyer account to start shopping'
              }
            </p>
          </div>

          <div style={{ background: cardBg, borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 8px 40px rgba(30,27,23,0.07)' }}>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: form.role === 'seller' ? 'Artisan Name' : 'Full Name', key: 'name', type: 'text', placeholder: form.role === 'seller' ? 'Your craft name or studio name' : 'Your full name' },
                { label: 'Email Address', key: 'email', type: 'email', placeholder: 'you@example.com' },
                { label: 'Password', key: 'password', type: 'password', placeholder: 'Min 6 characters' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontFamily: C.sans, fontSize: '0.78rem', fontWeight: 500, color: text, display: 'block', marginBottom: '0.5rem' }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={(form as any)[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    required
                    style={{ width: '100%', background: inputBg, border: 'none', borderRadius: '0.75rem', padding: '0.875rem 1.1rem', fontFamily: C.sans, fontSize: '0.875rem', color: text, outline: 'none' }}
                  />
                </div>
              ))}

              {/* Seller extra note */}
              {form.role === 'seller' && (
                <div style={{ background: 'rgba(159,64,45,0.06)', borderRadius: '0.875rem', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1rem', flexShrink: 0 }}>ℹ️</span>
                  <p style={{ fontFamily: C.sans, fontSize: '0.78rem', color: muted, lineHeight: 1.65 }}>
                    After signing up, you can immediately start listing your handmade products from your Artisan Studio dashboard.
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  marginTop: '0.5rem', padding: '1rem', borderRadius: '9999px',
                  border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
                  fontFamily: C.sans, fontSize: '0.9rem', fontWeight: 700,
                  background: loading ? C.surfaceDim : `linear-gradient(135deg, ${C.primary}, ${C.primaryLight})`,
                  color: loading ? muted : 'white',
                  opacity: loading ? 0.7 : 1, transition: 'opacity 0.2s'
                }}>
                {loading
                  ? 'Creating account...'
                  : form.role === 'seller'
                    ? 'Open My Artisan Studio →'
                    : 'Start Shopping →'
                }
              </button>
            </form>
          </div>

          <p style={{ textAlign: 'center', fontFamily: C.sans, fontSize: '0.82rem', color: muted, marginTop: '1.5rem' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: C.primary, fontWeight: 500 }}>Sign in →</Link>
          </p>
        </div>
      )}
    </div>
  )
}
