// ─── LoanCard ───
// Kaart voor individuele lening: type-icoon, progress, maandlast en saldo.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { ProgressBar } from '../ui/Card'
import { ICONS } from '../ui/Icons'
import { huidigeMaandlast, percentageAfgelost } from '../../utils/loanCalculations'

const TYPE_ICONS = {
  'Hypotheek':           'home',
  'Studieschuld':        'school',
  'Persoonlijke lening': 'creditCard',
  'Autolening':          'car',
}

export default function LoanCard({ loan, onEdit, onDelete }) {
  const { T } = useTheme()
  const [hover, setHover] = useState(false)

  const maandlast = huidigeMaandlast(loan)
  const pct       = percentageAfgelost(loan)
  const iconKey   = TYPE_ICONS[loan.type] || 'coin'

  const resterendJaren   = Math.floor(loan.resterende_maanden / 12)
  const resterendMaanden = loan.resterende_maanden % 12
  const looptijdTekst = loan.resterende_maanden > 0
    ? `${resterendJaren > 0 ? `${resterendJaren}j ` : ''}${resterendMaanden > 0 ? `${resterendMaanden}m` : ''}resterend`
    : 'Afgelost'

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: '14px 20px', borderRadius: 10,
        background: hover ? T.rule : 'transparent',
        transition: 'background 0.15s',
        position: 'relative',
      }}
    >
      {/* Type-icoon */}
      <div style={{
        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
        background: T.violetSoft, color: T.violet,
        display: 'grid', placeItems: 'center',
      }}>
        {ICONS[iconKey] || ICONS.coin}
      </div>

      {/* Naam + type */}
      <div style={{ flex: '0 0 auto', minWidth: 130 }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink }}>{loan.naam}</div>
        <div style={{ fontSize: 12, color: T.ink4, marginTop: 1 }}>
          {loan.type} · {loan.aflossingsvorm}
        </div>
      </div>

      {/* Progress + looptijd */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 5, minWidth: 80 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ProgressBar pct={pct} size={6} color={T.violet} />
          <span style={{ fontSize: 12, fontWeight: 600, color: T.ink3, ...TAB, flexShrink: 0 }}>
            {pct.toFixed(0)}%
          </span>
        </div>
        <div style={{ fontSize: 11, color: T.ink4 }}>{looptijdTekst}</div>
      </div>

      {/* Bedragen — rechts, verborgen achter edit/delete bij hover */}
      <div style={{ textAlign: 'right', flexShrink: 0, opacity: hover ? 0 : 1, transition: 'opacity 0.1s' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.ink, ...TAB }}>{fmt(maandlast)}</div>
        <div style={{ fontSize: 11, color: T.ink4, marginTop: 1 }}>/ maand</div>
        <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 3, ...TAB }}>Saldo {fmt(loan.huidig_saldo)}</div>
      </div>

      {/* Edit / delete bij hover */}
      {hover && (
        <div style={{
          position: 'absolute', right: 20, top: '50%', transform: 'translateY(-50%)',
          display: 'flex', gap: 6,
        }}>
          <button onClick={() => onEdit(loan)} style={{
            display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 6,
            border: `1px solid ${T.border}`, background: T.card, color: T.ink3, cursor: 'pointer',
          }}>{ICONS.edit}</button>
          <button onClick={() => onDelete(loan.id)} style={{
            display: 'grid', placeItems: 'center', width: 30, height: 30, borderRadius: 6,
            border: `1px solid ${T.border}`, background: T.card, color: T.red, cursor: 'pointer',
          }}>{ICONS.trash}</button>
        </div>
      )}
    </div>
  )
}
