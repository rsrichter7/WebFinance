// ─── SettingsNotifications ───
// Placeholder sectie — notificaties zijn nog niet beschikbaar.

import React from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'

const TOEKOMSTIG = [
  { label: 'Budget bijna overschreden',  desc: 'Per categorie · drempel instelbaar' },
  { label: 'Aankomende vaste lasten',    desc: '3 dagen voor afschrijving' },
  { label: 'Maandelijks overzicht',      desc: 'Eerste van de maand' },
  { label: 'Productupdates',             desc: 'Nieuwe features en verbeteringen' },
]

export default function SettingsNotifications() {
  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Notificaties</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Meldingen voor budgetten, vaste lasten en updates</div>
      </div>

      <div style={{ border: `1px dashed ${T.borderHi}`, borderRadius: 12, padding: 36, textAlign: 'center', background: T.cardAlt, marginBottom: 24 }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: T.amberSoft, color: T.amber,
          display: 'grid', placeItems: 'center',
          margin: '0 auto 14px',
        }}>
          {ICONS.bell}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>Nog niet beschikbaar</div>
          <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 4, background: T.amberSoft, color: T.amber, letterSpacing: 0.3 }}>BINNENKORT</span>
        </div>
        <div style={{ fontSize: 13, color: T.ink3, maxWidth: 360, margin: '0 auto', lineHeight: 1.55 }}>
          Notificaties worden geactiveerd zodra je een Webfinance-account hebt aangemaakt.
          Voor nu draait alles lokaal in je browser.
        </div>
      </div>

      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 4 }}>In voorbereiding</div>
      <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>Deze meldingen worden later beschikbaar</div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' }}>
        {TOEKOMSTIG.map((n, i) => (
          <div
            key={i}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '14px 16px',
              borderBottom: i < TOEKOMSTIG.length - 1 ? `1px solid ${T.rule}` : 'none',
              opacity: 0.55,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{n.label}</div>
              <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{n.desc}</div>
            </div>
            <div style={{
              width: 36, height: 20, borderRadius: 10,
              background: T.borderHi, padding: 2,
              display: 'flex', alignItems: 'center',
              cursor: 'not-allowed', flexShrink: 0,
            }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
