// ─── SettingsProfile ───
// Profiel sectie: naam, e-mail, avatar-initialen en wachtwoord wijzigen.

import React, { useState, useEffect } from 'react'
import { T } from '../../tokens'
import useSettings from '../../hooks/useSettings'
import { useAuth } from '../../hooks/useAuth'
import { supabase } from '../../supabaseClient'

export default function SettingsProfile() {
  const { settings, loading, updateSettings } = useSettings()
  const { user } = useAuth()
  const [data, setData]   = useState({ naam: '', email: '' })
  const [saved, setSaved] = useState(false)

  const [pwData, setPwData]     = useState({ nieuw: '', bevestig: '' })
  const [pwStatus, setPwStatus] = useState(null) // null | 'ok' | string (fout)

  useEffect(() => {
    if (!loading) {
      setData({
        naam:  settings.profiel_naam  || '',
        email: settings.profiel_email || user?.email || '',
      })
    }
  }, [loading, settings.profiel_naam, settings.profiel_email, user?.email])

  async function save() {
    await updateSettings({ profiel_naam: data.naam, profiel_email: data.email })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  async function changePassword() {
    setPwStatus(null)
    if (pwData.nieuw.length < 8) {
      setPwStatus('Wachtwoord moet minimaal 8 tekens zijn.')
      return
    }
    if (pwData.nieuw !== pwData.bevestig) {
      setPwStatus('Wachtwoorden komen niet overeen.')
      return
    }
    const { error } = await supabase.auth.updateUser({ password: pwData.nieuw })
    if (error) {
      setPwStatus(error.message)
    } else {
      setPwStatus('ok')
      setPwData({ nieuw: '', bevestig: '' })
      setTimeout(() => setPwStatus(null), 2000)
    }
  }

  const naamLeeg = data.naam.trim() === ''

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
            style={{ ...inputStyle, borderColor: naamLeeg ? T.red : T.border }}
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

      <button
        onClick={save}
        disabled={loading || naamLeeg}
        style={{
          padding: '8px 16px', borderRadius: 8,
          background: saved ? T.green : T.blue,
          color: '#fff', border: 'none',
          fontSize: 13, fontWeight: 500, cursor: naamLeeg ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s',
          opacity: (loading || naamLeeg) ? 0.5 : 1,
        }}
      >
        {saved ? 'Opgeslagen ✓' : 'Opslaan'}
      </button>

      {/* Wachtwoord wijzigen */}
      <div style={{ marginTop: 32 }}>
        <SectionHeader title="Wachtwoord" description="Wijzig je wachtwoord" />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <Field label="Nieuw wachtwoord">
            <input
              type="password"
              value={pwData.nieuw}
              onChange={e => { setPwData(d => ({ ...d, nieuw: e.target.value })); setPwStatus(null) }}
              style={inputStyle}
            />
          </Field>
          <Field label="Bevestig wachtwoord">
            <input
              type="password"
              value={pwData.bevestig}
              onChange={e => { setPwData(d => ({ ...d, bevestig: e.target.value })); setPwStatus(null) }}
              style={inputStyle}
            />
          </Field>
        </div>

        <button
          onClick={changePassword}
          style={{
            padding: '8px 16px', borderRadius: 8,
            background: pwStatus === 'ok' ? T.green : T.blue,
            color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {pwStatus === 'ok' ? 'Wachtwoord gewijzigd ✓' : 'Wachtwoord wijzigen'}
        </button>

        {pwStatus && pwStatus !== 'ok' && (
          <div style={{ marginTop: 10, fontSize: 12.5, color: T.red }}>
            {pwStatus}
          </div>
        )}
      </div>
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
