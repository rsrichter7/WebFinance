// ─── LandingPricing ───
// Prijskaarten: maandelijks, kwartaal, jaar + add-on bankkoppeling.

import React from 'react'
import { Link } from 'react-router-dom'
import { T } from '../../tokens'

const PLANNEN = [
  {
    naam: 'Maandelijks',
    prijs: '€ 3,99',
    periode: '/ maand',
    besparing: null,
    populair: false,
  },
  {
    naam: 'Per kwartaal',
    prijs: '€ 9,99',
    periode: '/ kwartaal',
    besparing: '€ 3,33 p/m · bespaar ~16%',
    populair: false,
  },
  {
    naam: 'Per jaar',
    prijs: '€ 29,99',
    periode: '/ jaar',
    besparing: '€ 2,50 p/m · bespaar 37%',
    populair: true,
  },
]

export default function LandingPricing() {
  return (
    <section id="prijzen" style={{
      background: T.card,
      padding: '80px clamp(20px, 5vw, 48px)',
      borderTop: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: 860, margin: '0 auto' }}>
        <div className="wf-reveal" style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{
            fontSize: 'clamp(22px, 3.5vw, 34px)',
            fontWeight: 800, color: T.ink, letterSpacing: -0.8, marginBottom: 14,
          }}>
            Eén app. Eén prijs. Kies hoe je betaalt.
          </h2>
          <p style={{ fontSize: 15, color: T.ink3, maxWidth: 500, margin: '0 auto', lineHeight: 1.6 }}>
            Probeer Webfinance een maand gratis. Daarna kies je zelf hoe je betaalt — hoe langer je vooruit betaalt, hoe goedkoper.
          </p>
        </div>

        <div className="landing-pricing-grid wf-reveal" style={{ marginBottom: 16 }}>
          {PLANNEN.map(plan => (
            <div key={plan.naam} style={{
              border: plan.populair ? `2px solid ${T.blue}` : `1px solid ${T.border}`,
              borderRadius: 14, padding: '28px 22px',
              background: plan.populair ? T.blueSoft : T.card,
              position: 'relative',
              boxShadow: plan.populair ? '0 4px 24px rgba(37,99,235,0.12)' : T.shadow,
            }}>
              {plan.populair && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: T.blue, color: '#fff',
                  fontSize: 11, fontWeight: 700, padding: '3px 12px',
                  borderRadius: 100, letterSpacing: 0.4, whiteSpace: 'nowrap',
                }}>
                  MEEST GEKOZEN
                </div>
              )}
              <div style={{ fontSize: 13, fontWeight: 600, color: T.ink3, marginBottom: 12 }}>
                {plan.naam}
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: plan.besparing ? 6 : 22 }}>
                <span style={{ fontSize: 30, fontWeight: 800, color: T.ink, letterSpacing: -1 }}>
                  {plan.prijs}
                </span>
                <span style={{ fontSize: 13, color: T.ink3 }}>{plan.periode}</span>
              </div>
              {plan.besparing && (
                <div style={{ fontSize: 12, color: T.green, fontWeight: 500, marginBottom: 22 }}>
                  {plan.besparing}
                </div>
              )}
              <Link to="/login?modus=registreren" style={{
                display: 'block', textAlign: 'center',
                padding: '11px 0', borderRadius: 8,
                background: plan.populair ? T.blue : T.ink,
                color: '#fff', fontSize: 14, fontWeight: 600, textDecoration: 'none',
              }}>
                Start gratis proefperiode
              </Link>
            </div>
          ))}
        </div>

        <p className="wf-reveal" style={{ textAlign: 'center', fontSize: 13, color: T.ink3, marginBottom: 36 }}>
          Betaal veilig met iDEAL of creditcard. Eerste maand gratis, stop wanneer je wil.
        </p>

        {/* Add-on bankkoppeling */}
        <div className="wf-reveal" style={{
          border: `1px solid ${T.border}`,
          borderRadius: 12, padding: '22px 26px',
          background: T.bg,
        }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.ink, marginBottom: 8 }}>
            Wil je nóg minder werk? Koppel je bank.
          </div>
          <p style={{ fontSize: 14, color: T.ink3, lineHeight: 1.6, margin: 0 }}>
            Met de bankkoppeling stromen je transacties automatisch binnen — geen CSV meer importeren. Beschikbaar als los abonnement bovenop je Webfinance-plan.
          </p>
        </div>
      </div>
    </section>
  )
}
