// ─── AccountModal ───
// Formulier voor rekening toevoegen/bewerken: naam, IBAN, gedeeld-toggle.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { Toggle } from '../ui/Card'
import { validateTekst } from '../../utils/validation'

const NAAM_MAX = 60

export default function AccountModal({ modal, onSave, onClose }) {
  const { T } = useTheme()
  const isEdit = modal.type === 'edit'
  const [naam, setNaam]       = useState(isEdit ? modal.account.naam : '')
  const [iban, setIban]       = useState(isEdit ? (modal.account.iban || '') : '')
  const [gedeeld, setGedeeld] = useState(isEdit ? !!modal.account.gedeeld : false)

  const naamGetrimd = naam.trim()
  const naamOk = naamGetrimd.length > 0 && validateTekst(naamGetrimd, NAAM_MAX).valid
  const titel = isEdit ? 'Rekening bewerken' : 'Rekening toevoegen'

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, outline: 'none', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box' }
  const primaryBtn   = { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const secondaryBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  function save() {
    if (!naamOk) return
    onSave({ naam: naamGetrimd, iban: iban.trim() || null, gedeeld })
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 28, width: 360, zIndex: 201 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 20 }}>{titel}</div>

        <div style={{ marginBottom: 16 }}>
          <label style={L}>Naam *</label>
          <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Bijv. Betaalrekening" autoFocus
            style={{ ...I, borderColor: naam.length > 0 && !naamOk ? T.red : T.border }} />
          {naam.length > 0 && !naamOk && <div style={{ fontSize: 11.5, color: T.red, marginTop: 4 }}>Naam moet 1–{NAAM_MAX} tekens zijn</div>}
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={L}>IBAN (optioneel)</label>
          <input value={iban} onChange={e => setIban(e.target.value)} placeholder="NL00 BANK 0000 0000 00" style={I} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>Delen met huishouden</div>
            <div style={{ fontSize: 12, color: T.ink3 }}>Gedeelde rekeningen zijn zichtbaar voor alle leden</div>
          </div>
          <Toggle on={gedeeld} onChange={() => setGedeeld(g => !g)} />
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={save} style={{ ...primaryBtn, opacity: naamOk ? 1 : 0.5, cursor: naamOk ? 'pointer' : 'not-allowed' }}>Opslaan</button>
          <button onClick={onClose} style={secondaryBtn}>Annuleren</button>
        </div>
      </div>
    </>
  )
}
