// ─── SettingsProfile ───
// Profiel sectie: naam, e-mail en avatar-initialen.

import React, { useState, useEffect } from 'react'
import { T } from '../../tokens'
import useSettings from '../../hooks/useSettings'

export default function SettingsProfile() {
  const { settings, loading, updateSettings } = useSettings()
  const [data, setData]   = useState({ naam: '', email: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (!loading) {
      setData({ naam: settings.profiel_naam || '', email: settings.profiel_email || '' })
    }
  }, [loading, settings.profiel_naam, settings.profiel_email])

  async function save() {
    await updateSettings({ profiel_naam: data.naam, profiel_email: data.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const initialen = (data.naam || 'RR')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div>
      <SectionHeader title="Profiel" description="Je persoonlijke gegevens" />

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: '#E0E7FF', color: '#3730A3',
          display: 'grid', placeItems: 'center',
          fontSize: 18, fontWeight: 600, flexShrink: 0,
        }}>
          {initialen}
        </div>
        <div style={{ fontSize: 12, color: T.ink4 }}>
          Profielfoto wordt later uitbreidbaar
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Field label="Naam">
          <input
            value={data.naam}
            onChange={e => { setData(d => ({ ...d, naam: e.target.value })); setSaved(false) }}
            style={inputStyle}
          />
        </Field>
        <Field label="E-mailadres">
          <input
            value={data.email}
            onChange={e => { setData(d => ({ ...d, email: e.target.value })); setSaved(false) }}
            style={inputStyle}
          />
        </Field>
      </div>

      <div style={{
        padding: 14, marginBottom: 24,
        background: T.blueSoft, border: '1px solid #DBEAFE',
        borderRadius: 10, fontSize: 12.5, color: T.blueText,
      }}>
        <div style={{ fontWeight: 600, marginBottom: 2 }}>Gesynchroniseerd via Supabase</div>
        <div style={{ color: T.ink3 }}>
          Je profielgegevens worden opgeslagen in je account en zijn beschikbaar op alle apparaten.
        </div>
      </div>

      <button
        onClick={save}
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

function SectionHeader({ title, description }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>{description}</div>}
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12.5, fontWeight: 500, color: T.ink2 }}>{label}</label>
      {children}
    </div>
  )
}

const inputStyle = {
  padding: '8px 12px',
  border: `1px solid ${T.border}`, borderRadius: 8,
  background: T.card, fontSize: 13.5, color: T.ink,
  outline: 'none', fontFamily: 'inherit',
}
