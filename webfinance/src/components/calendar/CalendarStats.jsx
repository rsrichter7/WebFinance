// ─── CalendarStats ───
// Drie statistiekkaarten: verwachte uitgaven, werkelijke uitgaven en verschil.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'

function MiniCard({ label, children }) {
  const { T } = useTheme()
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 10, padding: '14px 16px', boxShadow: T.shadow }}>
      <div style={{ fontSize: 11, color: T.ink4, fontWeight: 500, marginBottom: 4 }}>{label}</div>
      {children}
    </div>
  )
}

export default function CalendarStats({ totalExpected, totalActual }) {
  const { T } = useTheme()
  const diff = totalExpected - totalActual
  const onderVerwachting = diff >= 0

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <MiniCard label="Verwachte uitgaven">
        <div style={{ fontSize: 18, fontWeight: 700, color: T.green, ...TAB }}>{fmt(totalExpected)}</div>
      </MiniCard>
      <MiniCard label="Werkelijke uitgaven">
        <div style={{ fontSize: 18, fontWeight: 700, color: T.red, ...TAB }}>{fmt(totalActual)}</div>
      </MiniCard>
      <MiniCard label="Verschil">
        <div style={{ fontSize: 18, fontWeight: 700, color: T.blueText, ...TAB }}>
          {onderVerwachting ? '−' : '+'} {fmt(Math.abs(diff))}
        </div>
        <div style={{ fontSize: 11, color: T.ink4, marginTop: 2 }}>
          {onderVerwachting ? 'Onder verwachting' : 'Boven verwachting'}
        </div>
      </MiniCard>
    </div>
  )
}
