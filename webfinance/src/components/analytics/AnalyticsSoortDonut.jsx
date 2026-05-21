// ─── AnalyticsSoortDonut ───
// Donut grafiek voor Noodzaak / Wens / Sparen verdeling met 50/30/20 referentie.

import React from 'react'
import { T, TAB, fmt, fmtShort } from '../../tokens'

const FONT = "'Inter', system-ui, sans-serif"

const SOORTEN = [
  { key: 'Noodzaak', color: T.blue,   soft: T.blueSoft,   target: 50 },
  { key: 'Wens',     color: T.violet, soft: T.violetSoft, target: 30 },
  { key: 'Sparen',   color: T.green,  soft: T.greenSoft,  target: 20 },
]

function filterPeriod(transactions, period) {
  return transactions.filter(t => {
    if (t.type !== 'Uitgave') return false
    const d = new Date(t.datum)
    if (period.modus === 'maand')
      return d.getFullYear() === period.jaar && d.getMonth() === period.maand
    if (period.modus === 'kwartaal')
      return d.getFullYear() === period.jaar && Math.floor(d.getMonth() / 3) === period.kwartaal
    return d.getFullYear() === period.jaar
  })
}

function Donut({ segments, total, size = 160 }) {
  const r    = (size / 2) - 11
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      {/* Achtergrondcirkel */}
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.rule} strokeWidth="14" />
      {/* Segmenten */}
      {total > 0 && segments.map((seg, i) => {
        const dash = (seg.value / total) * circ
        const el = (
          <circle
            key={i}
            cx={size/2} cy={size/2} r={r}
            fill="none" stroke={seg.color} strokeWidth="14"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            strokeLinecap="round"
          />
        )
        offset += dash
        return el
      })}
      {/* Centrumlabel */}
      <text x={size/2} y={size/2 - 5} textAnchor="middle"
        style={{ fontSize: 10.5, fill: T.ink3, fontFamily: FONT }}>Totaal</text>
      <text x={size/2} y={size/2 + 13} textAnchor="middle"
        style={{ fontSize: 15, fontWeight: 700, fill: T.ink, fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}>
        {fmtShort(total)}
      </text>
    </svg>
  )
}

export default function AnalyticsSoortDonut({ allTransactions, period }) {
  const filtered = filterPeriod(allTransactions, period)
  const totals   = { Noodzaak: 0, Wens: 0, Sparen: 0 }
  for (const t of filtered) {
    if (totals[t.soort] !== undefined) totals[t.soort] += t.bedrag
  }
  const total    = Object.values(totals).reduce((s, v) => s + v, 0)
  const segments = SOORTEN.map(s => ({ ...s, value: totals[s.key] }))

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <Donut segments={segments} total={total} size={160} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {SOORTEN.map(s => {
          const val  = totals[s.key]
          const pct  = total > 0 ? (val / total) * 100 : 0
          const diff = pct - s.target
          // Noodzaak en Wens: lager dan doel = goed. Sparen: hoger = goed.
          const diffGoed = s.key === 'Sparen' ? diff >= 0 : diff <= 0
          const diffColor = diffGoed ? T.greenText : T.redText

          return (
            <div key={s.key}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.ink2 }}>{s.key}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>{fmt(val)}</span>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '2px 6px',
                    borderRadius: 4, background: s.soft, color: s.color,
                  }}>{pct.toFixed(0)}%</span>
                </div>
              </div>

              {/* Voortgangsbalk met doellijn */}
              <div style={{ position: 'relative' }}>
                <div style={{ height: 5, background: T.rule, borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', borderRadius: 3,
                    width: `${Math.min(pct, 100)}%`,
                    background: s.color,
                    transition: 'width 0.35s ease',
                  }} />
                </div>
                {/* Doellijn (50/30/20) */}
                <div style={{
                  position: 'absolute', top: -2, bottom: -2,
                  left: `${s.target}%`, width: 2,
                  background: T.ink4, borderRadius: 1,
                }} />
              </div>

              <div style={{ fontSize: 10.5, color: T.ink4, marginTop: 3 }}>
                Doel: {s.target}%
                {total > 0 && (
                  <span style={{ color: diffColor, marginLeft: 5, fontWeight: 600 }}>
                    {diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
