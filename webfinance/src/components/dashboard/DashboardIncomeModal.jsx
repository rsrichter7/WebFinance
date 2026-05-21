// ─── DashboardIncomeModal ───
// Pop-up modal voor het instellen van netto maandinkomen per persoon.

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { T, fmt } from '../../tokens'

const KEY = 'webfinance_netto_inkomen'

export function loadNettoInkomen() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {} } catch { return {} }
}

export default function DashboardIncomeModal({ persons, inkomen, onSave, onClose }) {
  const [waarden, setWaarden] = useState(() => {
    const init = {}
    for (const p of persons) init[p.initialen] = inkomen[p.initialen] || ''
    return init
  })

  const totaal = persons.reduce((s, p) => s + (parseFloat(waarden[p.initialen]) || 0), 0)

  function handleSave() {
    const data = {}
    for (const p of persons) {
      const v = parseFloat(waarden[p.initialen])
      if (v > 0) data[p.initialen] = v
    }
    try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
    onSave(data)
  }

  function set(initialen, val) {
    setWaarden(prev => ({ ...prev, [initialen]: val }))
  }

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
        background: '#fff', border: `1px solid ${T.border}`, borderRadius: 14,
        boxShadow: '0 20px 60px rgba(17,24,39,0.15)',
        padding: 28, width: 380, zIndex: 201,
      }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 6 }}>
          Netto inkomen instellen
        </div>
        <div style={{ fontSize: 13, color: T.ink3, marginBottom: 22, lineHeight: 1.5 }}>
          Vul het netto maandinkomen per persoon in. Dit wordt gebruikt voor de kostenverdeling.
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
          {persons.map(p => (
            <div key={p.initialen}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: p.kleur.bg, color: p.kleur.fg, display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                  {p.initialen}
                </div>
                {p.naam}
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 14, fontWeight: 500, pointerEvents: 'none' }}>€</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0,00"
                  value={waarden[p.initialen]}
                  onChange={e => set(p.initialen, e.target.value)}
                  style={{ ...inputStyle, paddingLeft: 28, fontVariantNumeric: 'tabular-nums', fontWeight: 600, fontSize: 15 }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Totaal */}
        {totaal > 0 && (
          <div style={{ padding: '10px 14px', background: T.bg, borderRadius: 8, marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: T.ink3 }}>Totaal netto inkomen</span>
            <span style={{ fontSize: 14, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{fmt(totaal)}</span>
          </div>
        )}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={handleSave} style={primaryBtn}>Opslaan</button>
          <button onClick={onClose} style={secondaryBtn}>Annuleren</button>
        </div>
      </div>
    </>,
    document.body
  )
}

const inputStyle = {
  width: '100%', padding: '9px 12px', borderRadius: 8,
  border: `1.5px solid ${T.border}`, background: '#fff',
  fontSize: 13, color: T.ink, outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box',
}
const primaryBtn   = { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
const secondaryBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: '#fff', color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
