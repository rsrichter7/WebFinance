// ─── LoginPage ───
// Inloggen en registreren op één pagina met toggle.

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { T } from '../../tokens'
import { useAuth } from '../../hooks/useAuth'

export default function LoginPage() {
  const navigate                  = useNavigate()
  const { signIn, signUp }        = useAuth()
  const [modus, setModus]         = useState('inloggen')  // 'inloggen' | 'registreren'
  const [email, setEmail]         = useState('')
  const [wachtwoord, setWachtwoord] = useState('')
  const [bevestig, setBevestig]   = useState('')
  const [fout, setFout]           = useState('')
  const [melding, setMelding]     = useState('')
  const [bezig, setBezig]         = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setFout('')
    setMelding('')

    if (modus === 'registreren' && wachtwoord !== bevestig) {
      setFout('Wachtwoorden komen niet overeen.')
      return
    }

    setBezig(true)

    if (modus === 'inloggen') {
      const { error } = await signIn(email, wachtwoord)
      if (error) {
        setFout(vertaalFout(error.message))
      } else {
        navigate('/')
      }
    } else {
      const { error } = await signUp(email, wachtwoord)
      if (error) {
        setFout(vertaalFout(error.message))
      } else {
        setMelding('Controleer je e-mail om je account te bevestigen.')
        setEmail('')
        setWachtwoord('')
        setBevestig('')
      }
    }

    setBezig(false)
  }

  function wisselModus() {
    setModus(m => m === 'inloggen' ? 'registreren' : 'inloggen')
    setFout('')
    setMelding('')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: T.bg,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Inter', sans-serif",
      padding: '24px',
    }}>
      {/* Logo / titel */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40,
          background: T.blue, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 12px',
        }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
              stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: T.ink, letterSpacing: '-0.3px' }}>
          Webfinance
        </span>
      </div>

      {/* Kaart */}
      <div style={{
        background: T.card,
        border: `1px solid ${T.border}`,
        borderRadius: 16,
        padding: '36px 40px',
        width: '100%',
        maxWidth: 400,
        boxShadow: T.shadow,
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 600, color: T.ink, margin: '0 0 6px' }}>
          {modus === 'inloggen' ? 'Inloggen' : 'Account aanmaken'}
        </h1>
        <p style={{ fontSize: 13, color: T.ink3, margin: '0 0 28px' }}>
          {modus === 'inloggen'
            ? 'Log in op je Webfinance account.'
            : 'Maak een nieuw account aan.'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={S.label}>
            E-mailadres
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="email"
              style={S.input}
              placeholder="jij@voorbeeld.nl"
            />
          </label>

          <label style={S.label}>
            Wachtwoord
            <input
              type="password"
              value={wachtwoord}
              onChange={e => setWachtwoord(e.target.value)}
              required
              autoComplete={modus === 'inloggen' ? 'current-password' : 'new-password'}
              style={S.input}
              placeholder="••••••••"
            />
          </label>

          {modus === 'registreren' && (
            <label style={S.label}>
              Wachtwoord bevestigen
              <input
                type="password"
                value={bevestig}
                onChange={e => setBevestig(e.target.value)}
                required
                autoComplete="new-password"
                style={S.input}
                placeholder="••••••••"
              />
            </label>
          )}

          {fout && (
            <div style={{
              background: T.redSoft,
              border: `1px solid ${T.red}22`,
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: T.redText,
            }}>
              {fout}
            </div>
          )}

          {melding && (
            <div style={{
              background: T.greenSoft,
              border: `1px solid ${T.green}22`,
              borderRadius: 8,
              padding: '10px 14px',
              fontSize: 13,
              color: T.greenText,
            }}>
              {melding}
            </div>
          )}

          <button
            type="submit"
            disabled={bezig}
            style={{
              ...S.knop,
              opacity: bezig ? 0.7 : 1,
              cursor: bezig ? 'not-allowed' : 'pointer',
              marginTop: 4,
            }}
          >
            {bezig
              ? 'Even wachten…'
              : modus === 'inloggen' ? 'Inloggen' : 'Account aanmaken'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: 13, color: T.ink3, marginTop: 22, marginBottom: 0 }}>
          {modus === 'inloggen' ? 'Nog geen account?' : 'Al een account?'}{' '}
          <button onClick={wisselModus} style={S.linkKnop}>
            {modus === 'inloggen' ? 'Registreren' : 'Inloggen'}
          </button>
        </p>
      </div>
    </div>
  )
}

function vertaalFout(msg) {
  if (msg.includes('Invalid login credentials')) return 'E-mailadres of wachtwoord is onjuist.'
  if (msg.includes('Email not confirmed'))        return 'Bevestig eerst je e-mailadres via de e-mail die je hebt ontvangen.'
  if (msg.includes('User already registered'))    return 'Dit e-mailadres is al in gebruik.'
  if (msg.includes('Password should be'))         return 'Wachtwoord moet minimaal 6 tekens bevatten.'
  return 'Er is iets misgegaan. Probeer het opnieuw.'
}

const S = {
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    fontSize: 13,
    fontWeight: 500,
    color: '#374151',
  },
  input: {
    padding: '9px 12px',
    border: '1px solid #E5E7EB',
    borderRadius: 8,
    fontSize: 14,
    color: '#111827',
    background: '#fff',
    outline: 'none',
    fontFamily: "'Inter', sans-serif",
    transition: 'border-color 0.15s',
  },
  knop: {
    background: '#2563EB',
    color: '#fff',
    border: 'none',
    borderRadius: 8,
    padding: '10px 16px',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: "'Inter', sans-serif",
    width: '100%',
  },
  linkKnop: {
    background: 'none',
    border: 'none',
    padding: 0,
    fontSize: 13,
    color: '#2563EB',
    cursor: 'pointer',
    fontFamily: "'Inter', sans-serif",
    fontWeight: 500,
  },
}
