// ─── GroupChartDonut ───
// Donut + legenda voor familie 'groep'. Toont optioneel 50/30/20-referentielijnen (soort-dimensie).

import React from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { TAB, fmt, fmtShort } from '../../../tokens'

const FONT = "'Inter', system-ui, sans-serif"

function DonutSvg({ segments, total, T, size = 160 }) {
  const r    = (size / 2) - 11
  const circ = 2 * Math.PI * r
  let offset = 0

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.rule} strokeWidth="14" />
      {total > 0 && segments.map((seg, i) => {
        const dash = (seg.value / total) * circ
        const el = (
          <circle key={i} cx={size/2} cy={size/2} r={r} fill="none" stroke={seg.color} strokeWidth="14"
            strokeDasharray={`${dash} ${circ - dash}`} strokeDashoffset={-offset}
            transform={`rotate(-90 ${size/2} ${size/2})`} strokeLinecap="round" />
        )
        offset += dash
        return el
      })}
      <text x={size/2} y={size/2 - 5} textAnchor="middle" style={{ fontSize: 10.5, fill: T.ink3, fontFamily: FONT }}>Totaal</text>
      <text x={size/2} y={size/2 + 13} textAnchor="middle" style={{ fontSize: 15, fontWeight: 700, fill: T.ink, fontVariantNumeric: 'tabular-nums', fontFamily: FONT }}>
        {fmtShort(total)}
      </text>
    </svg>
  )
}

export default function GroupChartDonut({ items, metric, toonReferentie }) {
  const { T } = useTheme()
  const total    = items.reduce((s, i) => s + i.value, 0)
  const segments = items.map(i => ({ color: i.color, value: i.value }))
  const formatValue = (v) => metric === 'aantal' ? String(Math.round(v)) : fmt(v)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
      <DonutSvg segments={segments} total={total} T={T} size={160} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map(item => {
          const pct  = total > 0 ? (item.value / total) * 100 : 0
          const diff = toonReferentie ? pct - item.target : 0
          const diffGoed  = item.label === 'Sparen' ? diff >= 0 : diff <= 0
          const diffColor = diffGoed ? T.greenText : T.redText

          return (
            <div key={item.label}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: item.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 13, color: T.ink2 }}>{item.label || '—'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>{formatValue(item.value)}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: item.soft, color: item.color }}>{pct.toFixed(0)}%</span>
                </div>
              </div>
              {toonReferentie && (
                <>
                  <div style={{ position: 'relative' }}>
                    <div style={{ height: 5, background: T.rule, borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', borderRadius: 3, width: `${Math.min(pct, 100)}%`, background: item.color, transition: 'width 0.35s ease' }} />
                    </div>
                    <div style={{ position: 'absolute', top: -2, bottom: -2, left: `${item.target}%`, width: 2, background: T.ink4, borderRadius: 1 }} />
                  </div>
                  <div style={{ fontSize: 10.5, color: T.ink4, marginTop: 3 }}>
                    Doel: {item.target}%
                    {total > 0 && (
                      <span style={{ color: diffColor, marginLeft: 5, fontWeight: 600 }}>
                        {diff > 0 ? `+${diff.toFixed(0)}%` : `${diff.toFixed(0)}%`}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
