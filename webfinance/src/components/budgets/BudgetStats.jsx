// ─── BudgetStats ───
// Drie StatCards: totaal budget, besteed en resterend.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { StatCard } from '../ui/Card'

export default function BudgetStats({ totaalBudget, totaalBesteed, totaalResterend }) {
  const { T } = useTheme()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <StatCard label="Totaal budget" value={totaalBudget} color={T.statGreen} accent={T.statGreen} />
      <StatCard label="Totaal besteed" value={totaalBesteed} color={T.statRed} accent={T.statRed} />
      <StatCard label="Totaal resterend" value={totaalResterend} color={T.statBlue} accent={T.statBlue} />
    </div>
  )
}
