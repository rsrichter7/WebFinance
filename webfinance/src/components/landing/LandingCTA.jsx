// ─── LandingCTA ───
// Afsluitende CTA-sectie met gradient achtergrond.

import React from 'react'
import { Link } from 'react-router-dom'
import { T } from '../../tokens'

export default function LandingCTA() {
  return (
    <section style={{
      background: T.gradHero,
      padding: '90px clamp(20px, 5vw, 48px)',
      textAlign: 'center',
    }}>
      <div className="wf-reveal">
        <h2 style={{
          fontSize: 'clamp(24px, 4vw, 42px)',
          fontWeight: 800, color: '#fff',
          letterSpacing: -1, lineHeight: 1.15, marginBottom: 32,
        }}>
          Klaar om te weten waar je geld blijft?
        </h2>
        <Link to="/login?modus=registreren" style={{
          display: 'inline-block',
          padding: '14px 32px', borderRadius: 10,
          background: '#fff', color: T.blue,
          fontSize: 16, fontWeight: 700, textDecoration: 'none',
          letterSpacing: -0.2, marginBottom: 16,
        }}>
          Probeer 1 maand gratis
        </Link>
        <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
          Eerste maand gratis · zeg op wanneer je wil
        </p>
      </div>
    </section>
  )
}
