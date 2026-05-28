// ─── FeedbackForm ───
// Slide-in panel voor het melden van bugs of ideeën.
// Ontvangt onSubmit als prop vanuit de Sidebar.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'

const EMPTY = { onderwerp: '', bericht: '', afbeelding: null }

export default function FeedbackForm({ open, onClose, onSubmit }) {
  const { T } = useTheme()
  const [form, setForm]       = useState(EMPTY)
  const [errors, setErrors]   = useState({})
  const [preview, setPreview] = useState(null)
  const [success, setSuccess] = useState(false)
  const [saving, setSaving]   = useState(false)

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    setErrors(prev => ({ ...prev, [field]: null }))
  }

  function handleAfbeelding(e) {
    const file = e.target.files?.[0]
    if (!file) return
    update('afbeelding', file)
    const reader = new FileReader()
    reader.onload = ev => setPreview(ev.target.result)
    reader.readAsDataURL(file)
  }

  function validate() {
    const errs = {}
    if (!form.onderwerp.trim())          errs.onderwerp = 'Onderwerp is verplicht'
    if (form.onderwerp.trim().length > 100) errs.onderwerp = 'Maximaal 100 tekens'
    if (!form.bericht.trim())            errs.bericht = 'Bericht is verplicht'
    if (form.bericht.trim().length > 2000) errs.bericht = 'Maximaal 2000 tekens'
    return errs
  }

  async function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setSaving(true)
    const result = await onSubmit(form)
    setSaving(false)
    if (result?.error) { setErrors({ submit: result.error }); return }
    setSuccess(true)
    setTimeout(() => { setSuccess(false); setForm(EMPTY); setPreview(null); onClose() }, 2000)
  }

  if (!open) return null

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, outline: 'none', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box' }
  const ERR = { fontSize: 12, color: T.red, marginTop: 4 }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 90 }} />
      <div style={{ position: 'fixed', top: 0, right: 0, bottom: 0, width: 420, background: T.card, borderLeft: `1px solid ${T.border}`, boxShadow: '-8px 0 32px rgba(0,0,0,0.12)', zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>Feedback verzenden</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Meld een bug of deel een idee</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        {success ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ width: 56, height: 56, borderRadius: '50%', background: T.greenSoft, display: 'grid', placeItems: 'center' }}>
              <span style={{ color: T.green, display: 'inline-flex', transform: 'scale(2)' }}>{ICONS.check}</span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>Bedankt voor je feedback!</div>
            <div style={{ fontSize: 13, color: T.ink3 }}>We nemen je melding in behandeling.</div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
              <div>
                <label style={L}>Onderwerp *</label>
                <input type="text" placeholder="Bijv. Knop werkt niet op de budgetten pagina" maxLength={100}
                  value={form.onderwerp} onChange={e => update('onderwerp', e.target.value)}
                  style={{ ...I, borderColor: errors.onderwerp ? T.red : T.border }} />
                {errors.onderwerp && <div style={ERR}>{errors.onderwerp}</div>}
              </div>
              <div>
                <label style={L}>Bericht *</label>
                <textarea placeholder="Beschrijf zo duidelijk mogelijk wat er mis gaat of wat je idee is..." maxLength={2000} rows={5}
                  value={form.bericht} onChange={e => update('bericht', e.target.value)}
                  style={{ ...I, resize: 'vertical', minHeight: 100, borderColor: errors.bericht ? T.red : T.border }} />
                <div style={{ fontSize: 11, color: T.ink4, marginTop: 3, textAlign: 'right' }}>{form.bericht.length}/2000</div>
                {errors.bericht && <div style={ERR}>{errors.bericht}</div>}
              </div>
              <div>
                <label style={L}>Schermafbeelding <span style={{ fontWeight: 400, color: T.ink4 }}>optioneel</span></label>
                <input type="file" accept="image/*" onChange={handleAfbeelding} style={{ fontSize: 13, color: T.ink3 }} />
                {preview && (
                  <img src={preview} alt="preview" style={{ marginTop: 10, maxWidth: '100%', maxHeight: 160, borderRadius: 8, border: `1px solid ${T.border}`, objectFit: 'cover' }} />
                )}
              </div>
              {errors.submit && (
                <div style={{ fontSize: 12, color: T.red, padding: '10px 14px', background: T.redSoft, borderRadius: 8 }}>
                  {errors.submit}
                </div>
              )}
            </div>
            <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 10 }}>
              <button onClick={handleSubmit} disabled={saving}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: saving ? T.borderHi : T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer', fontFamily: 'inherit' }}>
                {saving ? 'Verzenden...' : 'Verzenden'}
              </button>
              <button onClick={onClose}
                style={{ flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                Annuleren
              </button>
            </div>
          </>
        )}
      </div>
    </>
  )
}
