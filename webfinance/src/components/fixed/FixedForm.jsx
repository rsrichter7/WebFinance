// ─── FixedForm ───
// Slide-in formulier voor toevoegen en bewerken van vaste lasten.

import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { getMergedCategories, SOORTEN } from '../../data/categories'
import useProfiles from '../../hooks/useProfiles'
import { useActiveAccount } from '../../hooks/useActiveAccount'
import DatePicker from '../ui/DatePicker'
import WieKeuze from '../ui/WieKeuze'
import { validateVerplichteTekst } from '../../utils/validation'

const HERHALINGEN = ['Wekelijks', 'Maandelijks', 'Jaarlijks']
const CATS = getMergedCategories()

const EMPTY_FORM = {
  type: 'Uitgave', bedrag: '', startdatum: new Date().toISOString().split('T')[0],
  omschrijving: '', categorie: CATS[0].name, sub: CATS[0].subs[0],
  winkel: '', herhaling: 'Maandelijks', soort: 'Noodzaak', wie: 'GZ',
}

function WeekendHint({ T }) {
  return (
    <p style={{ margin: 0, fontSize: 12, color: T.ink4, lineHeight: 1.5 }}>
      De automatische verwerking kan ±1 dag afwijken door het weekend: valt de datum op zaterdag, dan meestal de vrijdag ervoor; op zondag, dan meestal de maandag erna.
    </p>
  )
}

