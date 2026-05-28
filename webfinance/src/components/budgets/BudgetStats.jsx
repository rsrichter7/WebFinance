// ─── BudgetStats ───
// Drie StatCards: totaal budget, besteed en resterend.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { StatCard } from '../ui/Card'

export default function BudgetStats({ totaalBudget, totaalBesteed, totaalResterend }) {
  const { T } = useTheme()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
      <StatCard label="Totaal budget" value={totaalBudget} color={T.green} accent={T.green} />
      <StatCard label="Totaal besteed" value={totaalBesteed} color={T.red} accent={T.red} />
      <StatCard label="Totaal resterend" value={totaalResterend} color={T.blueText} accent={T.blue} />
    </div>
  )
}
