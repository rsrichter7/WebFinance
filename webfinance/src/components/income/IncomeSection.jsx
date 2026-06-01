// ─── IncomeSection ───
// Inkomstenoverzicht: donut per persoon en gegroepeerde categorietabellen.

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'
import useProfiles from '../../hooks/useProfiles'
import IncomeCategoryGroup from './IncomeCategoryGroup'

const FONT = "'Inter', system-ui, sans-serif"

function toMonthly(item) {
  if (item.herhaling === 'Wekelijks') return item.bedrag * 52 / 12
  if (item.herhaling === 'Jaarlijks') return item.bedrag / 12
  if (item.herhaling === 'Kwartaal')  return item.bedrag / 3
  return item.bedrag
}

function WieDonut({ items, profiles, size = 130 }) {
  const { T } = useTheme()
  const perWie = useMemo(() => {
    const map = {}
    for (const item of items) {
      map[item.wie] = (map[item.wie] || 0) + toMonthly(item)
    }
    return Object.entries(map).map(([wie, value]) => {
      const p = profiles.find(pr => pr.initialen === wie)
      return { wie, value, color: p ? p.kleur.bg : T.rule }
    })
  }, [items, profiles])

  const total = perWie.reduce((s, e) => s + e.value, 0)
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 28, flex: 1 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 14 }}>Inkomen per persoon</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {perWie.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: e.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.ink2 }}>{e.wie}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, ...TAB, marginLeft: 'auto' }}>{fmt(e.value)}</span>
            </div>
          ))}
        </div>
      </div>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.rule} strokeWidth="10" />
        {perWie.map((seg, i) => {
          const dash = total > 0 ? (seg.value / total) * circ : 0
          const el = (
            <circle key={i} cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={seg.color} strokeWidth="10"
              strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`} strokeLinecap="round" />
          )
          offset += dash
          return el
        })}
        <text x={size / 2} y={size / 2 - 4} textAnchor="middle"
          style={{ fontSize: 13, fontWeight: 700, fill: T.ink, fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}>
          {fmt(total)}
        </text>
        <text x={size / 2} y={size / 2 + 12} textAnchor="middle"
          style={{ fontSize: 10, fill: T.ink4, fontFamily: FONT }}>
          / maand
        </text>
      </svg>
    </div>
  )
}

export default function IncomeSection({ groupedInkomsten, onEdit, onRemove }) {
  const { T } = useTheme()
  const { profiles } = useProfiles()
  const allItems = useMemo(() => groupedInkomsten.flatMap(g => g.items), [groupedInkomsten])

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
      <Card style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 28 }}>
        <WieDonut items={allItems} profiles={profiles} />
      </Card>
      {groupedInkomsten.map(group => (
        <IncomeCategoryGroup key={group.name} icon={group.icon} title={group.name}
          color={group.color} colorSoft={group.colorSoft} items={group.items}
          subtotal={group.subtotal} onEdit={onEdit} onRemove={onRemove} />
      ))}
    </div>
  )
}
