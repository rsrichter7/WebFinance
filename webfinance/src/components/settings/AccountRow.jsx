// ─── AccountRow ───
// Eén rij in de rekeningenlijst: naam, badges, koppelingstatus/sync en actieknoppen.

import React from 'react'
import { fmtDate } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { Badge } from '../ui/Card'
import { bankKoppelingZichtbaar } from '../../config/features'

const VEERTIEN_DAGEN_MS = 14 * 24 * 60 * 60 * 1000

export default function AccountRow({ acc, T, kanVerwijderen, onEdit, onDelete, onOntkoppel, onSync, onHerkoppelen }) {
  const gekoppeld = !!acc.externAccountId
  // Alle UI die de gekoppelde toestand toont hangt op de vlag — anders lekt bank-info
  // door op rekeningen die al gekoppeld zijn, ook met de feature uit beeld.
  const toonBank = bankKoppelingZichtbaar() && gekoppeld

  // Vervalbadge en herkoppel-knop leiden naar een nieuwe koppeling — uit beeld
  // zolang de bankkoppeling-feature uit staat (bestaande koppeling blijft gewoon werken).
  let vervalStatus = null
  if (bankKoppelingZichtbaar() && gekoppeld && acc.koppelingVervalt) {
    const vervalTijd = new Date(acc.koppelingVervalt).getTime()
    if (vervalTijd < Date.now()) vervalStatus = 'verlopen'
    else if (vervalTijd < Date.now() + VEERTIEN_DAGEN_MS) vervalStatus = 'binnenkort'
  }
  const moetHerkoppelen = vervalStatus === 'verlopen' || vervalStatus === 'binnenkort'

  const iconBtn = { width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, cursor: 'pointer', display: 'grid', placeItems: 'center' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{acc.naam}</span>
          {acc.gedeeld
            ? <Badge color={T.blueText} bg={T.blueSoft}>Gedeeld</Badge>
            : <Badge color={T.ink3} bg={T.rule}>Persoonlijk</Badge>}
          {toonBank && <Badge color={T.greenText} bg={T.greenSoft}>Gekoppeld</Badge>}
          {vervalStatus === 'verlopen' && <Badge color={T.redText} bg={T.redSoft}>Verlopen</Badge>}
          {vervalStatus === 'binnenkort' && <Badge color={T.amberText} bg={T.amberSoft}>Verloopt binnenkort</Badge>}
        </div>
        {acc.iban && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{acc.iban}</div>}
        {toonBank && acc.koppelingVervalt && (
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
            Bankkoppeling · verloopt {fmtDate(acc.koppelingVervalt)}
          </div>
        )}
        {toonBank && (
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
            {acc.laatstGesynct ? `Laatst gesynct: ${fmtDate(acc.laatstGesynct)}` : 'Nog niet gesynct'}
          </div>
        )}
        {moetHerkoppelen && (
          <button onClick={onHerkoppelen} style={{
            marginTop: 6, padding: '5px 10px', borderRadius: 6,
            border: `1px solid ${T.border}`, background: T.card, color: T.blueText,
            fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Opnieuw koppelen
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {toonBank && (
          <button onClick={onSync} style={iconBtn} title="Nu synchroniseren">
            {ICONS.refresh}
          </button>
        )}
        {toonBank && (
          <button onClick={onOntkoppel} style={iconBtn} title="Bankkoppeling verwijderen">
            {ICONS.link}
          </button>
        )}
        <button onClick={onEdit} style={iconBtn}>{ICONS.edit}</button>
        <button
          onClick={() => kanVerwijderen && onDelete()}
          style={{ ...iconBtn, opacity: kanVerwijderen ? 1 : 0.3, cursor: kanVerwijderen ? 'pointer' : 'not-allowed' }}
          title={kanVerwijderen ? `${acc.naam} verwijderen` : 'Minimaal één rekening vereist'}
        >
          {ICONS.trash}
        </button>
      </div>
    </div>
  )
}
