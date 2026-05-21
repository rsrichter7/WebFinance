// ─── AnalyticsTopBar ───
// Titelbalk van de Analyse pagina.

import React from 'react'
import { T } from '../../tokens'

export default function AnalyticsTopBar() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      padding: '18px 28px',
      borderBottom: `1px solid ${T.border}`,
      background: T.card,
    }}>
      <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
        Analyse
      </div>
    </div>
  )
}
