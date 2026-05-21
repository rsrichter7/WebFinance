// ─── SettingsTopBar ───
// Topbar voor de instellingen pagina — alleen de titel, geen subtitel.

import React from 'react'
import { T } from '../../tokens'

export default function SettingsTopBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '18px 28px',
      borderBottom: `1px solid ${T.border}`,
      background: T.card,
      flexShrink: 0,
    }}>
      <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
        Instellingen
      </div>
    </div>
  )
}
