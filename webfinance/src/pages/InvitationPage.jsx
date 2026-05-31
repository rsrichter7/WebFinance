// ─── InvitationPage ───
// Uitnodigingspagina voor huishouden. Toegankelijk zonder login (/uitnodiging/:token).

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../hooks/useAuth'
import useInvitations from '../hooks/useInvitations'

export default function InvitationPage() {
  const { token } = useParams()
  const { T } = useTheme()
  const navigate = useNavigate()
  const { user, loading: authLoading } = useAuth()
  const { getInvitationByToken, acceptInvitation, declineInvitation } = useInvitations()

  const [status, setStatus] = useState('laden') // laden | niet-ingelogd | geldig | ongeldig | eigen | aanvaard | geweigerd
  const [fout, setFout]     = useState('')
  const [bezig, setBezig]   = useState(false)

  // Niet ingelogd → token bewaren voor na login
  useEffect(() => {
    if (authLoading) return
    if (!user) {
      sessionStorage.setItem('invitation_token', token)
      setStatus('niet-ingelogd')
    }
  }, [authLoading, user, token])

  // Ingelogd → uitnodiging ophalen en valideren
  useEffect(() => {
    if (authLoading || !user) return
    sessionStorage.removeItem('invitation_token')

    getInvitationByToken(token).then(inv => {
      if (!inv) { setStatus('ongeldig'); return }
      if (inv.invited_by === user.id) { setStatus('eigen'); return }
      if (inv.status !== 'pending' || new Date(inv.expires_at) < new Date()) {
        setFout(inv.status === 'accepted' ? 'Deze uitnodiging is al gebruikt.' : 'Deze uitnodiging is verlopen.')
        setStatus('ongeldig')
        return
      }
      setStatus('geldig')
    })
  }, [authLoading, user, token, getInvitationByToken])

  async function handleAccepteren() {
    setBezig(true)
    const { error } = await acceptInvitation(token)
    if (error) { setFout(vertaalFout(error.message)); setBezig(false); return }
    setStatus('aanvaard')
    setTimeout(() => navigate('/'), 3000)
    setBezig(false)
  }

  async function handleWeigeren() {
    setBezig(true)
    const { error } = await declineInvitation(token)
    if (error) { setFout(vertaalFout(error.message)); setBezig(false); return }
    setStatus('geweigerd')
    setTimeout(() => navigate('/'), 2000)
    setBezig(false)
  }

  const card   = { background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '36px 40px', width: '100%', maxWidth: 420, boxShadow: T.shadow }
  const primBt = (bg) => ({ width: '100%', padding: '10px 16px', borderRadius: 8, border: 'none', background: bg, color: '#fff', fontSize: 14, fontWeight: 600, cursor: bezig ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: bezig ? 0.7 : 1 })
  const secBt  = { width: '100%', padding: '10px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const h1     = { fontSize: 18, fontWeight: 600, color: T.ink, margin: '0 0 8px' }
  const p      = { fontSize: 13.5, color: T.ink3, lineHeight: 1.6, margin: '0 0 24px' }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: 24 }}>
      {/* Logo */}
      <div style={{ marginBottom: 32, textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, background: T.blue, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span style={{ fontSize: 20, fontWeight: 700, color: T.ink, letterSpacing: '-0.3px' }}>Webfinance</span>
      </div>

      <div style={card}>
        {status === 'laden' && (
          <div style={{ textAlign: 'center', color: T.ink3, fontSize: 14 }}>Uitnodiging controleren…</div>
        )}

        {status === 'niet-ingelogd' && (
          <>
            <h1 style={h1}>Je bent uitgenodigd!</h1>
            <p style={p}>
              Je bent uitgenodigd om lid te worden van een Webfinance huishouden.
              Log in of maak een account aan om de uitnodiging te bekijken.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={() => navigate('/login?modus=registreren')} style={primBt(T.blue)}>
                Account aanmaken
              </button>
              <button onClick={() => navigate('/login')} style={secBt}>
                Inloggen
              </button>
            </div>
          </>
        )}

        {status === 'geldig' && (
          <>
            <h1 style={h1}>Uitnodiging ontvangen</h1>
            <p style={p}>
              Je bent uitgenodigd om lid te worden van een Webfinance huishouden.
              Accepteer de uitnodiging om toegang te krijgen tot de gedeelde financiën.
            </p>
            {fout && (
              <div style={{ background: T.redSoft, borderRadius: 8, padding: '10px 14px', fontSize: 13, color: T.redText, marginBottom: 16 }}>
                {fout}
              </div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button onClick={handleAccepteren} disabled={bezig} style={primBt(T.green)}>
                {bezig ? 'Even wachten…' : 'Accepteren'}
              </button>
              <button onClick={handleWeigeren} disabled={bezig} style={secBt}>
                Weigeren
              </button>
            </div>
          </>
        )}

        {status === 'aanvaard' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, fontWeight: 700, color: T.green, marginBottom: 12 }}>✓</div>
            <h1 style={h1}>Welkom!</h1>
            <p style={{ ...p, marginBottom: 0 }}>
              Je maakt nu deel uit van het huishouden. Je wordt doorgestuurd naar het dashboard…
            </p>
          </div>
        )}

        {status === 'geweigerd' && (
          <div style={{ textAlign: 'center' }}>
            <h1 style={h1}>Uitnodiging afgewezen</h1>
            <p style={{ ...p, marginBottom: 0 }}>Je wordt doorgestuurd…</p>
          </div>
        )}

        {status === 'eigen' && (
          <>
            <h1 style={h1}>Niet mogelijk</h1>
            <p style={p}>Je kunt je eigen uitnodiging niet accepteren.</p>
            <button onClick={() => navigate('/')} style={secBt}>Terug naar dashboard</button>
          </>
        )}

        {status === 'ongeldig' && (
          <>
            <h1 style={h1}>Ongeldige uitnodiging</h1>
            <p style={p}>{fout || 'Deze uitnodiging is niet meer geldig.'}</p>
            <button onClick={() => navigate('/')} style={secBt}>Terug naar homepage</button>
          </>
        )}
      </div>
    </div>
  )
}

function vertaalFout(msg) {
  if (msg.includes('already a member')) return 'Je bent al lid van dit huishouden.'
  if (msg.includes('expired'))          return 'Deze uitnodiging is verlopen.'
  if (msg.includes('accepted'))         return 'Deze uitnodiging is al gebruikt.'
  return 'Er is iets misgegaan. Probeer het opnieuw.'
}
