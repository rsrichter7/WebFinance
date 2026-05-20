// ─── FixedLoanSection ───
// Placeholder voor de leningen sectie. Nog niet werkend.

import React from 'react'
import { T } from '../../tokens'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'

export default function FixedLoanSection() {
  return (
    <Card style={{ padding: 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <span style={{ color: T.violet, display: 'inline-flex' }}>{ICONS.trending}</span>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Leningen</div>
      </div>
      <div style={{ fontSize: 12.5, color: T.ink3, marginBottom: 16 }}>
        Houd je aflossingen en restschuld bij
      </div>

      {/* Lege staat */}
      <div style={{
        border: `1px dashed ${T.borderHi}`, borderRadius: 10,
        padding: 28, display: 'flex', flexDirection: 'column', alignItems: 'center',
        background: T.cardAlt,
      }}>
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: T.violetSoft, display: 'grid', placeItems: 'center',
          color: T.violet, marginBottom: 12,
        }}>
          {ICONS.coin}
        </div>
        <div style={{ fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 4 }}>
          Nog geen leningen toegevoegd
        </div>
        <div style={{ fontSize: 12, color: T.ink4, marginBottom: 14, textAlign: 'center', maxWidth: 320 }}>
          Voeg een lening toe om je aflossingen, rentepercentage en restschuld bij te houden
        </div>
        <button style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 16px', borderRadius: 8,
          border: `1px solid ${T.border}`, background: T.card,
          fontSize: 13, fontWeight: 500, color: T.ink2, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          {ICONS.plus} Lening toevoegen
        </button>
      </div>

      {/* Voorbeeld kaart (placeholder) */}
      <div style={{
        marginTop: 20, padding: 16, border: `1px solid ${T.rule}`,
        borderRadius: 10, background: T.cardAlt, opacity: 0.5,
      }}>
        <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.3 }}>
          Voorbeeld
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
          {[
            { label: 'Totaalbedrag',   value: '€25.000,00' },
            { label: 'Rente',          value: '4,5%' },
            { label: 'Maandaflossing', value: '€466,08' },
            { label: 'Restschuld',     value: '€18.420,00' },
          ].map(({ label, value }) => (
            <div key={label}>
              <div style={{ fontSize: 11, color: T.ink4 }}>{label}</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.ink3, fontVariantNumeric: 'tabular-nums' }}>{value}</div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 12 }}>
          <div style={{ height: 6, background: T.rule, borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '26%', background: T.violet, borderRadius: 3, opacity: 0.6 }} />
          </div>
          <div style={{ fontSize: 11, color: T.ink4, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>26% afgelost</div>
        </div>
      </div>
    </Card>
  )
}
