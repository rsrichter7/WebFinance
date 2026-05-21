// ─── SettingsPreferences ───
// Voorkeuren: taal, valuta, datumformaat en donkere modus.

import React, { useState } from 'react'
import { T } from '../../tokens'

const KEYS = { taal: 'webfinance_taal', theme: 'webfinance_theme', datumformaat: 'webfinance_datumformaat' }

const DATE_OPTIONS = [
  { val: 'long', label: '8 mei 2026',  desc: 'Lang formaat' },
  { val: 'dmy',  label: '08-05-2026',  desc: 'Dag-Maand-Jaar' },
  { val: 'iso',  label: '2026-05-08',  desc: 'ISO 8601' },
]

function loadPrefs() {
  return {
    taal:         localStorage.getItem(KEYS.taal)         || 'nl',
    datumformaat: localStorage.getItem(KEYS.datumformaat) || 'long',
    theme:        localStorage.getItem(KEYS.theme)        || 'light',
  }
}

export default function SettingsPreferences() {
  const [prefs, setPrefs] = useState(loadPrefs)
  const [saved, setSaved]  = useState(false)

  function set(key, val) { setPrefs(p => ({ ...p, [key]: val })) }

  function saveAll() {
    localStorage.setItem(KEYS.taal,         prefs.taal)
    localStorage.setItem(KEYS.theme,        prefs.theme)
    localStorage.setItem(KEYS.datumformaat, prefs.datumformaat)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <SectionHeader title="Voorkeuren" description="Taal, valuta, datumformaat en thema" />

      <SubSection title="Regio">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Taal" hint="Meer talen worden later toegevoegd">
            <FakeSelect value="Nederlands" />
          </Field>
          <Field label="Valuta">
            <FakeSelect value="EUR (€)" />
          </Field>
        </div>
      </SubSection>

      <SubSection title="Datumformaat">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {DATE_OPTIONS.map(o => (
            <div
              key={o.val}
              onClick={() => set('datumformaat', o.val)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                border: `1.5px solid ${prefs.datumformaat === o.val ? T.blue : T.border}`,
                background: prefs.datumformaat === o.val ? T.blueSoft : T.card,
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: `2px solid ${prefs.datumformaat === o.val ? T.blue : T.borderHi}`,
                display: 'grid', placeItems: 'center',
              }}>
                {prefs.datumformaat === o.val && (
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.blue }} />
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>{o.label}</div>
                <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 1 }}>{o.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SubSection>

      <SubSection title="Thema" description="Styling van het donkere thema komt later — toggle werkt al">
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', border: `1px solid ${T.border}`, borderRadius: 10,
        }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Donkere modus</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Gebruik een donkere achtergrond</div>
          </div>
          <Toggle on={prefs.theme === 'dark'} onClick={() => set('theme', prefs.theme === 'dark' ? 'light' : 'dark')} />
        </div>
        {prefs.theme === 'dark' && (
          <div style={{ marginTop: 8, fontSize: 12, color: T.ink3, padding: '8px 12px', background: T.bg, borderRadius: 8 }}>
            Donkere modus styling wordt in een toekomstige update geactiveerd.
          </div>
        )}
      </SubSection>

      <button
        onClick={saveAll}
        style={{
          padding: '8px 16px', borderRadius: 8,
          background: saved ? T.green : T.blue,
          color: '#fff', border: 'none',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          transition: 'background 0.2s',
        }}
      >
        {saved ? 'Opgeslagen ✓' : 'Opslaan'}
      </button>
    </div>
  )
}

function SectionHeader({ title, description }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{description}</div>}
    </div>
  )
}

function SubSection({ title, description, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: description ? 4 : 12 }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>{description}</div>}
      {children}
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: T.ink2 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: T.ink4 }}>{hint}</div>}
    </div>
  )
}

function FakeSelect({ value }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '8px 12px', borderRadius: 8,
      border: `1px solid ${T.border}`,
      background: T.cardAlt, fontSize: 13, color: T.ink, opacity: 0.75,
    }}>
      <span>{value}</span>
    </div>
  )
}

function Toggle({ on, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: 36, height: 20, borderRadius: 10,
        background: on ? T.blue : T.borderHi,
        padding: 2, cursor: 'pointer',
        display: 'flex', alignItems: 'center',
        justifyContent: on ? 'flex-end' : 'flex-start',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </div>
  )
}
