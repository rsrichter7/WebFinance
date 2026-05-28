// ─── SettingsPreferences ───
// Voorkeuren: taal, valuta, datumformaat en thema (Licht / Donker / Automatisch).

import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import useSettings from '../../hooks/useSettings'

const DATE_OPTIONS = [
  { val: 'long', label: '8 mei 2026',  desc: 'Lang formaat' },
  { val: 'dmy',  label: '08-05-2026',  desc: 'Dag-Maand-Jaar' },
  { val: 'iso',  label: '2026-05-08',  desc: 'ISO 8601' },
]

const THEME_OPTIONS = [
  { val: 'light', label: 'Licht',       icon: 'sun'     },
  { val: 'dark',  label: 'Donker',      icon: 'moon'    },
  { val: 'auto',  label: 'Automatisch', icon: 'monitor' },
]

export default function SettingsPreferences() {
  const { T, theme, setTheme } = useTheme()
  const { settings, loading, updateSettings } = useSettings()
  const [prefs, setPrefs] = useState({ datumformaat: 'long', taal: 'nl' })
  const [saved, setSaved]  = useState(false)

  useEffect(() => {
    if (!loading) {
      setPrefs({
        datumformaat: settings.datumformaat,
        taal:         settings.taal,
      })
    }
  }, [loading, settings.datumformaat, settings.taal])

  function set(key, val) { setPrefs(p => ({ ...p, [key]: val })); setSaved(false) }

  async function saveAll() {
    await updateSettings({ datumformaat: prefs.datumformaat, taal: prefs.taal })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div>
      <SectionHeader title="Voorkeuren" description="Taal, valuta, datumformaat en thema" T={T} />

      <SubSection title="Regio" T={T}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Field label="Taal" hint="Meer talen worden later toegevoegd" T={T}>
            <FakeSelect value="Nederlands" T={T} />
          </Field>
          <Field label="Valuta" T={T}>
            <FakeSelect value="EUR (€)" T={T} />
          </Field>
        </div>
      </SubSection>

      <SubSection title="Datumformaat" T={T}>
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

      <SubSection title="Thema" T={T}>
        <div style={{ display: 'flex', gap: 10 }}>
          {THEME_OPTIONS.map(o => {
            const isActive = theme === o.val
            return (
              <button
                key={o.val}
                onClick={() => setTheme(o.val)}
                style={{
                  flex: 1, padding: '14px 10px', borderRadius: 10, cursor: 'pointer',
                  fontFamily: 'inherit', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 8,
                  border: `1.5px solid ${isActive ? T.blue : T.border}`,
                  background: isActive ? T.blueSoft : T.card,
                  color: isActive ? T.blue : T.ink3,
                  transition: 'border-color 0.15s, background 0.15s',
                }}
              >
                <span style={{ display: 'inline-flex', color: isActive ? T.blue : T.ink3 }}>
                  {ICONS[o.icon]}
                </span>
                <span style={{ fontSize: 12.5, fontWeight: 500, color: isActive ? T.blueText : T.ink2 }}>
                  {o.label}
                </span>
              </button>
            )
          })}
        </div>
      </SubSection>

      <button
        onClick={saveAll}
        disabled={loading}
        style={{
          padding: '8px 16px', borderRadius: 8,
          background: saved ? T.green : T.blue,
          color: '#fff', border: 'none',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          transition: 'background 0.2s',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {saved ? 'Opgeslagen ✓' : 'Opslaan'}
      </button>
    </div>
  )
}

function SectionHeader({ title, description, T }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{description}</div>}
    </div>
  )
}

function SubSection({ title, description, children, T }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: description ? 4 : 12 }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>{description}</div>}
      {children}
    </div>
  )
}

function Field({ label, hint, children, T }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: T.ink2 }}>{label}</label>
      {children}
      {hint && <div style={{ fontSize: 11.5, color: T.ink4 }}>{hint}</div>}
    </div>
  )
}

function FakeSelect({ value, T }) {
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
