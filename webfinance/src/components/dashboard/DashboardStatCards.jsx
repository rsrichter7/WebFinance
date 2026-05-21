// ─── DashboardStatCards ───
// 4 overzichtskaarten: saldo, inkomsten, uitgaven, resterend — met trend vs vorige maand.

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

export default function DashboardStatCards({ maand, jaar, inkomsten, uitgaven, prevInkomsten, prevUitgaven }) {
  const saldo     = inkomsten - uitgaven
  const prevSaldo = prevInkomsten - prevUitgaven
  const resterend = inkomsten - uitgaven

  const vorigeMaandIdx = maand === 1 ? 11 : maand - 2
  const vorigeMaandNaam = MAANDEN_KORT[vorigeMaandIdx]

  const saldoTrend    = calcTrend(saldo, prevSaldo)
  const uitgavenTrend = calcTrend(uitgaven, prevUitgaven)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
      <StatCard
        label="Totaal saldo"
        value={saldo}
        color={saldo >= 0 ? T.blue : T.red}
        accent={T.blue}
        trend={saldoTrend}
        trendGood="up"
        vorigeMaandNaam={vorigeMaandNaam}
      />
      <StatCard
        label="Inkomsten"
        value={inkomsten}
        color={T.green}
        accent={T.green}
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
        label="Budget resterend"
        value={resterend}
        color={resterend >= 0 ? T.amber : T.red}
        accent={T.amber}
      />
    </div>
  )
}
