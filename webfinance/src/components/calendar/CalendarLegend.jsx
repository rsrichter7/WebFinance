// ─── CalendarLegend ───
// Legenda voor de kalender-iconen en kleurcodes.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'

export default function CalendarLegend() {
  const { T } = useTheme()

  const ICON_ITEMS = [
    { icon: ICONS.clock,   color: T.blue,  label: 'Verwachte uitgave (vaste last)' },
    { icon: ICONS.arrDown, color: T.ink4,  label: 'Werkelijke uitgave' },
    { icon: ICONS.arrUp,   color: T.green, label: 'Inkomst' },
    { icon: ICONS.check,   color: T.green, label: 'Verwacht en betaald' },
  ]

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, padding: 16, marginTop: 16 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, marginBottom: 12 }}>Legenda</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {ICON_ITEMS.map(({ icon, color, label }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color, display: 'inline-flex' }}>{icon}</span>
            <span style={{ fontSize: 12, color: T.ink3 }}>{label}</span>
          </div>
        ))}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0, background: T.redSoft, border: '1px solid #FECACA' }} />
          <span style={{ fontSize: 12, color: T.ink3 }}>Hoge uitgave (&gt;€500)</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 14, height: 14, borderRadius: 3, flexShrink: 0, background: T.greenSoft, border: '1px solid #A7F3D0' }} />
          <span style={{ fontSize: 12, color: T.ink3 }}>Inkomsten verwacht</span>
        </div>
      </div>
    </div>
  )
}
