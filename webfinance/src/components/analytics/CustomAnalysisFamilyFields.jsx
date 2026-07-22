// ─── CustomAnalysisFamilyFields ───
// Familie-specifieke velden van CustomAnalysisForm: dimensie + weergave (+ referentielijnen
// bij soort/donut) voor 'groep', alleen weergave voor 'trend'.

import React from 'react'

const DIMENSIE_OPTIES = [
  { value: 'categorie',    label: 'Categorie' },
  { value: 'subcategorie', label: 'Subcategorie' },
  { value: 'soort',        label: 'Soort' },
  { value: 'type',         label: 'Type Inkomst/Uitgave' },
  { value: 'wie',          label: 'Wie' },
]

const GROEP_WEERGAVEN = [
  { value: 'staaf', label: 'Staafdiagram' },
  { value: 'donut', label: 'Cirkeldiagram' },
  { value: 'tabel', label: 'Tabel' },
]

const TREND_WEERGAVEN = [
  { value: 'lijn',  label: 'Lijndiagram' },
  { value: 'staaf', label: 'Staafdiagram' },
]

export function ToggleRow({ options, value, onChange, T }) {
  return (
    <div style={{ display: 'flex', gap: 8 }}>
      {options.map(o => (
        <button key={o.value} type="button" onClick={() => onChange(o.value)} style={{
          flex: 1, padding: '8px 0', borderRadius: 8, fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          border: `1.5px solid ${value === o.value ? T.blue : T.border}`,
          background: value === o.value ? T.blueSoft : T.card,
          color: value === o.value ? T.blueText : T.ink3,
        }}>{o.label}</button>
      ))}
    </div>
  )
}

export default function CustomAnalysisFamilyFields({ form, update, T, L }) {
  const toonReferentieCheckbox = form.familie === 'groep' && form.dimensie === 'soort' && form.grafiekvorm === 'donut'

  return (
    <>
      {form.familie === 'groep' && (
        <div>
          <label style={L}>Dimensie *</label>
          <select value={form.dimensie} onChange={e => update('dimensie', e.target.value)} style={{
            width: '100%', padding: '9px 12px', borderRadius: 8,
            border: `1.5px solid ${T.border}`, background: T.card,
            fontSize: 13, color: T.ink, outline: 'none', fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            {DIMENSIE_OPTIES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
      )}

      <div>
        <label style={L}>Weergave *</label>
        <ToggleRow
          options={form.familie === 'trend' ? TREND_WEERGAVEN : GROEP_WEERGAVEN}
          value={form.grafiekvorm}
          onChange={v => update('grafiekvorm', v)}
          T={T}
        />
      </div>

      {toonReferentieCheckbox && (
        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: T.ink2, cursor: 'pointer' }}>
          <input type="checkbox" checked={form.toonReferentie5030}
            onChange={e => update('toonReferentie5030', e.target.checked)} />
          Toon 50/30/20-referentielijnen
        </label>
      )}
    </>
  )
}
