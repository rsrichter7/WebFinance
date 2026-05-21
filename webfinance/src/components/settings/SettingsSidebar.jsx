// ─── SettingsSidebar ───
// Eigen navigatie-sidebar binnen de instellingen pagina.

import React from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'

const SECTIONS = [
  { k: 'profiel',      label: 'Profiel',         icon: ICONS.user },
  { k: 'voorkeuren',   label: 'Voorkeuren',       icon: ICONS.sliders },
  { k: 'categorieen',  label: 'Categorieën',      icon: ICONS.folder },
  { k: 'data',         label: 'Data beheer',      icon: ICONS.database },
  { k: 'notificaties', label: 'Notificaties',     icon: ICONS.bell },
  { k: 'over',         label: 'Over Webfinance',  icon: ICONS.info },
]

export default function SettingsSidebar({ active, onSelect, adminUnlocked }) {
  const sections = adminUnlocked
    ? [...SECTIONS, { k: 'admin', label: 'Admin', icon: ICONS.shield, isAdmin: true }]
    : SECTIONS

  const regularSections = sections.filter(s => !s.isAdmin)
  const adminSection = sections.find(s => s.isAdmin)

  return (
    <aside style={{
      width: 220, flex: '0 0 220px',
      background: T.cardAlt,
      borderRight: `1px solid ${T.border}`,
      padding: '20px 12px',
      display: 'flex', flexDirection: 'column',
      overflow: 'auto',
    }}>
      <div style={{
        padding: '0 10px 16px',
        fontSize: 11, fontWeight: 600, color: T.ink4,
        letterSpacing: 0.4, textTransform: 'uppercase',
      }}>
        Instellingen
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {regularSections.map(s => <SectionItem key={s.k} s={s} active={active} onSelect={onSelect} />)}

        {adminSection && (
          <>
            <div style={{ height: 1, background: T.border, margin: '8px 4px 6px' }} />
            <SectionItem s={adminSection} active={active} onSelect={onSelect} />
          </>
        )}
      </nav>

      <div style={{ flex: 1 }} />
      <div style={{
        padding: '10px 10px 0',
        borderTop: `1px solid ${T.border}`,
        fontSize: 11, color: T.ink4,
      }}>
        Lokaal opgeslagen · v0.1.0
      </div>
    </aside>
  )
}

function SectionItem({ s, active, onSelect }) {
  const isActive = s.k === active
  return (
    <button
      onClick={() => onSelect(s.k)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 10px', borderRadius: 8,
        background: isActive ? T.card : 'transparent',
        color: isActive ? T.ink : T.ink2,
        fontSize: 13.5, fontWeight: isActive ? 500 : 400,
        border: isActive ? `1px solid ${T.border}` : '1px solid transparent',
        cursor: 'pointer', textAlign: 'left', width: '100%',
      }}
    >
      <span style={{ color: isActive ? T.blue : (s.isAdmin ? T.amber : T.ink3), display: 'inline-flex' }}>
        {s.icon}
      </span>
      <span style={{ flex: 1 }}>{s.label}</span>
      {s.isAdmin && (
        <span style={{
          fontSize: 9.5, fontWeight: 600, letterSpacing: 0.3,
          padding: '2px 5px', borderRadius: 4,
          background: T.amberSoft, color: T.amber,
        }}>DEV</span>
      )}
    </button>
  )
}
