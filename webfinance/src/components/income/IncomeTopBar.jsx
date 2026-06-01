// ─── IncomeTopBar ───
// Titelbalk voor de Inkomsten pagina met actieknop en info-tooltip.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import PageInfoPopover from '../ui/PageInfoPopover'

export default function IncomeTopBar({ onAdd }) {
  const { T } = useTheme()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Inkomsten</div>
        <PageInfoPopover
          titel="Hoe werkt deze pagina?"
          intro="Overzicht van al je vaste inkomsten per maand."
          bullets={[
            'Voeg vaste inkomsten toe zoals salaris, toeslagen of andere terugkerende inkomsten.',
            'Bekijk de verdeling per persoon in de donut grafiek.',
            'Inkomsten worden automatisch als transactie aangemaakt op de ingestelde datum.',
          ]}
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
        {ICONS.plus} Inkomst toevoegen
      </button>
    </div>
  )
}