export default function FixedForm({ open, editingItem, onClose, onSave, initialType = 'Uitgave' }) {
  const { T } = useTheme()
  const { profiles, persons } = useProfiles()
  const { activeAccount } = useActiveAccount()
  const [form, setForm] = useState(EMPTY_FORM)
  const [pogingOpslaan, setPogingOpslaan] = useState(false)

  const defaultWie = persons.length > 1 ? 'GZ' : (persons[0]?.initialen ?? '')

  // Persoonlijke rekening: wie ligt vast op de eigenaar, geen keuze nodig.
  // Veiligheidsklep: als de eigenaar niet naar een profiel te herleiden is, gedraag je als gedeelde rekening.
  const isPersoonlijk = !!(activeAccount && activeAccount.gedeeld === false)
  const eigenaarInitialen = isPersoonlijk
    ? (profiles.find(p => p.userId === activeAccount.userId)?.initialen ?? null)
    : null
  const toonWieKeuze = !(isPersoonlijk && eigenaarInitialen)

  useEffect(() => {
    if (!open) return
    setPogingOpslaan(false)
    if (editingItem) {
      setForm({
        type: editingItem.type, bedrag: String(editingItem.bedrag),
        startdatum: editingItem.startdatum, omschrijving: editingItem.omschrijving,
        categorie: editingItem.categorie, sub: editingItem.sub,
        winkel: editingItem.winkel || '', herhaling: editingItem.herhaling,
        soort: editingItem.soort || 'Noodzaak',
        wie: (isPersoonlijk && eigenaarInitialen) ? eigenaarInitialen : (editingItem.wie || defaultWie),
      })
    } else {
      setForm({
        ...EMPTY_FORM, startdatum: new Date().toISOString().split('T')[0], type: initialType,
        wie: (isPersoonlijk && eigenaarInitialen) ? eigenaarInitialen : defaultWie,
      })
    }
  }, [open, editingItem, initialType, defaultWie])

  // Zet wie op de eigenaar zodra de actieve rekening persoonlijk is — ook bij wisselen van rekening terwijl het formulier open staat
  useEffect(() => {
    if (open && isPersoonlijk && eigenaarInitialen) {
      setForm(prev => prev.wie === eigenaarInitialen ? prev : { ...prev, wie: eigenaarInitialen })
    }
  }, [open, isPersoonlijk, eigenaarInitialen])

  const allCats = getMergedCategories()
  const currentCat = allCats.find(c => c.name === form.categorie)
  const subs = currentCat ? currentCat.subs : []
  const isEdit = !!editingItem

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'categorie') {
        const cat = allCats.find(c => c.name === value)
        next.sub = cat ? cat.subs[0] : ''
      }
      return next
    })
  }

  const winkelValidatie = validateVerplichteTekst(form.winkel, 'Winkel/Bron')

  function handleSave(keepOpen) {
    const bedrag = parseFloat(form.bedrag)
    if (!bedrag || !winkelValidatie.valid) { setPogingOpslaan(true); return }
    onSave({
      type: form.type, bedrag, startdatum: form.startdatum,
      omschrijving: form.omschrijving.trim(), categorie: form.categorie,
      sub: form.sub, winkel: form.winkel.trim(), herhaling: form.herhaling,
      soort: form.soort, wie: form.wie,
    }, isEdit)
    setForm({
      ...EMPTY_FORM, startdatum: new Date().toISOString().split('T')[0],
      wie: (isPersoonlijk && eigenaarInitialen) ? eigenaarInitialen : defaultWie,
    })
    setPogingOpslaan(false)
    if (!keepOpen) onClose()
  }

  if (!open) return null

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = {
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
            {isEdit
              ? (form.type === 'Inkomst' ? 'Vaste inkomst bewerken' : 'Vaste last bewerken')
              : (form.type === 'Inkomst' ? 'Nieuwe vaste inkomst' : 'Nieuwe vaste last')}
          </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{isEdit ? 'Wijzig de gegevens' : 'Voeg een terugkerende post toe'}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={L}>Bedrag *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 14, fontWeight: 500 }}>€</span>
                <input type="number" step="0.01" placeholder="0,00" value={form.bedrag}
                  onChange={e => update('bedrag', e.target.value)}
                  style={{ ...I, paddingLeft: 28, fontWeight: 600, fontSize: 16, fontVariantNumeric: 'tabular-nums' }} />
              </div>
            </div>
            <div>
              <label style={L}>Startdatum *</label>
              <DatePicker value={form.startdatum} onChange={v => update('startdatum', v)} />
            </div>
          </div>
          {form.type === 'Inkomst' && <WeekendHint T={T} />}

          <div>
            <label style={L}>Winkel / Bron *</label>
            <input type="text" placeholder="bijv. Essent" value={form.winkel}
              onChange={e => update('winkel', e.target.value)}
              style={{ ...I, borderColor: pogingOpslaan && !winkelValidatie.valid ? T.red : T.border }} />
            {pogingOpslaan && !winkelValidatie.valid && (
              <div style={{ fontSize: 11.5, color: T.red, marginTop: 4 }}>{winkelValidatie.error}</div>
            )}
          </div>

          <div>
            <label style={L}>Omschrijving <span style={{ fontWeight: 400, color: T.ink4 }}>optioneel</span></label>
            <input type="text" placeholder="bijv. Hypotheek" value={form.omschrijving}
              onChange={e => update('omschrijving', e.target.value)} style={I} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={L}>Categorie *</label>
              <select value={form.categorie} onChange={e => update('categorie', e.target.value)} style={I}>
                {allCats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={L}>Subcategorie</label>
              <select value={form.sub} onChange={e => update('sub', e.target.value)} style={I}>
                {subs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label style={L}>Herhaling *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {HERHALINGEN.map(h => (
                <button key={h} onClick={() => update('herhaling', h)} style={{
                  flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                  border: `1.5px solid ${form.herhaling === h ? T.blue : T.border}`,
                  background: form.herhaling === h ? T.blueSoft : T.card,
                  color: form.herhaling === h ? T.blueText : T.ink3,
                }}>{h}</button>
              ))}
            </div>
          </div>

          {form.type === 'Uitgave' && (
            <div>
              <label style={L}>Soort *</label>
              <div style={{ display: 'flex', gap: 8 }}>
                {SOORTEN.map(s => (
                  <button key={s} onClick={() => update('soort', s)} style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: `1.5px solid ${form.soort === s ? T.blue : T.border}`,
                    background: form.soort === s ? T.blueSoft : T.card,
                    color: form.soort === s ? T.blueText : T.ink3,
                  }}>{s}</button>
                ))}
              </div>
            </div>
          )}

          {toonWieKeuze && (
            <WieKeuze profiles={profiles} persons={persons} value={form.wie}
              onChange={v => update('wie', v)} T={T} labelStyle={L} />
          )}
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 10 }}>
          <button onClick={() => handleSave(false)} style={{
            flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
            background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Opslaan
          </button>
          {!isEdit && (
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
