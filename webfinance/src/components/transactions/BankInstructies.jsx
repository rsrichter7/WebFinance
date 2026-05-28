// ─── BankInstructies ───
// Inklapbaar overzicht van downloadinstructies per ondersteunde bank

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

const BANKEN = [
  { naam: 'Rabobank', stappen: 'Log in op rabobank.nl → Downloads en documenten → Transacties downloaden → Kies CSV' },
  { naam: 'ING', stappen: "Log in op mijn.ing.nl → Betalen → Transacties → Download → Kies 'Kommagescheiden CSV'" },
  { naam: 'ABN AMRO', stappen: 'Log in op abnamro.nl → Zelf regelen → Bij- en afschrijvingen downloaden → Kies TXT', ext: '.txt' },
  { naam: 'ASN Bank / SNS Bank / RegioBank', stappen: 'Log in op mijn.asnbank.nl of mijn.snsbank.nl → Betaalrekening → Download transacties → Kies CSV' },
  { naam: 'bunq', stappen: 'Open de bunq app → Profiel → Rekeningoverzicht → Exporteer → Kies CSV' },
  { naam: 'Knab', stappen: 'Log in op knab.nl → Transactieoverzicht → Download → Kies CSV' },
  { naam: 'Triodos Bank', stappen: 'Log in op bankieren.triodos.nl → Overzichten → Downloaden → Kies CSV' },
  { naam: 'Revolut', stappen: 'Open de Revolut app → Account → Statements → Kies CSV' },
  { naam: 'Van Lanschot', stappen: null },
]

export default function BankInstructies() {
  const { T } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginTop: 20 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '6px 12px', borderRadius: 8, border: `1px solid ${T.border}`,
          background: T.card, fontSize: 12.5, color: T.ink3, cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <span style={{ fontSize: 14 }}>🏦</span>
        Ondersteunde banken & exportinstructies
        <span style={{ fontSize: 10, marginLeft: 2 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div style={{
          marginTop: 10, padding: '14px 16px', borderRadius: 10,
          background: T.blueSoft, border: `1px solid ${T.border}`,
          fontSize: 12.5, color: T.ink2, lineHeight: 1.7,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {BANKEN.map(b => (
            <div key={b.naam} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <div style={{ fontWeight: 600, color: T.ink, fontSize: 13 }}>
                {b.naam}
                {b.ext && (
                  <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 400, color: T.ink3 }}>
                    (.txt bestand)
                  </span>
                )}
              </div>
              {b.stappen ? (
                <div style={{ color: T.ink3 }}>{b.stappen}</div>
              ) : (
                <div style={{ color: T.ink4, fontStyle: 'italic' }}>Binnenkort beschikbaar</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
