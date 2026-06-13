// ─── UpcomingMockup ───
// Nagebootste lijst van aankomende vaste lasten deze maand.

import React from 'react'
import { T, TAB } from '../../../tokens'

const LASTEN = [
  { naam: 'Huur',           datum: '1 jul',  bedrag: 875,   kleur: T.blue },
  { naam: 'Spotify',        datum: '3 jul',  bedrag: 11.99, kleur: T.teal },
  { naam: 'Verzekering',    datum: '5 jul',  bedrag: 92,    kleur: T.amber },
  { naam: 'Netflix',        datum: '8 jul',  bedrag: 17.99, kleur: '#7C3AED' },
  { naam: 'Energierekening',datum: '15 jul', bedrag: 134,   kleur: T.red },
]

export default function UpcomingMockup() {
  const totaal = LASTEN.reduce((s, l) => s + l.bedrag, 0)

  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 22,
      boxShadow: '0 4px 24px rgba(17,24,39,0.07)',
      maxWidth: 300, width: '100%',
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 18 }}>
        Aankomende afschrijvingen
      </div>
      {LASTEN.map((last, i) => (
        <div key={last.naam} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: i < LASTEN.length - 1 ? 10 : 0,
          marginBottom: i < LASTEN.length - 1 ? 10 : 0,
          borderBottom: i < LASTEN.length - 1 ? `1px solid ${T.rule}` : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: last.kleur, flex: '0 0 auto' }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{last.naam}</div>
              <div style={{ fontSize: 11, color: T.ink3 }}>{last.datum}</div>
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.red, ...TAB }}>
            −€ {last.bedrag.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
      <div style={{
        marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.rule}`,
        display: 'flex', justifyContent: 'space-between', fontSize: 12,
      }}>
        <span style={{ color: T.ink3 }}>Totaal deze maand</span>
        <span style={{ fontWeight: 700, color: T.ink, ...TAB }}>
          −€ {totaal.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  )
}
