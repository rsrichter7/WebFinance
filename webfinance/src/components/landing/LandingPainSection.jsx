// ─── LandingPainSection ───
// Pijn-sectie: herkenbare financiële frustraties die Webfinance oplost.

import React from 'react'
import { T } from '../../tokens'

const PIJNPUNTEN = [
  { emoji: '📊', tekst: 'Je bank-app toont wel transacties, maar geen overzicht.' },
  { emoji: '📉', tekst: 'Die Excel hield je twee maanden bij.' },
  { emoji: '💬', tekst: 'Ruzietjes over wie wat heeft betaald.' },
  { emoji: '💸', tekst: 'Sparen? Komt er nooit van.' },
]

export default function LandingPainSection() {
  return (
    <section style={{
      background: T.bg,
      padding: '80px clamp(20px, 5vw, 48px)',
    }}>
      <div style={{ maxWidth: 680, margin: '0 auto' }}>
        <div className="wf-reveal" style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{
            fontSize: 'clamp(22px, 4vw, 36px)',
            fontWeight: 800, color: T.ink,
            letterSpacing: -0.8, lineHeight: 1.2,
          }}>
            Je salaris komt binnen.<br />Drie weken later is het weg. Waar?
          </h2>
        </div>
        <div className="wf-reveal" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 36 }}>
          {PIJNPUNTEN.map(p => (
            <div key={p.tekst} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: T.card, borderRadius: 10, padding: '14px 18px',
              border: `1px solid ${T.border}`, boxShadow: T.shadow,
            }}>
              <span style={{ fontSize: 20, flex: '0 0 auto' }}>{p.emoji}</span>
              <span style={{ fontSize: 15, color: T.ink2, lineHeight: 1.45 }}>{p.tekst}</span>
            </div>
          ))}
        </div>
        <div className="wf-reveal" style={{
          textAlign: 'center',
          borderTop: `1px solid ${T.border}`, paddingTop: 28,
          fontSize: 15, color: T.ink3, fontWeight: 500,
        }}>
          Webfinance is gebouwd om precies díe vragen te beantwoorden.
        </div>
      </div>
    </section>
  )
}
