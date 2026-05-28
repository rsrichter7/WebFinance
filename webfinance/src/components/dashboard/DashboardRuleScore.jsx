// ─── DashboardRuleScore ───
// 50/30/20 voortgangsbalken op basis van inkomsten en soort-veld transacties.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt } from '../../tokens'
import { Card, CardTitle, ProgressBar } from '../ui/Card'
import { ICONS } from '../ui/Icons'

const REGELS = [
  { key: 'noodzaak', label: 'Noodzaak', icon: 'home',   defaultPct: 50 },
  { key: 'wens',     label: 'Wens',     icon: 'coffee', defaultPct: 30 },
  { key: 'sparen',   label: 'Sparen',   icon: 'piggy',  defaultPct: 20 },
]

export default function DashboardRuleScore({ ruleData, inkomsten }) {
  const { T } = useTheme()
  return (
    <Card>
      <CardTitle sub="Hoe scoor je deze maand?">
        50/30/20 score
      </CardTitle>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {REGELS.map(regel => {
          const data   = ruleData[regel.key] || { budget: 0, besteed: 0, pct: 0 }
          const budget = data.budget
          const besteed = data.besteed
          const pct    = budget > 0 ? Math.min((besteed / budget) * 100, 100) : 0
          const label  = inkomsten > 0
            ? `${Math.round((data.besteed / inkomsten) * 100)}% van inkomen`
            : '—'

          return (
            <div key={regel.key}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 8,
                  background: T.rule, display: 'grid', placeItems: 'center',
                  color: T.ink3, flexShrink: 0,
                }}>
                  {ICONS[regel.icon]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>
                      {regel.label}
                      <span style={{ marginLeft: 6, fontSize: 11, color: T.ink4, fontWeight: 400 }}>
                        doel {regel.defaultPct}%
                      </span>
                    </span>
                    <span style={{ fontSize: 12, color: T.ink3, fontVariantNumeric: 'tabular-nums' }}>
                      {fmt(besteed)} / {fmt(budget)}
                    </span>
                  </div>
                  <ProgressBar pct={pct} size={7} />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {inkomsten === 0 && (
        <div style={{ marginTop: 16, fontSize: 12, color: T.ink4, textAlign: 'center' }}>
          Voeg inkomsttransacties toe om de score te berekenen
        </div>
      )}
    </Card>
  )
}
