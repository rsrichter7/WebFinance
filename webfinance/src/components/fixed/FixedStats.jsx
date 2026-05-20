// ─── FixedStats ───
// Overzichtskaarten en donut-grafiek voor vaste lasten.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'
import { StatCard, Card } from '../ui/Card'

const FONT = "'Inter', system-ui, sans-serif"

// SVG donut grafiek
function MiniDonut({ segments, size = 130 }) {
  const total = segments.reduce((s, seg) => s + seg.value, 0)
  const r = (size / 2) - 8
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={T.rule} strokeWidth="10" />
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ
        const el = (
          <circle
            key={i}
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={seg.color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            strokeLinecap="round"
          />
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
  )
}

export default function FixedStats({ totals, donutData }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        <StatCard
          label="Vaste lasten / maand"
          value={totals.uitgaven}
          color={T.red}
          accent={T.red}
        />
        <StatCard
          label="Vaste inkomsten / maand"
          value={totals.inkomsten}
          color={T.green}
          accent={T.green}
        />
        <StatCard
          label="Restant / maand"
          value={totals.restant}
          color={totals.restant >= 0 ? T.blue : T.red}
          accent={totals.restant >= 0 ? T.blue : T.red}
        />
      </div>

      {/* Donut + legenda */}
      {donutData.length > 0 && (
        <Card style={{ padding: 22, display: 'flex', alignItems: 'center', gap: 28 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, marginBottom: 14 }}>
              Verdeling vaste lasten
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {donutData.map((seg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 10, height: 10, borderRadius: 3,
                    background: seg.color, flexShrink: 0,
                  }} />
                  <span style={{ fontSize: 13, color: T.ink2 }}>{seg.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 500, color: T.ink, ...TAB, marginLeft: 'auto' }}>
                    {fmt(seg.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <MiniDonut segments={donutData} size={130} />
        </Card>
      )}
    </div>
  )
}
