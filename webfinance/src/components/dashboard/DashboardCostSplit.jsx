// ─── DashboardCostSplit ───
// Kostenverdeling Ronald vs Anne op basis van inkomsttransacties (wie-veld).

import React from 'react'
import { T, fmt, fmtShort } from '../../tokens'
import { Card, CardTitle } from '../ui/Card'

export default function DashboardCostSplit({ costSplit, gemUitgaven }) {
  const { rr, am } = costSplit
  const totaal = rr + am
  const rrPct  = totaal > 0 ? (rr / totaal) * 100 : 50
  const amPct  = totaal > 0 ? (am / totaal) * 100 : 50

  return (
    <Card>
      <CardTitle sub="Verdeling op basis van netto salaris">
        Kostenverdeling
      </CardTitle>

      {/* Blokken */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <PersonBlock
          naam="Ronald"
          initials="RR"
          bedrag={rr}
          pct={rrPct}
          bg='#E0E7FF'
          fg='#3730A3'
          accent={T.blue}
        />
        <PersonBlock
          naam="Anne"
          initials="AM"
          bedrag={am}
          pct={amPct}
          bg='#FCE7F3'
          fg='#9D174D'
          accent='#EC4899'
        />
      </div>

      {/* Verhoudingsbalk */}
      <div style={{ height: 8, borderRadius: 4, overflow: 'hidden', display: 'flex', marginBottom: 16 }}>
        <div style={{ width: `${rrPct}%`, background: T.blue, transition: 'width 0.4s' }} />
        <div style={{ flex: 1, background: '#EC4899' }} />
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 12, borderTop: `1px solid ${T.rule}` }}>
        <div>
          <div style={{ fontSize: 11, color: T.ink3, marginBottom: 2 }}>Gem. uitgaven / mnd</div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
            {gemUitgaven !== null ? fmt(gemUitgaven) : '—'}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: T.ink3, marginBottom: 2 }}>Methode</div>
          <div style={{ fontSize: 13, fontWeight: 500, color: T.ink2 }}>Naar ratio</div>
        </div>
      </div>
    </Card>
  )
}

function PersonBlock({ naam, initials, bedrag, pct, bg, fg, accent }) {
  return (
    <div style={{
      flex: 1, padding: '12px 14px', borderRadius: 10,
      background: bg, border: `1.5px solid ${accent}22`,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: fg + '22', color: fg,
          display: 'grid', placeItems: 'center',
          fontSize: 9, fontWeight: 700,
        }}>
          {initials}
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: fg }}>{naam}</span>
      </div>
      <div style={{ fontSize: 22, fontWeight: 700, color: fg, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>
        {fmt(bedrag)}
      </div>
      <div style={{ fontSize: 12, color: fg, opacity: 0.7, marginTop: 2 }}>
        {pct.toFixed(0)}% van totaal
      </div>
    </div>
  )
}
