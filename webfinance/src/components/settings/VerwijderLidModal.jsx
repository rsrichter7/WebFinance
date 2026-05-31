// ─── VerwijderLidModal ───
// Bevestigingsmodal voor het verwijderen van een huishoudlid.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'

export default function VerwijderLidModal({ member, onConfirm, onClose, bezig }) {
  const { T } = useTheme()
  const priBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: T.red, color: '#fff', fontSize: 13, fontWeight: 500, cursor: bezig ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: bezig ? 0.7 : 1 }
  const secBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: bezig ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }

  return (
    <>
      <div onClick={!bezig ? onClose : undefined} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 28, width: 400, zIndex: 201 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 8 }}>Lid verwijderen?</div>
        <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.6, marginBottom: 24 }}>
          Weet je zeker dat je <strong style={{ color: T.ink }}>{member.email}</strong> wilt verwijderen
          uit het huishouden? Deze persoon verliest toegang tot alle gedeelde financiën.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} disabled={bezig} style={priBtn}>
            {bezig ? 'Even wachten…' : 'Verwijderen'}
          </button>
          <button onClick={onClose} disabled={bezig} style={secBtn}>Annuleren</button>
        </div>
      </div>
    </>
  )
}
