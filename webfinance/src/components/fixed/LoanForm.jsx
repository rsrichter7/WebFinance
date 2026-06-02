// ─── LoanForm ───
// Slide-in formulier voor toevoegen en bewerken van leningen.

import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import useProfiles from '../../hooks/useProfiles'
import DatePicker from '../ui/DatePicker'
import { huidigeMaandlast, berekenEinddatum } from '../../utils/loanCalculations'
import { fmt } from '../../tokens'

const TYPEN = ['Hypotheek', 'Studieschuld', 'Persoonlijke lening', 'Autolening']
const AFLOSSINGSVORMEN = ['Annuitair', 'Lineair']

const LEEG_FORMULIER = {
  naam: '', type: 'Hypotheek', aflossingsvorm: 'Annuitair',
  oorspronkelijk_bedrag: '', huidig_saldo: '',
  rente_percentage: '', looptijd_maanden: '',
  startdatum: new Date().toISOString().split('T')[0],
  wie: 'GZ', rekening: '', notitie: '',
}

function maandlastPreview(form) {
  const hoofdsom = parseFloat(form.huidig_saldo || form.oorspronkelijk_bedrag)
  const rente    = parseFloat(form.rente_percentage)
  const looptijd = parseInt(form.looptijd_maanden, 10)
  if (!hoofdsom || looptijd < 1) return null
  return huidigeMaandlast({
    aflossingsvorm:        form.aflossingsvorm,
    huidig_saldo:          hoofdsom,
    oorspronkelijk_bedrag: parseFloat(form.oorspronkelijk_bedrag) || hoofdsom,
    rente_percentage:      rente || 0,
    looptijd_maanden:      looptijd,
  })
}

