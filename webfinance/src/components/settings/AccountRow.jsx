// ─── AccountRow ───
// Eén rij in de rekeningenlijst: naam, badges, koppelingstatus/sync en actieknoppen.

import React from 'react'
import { fmtDate } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { Badge } from '../ui/Card'

export default function AccountRow({ acc, T, kanVerwijderen, onEdit, onDelete, onOntkoppel, onSync }) {
  const gekoppeld = !!acc.externAccountId
  const iconBtn = { width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, cursor: 'pointer', display: 'grid', placeItems: 'center' }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.bg, borderRadius: 10, border: `1px solid ${T.border}` }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{acc.naam}</span>
          {acc.gedeeld
            ? <Badge color={T.blueText} bg={T.blueSoft}>Gedeeld</Badge>
            : <Badge color={T.ink3} bg={T.rule}>Persoonlijk</Badge>}
          {gekoppeld && <Badge color={T.greenText} bg={T.greenSoft}>Gekoppeld</Badge>}
        </div>
        {acc.iban && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{acc.iban}</div>}
        {gekoppeld && acc.koppelingVervalt && (
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
            Bankkoppeling · verloopt {fmtDate(acc.koppelingVervalt)}
          </div>
        )}
        {gekoppeld && (
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
            {acc.laatstGesynct ? `Laatst gesynct: ${fmtDate(acc.laatstGesynct)}` : 'Nog niet gesynct'}
          </div>
        )}
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        {gekoppeld && (
          <button onClick={onSync} style={iconBtn} title="Nu synchroniseren">
            {ICONS.refresh}
          </button>
        )}
        {gekoppeld && (
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
