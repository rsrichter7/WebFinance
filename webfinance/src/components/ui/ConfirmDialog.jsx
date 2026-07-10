// ─── ConfirmDialog ───
// Herbruikbare bevestigingsmodal voor verwijderacties, in huisstijl.

import React from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../hooks/useTheme'

export default function ConfirmDialog({ open, title, message, confirmLabel = 'Verwijderen', cancelLabel = 'Annuleren', onConfirm, onClose }) {
  const { T } = useTheme()

  if (!open) return null

  const priBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: T.red, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const secBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 28, width: 400, zIndex: 201 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.6, marginBottom: 24 }}>
          {message}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} style={priBtn}>{confirmLabel}</button>
          <button onClick={onClose} style={secBtn}>{cancelLabel}</button>
        </div>
      </div>
    </>,
    document.body
  )
}
