// ─── CalendarTopBar ───
// Titelbalk van de Kalender pagina met weergave- en filter-toggles.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import PageInfoPopover from '../ui/PageInfoPopover'

function PillGroup({ options, value, onChange }) {
  const { T } = useTheme()
  return (
    <div style={{ display: 'inline-flex', padding: 3, background: T.bg, border: `1px solid ${T.border}`, borderRadius: 8 }}>
      {options.map(o => {
        const active = o === value
        return (
          <span key={o} onClick={() => onChange(o)} style={{
            padding: '6px 14px', fontSize: 12.5, fontWeight: 500, borderRadius: 5, cursor: 'pointer',
            background: active ? T.card : 'transparent', color: active ? T.ink : T.ink3,
            boxShadow: active ? '0 1px 2px rgba(17,24,39,0.06)' : 'none',
            transition: 'background 0.15s', userSelect: 'none',
          }}>
            {o}
          </span>
        )
      })}
    </div>
  )
}

export default function CalendarTopBar({ viewMode, setViewMode, viewFilter, setViewFilter }) {
  const { T } = useTheme()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Kalender</div>
        <PageInfoPopover
          titel="Hoe werkt deze pagina?"
          intro="Bekijk je verwachte en werkelijke transacties per dag."
          bullets={[
            'Verwachte uitgaven worden automatisch berekend vanuit je vaste lasten.',
            'Werkelijke transacties verschijnen zodra ze zijn ingevoerd of geïmporteerd.',
            'Verwachte uitgaven verdwijnen automatisch bij een match met een werkelijke transactie.',
            'Hoge uitgaven (boven €500) worden gemarkeerd met een rode achtergrond.',
          ]}
        />
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        <PillGroup options={['Maand', 'Week']} value={viewMode} onChange={setViewMode} />
        <PillGroup options={['Verwacht', 'Werkelijk', 'Beide']} value={viewFilter} onChange={setViewFilter} />
      </div>
    </div>
  )
}
