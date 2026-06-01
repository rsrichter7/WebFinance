// ─── AnalyticsTopBar ───
// Titelbalk van de Analyse pagina.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import PageInfoPopover from '../ui/PageInfoPopover'

export default function AnalyticsTopBar() {
  const { T } = useTheme()
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
    }}>
      <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Analyse</div>
      <PageInfoPopover
        titel="Hoe werkt deze pagina?"
        intro="Bekijk je financiën in grafieken en ontdek patronen."
        bullets={[
          'Vergelijk inkomsten en uitgaven over tijd.',
          'Bekijk je top categorieën en subcategorieën.',
          'Filter op periode om trends te ontdekken.',
          'Versleep de grafieken om je eigen indeling te maken.',
        ]}
      />
    </div>
  )
}
