// ─── DashboardRecente ───
// Laatste 5 transacties met categorie-icoon, AUTO-badge en relatieve tijd.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { CATEGORY_CONFIG } from '../../data/categoryConfig'
import { relatiefTijdstip } from '../../utils/dashboardCalculations'

function TxRow({ tx, T, isLast }) {
  const cfg   = CATEGORY_CONFIG[tx.categorie] || { icon: 'grip', colorKey: 'ink3', softKey: 'rule' }
  const isAuto = tx.bron === 'auto'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '9px 0',
      borderBottom: isLast ? 'none' : `1px solid ${T.rule}`,
    }}>
      {/* Icoon-tegel met thema-veilige soft achtergrond */}
      <div style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        background: T[cfg.softKey] || T.rule,
        color: T[cfg.colorKey] || T.ink3,
        display: 'grid', placeItems: 'center',
      }}>
        {ICONS[cfg.icon] || ICONS.grip}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
          <span style={{
            fontSize: 12, fontWeight: 600, color: T.ink,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', flex: 1,
          }}>
            {tx.winkel || tx.beschrijving}
          </span>
          {isAuto && (
            <span style={{
              padding: '1px 5px', borderRadius: 4, fontSize: 8.5, fontWeight: 700,
              background: 'linear-gradient(135deg, #1E5AA8 0%, #2563EB 100%)',
              color: '#fff', flexShrink: 0, letterSpacing: 0.3,
            }}>
              AUTO
            </span>
          )}
        </div>
        {tx.winkel && (
          <div style={{ fontSize: 11, color: T.ink3, marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {tx.beschrijving}
          </div>
        )}
        <div style={{ fontSize: 10.5, color: T.ink4 }}>
          {relatiefTijdstip(tx.createdAt)}
        </div>
      </div>

      <div style={{
        fontSize: 12.5, fontWeight: 500, flexShrink: 0,
        color: tx.type === 'Inkomst' ? T.green : T.ink2,
        fontVariantNumeric: 'tabular-nums',
      }}>
        {tx.type === 'Inkomst' ? '+' : '−'}{fmt(tx.bedrag)}
      </div>
    </div>
  )
}

export default function DashboardRecente({ recentTx, animDelay = 0 }) {
  const { T } = useTheme()
  const heeftAuto = recentTx.some(tx => tx.bron === 'auto')

  return (
    <div className="wf-anim-card wf-card-hover" style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      boxShadow: T.shadow, padding: '18px 20px',
      animationDelay: `${animDelay}ms`,
    }}>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Recente transacties</div>
        {heeftAuto && (
          <div style={{ fontSize: 11.5, color: T.ink4, marginTop: 1 }}>
            Automatisch geïmporteerd van je bank
          </div>
        )}
      </div>

      {recentTx.length === 0 ? (
        <div style={{ color: T.ink4, fontSize: 13, textAlign: 'center', padding: '20px 0' }}>
          Nog geen transacties
        </div>
      ) : recentTx.map((tx, i) => (
        <TxRow key={tx.id} tx={tx} T={T} isLast={i === recentTx.length - 1} />
      ))}
    </div>
  )
}
