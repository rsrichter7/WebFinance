// ─── WieKeuze ───
// Herbruikbare wie-kiezer (persoon-knoppen), gebruikt in TransactionForm en FixedForm.

import React from 'react'

export default function WieKeuze({ profiles, persons, value, onChange, T, labelStyle }) {
  return (
    <div>
      <label style={labelStyle}>Wie *</label>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {(persons.length > 1 ? profiles : persons).map(p => (
          <button key={p.initialen} onClick={() => onChange(p.initialen)} style={{
            flex: 1, minWidth: 80, padding: '8px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
            border: `1.5px solid ${value === p.initialen ? T.blue : T.border}`,
            background: value === p.initialen ? T.blueSoft : T.card,
            color: value === p.initialen ? T.blueText : T.ink3,
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
  )
}
