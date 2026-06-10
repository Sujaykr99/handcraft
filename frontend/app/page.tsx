'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')

    if (!storedUser) {
      router.replace('/login')
      return
    }

    try {
      const user = JSON.parse(storedUser)
      router.replace(user?.role === 'seller' ? '/dashboard' : '/my-account')
    } catch {
      localStorage.removeItem('user')
      localStorage.removeItem('token')
      router.replace('/login')
    }
  }, [router])

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fff8f1',
        color: '#1e1b17',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      Opening HandArt...
    </main>
  )
}
