// ─── CalendarStats ───
// Drie statistiekkaarten: inkomsten, uitgaven en verschil — consistent met andere pagina's.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'

function MiniCard({ label, children, accentColor }) {
  const { T } = useTheme()
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderTop: `3px solid ${accentColor}`,
      borderRadius: 10, padding: '14px 16px', boxShadow: T.shadow,
    }}>
      <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }}>{label}</div>
      {children}
    </div>
  )
}

export default function CalendarStats({ totalIncome, totalExpenses }) {
  const { T } = useTheme()
  const diff = totalIncome - totalExpenses
  const diffColor = diff >= 0 ? T.statGreen : T.statRed

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <MiniCard label="Inkomsten" accentColor={T.statGreen}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.statGreen, ...TAB }}>{fmt(totalIncome)}</div>
      </MiniCard>
      <MiniCard label="Uitgaven" accentColor={T.statRed}>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.statRed, ...TAB }}>{fmt(totalExpenses)}</div>
      </MiniCard>
      <MiniCard label="Verschil" accentColor={T.statBlue}>
        <div style={{ fontSize: 22, fontWeight: 700, color: diffColor, ...TAB }}>
          {diff >= 0 ? '+' : '−'} {fmt(Math.abs(diff))}
        </div>
      </MiniCard>
    </div>
  )
}
