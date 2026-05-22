// ─── DashboardStatCards ───
// 3 overzichtskaarten: inkomsten, uitgaven, saldo — met trend vs vorige maand.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'

const MAANDEN_KORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

function TrendBadge({ pct, trendGood, vorigeMaand }) {
  if (pct === null || pct === undefined) return null
  const positief = pct > 0
  const goed = (trendGood === 'up' && positief) || (trendGood === 'down' && !positief)
  const kleur = goed ? T.green : T.red
  const bg    = goed ? T.greenSoft : T.redSoft
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      marginTop: 8, padding: '3px 8px', borderRadius: 6,
      background: bg, fontSize: 11.5, fontWeight: 600, color: kleur,
    }}>
      <span style={{ color: kleur }}>{positief ? '↑' : '↓'}</span>
      {Math.abs(pct).toFixed(1)}%
      <span style={{ fontWeight: 400, color: T.ink4, marginLeft: 2 }}>vs {vorigeMaand}</span>
    </div>
  )
}

function StatCard({ label, value, color, accent, trend, trendGood, vorigeMaandNaam }) {
  return (
    <Card style={{ flex: 1, padding: '18px 20px', borderTop: `3px solid ${accent}` }}>
      <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || T.ink, ...TAB, letterSpacing: -0.5 }}>
        {fmt(value)}
      </div>
      {trend !== null && trend !== undefined && (
        <TrendBadge pct={trend} trendGood={trendGood} vorigeMaand={vorigeMaandNaam} />
      )}
    </Card>
  )
}

function calcTrend(current, prev) {
  if (!prev || prev === 0) return null
  return ((current - prev) / prev) * 100
}

export default function DashboardStatCards({ maand, jaar, inkomsten, uitgaven, prevInkomsten, prevUitgaven, huidigSaldo }) {
  const vorigeMaandIdx  = maand === 1 ? 11 : maand - 2
  const vorigeMaandNaam = MAANDEN_KORT[vorigeMaandIdx]

  const inkomstenTrend = calcTrend(inkomsten, prevInkomsten)
  const uitgavenTrend  = calcTrend(uitgaven, prevUitgaven)

  // Saldo: huidigSaldo indien beschikbaar, anders inkomsten − uitgaven over alle tx
  const saldo = huidigSaldo !== undefined ? huidigSaldo : (inkomsten - uitgaven)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
      <StatCard
        label="Inkomsten"
        value={inkomsten}
        color={T.green}
        accent={T.green}
        trend={inkomstenTrend}
        trendGood="up"
        vorigeMaandNaam={vorigeMaandNaam}
      />
      <StatCard
        label="Uitgaven"
        value={uitgaven}
        color={T.red}
        accent={T.red}
        trend={uitgavenTrend}
        trendGood="down"
        vorigeMaandNaam={vorigeMaandNaam}
      />
      <StatCard
        label="Huidig Saldo"
        value={saldo}
        color={T.blue}
        accent={T.blue}
      />
    </div>
  )
}
