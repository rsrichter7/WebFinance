// ─── FixedStats ───
// StatCards voor vaste lasten (totalen) + tekst-verdeling per categorie (zonder donut).

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { StatCard, Card } from '../ui/Card'

// Tekst-lijst van categorieverdeling, zonder cirkeldiagram
export function FixedUitgavenDonut({ donutData }) {
  const { T } = useTheme()
  if (!donutData || donutData.length === 0) return null
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 14 }}>
        Verdeling vaste lasten
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {donutData.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ width: 10, height: 10, borderRadius: 3, background: seg.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: T.ink2 }}>{seg.label}</span>
            <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, ...TAB, marginLeft: 'auto' }}>
              {fmt(seg.value)}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

export default function FixedStats({ totals }) {
  const { T } = useTheme()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <StatCard label="Vaste inkomsten / maand" value={totals.inkomsten} color={T.statGreen} accent={T.statGreen} />
      <StatCard label="Vaste lasten / maand" value={totals.uitgaven} color={T.statRed} accent={T.statRed} />
      <StatCard label="Restant / maand" value={totals.restant} color={T.statBlue} accent={T.statBlue} />
    </div>
  )
}
