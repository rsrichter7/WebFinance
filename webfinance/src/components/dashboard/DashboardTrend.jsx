// ─── DashboardTrend ───
// Inkomsten vs. uitgaven area-grafiek met periode-tabs (3M / 6M / 1J).

import React, { useState, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt } from '../../tokens'
import { sparklineData } from '../../utils/dashboardCalculations'

const MAANDEN_KORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

function TrendChart({ inData, uitData, T }) {
  if (!inData || inData.length === 0) return null
  const W = 560, H = 160
  const max = Math.max(...inData, ...uitData, 1)

  function toPath(data, close = false) {
    const pts = data.map((v, i) => [
      (i / (data.length - 1)) * W,
      H - (v / max) * H * 0.82 - H * 0.09,
    ])
    const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
    return close ? `${line} L${W},${H} L0,${H} Z` : { line, pts }
  }

  const { line: inLine, pts: inPts }   = toPath(inData)
  const { line: uitLine, pts: uitPts } = toPath(uitData)
  const inArea  = toPath(inData, true)
  const uitArea = toPath(uitData, true)

  const gridLevels = [0.25, 0.5, 0.75]
  const lastIn  = inPts[inPts.length - 1]
  const lastUit = uitPts[uitPts.length - 1]

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <linearGradient id="wf-trend-in" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#10B981" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
        </linearGradient>
        <linearGradient id="wf-trend-uit" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EF4444" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {/* Gridlines */}
      {gridLevels.map((f, i) => {
        const y = H - f * H * 0.82 - H * 0.09
        return <line key={i} x1={0} y1={y} x2={W} y2={y} stroke={T.rule} strokeWidth="1" strokeDasharray="5,4" />
      })}

      {/* Areas */}
      <path d={inArea}  fill="url(#wf-trend-in)" />
      <path d={uitArea} fill="url(#wf-trend-uit)" />

      {/* Lines */}
      <path d={inLine}  stroke="#10B981" strokeWidth="2" fill="none" strokeLinejoin="round" />
      <path d={uitLine} stroke="#EF4444" strokeWidth="2" fill="none" strokeLinejoin="round" />

      {/* Einddots */}
      <circle cx={lastIn[0]}  cy={lastIn[1]}  r="4" fill="#10B981" />
      <circle cx={lastUit[0]} cy={lastUit[1]} r="4" fill="#EF4444" />
    </svg>
  )
}

export default function DashboardTrend({ allTransactions, animDelay = 0 }) {
  const { T }    = useTheme()
  const [periode, setPeriode] = useState('6M')

  const n = periode === '3M' ? 3 : periode === '1J' ? 12 : 6

  const inData  = useMemo(() => sparklineData(allTransactions, 'Inkomst', n), [allTransactions, n])
  const uitData = useMemo(() => sparklineData(allTransactions, 'Uitgave', n), [allTransactions, n])

  const nu = new Date()
  const maandLabels = Array.from({ length: n }, (_, i) => {
    const d = new Date(nu.getFullYear(), nu.getMonth() - (n - 1 - i), 1)
    return MAANDEN_KORT[d.getMonth()]
  })

  const gemSaldo = useMemo(() => {
    const diffs = inData.map((v, i) => v - uitData[i])
    return diffs.length > 0 ? diffs.reduce((s, v) => s + v, 0) / diffs.length : 0
  }, [inData, uitData])

  const tabStyle = (active) => ({
    padding: '5px 11px', fontSize: 12, fontWeight: 500, border: 'none',
    cursor: 'pointer', fontFamily: 'inherit',
    background: active ? T.blue : T.card, color: active ? '#fff' : T.ink3,
  })

  return (
    <div className="wf-anim-card wf-card-hover" style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      boxShadow: T.shadow, padding: '18px 20px',
      animationDelay: `${animDelay}ms`,
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Inkomsten vs. uitgaven</div>
          <div style={{ fontSize: 11.5, color: T.ink4, marginTop: 1 }}>Maandelijks verloop</div>
        </div>
        <div style={{ display: 'flex', border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
          {['3M', '6M', '1J'].map(p => (
            <button key={p} onClick={() => setPeriode(p)} style={tabStyle(periode === p)}>{p}</button>
          ))}
        </div>
      </div>

      {/* Grafiek */}
      <div style={{ marginBottom: 8 }}>
        <TrendChart inData={inData} uitData={uitData} T={T} />
      </div>

      {/* Maand-labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
        {maandLabels.map((m, i) => (
          <span key={i} style={{ fontSize: 11, color: T.ink4 }}>{m}</span>
        ))}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {[{ c: '#10B981', label: 'Inkomsten' }, { c: '#EF4444', label: 'Uitgaven' }].map(({ c, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              <span style={{ fontSize: 12, color: T.ink3 }}>{label}</span>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: T.ink3 }}>
          Gem. saldo:{' '}
          <span style={{ fontWeight: 600, color: gemSaldo >= 0 ? T.green : T.red, fontVariantNumeric: 'tabular-nums' }}>
            {gemSaldo >= 0 ? '+' : ''}{fmt(gemSaldo)}
          </span>
        </div>
      </div>
    </div>
  )
}
