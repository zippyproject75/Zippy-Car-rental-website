import React, { useEffect } from 'react'

export default function App() {
  useEffect(() => {
    if (window.location.port === '8443') {
      window.location.replace(`http://${window.location.hostname}:3000`)
    }
  }, [])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: '2rem',
      textAlign: 'center',
      background: '#0a0a0b',
      color: '#f3eee4'
    }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '1rem', color: '#d4b373' }}>
        Zippy Car Rental Production
      </h1>
      <p style={{ maxWidth: '520px', marginBottom: '1.5rem', color: '#c4bdaf', lineHeight: 1.6 }}>
        The legacy single-file prototype previously running on port 8443 has been retired.
        All latest features, multi-page routing, fleet information, WhatsApp booking, and interactive maps are running on the official Next.js production server at <strong>localhost:3000</strong>.
      </p>
      <a
        href="http://localhost:3000"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.75rem 1.5rem',
          background: '#d4b373',
          color: '#0a0a0b',
          fontWeight: 700,
          borderRadius: '0.5rem',
          textDecoration: 'none',
          boxShadow: '0 4px 12px rgba(212, 179, 115, 0.3)'
        }}
      >
        Open http://localhost:3000 →
      </a>
    </div>
  )
}
