// ─── DashboardKomende ───
// Komende vaste afschrijvingen in de volgende 30 dagen.

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt, fmtShort } from '../../tokens'
import { komendeAfschrijvingen } from '../../utils/dashboardCalculations'

const CAT_KLEUREN = {
  'Wonen': '#2563EB', 'Vervoer': '#0D9488', 'Dagelijks leven': '#B45309',
  'Abonnementen & Telecom': '#7C3AED', 'Vrije tijd': '#DC2626',
  'Financieel': '#059669', 'Overig': '#6B7280',
}

function TopBars({ items, T }) {
  const top5 = items.slice(0, 5)
  const max  = Math.max(...top5.map(i => i.bedrag), 1)

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 38 }}>
      {top5.map((item, i) => (
        <div key={i} title={item.naam} style={{
          width: 12, height: Math.max(4, (item.bedrag / max) * 38),
          borderRadius: 3, background: T.gradAmber,
          opacity: 0.55 + (i / top5.length) * 0.45,
        }} />
      ))}
    </div>
  )
}

export default function DashboardKomende({ fixedExpenses, animDelay = 0 }) {
  const { T } = useTheme()

  const komende = useMemo(() => komendeAfschrijvingen(fixedExpenses, 30), [fixedExpenses])
  const totaal  = komende.reduce((s, i) => s + i.bedrag, 0)
  const top3    = komende.slice(0, 3)

  return (
    <div className="wf-anim-card wf-card-hover" style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      boxShadow: T.shadow, padding: '18px 20px',
      animationDelay: `${animDelay}ms`,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 2 }}>Komende afschrijvingen</div>
      <div style={{ fontSize: 11.5, color: T.ink4, marginBottom: 16 }}>In de komende 30 dagen</div>

      {/* Totaal + mini barchart */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
            {fmtShort(totaal)}
          </div>
          <div style={{ fontSize: 11.5, color: T.ink4, marginTop: 2 }}>
            {komende.length} afschrijving{komende.length !== 1 ? 'en' : ''}
          </div>
        </div>
        {komende.length > 0 && <TopBars items={komende} T={T} />}
      </div>

      {/* Top 3 lijst */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {top3.length === 0 ? (
          <div style={{ fontSize: 12.5, color: T.ink4, textAlign: 'center', padding: '8px 0' }}>
            Geen afschrijvingen gepland
          </div>
        ) : top3.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
              background: CAT_KLEUREN[item.categorie] || '#6B7280',
            }} />
            <span style={{ flex: 1, fontSize: 12.5, color: T.ink2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {item.naam}
            </span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
              {fmt(item.bedrag)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
