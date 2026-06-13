// ─── Paywall ───
// Afsluitscherm als de proefmaand voorbij is of het abonnement verlopen is.
// Toont drie planopties en een placeholder-knop voor toekomstige checkout.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { T as LT, TAB, fmt } from '../../tokens'

const PLANNEN = [
  { naam: 'Maandelijks', prijs: 3.99,  per: '/ maand', besparing: null,          populair: false },
  { naam: 'Per kwartaal', prijs: 9.99, per: '/ kwartaal', besparing: '~16% korting', populair: false },
  { naam: 'Per jaar',    prijs: 29.99, per: '/ jaar',  besparing: '37% korting', populair: true },
]

function PlanKaart({ plan, T }) {
  return (
    <div style={{
      border: plan.populair ? `2px solid ${T.blue}` : `1px solid ${T.border}`,
      borderRadius: 14, padding: '22px 18px',
      background: plan.populair ? T.blueSoft : T.card,
      position: 'relative',
      boxShadow: plan.populair ? '0 4px 20px rgba(37,99,235,0.10)' : T.shadow,
      flex: '1 1 160px',
    }}>
      {plan.populair && (
        <div style={{
          position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
          background: T.blue, color: '#fff',
          fontSize: 10, fontWeight: 700, padding: '2px 10px',
          borderRadius: 100, letterSpacing: 0.5, whiteSpace: 'nowrap',
        }}>
          MEEST GEKOZEN
        </div>
      )}
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, marginBottom: 10 }}>{plan.naam}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: plan.besparing ? 4 : 16 }}>
        <span style={{ fontSize: 26, fontWeight: 800, color: T.ink, letterSpacing: -1, ...TAB }}>{fmt(plan.prijs)}</span>
        <span style={{ fontSize: 12, color: T.ink3 }}>{plan.per}</span>
      </div>
      {plan.besparing && (
        <div style={{ fontSize: 11, color: T.green, fontWeight: 600, marginBottom: 16 }}>{plan.besparing}</div>
      )}
    </div>
  )
}

export default function Paywall() {
  const { T } = useTheme()

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: T.bg, fontFamily: "'Inter', system-ui, sans-serif",
      padding: '40px 24px',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: LT.gradHero,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#fff',
        }}>€</div>
        <span style={{ fontWeight: 700, fontSize: 18, color: T.ink, letterSpacing: -0.3 }}>Webfinance</span>
      </div>

      {/* Kaart */}
      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: '40px 36px',
        boxShadow: '0 4px 32px rgba(17,24,39,0.07)',
        maxWidth: 620, width: '100%', textAlign: 'center',
      }}>
        {/* Icoon */}
        <div style={{
          width: 56, height: 56, borderRadius: 14, margin: '0 auto 20px',
          background: T.blueSoft,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke={T.blue} strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>
          </svg>
        </div>

        <h1 style={{ fontSize: 22, fontWeight: 800, color: T.ink, letterSpacing: -0.5, marginBottom: 10 }}>
          Je gratis maand zit erop
        </h1>
        <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6, marginBottom: 32, maxWidth: 380, margin: '0 auto 32px' }}>
          Kies een abonnement om Webfinance te blijven gebruiken. Je data staat klaar — niets gaat verloren.
        </p>

        {/* Plannen */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
          {PLANNEN.map(plan => <PlanKaart key={plan.naam} plan={plan} T={T} />)}
        </div>

        {/* CTA */}
        <button
          onClick={() => {}}
          style={{
            padding: '13px 32px', borderRadius: 10,
            background: T.blue, color: '#fff', border: 'none',
            fontSize: 15, fontWeight: 700, cursor: 'pointer',
            fontFamily: 'inherit', letterSpacing: -0.2,
            boxShadow: '0 2px 8px rgba(37,99,235,0.22)',
            marginBottom: 14,
          }}
        >
          Kies een abonnement
        </button>

        <p style={{ fontSize: 12, color: T.ink4, margin: 0 }}>
          Betalen kan straks met iDEAL of creditcard.
        </p>
      </div>
    </div>
  )
}
