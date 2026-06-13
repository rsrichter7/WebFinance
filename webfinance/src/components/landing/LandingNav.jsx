// ─── LandingNav ───
// Sticky navigatiebalk: transparant op hero, wit na scroll.

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { T } from '../../tokens'

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const onWhite = scrolled
  const linkClr = onWhite ? T.ink2 : 'rgba(255,255,255,0.88)'

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      height: 64,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 clamp(20px, 5vw, 48px)',
      transition: 'background 200ms ease, box-shadow 200ms ease',
      background: onWhite ? '#fff' : 'transparent',
      boxShadow: onWhite ? T.shadow : 'none',
    }}>
      {/* Logo */}
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{
          width: 30, height: 30, borderRadius: 7,
          background: onWhite ? T.ink : 'rgba(255,255,255,0.15)',
          border: onWhite ? 'none' : '1px solid rgba(255,255,255,0.22)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, fontWeight: 800, color: '#fff',
        }}>€</div>
        <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: -0.3, color: onWhite ? T.ink : '#fff' }}>
          Webfinance
        </span>
      </Link>

      {/* Rechts: links + knoppen */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span className="landing-nav-links" style={{ marginRight: 8, gap: 0 }}>
          <a href="#functies" style={{ fontSize: 14, padding: '6px 10px', color: linkClr, textDecoration: 'none', borderRadius: 6 }}>
            Functies
          </a>
          <a href="#prijzen" style={{ fontSize: 14, padding: '6px 10px', color: linkClr, textDecoration: 'none', borderRadius: 6 }}>
            Prijzen
          </a>
          <Link to="/privacy" style={{ fontSize: 14, padding: '6px 10px', color: linkClr, textDecoration: 'none', borderRadius: 6 }}>
            Privacy
          </Link>
        </span>
        <Link to="/login" style={{
          fontSize: 14, padding: '7px 14px', borderRadius: 8, fontWeight: 500,
          color: onWhite ? T.ink : '#fff', textDecoration: 'none',
          border: `1px solid ${onWhite ? T.border : 'rgba(255,255,255,0.28)'}`,
        }}>
          Inloggen
        </Link>
        <Link to="/login?modus=registreren" style={{
          fontSize: 14, padding: '7px 15px', borderRadius: 8, fontWeight: 600,
          background: onWhite ? T.blue : 'rgba(255,255,255,0.18)',
          color: '#fff', textDecoration: 'none',
        }}>
          Probeer gratis
        </Link>
      </div>
    </nav>
  )
}
