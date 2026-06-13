// ─── ProgressMockup ───
// Nagebootste spaardoel-progressbalk.

import React from 'react'
import { T, TAB } from '../../../tokens'

const DOELEN = [
  { naam: 'Vakantie Spanje 🌞', huidig: 850, doel: 1200, kleur: T.blue, deadline: 'aug 2026' },
  { naam: 'Nieuwe laptop 💻', huidig: 320, doel: 900, kleur: T.teal, deadline: 'dec 2026' },
]

export default function ProgressMockup() {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 22,
      boxShadow: '0 4px 24px rgba(17,24,39,0.07)',
      maxWidth: 300, width: '100%',
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 20 }}>
        Mijn spaardoelen
      </div>
      {DOELEN.map(doel => {
        const pct = Math.round((doel.huidig / doel.doel) * 100)
        return (
          <div key={doel.naam} style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 7 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{doel.naam}</span>
              <span style={{ fontSize: 11, color: T.ink3 }}>{doel.deadline}</span>
            </div>
            <div style={{ background: T.rule, borderRadius: 6, height: 8, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{
                width: `${pct}%`, height: '100%', borderRadius: 6,
                background: doel.kleur,
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span style={{ color: T.ink3, ...TAB }}>
                <span style={{ color: doel.kleur, fontWeight: 600 }}>
                  € {doel.huidig.toLocaleString('nl-NL')}
                </span>
                {' / € '}{doel.doel.toLocaleString('nl-NL')}
              </span>
              <span style={{ fontWeight: 600, color: T.ink3 }}>{pct}%</span>
            </div>
          </div>
        )
      })}
      <div style={{
        background: T.greenSoft, borderRadius: 8, padding: '10px 14px',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 14 }}>🎯</span>
        <span style={{ fontSize: 12, color: T.greenText, fontWeight: 500 }}>
          Vakantie: nog € 350 te gaan!
        </span>
      </div>
    </div>
  )
}
