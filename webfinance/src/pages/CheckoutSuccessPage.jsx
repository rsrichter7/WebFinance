// ─── CheckoutSuccessPage ───
// Terugkeerpagina na geslaagde Stripe-betaling.
// Pollt de abonnementsstatus tot 'active'; toont bevestiging of fallback na timeout.

import React, { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from '../hooks/useHousehold'
import { useTheme } from '../hooks/useTheme'
import { T as LT } from '../tokens'

const MAX_POGINGEN = 5
const INTERVAL_MS  = 2000

function RondIcoon({ achtergrond, kleur, children }) {
  return (
    <div style={{
      width: 60, height: 60, borderRadius: 15, margin: '0 auto 20px',
      background: achtergrond,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <svg width={28} height={28} viewBox="0 0 24 24" fill="none"
        stroke={kleur} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        {children}
      </svg>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  const { T } = useTheme()
  const { householdId, loading: householdLoading } = useHousehold()
  const [staat, setStaat] = useState('laden') // 'laden' | 'actief' | 'timeout'
  const pogingRef = useRef(0)

  useEffect(() => {
    if (householdLoading || !householdId) return
    let timer

    async function check() {
      pogingRef.current += 1
      const { data } = await supabase
        .from('subscriptions')
        .select('status')
        .eq('household_id', householdId)
        .maybeSingle()

      if (data?.status === 'active') { setStaat('actief'); return }
      if (pogingRef.current >= MAX_POGINGEN) { setStaat('timeout'); return }
      timer = setTimeout(check, INTERVAL_MS)
    }

    timer = setTimeout(check, INTERVAL_MS)
    return () => clearTimeout(timer)
  }, [householdId, householdLoading])

  // Volledige reload zodat de subscription-cache ververst wordt
  function naarDashboard() { window.location.href = '/dashboard' }

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
        {staat === 'actief' && (
          <>
            <RondIcoon achtergrond={T.greenSoft} kleur={T.green}>
              <path d="M20 6 9 17l-5-5"/>
            </RondIcoon>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
              Je bent nu abonnee
            </h1>
            <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6 }}>
              Je abonnement is actief. Welkom bij Webfinance.
            </p>
            <button onClick={naarDashboard} style={knopStijl}>Naar het dashboard</button>
          </>
        )}

        {staat === 'timeout' && (
          <>
            <RondIcoon achtergrond={T.amberSoft} kleur={T.amber}>
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
            </RondIcoon>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
              Betaling ontvangen
            </h1>
            <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6 }}>
              Je betaling is geslaagd. Het activeren van je abonnement kan nog even duren — dat wordt automatisch afgehandeld.
            </p>
            <button onClick={naarDashboard} style={knopStijl}>Naar het dashboard</button>
          </>
        )}

        {staat === 'laden' && (
          <>
            <RondIcoon achtergrond={T.blueSoft} kleur={T.blue}>
              <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
            </RondIcoon>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
              Betaling geslaagd
            </h1>
            <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6 }}>
              Je abonnement wordt geactiveerd…
            </p>
          </>
        )}
      </div>
    </div>
  )
}
