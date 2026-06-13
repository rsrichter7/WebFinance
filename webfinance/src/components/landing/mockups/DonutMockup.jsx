// ─── DonutMockup ───
// Nagebootste categorie-donut: statische mockup van de echte widget.

import React from 'react'
import { T, TAB } from '../../../tokens'

const ITEMS = [
  { label: 'Wonen',           bedrag: 790,  pct: 42, color: T.blue },
  { label: 'Dagelijks leven', bedrag: 525,  pct: 28, color: T.amber },
  { label: 'Vervoer',         bedrag: 338,  pct: 18, color: T.teal },
  { label: 'Vrije tijd',      bedrag: 225,  pct: 12, color: T.red },
]

export default function DonutMockup() {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 22,
      boxShadow: '0 4px 24px rgba(17,24,39,0.07)',
      maxWidth: 300, width: '100%',
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 18 }}>
        Waar is mijn geld gebleven?
      </div>
      {/* Donut via conic-gradient */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{
          width: 144, height: 144, borderRadius: '50%',
          background: `conic-gradient(
            ${T.blue} 0% 42%,
            ${T.amber} 42% 70%,
            ${T.teal} 70% 88%,
            ${T.red} 88% 100%
          )`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{
            width: 90, height: 90, borderRadius: '50%', background: T.card,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.ink, ...TAB }}>€ 1.878</div>
            <div style={{ fontSize: 10, color: T.ink3 }}>totaal</div>
          </div>
        </div>
      </div>
      {/* Legenda */}
      {ITEMS.map((item, i) => (
        <div key={item.label} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          paddingBottom: i < ITEMS.length - 1 ? 9 : 0,
          marginBottom: i < ITEMS.length - 1 ? 9 : 0,
          borderBottom: i < ITEMS.length - 1 ? `1px solid ${T.rule}` : 'none',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 9, height: 9, borderRadius: 2, background: item.color, flex: '0 0 auto' }} />
            <span style={{ fontSize: 13, color: T.ink2 }}>{item.label}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 11, color: T.ink4 }}>{item.pct}%</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>
              € {item.bedrag.toLocaleString('nl-NL')}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}
