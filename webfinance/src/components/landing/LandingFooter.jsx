// ─── LandingFooter ───
// Eenvoudige footer: logo, tagline, links, copyright.

import React from 'react'
import { Link } from 'react-router-dom'
import { T } from '../../tokens'

export default function LandingFooter() {
  return (
    <footer style={{
      background: T.ink,
      padding: '36px clamp(20px, 5vw, 48px)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      flexWrap: 'wrap', gap: 20,
    }}>
      {/* Logo + tagline */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 7,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.14)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 14, fontWeight: 800, color: '#fff',
          }}>€</div>
          <span style={{ fontWeight: 700, fontSize: 15, color: '#fff', letterSpacing: -0.2 }}>
            Webfinance
          </span>
        </div>
        <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: 0, letterSpacing: 0.1 }}>
          Antwoorden over je geld, geen data.
        </p>
      </div>

      {/* Links + copyright */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <Link to="/privacy" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          Privacy
        </Link>
        <Link to="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'none' }}>
          Inloggen
        </Link>
        <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)' }}>© Webfinance</span>
      </div>
    </footer>
  )
}
