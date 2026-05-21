// ─── DashboardCategoryDonut ───
// Donut chart uitgaven per hoofdcategorie + legenda voor de geselecteerde maand.

import React from 'react'
import { T, fmt } from '../../tokens'
import { Card, CardTitle } from '../ui/Card'
import { CATEGORY_CONFIG } from '../../data/categoryConfig'
import { ICONS } from '../ui/Icons'

const MAANDEN = [
  'januari','februari','maart','april','mei','juni',
  'juli','augustus','september','oktober','november','december',
]

function DonutChart({ segmenten, totaal, size = 140, dikte = 26 }) {
  const r   = (size - dikte) / 2
  const omtrek = 2 * Math.PI * r
  const cx = size / 2
  const cy = size / 2

  let offset = 0
  const gaps = segmenten.length > 1 ? 2 : 0

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {/* Achtergrond ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke={T.rule} strokeWidth={dikte} />

      {segmenten.map((seg, i) => {
        const pct    = totaal > 0 ? seg.bedrag / totaal : 0
        const lengte = pct * omtrek - gaps
        const dash   = `${Math.max(0, lengte)} ${omtrek}`
        const rotatie = -90 + (offset / omtrek) * 360
        offset += pct * omtrek

        return (
          <circle
            key={seg.cat}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.kleur}
            strokeWidth={dikte}
            strokeDasharray={dash}
            strokeDashoffset={0}
            strokeLinecap="butt"
            transform={`rotate(${rotatie} ${cx} ${cy})`}
          />
        )
      })}

      {/* Midden label */}
      <text x={cx} y={cy - 7} textAnchor="middle" fontSize={13} fontWeight={700} fill={T.ink} fontFamily="Inter, sans-serif">
        {totaal >= 1000 ? `€${(totaal / 1000).toFixed(1)}k` : `€${Math.round(totaal)}`}
      </text>
      <text x={cx} y={cy + 10} textAnchor="middle" fontSize={10} fill={T.ink3} fontFamily="Inter, sans-serif">
        totaal
      </text>
    </svg>
  )
}

export default function DashboardCategoryDonut({ categoryTotals, maand }) {
  const maandNaam = MAANDEN[maand - 1]

  // Alleen categorieën met bedrag > 0, gesorteerd op bedrag
  const segmenten = categoryTotals
    .filter(c => c.bedrag > 0)
    .sort((a, b) => b.bedrag - a.bedrag)
    .map(c => {
      const cfg = CATEGORY_CONFIG[c.cat] || {}
      return { ...c, kleur: T[cfg.colorKey] || T.ink3, icoon: cfg.icon || 'grip' }
    })

  const totaal = segmenten.reduce((s, c) => s + c.bedrag, 0)

  return (
    <Card style={{ overflow: 'visible' }}>
      <CardTitle sub={`Verdeling van je uitgaven in ${maandNaam}`}>
        Uitgaven per categorie
      </CardTitle>

      {totaal === 0 ? (
        <div style={{ color: T.ink4, fontSize: 13, textAlign: 'center', padding: '24px 0' }}>
          Geen uitgaven in {maandNaam}
        </div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <DonutChart segmenten={segmenten} totaal={totaal} />

          {/* Legenda */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {segmenten.map(seg => (
              <div key={seg.cat} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: seg.kleur, flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: T.ink2, flex: 1 }}>{seg.cat}</span>
                <span style={{ fontSize: 12, fontWeight: 600, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
                  {fmt(seg.bedrag)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
