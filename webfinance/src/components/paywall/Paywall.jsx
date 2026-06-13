// ─── Paywall ───
// Afsluitscherm als de proefmaand voorbij is of het abonnement verlopen is.
// Elk plankaartje heeft een eigen knop die direct checkout start.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { T as LT, TAB, fmt } from '../../tokens'
import { startCheckout } from '../../utils/checkout'

const PLANNEN = [
  { naam: 'Maandelijks',  prijs: 3.99,  per: '/ maand',    besparing: null,           populair: false, slug: 'monthly'   },
  { naam: 'Per kwartaal', prijs: 9.99,  per: '/ kwartaal', besparing: '~16% korting', populair: false, slug: 'quarterly' },
  { naam: 'Per jaar',     prijs: 29.99, per: '/ jaar',     besparing: '37% korting',  populair: true,  slug: 'yearly'    },
]

function PlanKaart({ plan, T, onKies, isLadend, disabled }) {
  return (
    <div style={{
      border: plan.populair ? `2px solid ${T.blue}` : `1px solid ${T.border}`,
      borderRadius: 14, padding: '22px 18px',
      background: plan.populair ? T.blueSoft : T.card,
      position: 'relative',
      boxShadow: plan.populair ? '0 4px 20px rgba(37,99,235,0.10)' : T.shadow,
      flex: '1 1 160px', display: 'flex', flexDirection: 'column',
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
      <div style={{ flex: 1 }} />
      <button
        onClick={onKies}
        disabled={disabled}
        style={{
          width: '100%', padding: '9px 0', borderRadius: 8, marginTop: 12,
          background: isLadend ? T.ink4 : plan.populair ? T.blue : T.ink,
          color: '#fff', border: 'none',
          fontSize: 13, fontWeight: 600,
          cursor: disabled ? 'not-allowed' : 'pointer',
          fontFamily: 'inherit',
          opacity: disabled && !isLadend ? 0.55 : 1,
          transition: 'opacity 0.15s',
        }}
      >
        {isLadend ? 'Bezig met doorsturen…' : 'Kies dit plan'}
      </button>
    </div>
  )
}

export default function Paywall() {
  const { T } = useTheme()
  const [ladendPlan, setLadendPlan] = useState(null)
  const [fout, setFout] = useState(null)

  async function handleKies(slug) {
    setFout(null)
    setLadendPlan(slug)
    try {
      await startCheckout(slug)
    } catch (e) {
      setFout(e.message)
      setLadendPlan(null)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', width: '100%',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      background: T.bg, fontFamily: "'Inter', system-ui, sans-serif",
      padding: '40px 24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 9,
          background: LT.gradHero,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18, fontWeight: 800, color: '#fff',
        }}>€</div>
        <span style={{ fontWeight: 700, fontSize: 18, color: T.ink, letterSpacing: -0.3 }}>Webfinance</span>
      </div>

      <div style={{
        background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 16, padding: '40px 36px',
        boxShadow: '0 4px 32px rgba(17,24,39,0.07)',
        maxWidth: 620, width: '100%', textAlign: 'center',
      }}>
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
        <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6, maxWidth: 380, margin: '0 auto 32px' }}>
          Kies een abonnement om Webfinance te blijven gebruiken. Je data staat klaar — niets gaat verloren.
        </p>

        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', justifyContent: 'center' }}>
          {PLANNEN.map(plan => (
            <PlanKaart
              key={plan.slug}
              plan={plan}
              T={T}
              onKies={() => handleKies(plan.slug)}
              isLadend={ladendPlan === plan.slug}
              disabled={ladendPlan !== null}
            />
          ))}
        </div>

        {fout && (
          <p style={{ fontSize: 12, color: T.red, marginBottom: 8 }}>{fout}</p>
        )}

        <p style={{ fontSize: 12, color: T.ink4, margin: 0 }}>
          Betalen kan met iDEAL of creditcard.
        </p>
      </div>
    </div>
  )
}
