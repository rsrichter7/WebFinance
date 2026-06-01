// ─── IncomeSection ───
// Gegroepeerde categorietabellen voor vaste inkomsten.
// Donut staat in IncomeDonutCard en wordt op IncomePage naast IncomeCostSplit getoond.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'
import IncomeCategoryGroup from './IncomeCategoryGroup'

export default function IncomeSection({ groupedInkomsten, onEdit, onRemove }) {
  const { T } = useTheme()

  if (groupedInkomsten.length === 0) {
    return (
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 48, gap: 12 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: T.greenSoft, display: 'grid', placeItems: 'center', color: T.green, marginBottom: 4 }}>
          {ICONS.coin}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>Geen vaste inkomsten</div>
        <div style={{ fontSize: 13, color: T.ink3, textAlign: 'center', maxWidth: 300 }}>
          Voeg een vaste inkomst toe via de knop rechtsboven
        </div>
      </Card>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {groupedInkomsten.map(group => (
        <IncomeCategoryGroup key={group.name} icon={group.icon} title={group.name}
          color={group.color} colorSoft={group.colorSoft} items={group.items}
          subtotal={group.subtotal} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </div>
  )
}
