import './globals.css'
import Navbar from '../components/Navbar'

export const metadata = {
  title: 'HandArt — Handmade with Soul',
  description: 'Discover unique handcrafted items directly from artisans across India.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,300;0,400;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#fff8f1', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}