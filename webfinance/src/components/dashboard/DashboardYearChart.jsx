// ─── DashboardYearChart ───
// Staafdiagram: inkomsten vs uitgaven per maand voor het geselecteerde jaar.

import React from 'react'
import { T, fmtShort } from '../../tokens'
import { Card, CardTitle } from '../ui/Card'

const MAANDEN_KORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

export default function DashboardYearChart({ yearData, jaar }) {
  const max = Math.max(...yearData.flatMap(m => [m.inkomsten, m.uitgaven]), 1)
  const barH  = 120
  const barW  = 14
  const gap   = 4
  const colW  = barW * 2 + gap + 8

  return (
    <Card>
      <CardTitle sub="Inkomsten vs uitgaven per maand">
        Maandoverzicht {jaar}
      </CardTitle>

      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, minWidth: 460, paddingBottom: 4 }}>
          {yearData.map((m, i) => {
            const hInk = Math.round((m.inkomsten / max) * barH)
            const hUit = Math.round((m.uitgaven  / max) * barH)
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flex: 1 }}>
                {/* Staven */}
                <div style={{ display: 'flex', alignItems: 'flex-end', gap, height: barH }}>
                  {/* Inkomsten — teal */}
                  <div
                    title={`Inkomsten ${MAANDEN_KORT[i]}: ${fmtShort(m.inkomsten)}`}
                    style={{
                      width: barW, height: hInk || 2,
                      background: T.teal, borderRadius: '3px 3px 0 0',
                    }}
                  />
                  {/* Uitgaven — rood */}
                  <div
                    title={`Uitgaven ${MAANDEN_KORT[i]}: ${fmtShort(m.uitgaven)}`}
                    style={{
                      width: barW, height: hUit || 2,
                      background: T.red, opacity: 0.7, borderRadius: '3px 3px 0 0',
                    }}
                  />
                </div>
                {/* Maandlabel */}
                <div style={{ fontSize: 10, color: T.ink3, userSelect: 'none' }}>
                  {MAANDEN_KORT[i]}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Legenda */}
      <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.ink3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.teal }} />
          Inkomsten
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.ink3 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.red, opacity: 0.7 }} />
          Uitgaven
        </div>
      </div>
    </Card>
  )
}
