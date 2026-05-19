// ─── TransactionTopBar ───
// Bovenste balk van de transactiepagina met titel en actieknoppen.

import React from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { Badge } from '../ui/Card'

export default function TransactionTopBar({ onNewClick }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px',
      borderBottom: `1px solid ${T.border}`,
      background: T.card,
    }}>
      <div>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Transacties</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}></div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Importeren knop (Premium placeholder) */}
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          border: `1px solid ${T.border}`, background: T.card,
          fontSize: 13, fontWeight: 500, color: T.ink3, cursor: 'pointer',
        }}>
          Importeren
          <Badge color={T.amber} bg={T.amberSoft}>PREMIUM</Badge>
        </button>

        {/* Nieuwe transactie knop */}
        <button
          onClick={onNewClick}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: 'none', background: T.blue, color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
          }}
        >
          <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span>
          Nieuwe transactie
        </button>
      </div>
    </div>
  )
}
