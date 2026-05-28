// ─── DashboardSavingsGoals ───
// Spaardoelen met voortgangsbalken. huidigBedrag berekend uit transacties.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt, fmtDate } from '../../tokens'
import { Card, CardTitle, ProgressBar } from '../ui/Card'
import { ICONS } from '../ui/Icons'

export default function DashboardSavingsGoals({ spaardoelen, onNaarBudgetten }) {
  const { T } = useTheme()

  const plusBtnStyle = {
    display: 'flex', alignItems: 'center', gap: 4,
    height: 28, padding: '0 10px', borderRadius: 6,
    border: `1px solid ${T.border}`, background: T.card,
    color: T.ink2, fontSize: 12, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0,
  }

  return (
    <Card style={{ overflow: 'visible' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <CardTitle sub="Voortgang van je doelen" style={{ marginBottom: 0 }}>
          Spaardoelen
        </CardTitle>
        <button onClick={onNaarBudgetten} style={plusBtnStyle}>
          {ICONS.plus}
          Doel
        </button>
      </div>

      {spaardoelen.length === 0 ? (
        <div style={{ color: T.ink4, fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          Nog geen spaardoelen aangemaakt
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {spaardoelen.map(doel => {
            const huidig = doel.huidigBedrag || 0
            const pct = doel.doelBedrag > 0
              ? Math.min((huidig / doel.doelBedrag) * 100, 100)
              : 0
            return (
              <div key={doel.id}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, background: T.blueSoft,
                    display: 'grid', placeItems: 'center', color: T.blue, flexShrink: 0,
                  }}>
                    {ICONS.target}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doel.naam}
                      </span>
                      <span style={{ fontSize: 12, fontWeight: 600, color: T.ink, fontVariantNumeric: 'tabular-nums', marginLeft: 8 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                    <ProgressBar pct={pct} size={6} color={T.blue} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
                      <span style={{ fontSize: 11, color: T.ink3, fontVariantNumeric: 'tabular-nums' }}>
                        {fmt(huidig)} / {fmt(doel.doelBedrag || 0)}
                      </span>
                      {doel.deadline && (
                        <span style={{
                          fontSize: 10, fontWeight: 600, padding: '1px 7px', borderRadius: 4,
                          background: T.amberSoft, color: T.amberText,
                        }}>
                          {fmtDate(doel.deadline)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </Card>
  )
}
