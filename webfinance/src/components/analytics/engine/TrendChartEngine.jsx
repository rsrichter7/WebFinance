// ─── TrendChartEngine ───
// Tekenaar voor familie 'trend': tijdreeks per periode-eenheid (dag/maand), als lijn of staaf.
// filters.type bepaalt welke lijn(en) getekend worden ('Beide' → inkomsten + uitgaven).

import React from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { filterByConfig } from './filterUtils'

const FONT = "'Inter', system-ui, sans-serif"
const MLBL = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

function fmtY(n) {
  if (n >= 1000) return `€${(n / 1000).toFixed(1)}k`
  return `€${Math.round(n)}`
}

function sumType(txs, type) {
  return txs.filter(t => t.type === type).reduce((s, t) => s + t.bedrag, 0)
}

function getUnits(transactions, period) {
  const { modus, maand, kwartaal, jaar } = period
  if (modus === 'jaar') {
    return Array.from({ length: 12 }, (_, m) => {
      const txs = transactions.filter(t => { const d = new Date(t.datum); return d.getFullYear() === jaar && d.getMonth() === m })
      return { label: MLBL[m], income: sumType(txs, 'Inkomst'), expense: sumType(txs, 'Uitgave') }
    })
  }
  if (modus === 'kwartaal') {
    const startM = kwartaal * 3
    return [0, 1, 2].map(i => {
      const m   = startM + i
      const txs = transactions.filter(t => { const d = new Date(t.datum); return d.getFullYear() === jaar && d.getMonth() === m })
      return { label: MLBL[m], income: sumType(txs, 'Inkomst'), expense: sumType(txs, 'Uitgave') }
    })
  }
  const daysInMonth = new Date(jaar, maand + 1, 0).getDate()
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1
    const txs = transactions.filter(t => { const d = new Date(t.datum); return d.getFullYear() === jaar && d.getMonth() === maand && d.getDate() === day })
    return { label: String(day), income: sumType(txs, 'Inkomst'), expense: sumType(txs, 'Uitgave') }
  })
}

function makePath(pts) {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
}

export default function TrendChartEngine({ config, allTransactions, period }) {
  const { T } = useTheme()
  const filters   = config.filters || {}
  const type      = filters.type || 'Beide'
  const gefilterd = filterByConfig(allTransactions, { ...filters, type: undefined })
  const units     = getUnits(gefilterd, period)
  const n         = units.length

  const lijnen = type === 'Beide'
    ? [{ key: 'income', color: T.green, label: 'Inkomsten' }, { key: 'expense', color: T.red, label: 'Uitgaven' }]
    : type === 'Inkomst'
      ? [{ key: 'income', color: T.green, label: 'Inkomsten' }]
      : [{ key: 'expense', color: T.red, label: 'Uitgaven' }]

  if (config.grafiekvorm === 'staaf') {
    const barMax = Math.max(...units.flatMap(u => lijnen.map(l => u[l.key])), 1)
    return (
      <div>
        <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
          {lijnen.map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: l.color }} />
              <span style={{ fontSize: 12, color: T.ink3 }}>{l.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160 }}>
          {units.map((u, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', gap: 2, alignItems: 'flex-end', justifyContent: 'center', height: '100%' }}>
              {lijnen.map(l => (
                <div key={l.key} style={{
                  width: '100%', maxWidth: 14, borderRadius: 2, background: l.color,
                  height: `${u[l.key] > 0 ? Math.max((u[l.key] / barMax) * 100, 1.5) : 0}%`,
                }} />
              ))}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {units.map((u, i) => (
            <div key={i} style={{ flex: 1, fontSize: 9.5, color: T.ink4, textAlign: 'center' }}>{u.label}</div>
          ))}
        </div>
      </div>
    )
  }

  const W = 540, H = 182, PL = 50, PR = 16, PT = 12, PB = 26
  const CW = W - PL - PR, CH = H - PT - PB
  const maxVal = Math.max(...units.flatMap(u => lijnen.map(l => u[l.key])), 100)

  function toPoints(key) {
    return units.map((u, i) => ({
      x: PL + (i / Math.max(n - 1, 1)) * CW,
      y: PT + (1 - u[key] / maxVal) * CH,
    }))
  }

  const step = n > 20 ? 6 : n > 6 ? 2 : 1
  const gridVals = [0, 0.25, 0.5, 0.75, 1].map(pct => ({ y: PT + pct * CH, val: maxVal * (1 - pct) }))
  const dotR = n > 15 ? 0 : 2.5

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
        {lijnen.map(l => (
          <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
            <span style={{ fontSize: 12, color: T.ink3 }}>{l.label}</span>
          </div>
        ))}
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', fontFamily: FONT }}>
        {gridVals.map((g, i) => (
          <React.Fragment key={i}>
            <line x1={PL} y1={g.y} x2={W - PR} y2={g.y} stroke={T.rule} strokeWidth="1" />
            <text x={PL - 6} y={g.y + 4} textAnchor="end" fontSize="9.5" fill={T.ink4} fontFamily={FONT} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {fmtY(g.val)}
            </text>
          </React.Fragment>
        ))}

        {lijnen.map(l => {
          const pts = toPoints(l.key)
          return (
            <React.Fragment key={l.key}>
              {l.key === 'income' && (
                <path d={`${makePath(pts)} L${pts[n-1].x},${PT+CH} L${pts[0].x},${PT+CH} Z`} fill={T.green} opacity="0.07" />
              )}
              <path d={makePath(pts)} fill="none" stroke={l.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => dotR > 0 && (
                <circle key={i} cx={p.x} cy={p.y} r={dotR} fill={T.card} stroke={l.color} strokeWidth="1.5" />
              ))}
            </React.Fragment>
          )
        })}

        {units.map((u, i) => (i % step === 0 || i === n - 1) && (
          <text key={i} x={PL + (i / Math.max(n - 1, 1)) * CW} y={H - 4} textAnchor="middle" fontSize="9.5" fill={T.ink4} fontFamily={FONT}>
            {u.label}
          </text>
        ))}
      </svg>
    </div>
  )
}
