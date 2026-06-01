// ─── DashboardTopBar ───
// Begroeting op basis van tijdstip + maandselector + transactie-knop.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import PageInfoPopover from '../ui/PageInfoPopover'

const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

function begroeting() {
  const uur = new Date().getHours()
  if (uur < 12) return 'Goedemorgen'
  if (uur < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

export default function DashboardTopBar({ maand, jaar, onMaandWijzig, onAddTx, voornaam }) {
  const { T } = useTheme()

  function vorige() {
    if (maand === 1) onMaandWijzig({ maand: 12, jaar: jaar - 1 })
    else onMaandWijzig({ maand: maand - 1, jaar })
  }

  function volgende() {
    if (maand === 12) onMaandWijzig({ maand: 1, jaar: jaar + 1 })
    else onMaandWijzig({ maand: maand + 1, jaar })
  }

  const navBtnStyle = {
    width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`,
    background: T.card, cursor: 'pointer', display: 'grid', placeItems: 'center',
    color: T.ink3, fontSize: 14,
  }

  const maandLabelStyle = {
    padding: '6px 16px', borderRadius: 6, border: `1px solid ${T.border}`,
    background: T.bg, fontSize: 13, fontWeight: 500, color: T.ink,
    minWidth: 148, textAlign: 'center', textTransform: 'capitalize',
  }

  const addBtnStyle = {
    height: 32, padding: '0 14px', borderRadius: 8, border: 'none',
    background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'inherit',
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
          {begroeting()}{voornaam ? `, ${voornaam}` : ''}
        </div>
        <PageInfoPopover
          titel="Hoe werkt deze pagina?"
          intro="Het dashboard geeft een overzicht van je financiën per maand."
          bullets={[
            'Bekijk je inkomsten, uitgaven en huidig saldo bovenaan de pagina.',
            'De grafieken tonen je bestedingspatroon per categorie en per maand.',
            'Volg je voortgang op spaardoelen en je 50/30/20 score.',
            'Gebruik de maandnavigatie om andere periodes te bekijken.',
          ]}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={vorige} style={navBtnStyle}>‹</button>
          <div style={maandLabelStyle}>
            {MAANDEN[maand - 1]} {jaar}
          </div>
          <button onClick={volgende} style={navBtnStyle}>›</button>
        </div>
        <button onClick={onAddTx} style={addBtnStyle}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {ICONS.plus}
            Transactie
          </span>
        </button>
      </div>
    </div>
  )
}
