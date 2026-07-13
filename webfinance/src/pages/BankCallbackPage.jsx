// ─── BankCallbackPage ───
// Terugkeerpagina na de bank-login bij Enable Banking. Rondt de koppelsessie af via
// /api/bank/callback en toont de gevonden bankrekeningen (kale versie, nog geen keuze-UI).

import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import { supabase } from '../supabaseClient'
import { T as LT } from '../tokens'

function RondIcoon({ achtergrond, kleur, children }) {
  return (
    <div style={{
      width: 56, height: 56, borderRadius: 14, margin: '0 auto 20px',
      background: achtergrond,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={26} height={26} viewBox="0 0 24 24" fill="none"
        stroke={kleur} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </div>
  )
}

export default function BankCallbackPage() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [staat, setStaat] = useState('laden') // 'laden' | 'klaar' | 'fout'
  const [foutmelding, setFoutmelding] = useState('')
  const [resultaat, setResultaat] = useState(null)

  useEffect(() => {
    const code = searchParams.get('code')
    const state = searchParams.get('state')
    const errorParam = searchParams.get('error')

    if (errorParam || !code || !state) {
      setStaat('fout')
      setFoutmelding('Koppeling geannuleerd of mislukt')
      return
    }

    async function rondAf() {
      const { data: { session } } = await supabase.auth.getSession()
      const response = await fetch('/api/bank/callback', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, state }),
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setStaat('fout')
        setFoutmelding(data.error || 'Koppeling geannuleerd of mislukt')
        return
      }

      setResultaat(data)
      setStaat('klaar')
    }

    rondAf()
  }, [searchParams])

  function terugNaarRekeningen() {
    navigate('/instellingen?sectie=rekeningen')
  }

  const knopStijl = {
    marginTop: 24, padding: '12px 28px', borderRadius: 10,
    background: T.blue, color: '#fff', border: 'none',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    fontFamily: 'inherit', letterSpacing: -0.2,
    boxShadow: '0 2px 8px rgba(37,99,235,0.22)',
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      background: T.bg, fontFamily: "'Inter', system-ui, sans-serif", padding: '40px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9, background: LT.gradHero,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#fff',
        }}>€</div>
        <span style={{ fontWeight: 700, fontSize: 18, color: T.ink, letterSpacing: -0.3 }}>Webfinance</span>
      </div>

      <div style={{
        background: T.card, border: `1px solid ${T.border}`, borderRadius: 16,
        padding: '48px 40px', maxWidth: 480, width: '100%', textAlign: 'center',
        boxShadow: '0 4px 32px rgba(17,24,39,0.07)',
      }}>
        {staat === 'laden' && (
          <>
            <RondIcoon achtergrond={T.blueSoft} kleur={T.blue}>
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
            </RondIcoon>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
              Koppeling afronden…
            </h1>
            <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6 }}>
              We ronden de koppeling met je bank af.
            </p>
          </>
        )}

        {staat === 'fout' && (
          <>
            <RondIcoon achtergrond={T.amberSoft} kleur={T.amber}>
              <path d="M18 6 6 18M6 6l12 12"/>
            </RondIcoon>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
              Koppeling mislukt
            </h1>
            <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6 }}>
              {foutmelding}
            </p>
            <button onClick={terugNaarRekeningen} style={knopStijl}>Terug naar rekeningen</button>
          </>
        )}

        {staat === 'klaar' && (
          <>
            <RondIcoon achtergrond={T.greenSoft} kleur={T.green}>
              <path d="M20 6 9 17l-5-5"/>
            </RondIcoon>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
              Bank gekoppeld
            </h1>
            <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6, marginBottom: 20 }}>
              We hebben {resultaat.bankRekeningen.length === 1 ? 'deze rekening' : 'deze rekeningen'} gevonden bij je bank:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {resultaat.bankRekeningen.map((r) => (
                <div key={r.uid} style={{
                  padding: '12px 14px', borderRadius: 10,
                  border: `1px solid ${T.border}`, background: T.bg,
                }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{r.naam}</div>
                  {r.iban && (
                    <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{r.iban}</div>
                  )}
                  <div style={{ fontSize: 12, color: r.suggestie_rekening_id ? T.blue : T.ink3, marginTop: 6 }}>
                    {r.suggestie_rekening_id
                      ? 'Wordt voorgesteld te koppelen aan een bestaande rekening'
                      : 'Wordt een nieuwe rekening'}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={terugNaarRekeningen} style={knopStijl}>Terug naar rekeningen</button>
          </>
        )}
      </div>
    </div>
  )
}
