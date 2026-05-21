// ─── DashboardRecentTx ───
// Laatste 5 transacties ongeacht geselecteerde maand.

import React from 'react'
import { T, fmt, fmtDate } from '../../tokens'
import { Card, CardTitle } from '../ui/Card'

// Avatar kleuren per wie-code
const AVATAR = {
  RR: { bg: '#E0E7FF', fg: '#3730A3' },
  AM: { bg: '#FCE7F3', fg: '#9D174D' },
  GZ: { bg: '#F0FDFA', fg: '#0D9488' },
}

function Avatar({ wie }) {
  const colors = AVATAR[wie] || { bg: T.rule, fg: T.ink3 }
  return (
    <div style={{
      width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
      background: colors.bg, color: colors.fg,
      display: 'grid', placeItems: 'center',
      fontSize: 10, fontWeight: 700, letterSpacing: 0.5,
    }}>
      {wie}
    </div>
  )
}

export default function DashboardRecentTx({ recentTx }) {
  return (
    <Card>
      <CardTitle sub="Laatste 5 uitgaven">
        Recente transacties
      </CardTitle>

      {recentTx.length === 0 ? (
        <div style={{ color: T.ink4, fontSize: 13, textAlign: 'center', padding: '16px 0' }}>
          Nog geen transacties
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {recentTx.map((tx, i) => (
            <div key={tx.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '9px 0',
              borderBottom: i < recentTx.length - 1 ? `1px solid ${T.rule}` : 'none',
            }}>
              <Avatar wie={tx.wie} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {tx.omschrijving}
                </div>
                <div style={{ fontSize: 11, color: T.ink3, marginTop: 1 }}>
                  {tx.sub} · {fmtDate(tx.datum)}
                </div>
              </div>
              <div style={{
                fontSize: 13, fontWeight: 600,
                color: tx.type === 'Inkomst' ? T.green : T.ink,
                fontVariantNumeric: 'tabular-nums', flexShrink: 0,
              }}>
                {tx.type === 'Inkomst' ? '+' : '-'}{fmt(tx.bedrag)}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
