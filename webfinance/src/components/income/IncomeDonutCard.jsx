// ─── IncomeDonutCard ───
// Kaart met donut grafiek: inkomen per persoon, op volledige naam.

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { Card } from '../ui/Card'
import useProfiles from '../../hooks/useProfiles'

const FONT = "'Inter', system-ui, sans-serif"

function toMonthly(item) {
  if (item.herhaling === 'Wekelijks') return item.bedrag * 52 / 12
  if (item.herhaling === 'Jaarlijks') return item.bedrag / 12
  if (item.herhaling === 'Kwartaal')  return item.bedrag / 3
  return item.bedrag
}

export default function IncomeDonutCard({ items, size = 130 }) {
  const { T } = useTheme()
  const { profiles } = useProfiles()

  const perWie = useMemo(() => {
    const map = {}
    for (const item of items) {
      map[item.wie] = (map[item.wie] || 0) + toMonthly(item)
    }
    return Object.entries(map).map(([wie, value]) => {
      const p = profiles.find(pr => pr.initialen === wie)
      return {
        wie,
        naam:  p ? p.naam : wie,
        value,
        color: p ? p.kleur.bg : T.rule,
      }
    })
  }, [items, profiles])

  const total = perWie.reduce((s, e) => s + e.value, 0)
  const r     = (size / 2) - 8
  const circ  = 2 * Math.PI * r
  let offset  = 0

  return (
    <Card style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 28 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 14 }}>Inkomen per persoon</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {perWie.map((e, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 10, height: 10, borderRadius: 3, background: e.color, flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: T.ink2 }}>{e.naam}</span>
              <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, ...TAB, marginLeft: 'auto' }}>{fmt(e.value)}</span>
            </div>
          ))}
          {perWie.length === 0 && (
            <div style={{ fontSize: 13, color: T.ink4 }}>Geen inkomsten</div>
          )}
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
    </Card>
  )
}
