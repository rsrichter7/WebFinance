// ─── FixedTopBar ───
// Titelbalk voor de Vaste Lasten pagina met actieknop en info-tooltip.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import PageInfoPopover from '../ui/PageInfoPopover'

export default function FixedTopBar({ onAdd }) {
  const { T } = useTheme()

  const bullets = [
    'Voeg een vaste last toe met een startdatum en herhaling (wekelijks, maandelijks of jaarlijks).',
    'Deze pagina is een overzicht: vaste lasten worden hier niet als transacties geboekt. Werkelijke transacties komen uit je CSV-import of handmatige invoer.',
    'Bedragen worden omgerekend naar maandbedragen voor het overzicht.',
  ]

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
          Vaste lasten
        </div>
        <PageInfoPopover
          titel="Hoe werkt deze pagina?"
          intro="Vaste lasten zijn je terugkerende kosten en inkomsten — een overzicht van wat er maandelijks binnenkomt en uitgaat."
          bullets={bullets}
        />
      </div>
      <button
        onClick={onAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          border: 'none', background: T.blue, color: '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
        }}
      >
        {ICONS.plus} Vaste last toevoegen
      </button>
    </div>
  )
}