export default function LoanForm({ open, editingLoan, onClose, onSave }) {
  const { T } = useTheme()
  const { profiles } = useProfiles()
  const [form, setForm] = useState(LEEG_FORMULIER)

  useEffect(() => {
    if (!open) return
    if (editingLoan) {
      setForm({
        naam:                  editingLoan.naam,
        type:                  editingLoan.type,
        aflossingsvorm:        editingLoan.aflossingsvorm,
        oorspronkelijk_bedrag: String(editingLoan.oorspronkelijk_bedrag),
        huidig_saldo:          String(editingLoan.huidig_saldo),
        rente_percentage:      String(editingLoan.rente_percentage),
        looptijd_maanden:      String(editingLoan.looptijd_maanden),
        startdatum:            editingLoan.startdatum,
        wie:                   editingLoan.wie || 'GZ',
        rekening:              editingLoan.rekening || '',
        notitie:               editingLoan.notitie || '',
      })
    } else {
      setForm({ ...LEEG_FORMULIER, startdatum: new Date().toISOString().split('T')[0] })
    }
  }, [open, editingLoan])

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Huidig saldo automatisch gelijkstellen bij leeg (alleen bij nieuw)
      if (field === 'oorspronkelijk_bedrag' && !editingLoan && !prev.huidig_saldo) {
        next.huidig_saldo = value
      }
      return next
    })
  }

  function valideer() {
    const bed = parseFloat(form.oorspronkelijk_bedrag)
    const sal = parseFloat(form.huidig_saldo)
    const lpt = parseInt(form.looptijd_maanden, 10)
    if (!form.naam.trim()) return 'Naam is verplicht'
    if (!bed || bed <= 0) return 'Geldig bedrag vereist'
    if (isNaN(sal) || sal < 0 || sal > bed) return 'Huidig saldo mag niet groter zijn dan oorspronkelijk bedrag'
    if (!lpt || lpt < 1) return 'Looptijd moet minimaal 1 maand zijn'
    const rente = parseFloat(form.rente_percentage)
    if (isNaN(rente) || rente < 0 || rente > 20) return 'Rente moet tussen 0% en 20% liggen'
    return null
  }

  function handleSave() {
    const fout = valideer()
    if (fout) { alert(fout); return }

    const looptijd = parseInt(form.looptijd_maanden, 10)
    const einddatum = berekenEinddatum(form.startdatum, looptijd)

    onSave({
      naam:                  form.naam.trim(),
      type:                  form.type,
      aflossingsvorm:        form.aflossingsvorm,
      oorspronkelijk_bedrag: parseFloat(form.oorspronkelijk_bedrag),
      huidig_saldo:          parseFloat(form.huidig_saldo),
      rente_percentage:      parseFloat(form.rente_percentage) || 0,
      looptijd_maanden:      looptijd,
      startdatum:            form.startdatum,
      einddatum,
      wie:                   form.wie,
      rekening:              form.rekening.trim(),
      notitie:               form.notitie.trim(),
    }, !!editingLoan)
    onClose()
  }

  if (!open) return null

  const isEdit   = !!editingLoan
  const preview  = maandlastPreview(form)
  const lptInt   = parseInt(form.looptijd_maanden, 10)
  const jaren    = isNaN(lptInt) ? '' : Math.floor(lptInt / 12)
  const mnd      = isNaN(lptInt) ? '' : lptInt % 12

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1.5px solid ${T.border}`, background: T.card,
    fontSize: 13, color: T.ink, outline: 'none',
    fontFamily: "'Inter', system-ui, sans-serif",
    boxSizing: 'border-box',
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 90 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 440,
        background: T.card, borderLeft: `1px solid ${T.border}`,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>{isEdit ? 'Lening bewerken' : 'Nieuwe lening'}</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{isEdit ? 'Wijzig de leninggegevens' : 'Voeg een lening toe om aflossingen bij te houden'}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        {/* Formuliervelden */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>

          <div>
            <label style={L}>Naam *</label>
            <input type="text" placeholder="Bijv. Hypotheek ABN Amro" maxLength={100}
              value={form.naam} onChange={e => update('naam', e.target.value)} style={I} />
          </div>

          <div>
            <label style={L}>Type *</label>
            <div style={{ display: 'flex', gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
              {TYPEN.map(t => (
                <button key={t} onClick={() => update('type', t)} style={{
                  flex: 1, padding: '8px 4px', border: 'none', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  background: form.type === t ? T.violetSoft : T.card,
                  color: form.type === t ? T.violet : T.ink3,
                  borderRight: `1px solid ${T.border}`,
                }}>{t}</button>
              ))}
            </div>
          </div>

          <div>
            <label style={L}>Aflossingsvorm *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {AFLOSSINGSVORMEN.map(a => (
                <button key={a} onClick={() => update('aflossingsvorm', a)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${form.aflossingsvorm === a ? T.violet : T.border}`,
                  background: form.aflossingsvorm === a ? T.violetSoft : T.card,
                  color: form.aflossingsvorm === a ? T.violet : T.ink3,
                }}>{a}</button>
              ))}
            </div>
            <div style={{ fontSize: 11.5, color: T.ink4, marginTop: 5 }}>
              {form.aflossingsvorm === 'Annuitair'
                ? 'Vaste maandlast — rente en aflossing verschuiven over de looptijd'
                : 'Vaste aflossing — maandlast daalt naarmate het saldo afneemt'}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={L}>Oorspronkelijk bedrag *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 14 }}>€</span>
                <input type="number" step="0.01" min="0" placeholder="0,00"
                  value={form.oorspronkelijk_bedrag}
                  onChange={e => update('oorspronkelijk_bedrag', e.target.value)}
                  style={{ ...I, paddingLeft: 28, fontVariantNumeric: 'tabular-nums' }} />
              </div>
            </div>
            <div>
              <label style={L}>Huidig saldo *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 14 }}>€</span>
                <input type="number" step="0.01" min="0" placeholder="0,00"
                  value={form.huidig_saldo}
                  onChange={e => update('huidig_saldo', e.target.value)}
                  style={{ ...I, paddingLeft: 28, fontVariantNumeric: 'tabular-nums' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={L}>Rente % *</label>
              <div style={{ position: 'relative' }}>
                <input type="number" step="0.001" min="0" max="20" placeholder="3.500"
                  value={form.rente_percentage}
                  onChange={e => update('rente_percentage', e.target.value)}
                  style={{ ...I, paddingRight: 28, fontVariantNumeric: 'tabular-nums' }} />
                <span style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', color: T.ink4, fontSize: 13 }}>%</span>
              </div>
            </div>
            <div>
              <label style={L}>Looptijd (maanden) *</label>
              <input type="number" step="1" min="1" placeholder="360"
                value={form.looptijd_maanden}
                onChange={e => update('looptijd_maanden', e.target.value)}
                style={{ ...I, fontVariantNumeric: 'tabular-nums' }} />
              {!isNaN(lptInt) && lptInt > 0 && (
                <div style={{ fontSize: 11.5, color: T.ink4, marginTop: 4 }}>
                  {jaren > 0 ? `${jaren} jaar` : ''}{jaren > 0 && mnd > 0 ? ' en ' : ''}{mnd > 0 ? `${mnd} maanden` : ''}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={L}>Startdatum *</label>
              <DatePicker value={form.startdatum} onChange={v => update('startdatum', v)} />
            </div>
            <div>
              <label style={L}>Rekening / Bank <span style={{ fontWeight: 400, color: T.ink4 }}>optioneel</span></label>
              <input type="text" placeholder="Bijv. ABN Amro"
                value={form.rekening} onChange={e => update('rekening', e.target.value)} style={I} />
            </div>
          </div>

          <div>
            <label style={L}>Wie *</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profiles.map(p => (
                <button key={p.initialen} onClick={() => update('wie', p.initialen)} style={{
                  flex: 1, minWidth: 80, padding: '8px 12px', borderRadius: 8,
                  fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${form.wie === p.initialen ? T.violet : T.border}`,
                  background: form.wie === p.initialen ? T.violetSoft : T.card,
                  color: form.wie === p.initialen ? T.violet : T.ink3,
                  display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: p.kleur.bg, color: p.kleur.fg, display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 600, flexShrink: 0 }}>
                    {p.initialen}
                  </div>
                  {p.naam.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={L}>Notitie <span style={{ fontWeight: 400, color: T.ink4 }}>optioneel</span></label>
            <textarea rows={2} maxLength={500} placeholder="Bijv. variabele rente, herzien in 2028"
              value={form.notitie} onChange={e => update('notitie', e.target.value)}
              style={{ ...I, resize: 'vertical', lineHeight: 1.5 }} />
          </div>

          {/* Live maandlast preview */}
          {preview !== null && (
            <div style={{
              padding: '12px 16px', borderRadius: 10,
              background: T.violetSoft, border: `1px solid ${T.violet}22`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ fontSize: 13, color: T.violet, fontWeight: 500 }}>Berekende maandlast</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: T.violet, fontVariantNumeric: 'tabular-nums' }}>
                {fmt(preview)}
              </div>
            </div>
          )}
        </div>

        {/* Voettekst */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 10 }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
            background: T.violet, color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            {isEdit ? 'Wijzigingen opslaan' : 'Lening toevoegen'}
          </button>
          <button onClick={onClose} style={{
            flex: 1, padding: '10px 0', borderRadius: 8,
            border: `1px solid ${T.border}`, background: T.card,
            color: T.ink2, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Annuleren
          </button>
        </div>
      </div>
    </>
  )
}
