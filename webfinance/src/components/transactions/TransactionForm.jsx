// ─── TransactionForm ───
// Slide-in paneel voor nieuwe transactie.
// Subcategorie reset automatisch bij wijziging hoofdcategorie.
// Formulier leegt na opslaan. Bij "Opslaan en volgende" blijft paneel open.

import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { CATEGORIES, getMergedCategories, SOORTEN } from '../../data/categories'
import useProfiles from '../../hooks/useProfiles'
import { useActiveAccount } from '../../hooks/useActiveAccount'
import DatePicker from '../ui/DatePicker'
import WieKeuze from '../ui/WieKeuze'
import { fmt, TAB } from '../../tokens'
import { validateVerplichteTekst } from '../../utils/validation'

const FORM_BASE = {
  type: 'Uitgave',
  bedrag: '',
  datum: new Date().toISOString().split('T')[0],
  beschrijving: '',
  winkel: '',
  categorie: CATEGORIES[0].name,
  subcategorie: CATEGORIES[0].subs[0],
  soort: 'Noodzaak',
  wie: '',
  notitie: '',
}

function SaldoNaTransactie({ saldoNaTransactie, T }) {
  if (saldoNaTransactie == null || !isFinite(saldoNaTransactie)) return null
  return (
    <div style={{ padding: '12px 24px', borderTop: `1px solid ${T.rule}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: T.ink2 }}>Saldo na transactie</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: saldoNaTransactie >= 0 ? T.green : T.red, ...TAB }}>
          {fmt(saldoNaTransactie)}
        </span>
      </div>
    </div>
  )
}

export default function TransactionForm({ open, onClose, onSave, onUpdate, initialDate, editingTransaction, saldoNaTransactie = null }) {
  const { T } = useTheme()
  const { profiles, persons } = useProfiles()
  const { activeAccount } = useActiveAccount()

  // Persoonlijke rekening: wie ligt vast op de eigenaar, geen keuze nodig.
  // Veiligheidsklep: als de eigenaar niet naar een profiel te herleiden is, gedraag je als gedeelde rekening.
  const isPersoonlijk = !!(activeAccount && activeAccount.gedeeld === false)
  const eigenaarInitialen = isPersoonlijk
    ? (profiles.find(p => p.userId === activeAccount.userId)?.initialen ?? null)
    : null
  const toonWieKeuze = !(isPersoonlijk && eigenaarInitialen)

  function emptyForm() {
    if (isPersoonlijk && eigenaarInitialen) return { ...FORM_BASE, wie: eigenaarInitialen }
    const defaultWie = persons.length > 1 ? 'GZ' : (persons[0]?.initialen ?? '')
    return { ...FORM_BASE, wie: defaultWie }
  }

  const [form, setForm] = useState(emptyForm)
  const [pogingOpslaan, setPogingOpslaan] = useState(false)

  useEffect(() => {
    if (!open) return
    setPogingOpslaan(false)
    if (editingTransaction) {
      setForm({
        type: editingTransaction.type || 'Uitgave',
        bedrag: editingTransaction.bedrag || '',
        datum: editingTransaction.datum || new Date().toISOString().split('T')[0],
        beschrijving: editingTransaction.beschrijving || '',
        winkel: editingTransaction.winkel || '',
        categorie: editingTransaction.categorie || CATEGORIES[0].name,
        subcategorie: editingTransaction.subcategorie || CATEGORIES[0].subs[0],
        soort: editingTransaction.soort || 'Noodzaak',
        wie: (isPersoonlijk && eigenaarInitialen) ? eigenaarInitialen : (editingTransaction.wie || ''),
        notitie: editingTransaction.notitie || '',
      })
    } else {
      setForm({ ...emptyForm(), datum: initialDate || new Date().toISOString().split('T')[0] })
    }
  }, [open])

  // Zet wie op de eigenaar zodra de actieve rekening persoonlijk is — ook bij wisselen van rekening terwijl het formulier open staat
  useEffect(() => {
    if (open && isPersoonlijk && eigenaarInitialen) {
      setForm(prev => prev.wie === eigenaarInitialen ? prev : { ...prev, wie: eigenaarInitialen })
    }
  }, [open, isPersoonlijk, eigenaarInitialen])

  const allCats = getMergedCategories()
  const currentCat = allCats.find(c => c.name === form.categorie)
  const subs = currentCat ? currentCat.subs : []

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'categorie') {
        const cat = allCats.find(c => c.name === value)
        next.subcategorie = cat ? cat.subs[0] : ''
      }
      return next
    })
  }

  const winkelValidatie = validateVerplichteTekst(form.winkel, 'Winkel/Bron')

  async function handleSave(keepOpen) {
    const bedrag = parseFloat(form.bedrag)
    if (!bedrag || !winkelValidatie.valid) { setPogingOpslaan(true); return }
    const velden = {
      datum: form.datum, bedrag, beschrijving: form.beschrijving.trim(),
      winkel: form.winkel.trim(), type: form.type, categorie: form.categorie,
      subcategorie: form.subcategorie, soort: form.soort, wie: form.wie,
      notitie: form.notitie.trim(),
    }
    if (editingTransaction) {
      await onUpdate(editingTransaction.id, velden)
      onClose()
    } else {
      await onSave(velden)
      setForm({ ...emptyForm(), datum: new Date().toISOString().split('T')[0] })
      setPogingOpslaan(false)
      if (!keepOpen) onClose()
    }
  }

  if (!open) return null

  const labelStyle = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const inputStyle = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1.5px solid ${T.border}`, background: T.card,
    fontSize: 13, color: T.ink, outline: 'none',
    fontFamily: "'Inter', system-ui, sans-serif",
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 90 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: T.card, borderLeft: `1px solid ${T.border}`,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>
              {editingTransaction ? 'Transactie bewerken' : 'Nieuwe transactie'}
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
              {editingTransaction ? 'Pas de gegevens aan' : 'Voeg een mutatie toe'}
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={labelStyle}>Type *</label>
            <div style={{ display: 'flex', gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
              {['Uitgave', 'Inkomst'].map(t => (
                <button key={t} onClick={() => update('type', t)} style={{
                  flex: 1, padding: '8px 0', border: 'none', fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  background: form.type === t ? (t === 'Uitgave' ? T.uitgaveBtnBg : T.inkomstBtnBg) : T.card,
                  color: form.type === t ? (t === 'Uitgave' ? T.uitgaveBtnText : T.inkomstBtnText) : T.ink3,
                }}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Bedrag *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 14, fontWeight: 500 }}>€</span>
                <input type="number" step="0.01" placeholder="0,00" value={form.bedrag}
                  onChange={e => update('bedrag', e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 28, fontWeight: 600, fontSize: 16, fontVariantNumeric: 'tabular-nums' }} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Datum *</label>
              <DatePicker value={form.datum} onChange={v => update('datum', v)} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Winkel / Bron *</label>
            <input type="text" placeholder="bijv. Albert Heijn" value={form.winkel}
              onChange={e => update('winkel', e.target.value)}
              style={{ ...inputStyle, borderColor: pogingOpslaan && !winkelValidatie.valid ? T.red : T.border }} />
            {pogingOpslaan && !winkelValidatie.valid && (
              <div style={{ fontSize: 11.5, color: T.red, marginTop: 4 }}>{winkelValidatie.error}</div>
            )}
          </div>

          <div>
            <label style={labelStyle}>Omschrijving <span style={{ fontWeight: 400, color: T.ink4 }}>optioneel</span></label>
            <input type="text" placeholder="bijv. Boodschappen" value={form.beschrijving}
              onChange={e => update('beschrijving', e.target.value)} style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Categorie *</label>
              <select value={form.categorie} onChange={e => update('categorie', e.target.value)} style={inputStyle}>
                {allCats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Subcategorie</label>
              <select value={form.subcategorie} onChange={e => update('subcategorie', e.target.value)} style={inputStyle}>
                {subs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={labelStyle}>Soort *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {SOORTEN.map(s => (
                <button key={s} onClick={() => update('soort', s)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${form.soort === s ? T.blue : T.border}`,
                  background: form.soort === s ? T.blueSoft : T.card,
                  color: form.soort === s ? T.blueText : T.ink3,
                }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {toonWieKeuze && (
            <WieKeuze profiles={profiles} persons={persons} value={form.wie}
              onChange={v => update('wie', v)} T={T} labelStyle={labelStyle} />
          )}

          <div>
            <label style={labelStyle}>Notitie <span style={{ fontWeight: 400, color: T.ink4 }}>optioneel</span></label>
            <textarea placeholder="Voeg een toelichting toe..." value={form.notitie}
              onChange={e => update('notitie', e.target.value)} rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }} />
          </div>
        </div>

        {editingTransaction && <SaldoNaTransactie saldoNaTransactie={saldoNaTransactie} T={T} />}

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 10 }}>
          <button onClick={() => handleSave(false)} style={{
            flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
            background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Opslaan
          </button>
          {!editingTransaction && (
            <button onClick={() => handleSave(true)} style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.card,
              color: T.ink2, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              Opslaan en volgende
            </button>
          )}
        </div>
      </div>
    </>
  )
}
