// ─── TransactionForm ───
// Slide-in paneel voor nieuwe transactie.
// Subcategorie reset automatisch bij wijziging hoofdcategorie.
// Formulier leegt na opslaan. Bij "Opslaan en volgende" blijft paneel open.

import React, { useState, useEffect } from 'react'
import { T } from '../../tokens'
import { CATEGORIES, SOORTEN, PERSONEN } from '../../data/categories'

const EMPTY_FORM = {
  type: 'Uitgave',
  bedrag: '',
  datum: new Date().toISOString().split('T')[0],
  omschrijving: '',
  categorie: CATEGORIES[0].name,
  sub: CATEGORIES[0].subs[0],
  winkel: '',
  soort: 'Noodzaak',
  wie: PERSONEN[0].initials,
  notitie: '',
}

export default function TransactionForm({ open, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM)

  // Reset formulier wanneer paneel opent
  useEffect(() => {
    if (open) setForm({ ...EMPTY_FORM, datum: new Date().toISOString().split('T')[0] })
  }, [open])

  // Subcategorieën op basis van gekozen hoofdcategorie
  const currentCat = CATEGORIES.find(c => c.name === form.categorie)
  const subs = currentCat ? currentCat.subs : []

  // Update een veld
  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      // Reset subcategorie als hoofdcategorie wijzigt
      if (field === 'categorie') {
        const cat = CATEGORIES.find(c => c.name === value)
        next.sub = cat ? cat.subs[0] : ''
      }
      return next
    })
  }

  // Opslaan
  function handleSave(keepOpen) {
    const bedrag = parseFloat(form.bedrag)
    if (!bedrag || !form.omschrijving.trim()) return

    onSave({
      datum: form.datum,
      bedrag,
      omschrijving: form.omschrijving.trim(),
      type: form.type,
      categorie: form.categorie,
      sub: form.sub,
      winkel: form.winkel.trim(),
      soort: form.soort,
      wie: form.wie,
      notitie: form.notitie.trim(),
    })

    // Reset formulier
    setForm({ ...EMPTY_FORM, datum: new Date().toISOString().split('T')[0] })

    // Sluit paneel tenzij "Opslaan en volgende"
    if (!keepOpen) onClose()
  }

  if (!open) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)',
          zIndex: 90,
        }}
      />

      {/* Paneel */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: T.card, borderLeft: `1px solid ${T.border}`,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.08)',
        zIndex: 100, display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${T.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>Nieuwe transactie</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Voeg een mutatie toe</div>
          </div>
          <button
            onClick={onClose}
            style={{
              border: 'none', background: 'transparent', fontSize: 20,
              color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6,
            }}
          >
            ×
          </button>
        </div>

        {/* Formulier */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Type toggle */}
          <div>
            <label style={labelStyle}>Type *</label>
            <div style={{ display: 'flex', gap: 0, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
              {['Uitgave', 'Inkomst'].map(t => (
                <button
                  key={t}
                  onClick={() => update('type', t)}
                  style={{
                    flex: 1, padding: '8px 0', border: 'none', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    background: form.type === t ? (t === 'Uitgave' ? T.ink : T.green) : T.card,
                    color: form.type === t ? '#fff' : T.ink3,
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Bedrag + Datum */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Bedrag *</label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 14, fontWeight: 500 }}>€</span>
                <input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={form.bedrag}
                  onChange={e => update('bedrag', e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 28, fontWeight: 600, fontSize: 16, fontVariantNumeric: 'tabular-nums' }}
                />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Datum *</label>
              <input
                type="date"
                value={form.datum}
                onChange={e => update('datum', e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Omschrijving */}
          <div>
            <label style={labelStyle}>Omschrijving *</label>
            <input
              type="text"
              placeholder="Bijv. Boodschappen Albert Heijn"
              value={form.omschrijving}
              onChange={e => update('omschrijving', e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Categorie + Subcategorie */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div>
              <label style={labelStyle}>Categorie *</label>
              <select value={form.categorie} onChange={e => update('categorie', e.target.value)} style={inputStyle}>
                {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Subcategorie</label>
              <select value={form.sub} onChange={e => update('sub', e.target.value)} style={inputStyle}>
                {subs.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Winkel / Bron */}
          <div>
            <label style={labelStyle}>Winkel / Bron</label>
            <input
              type="text"
              placeholder="Bijv. Albert Heijn"
              value={form.winkel}
              onChange={e => update('winkel', e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Soort */}
          <div>
            <label style={labelStyle}>Soort *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {SOORTEN.map(s => (
                <button
                  key={s}
                  onClick={() => update('soort', s)}
                  style={{
                    flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: `1.5px solid ${form.soort === s ? T.blue : T.border}`,
                    background: form.soort === s ? T.blueSoft : T.card,
                    color: form.soort === s ? T.blueText : T.ink3,
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Wie */}
          <div>
            <label style={labelStyle}>Wie *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {PERSONEN.map(p => (
                <button
                  key={p.initials}
                  onClick={() => update('wie', p.initials)}
                  style={{
                    flex: 1, padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    border: `1.5px solid ${form.wie === p.initials ? T.blue : T.border}`,
                    background: form.wie === p.initials ? T.blueSoft : T.card,
                    color: form.wie === p.initials ? T.blueText : T.ink3,
                    display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
                  }}
                >
                  <div style={{
                    width: 22, height: 22, borderRadius: '50%',
                    background: p.color.bg, color: p.color.fg,
                    display: 'grid', placeItems: 'center',
                    fontSize: 9, fontWeight: 600,
                  }}>
                    {p.initials}
                  </div>
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Notitie */}
          <div>
            <label style={labelStyle}>Notitie <span style={{ fontWeight: 400, color: T.ink4 }}>optioneel</span></label>
            <textarea
              placeholder="Voeg een toelichting toe..."
              value={form.notitie}
              onChange={e => update('notitie', e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', minHeight: 72 }}
            />
          </div>
        </div>

        {/* Footer met knoppen */}
        <div style={{
          padding: '16px 24px', borderTop: `1px solid ${T.border}`,
          display: 'flex', gap: 10,
        }}>
          <button
            onClick={() => handleSave(false)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
              background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Opslaan
          </button>
          <button
            onClick={() => handleSave(true)}
            style={{
              flex: 1, padding: '10px 0', borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.card,
              color: T.ink2, fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            Opslaan en volgende
          </button>
        </div>
      </div>
    </>
  )
}

// ─── Gedeelde styles ───
const labelStyle = {
  display: 'block', fontSize: 13, fontWeight: 500,
  color: T.ink2, marginBottom: 6,
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1.5px solid ${T.border}`, background: T.card,
  fontSize: 13, color: T.ink, outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif",
}
