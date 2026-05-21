// ─── AnalyticsIncomeExpense ───
// Twee-lijnen SVG grafiek: inkomsten (groen) en uitgaven (rood) per periode-eenheid.

import React from 'react'
import { T } from '../../tokens'

const FONT  = "'Inter', system-ui, sans-serif"
const MLBL  = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

function fmtY(n) {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`
  return `€${Math.round(n)}`
}

function sumType(txs, type) {
  return txs.filter(t => t.type === type).reduce((s, t) => s + t.bedrag, 0)
}

function getUnits(allTransactions, period) {
  const { modus, maand, kwartaal, jaar } = period

  if (modus === 'jaar') {
    return Array.from({ length: 12 }, (_, m) => {
      const txs = allTransactions.filter(t => {
        const d = new Date(t.datum)
        return d.getFullYear() === jaar && d.getMonth() === m
      })
      return { label: MLBL[m], income: sumType(txs, 'Inkomst'), expense: sumType(txs, 'Uitgave') }
    })
  }

  if (modus === 'kwartaal') {
    const startM = kwartaal * 3
    return [0, 1, 2].map(i => {
      const m   = startM + i
      const txs = allTransactions.filter(t => {
        const d = new Date(t.datum)
        return d.getFullYear() === jaar && d.getMonth() === m
      })
      return { label: MLBL[m], income: sumType(txs, 'Inkomst'), expense: sumType(txs, 'Uitgave') }
    })
  }

  // Maand: per dag
  const daysInMonth = new Date(jaar, maand + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const txs = allTransactions.filter(t => {
      const d = new Date(t.datum)
      return d.getFullYear() === jaar && d.getMonth() === maand && d.getDate() === day
    })
    return { label: String(day), income: sumType(txs, 'Inkomst'), expense: sumType(txs, 'Uitgave') }
  })
}

function makePath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

export default function AnalyticsIncomeExpense({ allTransactions, period }) {
  const units = getUnits(allTransactions, period)

  const W = 540, H = 182
  const PL = 50, PR = 16, PT = 12, PB = 26
  const CW = W - PL - PR
  const CH = H - PT - PB

  const maxVal = Math.max(...units.flatMap(u => [u.income, u.expense]), 100)
  const n      = units.length

  function toPoints(key) {
    return units.map((u, i) => ({
      x: PL + (i / Math.max(n - 1, 1)) * CW,
      y: PT + (1 - u[key] / maxVal) * CH,
    }))
  }

  const incPts = toPoints('income')
  const expPts = toPoints('expense')

  // Label elke Nth stap zodat de x-as leesbaar blijft
  const step = n > 20 ? 6 : n > 6 ? 2 : 1

  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(pct => ({
    y: PT + pct * CH, val: maxVal * (1 - pct),
  }))

  const dotR = n > 15 ? 0 : 2.5

  return (
    <div>
      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
        {[{ color: T.green, label: 'Inkomsten' }, { color: T.red, label: 'Uitgaven' }].map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
            <span style={{ fontSize: 12, color: T.ink3 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', fontFamily: FONT }}>
        {/* Rasterlijnen + Y-labels */}
        {gridVals.map((g, i) => (
          <React.Fragment key={i}>
            <line x1={PL} y1={g.y} x2={W - PR} y2={g.y} stroke={T.rule} strokeWidth="1" />
            <text x={PL - 6} y={g.y + 4} textAnchor="end" fontSize="9.5" fill={T.ink4}
              fontFamily={FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtY(g.val)}
            </text>
          </React.Fragment>
        ))}

        {/* Inkomsten opvulling */}
        <path
          d={`${makePath(incPts)} L${incPts[n-1].x},${PT+CH} L${incPts[0].x},${PT+CH} Z`}
          fill={T.green} opacity="0.07"
        />

        {/* Inkomsten lijn + punten */}
        <path d={makePath(incPts)} fill="none" stroke={T.green} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
        {incPts.map((p, i) => dotR > 0 && (
          <circle key={i} cx={p.x} cy={p.y} r={dotR}
            fill={T.card} stroke={T.green} strokeWidth="1.5" />
        ))}

        {/* Uitgaven lijn + punten */}
        <path d={makePath(expPts)} fill="none" stroke={T.red} strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round" />
        {expPts.map((p, i) => dotR > 0 && (
          <circle key={i} cx={p.x} cy={p.y} r={dotR}
            fill={T.card} stroke={T.red} strokeWidth="1.5" />
        ))}

        {/* X-as labels */}
        {units.map((u, i) => (i % step === 0 || i === n - 1) && (
          <text key={i} x={incPts[i].x} y={H - 4}
            textAnchor="middle" fontSize="9.5" fill={T.ink4} fontFamily={FONT}>
            {u.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
