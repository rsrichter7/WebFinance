// ─── SettingsTopBar ───
// Topbar voor de instellingen pagina — alleen de titel, geen subtitel.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import PageInfoPopover from '../ui/PageInfoPopover'

export default function SettingsTopBar() {
  const { T } = useTheme()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card, flexShrink: 0,
    }}>
      <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Instellingen</div>
      <PageInfoPopover
        titel="Hoe werkt deze pagina?"
        intro="Beheer je account en pas Webfinance aan naar jouw voorkeuren."
        bullets={[
          'Wijzig je naam, wachtwoord en profielinstellingen.',
          'Beheer je huishouden en nodig anderen uit.',
          'Pas categorieën, datumformaat en thema aan.',
          'Exporteer of verwijder je data via Data beheer.',
        ]}
      />
    </div>
  )
}
