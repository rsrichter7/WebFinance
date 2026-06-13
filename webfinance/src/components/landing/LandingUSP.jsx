// ─── LandingUSP ───
// Vier USP-blokken: de onderscheidende kenmerken van Webfinance.

import React from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'

const USPS = [
  {
    icon: ICONS.download,
    titel: 'Gemaakt voor Nederland',
    tekst: 'Importeer je afschriften van Rabobank, ING, ABN AMRO, bunq en meer in één klik.',
  },
  {
    icon: ICONS.users,
    titel: 'Voor jullie samen',
    tekst: "Het enige overzicht dat met z'n tweeën net zo goed werkt als alleen.",
  },
  {
    icon: ICONS.analytics,
    titel: 'Antwoorden, geen data',
    tekst: 'Elke widget beantwoordt een echte vraag. Geen dashboards waar je zelf nog uit moet rekenen.',
  },
  {
    icon: ICONS.shield,
    titel: 'Jouw data blijft van jou',
    tekst: 'Gehost in de EU, nooit verkocht, geen advertenties.',
  },
]

export default function LandingUSP() {
  return (
    <section style={{
      background: T.bg,
      padding: '80px clamp(20px, 5vw, 48px)',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className="wf-reveal" style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{
            fontSize: 'clamp(20px, 3vw, 30px)',
            fontWeight: 800, color: T.ink, letterSpacing: -0.6,
          }}>
            Waarom Webfinance?
          </h2>
        </div>
        <div className="landing-usp-grid wf-reveal">
          {USPS.map(usp => (
            <div key={usp.titel} style={{
              background: T.card, border: `1px solid ${T.border}`,
              borderRadius: 12, padding: 22, boxShadow: T.shadow,
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 10,
                background: T.blueSoft, color: T.blue,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 14,
              }}>
                {usp.icon}
              </div>
              <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
                {usp.titel}
              </div>
              <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.55 }}>
                {usp.tekst}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
