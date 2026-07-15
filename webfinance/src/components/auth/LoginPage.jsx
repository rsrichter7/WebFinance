// ─── LoginPage ───
// Inloggen en registreren op één pagina met toggle.
// Inclusief e-mailverificatie flow, wachtwoord-eisen en Google login.

import React, { useState, useEffect } from 'react'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'

function GoogleLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
    </svg>
  )
}

export default function LoginPage() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const [searchParams]      = useSearchParams()
  const [accountVerwijderd] = useState(() => searchParams.get('deleted') === 'true')
  const [modus, setModus]   = useState(() => searchParams.get('modus') === 'registreren' ? 'registreren' : 'inloggen')
  const [naam, setNaam]                   = useState('')
  const [naamFout, setNaamFout]           = useState('')
  const [email, setEmail]                 = useState('')
  const [wachtwoord, setWachtwoord]       = useState('')
  const [bevestig, setBevestig]           = useState('')
  const [fout, setFout]                   = useState('')
  const [wachtwoordFout, setWachtwoordFout] = useState('')
  const [needsBevestiging, setNeedsBevestiging] = useState(false)
  const [bezig, setBezig]                 = useState(false)
  const [googleHover, setGoogleHover]     = useState(false)

  useEffect(() => {
    if (accountVerwijderd) window.history.replaceState({}, '', '/login')
  }, [])

  function navigeerNaLogin() {
    const invToken = sessionStorage.getItem('invitation_token')
    if (invToken) {
      sessionStorage.removeItem('invitation_token')
      navigate(`/uitnodiging/${invToken}`)
    } else {
      navigate('/dashboard')
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFout(''); setWachtwoordFout(''); setNaamFout('')
    if (modus === 'registreren') {
      if (naam.trim().length < 2) { setNaamFout('Voer je volledige naam in (minimaal 2 tekens).'); return }
      if (wachtwoord.length < 8) { setWachtwoordFout('Wachtwoord moet minimaal 8 tekens bevatten.'); return }
      if (wachtwoord !== bevestig) { setFout('Wachtwoorden komen niet overeen.'); return }
    }
    setBezig(true)
    if (modus === 'inloggen') {
      const { error } = await signIn(email, wachtwoord)
      if (error) setFout(vertaalFout(error.message))
      else navigeerNaLogin()
    } else {
      const { error, needsConfirmation } = await signUp(email, wachtwoord, naam.trim())
      if (error) setFout(vertaalFout(error.message))
      else if (needsConfirmation) setNeedsBevestiging(true)
      else navigeerNaLogin()
    }
    setBezig(false)
  }

  function wisselModus() { setModus(m => m === 'inloggen' ? 'registreren' : 'inloggen'); setFout(''); setWachtwoordFout(''); setNaam(''); setNaamFout('') }
  function terug() { setNeedsBevestiging(false); setModus('inloggen'); setEmail(''); setWachtwoord(''); setBevestig(''); setNaam('') }

  const labelStyle = { display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 500, color: T.ink2 }
  const inputStyle = { padding: '9px 12px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, color: T.ink, background: T.card, outline: 'none', fontFamily: "'Inter', sans-serif", transition: 'border-color 0.15s' }
  const knopStyle  = { background: T.blue, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 16px', fontSize: 14, fontWeight: 600, fontFamily: "'Inter', sans-serif", width: '100%' }
  const linkKnopStyle = { background: 'none', border: 'none', padding: 0, fontSize: 13, color: T.blue, cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontWeight: 500 }

  return (
    <div style={{
      minHeight: '100vh', background: T.bg,
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", padding: '24px',
    }}>
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: T.ink, color: T.bg, display: 'grid', placeItems: 'center', fontSize: 20, fontWeight: 600, margin: '0 auto 12px' }}>€</div>
        <span style={{ fontSize: 20, fontWeight: 700, color: T.ink, letterSpacing: '-0.3px' }}>Webfinance</span>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '36px 40px', width: '100%', maxWidth: 400, boxShadow: T.shadow }}>
        {accountVerwijderd && (
          <div style={{ background: T.greenSoft, border: `1px solid ${T.green}22`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: T.greenText, marginBottom: 20 }}>
            Je account en alle gegevens zijn succesvol verwijderd.
          </div>
        )}

        {needsBevestiging ? (
          <>
            <div style={{ background: T.blueSoft, border: `1px solid ${T.blue}22`, borderRadius: 10, padding: '20px 18px', fontSize: 14, color: T.blueText, lineHeight: 1.6, marginBottom: 20 }}>
              <strong style={{ display: 'block', marginBottom: 6 }}>Bijna klaar!</strong>
              We hebben een bevestigingsmail gestuurd naar <strong>{email}</strong>. Controleer je inbox en klik op de link om je account te activeren.
            </div>
            <button onClick={terug} style={linkKnopStyle}>← Terug naar inloggen</button>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: 18, fontWeight: 600, color: T.ink, margin: '0 0 6px' }}>
              {modus === 'inloggen' ? 'Inloggen' : 'Account aanmaken'}
            </h1>
            <p style={{ fontSize: 13, color: T.ink3, margin: '0 0 28px' }}>
              {modus === 'inloggen' ? 'Log in op je Webfinance account.' : 'Maak een nieuw account aan.'}
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {modus === 'registreren' && (
                <label style={labelStyle}>
                  Volledige naam
                  <input type="text" value={naam} onChange={e => { setNaam(e.target.value); setNaamFout('') }} required autoComplete="name" style={inputStyle} placeholder="Jan de Vries" />
                  {naamFout && <span style={{ fontSize: 12, color: T.redText, marginTop: 2 }}>{naamFout}</span>}
                </label>
              )}

              <label style={labelStyle}>
                E-mailadres
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" style={inputStyle} placeholder="jij@voorbeeld.nl" />
              </label>

              <label style={labelStyle}>
                Wachtwoord
                <input type="password" value={wachtwoord} onChange={e => setWachtwoord(e.target.value)} required autoComplete={modus === 'inloggen' ? 'current-password' : 'new-password'} style={inputStyle} placeholder="••••••••" />
                {wachtwoordFout && <span style={{ fontSize: 12, color: T.redText, marginTop: 2 }}>{wachtwoordFout}</span>}
              </label>

              {modus === 'registreren' && (
                <label style={labelStyle}>
                  Wachtwoord bevestigen
                  <input type="password" value={bevestig} onChange={e => setBevestig(e.target.value)} required autoComplete="new-password" style={inputStyle} placeholder="••••••••" />
                </label>
              )}

              {fout && (
                <div style={{ background: T.redSoft, border: `1px solid ${T.red}22`, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: T.redText }}>
                  {fout}
                </div>
              )}

              <button type="submit" disabled={bezig} style={{ ...knopStyle, opacity: bezig ? 0.7 : 1, cursor: bezig ? 'not-allowed' : 'pointer', marginTop: 4 }}>
                {bezig ? 'Even wachten…' : modus === 'inloggen' ? 'Inloggen' : 'Account aanmaken'}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '18px 0', gap: 10 }}>
              <div style={{ flex: 1, height: 1, background: T.border }} />
              <span style={{ fontSize: 12, color: T.ink4 }}>of</span>
              <div style={{ flex: 1, height: 1, background: T.border }} />
            </div>

            <button type="button" onClick={() => signInWithGoogle()}
              onMouseEnter={() => setGoogleHover(true)} onMouseLeave={() => setGoogleHover(false)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, width: '100%', padding: '10px 16px', background: googleHover ? T.rule : T.card, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 14, fontWeight: 500, color: T.ink, fontFamily: "'Inter', sans-serif", cursor: 'pointer', transition: 'background 0.15s' }}>
              <GoogleLogo />
              Inloggen met Google
            </button>

            <p style={{ textAlign: 'center', fontSize: 13, color: T.ink3, marginTop: 22, marginBottom: 0 }}>
              {modus === 'inloggen' ? 'Nog geen account?' : 'Al een account?'}{' '}
              <button onClick={wisselModus} style={linkKnopStyle}>
                {modus === 'inloggen' ? 'Registreren' : 'Inloggen'}
              </button>
            </p>

            <p style={{ textAlign: 'center', fontSize: 13, color: T.ink4, marginTop: 14, marginBottom: 0 }}>
              Door in te loggen ga je akkoord met ons{' '}
              <Link to="/privacy" style={{ color: T.blue, textDecoration: 'none', fontWeight: 500 }}>privacybeleid</Link>
              {' '}en onze{' '}
              <Link to="/voorwaarden" style={{ color: T.blue, textDecoration: 'none', fontWeight: 500 }}>algemene voorwaarden</Link>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

function vertaalFout(msg) {
  if (msg.includes('Invalid login credentials')) return 'E-mailadres of wachtwoord is onjuist.'
  if (msg.includes('Email not confirmed'))        return 'Bevestig eerst je e-mailadres via de e-mail die je hebt ontvangen.'
  if (msg.includes('User already registered'))    return 'Dit e-mailadres is al in gebruik.'
  if (msg.includes('Password should be'))         return 'Wachtwoord moet minimaal 8 tekens bevatten.'
  return 'Er is iets misgegaan. Probeer het opnieuw.'
}
