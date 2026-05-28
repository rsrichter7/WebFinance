// ─── TransactionTopBar ───
// Bovenste balk van de transactiepagina met titel en actieknoppen.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import { Badge } from '../ui/Card'
import usePremium from '../../hooks/usePremium'

export default function TransactionTopBar({ onNewClick, onImportClick }) {
  const { T } = useTheme()
  const { isPremium } = usePremium()
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
        {isPremium ? (
          <button onClick={onImportClick} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.card,
            fontSize: 13, fontWeight: 500, color: T.ink2, cursor: 'pointer',
            fontFamily: 'inherit',
          }}>
            <span style={{ display: 'inline-flex' }}>{ICONS.upload}</span>
            Importeren
          </button>
        ) : (
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.card,
            fontSize: 13, fontWeight: 500, color: T.ink3, cursor: 'default',
            fontFamily: 'inherit',
          }}>
            Importeren
            <Badge color={T.amber} bg={T.amberSoft}>PREMIUM</Badge>
          </button>
        )}
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
