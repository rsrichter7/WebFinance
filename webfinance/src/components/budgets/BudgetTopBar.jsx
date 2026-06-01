// ─── BudgetTopBar ───
// Paginatitel met maand/jaar selector.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import PageInfoPopover from '../ui/PageInfoPopover'

const MAANDEN = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
]

export default function BudgetTopBar({ geselecteerdeMaand, onMaandWijzig, onBudgetInstellen }) {
  const { T } = useTheme()
  const { maand, jaar } = geselecteerdeMaand

  function vorige() {
    if (maand === 1) onMaandWijzig({ maand: 12, jaar: jaar - 1 })
    else onMaandWijzig({ maand: maand - 1, jaar })
  }

  function volgende() {
    if (maand === 12) onMaandWijzig({ maand: 1, jaar: jaar + 1 })
    else onMaandWijzig({ maand: maand + 1, jaar })
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Budgetten</div>
        <PageInfoPopover
          titel="Hoe werkt deze pagina?"
          intro="Stel budgetten in en houd je uitgaven per categorie bij."
          bullets={[
            'Gebruik de 50/30/20 regel om je inkomsten te verdelen over noodzaak, wens en sparen.',
            'Bekijk per categorie hoeveel je hebt uitgegeven ten opzichte van je budget.',
            'Stel spaardoelen in en volg je voortgang met stortingen.',
            'Je budget wordt automatisch berekend op basis van je gemiddelde inkomen van de afgelopen maanden. Je kunt dit handmatig overschrijven.',
          ]}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button onClick={onBudgetInstellen} style={{
          height: 32, padding: '0 14px', borderRadius: 8, border: 'none',
          background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>
          Budget instellen
        </button>
        <button onClick={vorige} style={{
          width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.card, cursor: 'pointer', display: 'grid', placeItems: 'center', color: T.ink3, fontSize: 14,
        }}>‹</button>
        <div style={{
          padding: '6px 16px', borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.bg, fontSize: 13, fontWeight: 500, color: T.ink,
          minWidth: 140, textAlign: 'center',
        }}>
          {MAANDEN[maand - 1]} {jaar}
        </div>
        <button onClick={volgende} style={{
          width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.card, cursor: 'pointer', display: 'grid', placeItems: 'center', color: T.ink3, fontSize: 14,
        }}>›</button>
      </div>
    </div>
  )
}
