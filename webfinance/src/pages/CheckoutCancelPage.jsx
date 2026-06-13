// ─── CheckoutCancelPage ───
// Terugkeerpagina na geannuleerde Stripe-betaling.
// Geeft de gebruiker de mogelijkheid terug te gaan naar de plannen.

import React from 'react'
import { useTheme } from '../hooks/useTheme'
import { T as LT } from '../tokens'

export default function CheckoutCancelPage() {
  const { T } = useTheme()

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
        padding: '48px 40px', maxWidth: 440, width: '100%', textAlign: 'center',
        boxShadow: '0 4px 32px rgba(17,24,39,0.07)',
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 20px',
          background: T.amberSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none"
            stroke={T.amber} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
          Betaling geannuleerd
        </h1>
        <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6 }}>
          Je betaling is geannuleerd. Je kunt het altijd opnieuw proberen.
        </p>

        <button
          onClick={() => { window.location.href = '/dashboard' }}
          style={{
            marginTop: 24, padding: '12px 28px', borderRadius: 10,
            background: T.blue, color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', letterSpacing: -0.2,
            boxShadow: '0 2px 8px rgba(37,99,235,0.22)',
          }}
        >
          Terug naar abonnement
        </button>
      </div>
    </div>
  )
}
