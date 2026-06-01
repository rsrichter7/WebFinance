// ─── IncomeStats ───
// StatCards voor de inkomstenpagina: vaste inkomsten, vaste lasten en restant.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { StatCard } from '../ui/Card'

export default function IncomeStats({ totals }) {
  const { T } = useTheme()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <StatCard label="Vaste inkomsten / maand" value={totals.inkomsten} color={T.statGreen} accent={T.statGreen} />
      <StatCard label="Vaste lasten / maand"    value={totals.uitgaven}  color={T.statRed}   accent={T.statRed} />
      <StatCard label="Restant / maand"          value={totals.restant}   color={T.statBlue}  accent={T.statBlue} />
    </div>
  )
}
