// ─── FixedTopBar ───
// Titelbalk voor de Vaste Lasten pagina met actieknop en info-tooltip.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'

export default function FixedTopBar({ onAdd }) {
  const { T } = useTheme()
  const [showInfo, setShowInfo] = useState(false)

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
      position: 'relative',
    }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
            Vaste lasten
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowInfo(!showInfo)}
              style={{
                width: 20, height: 20, borderRadius: '50%',
                border: `1.5px solid ${T.border}`, background: T.card,
                fontSize: 12, fontWeight: 600, color: T.ink4,
                cursor: 'pointer', display: 'grid', placeItems: 'center',
                fontFamily: 'inherit',
              }}
            >
              ?
            </button>

            {showInfo && (
              <div style={{
                position: 'absolute', top: 28, left: -8,
                width: 340, padding: 18, borderRadius: 10,
                background: T.card, border: `1px solid ${T.border}`,
                boxShadow: '0 8px 24px rgba(17,24,39,0.15)',
                zIndex: 50, fontSize: 13, color: T.ink2, lineHeight: 1.6,
              }}>
                <div style={{ fontWeight: 600, color: T.ink, marginBottom: 8, fontSize: 14 }}>
                  Hoe werkt deze pagina?
                </div>
                <div style={{ marginBottom: 10 }}>
                  Vaste lasten zijn terugkerende kosten en inkomsten die automatisch worden bijgehouden.
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: T.blue, fontWeight: 600, flexShrink: 0 }}>•</span>
                    <span>Voeg een vaste last toe met een startdatum en herhaling (wekelijks, maandelijks of jaarlijks).</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: T.blue, fontWeight: 600, flexShrink: 0 }}>•</span>
                    <span>Transacties worden automatisch aangemaakt op basis van de herhaling. Deze herken je aan het <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: T.violetSoft, color: T.violet }}>AUTO</span> label op de transactiepagina.</span>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: T.blue, fontWeight: 600, flexShrink: 0 }}>•</span>
                    <span>Bedragen worden omgerekend naar maandbedragen voor het overzicht.</span>
                  </div>
                </div>
                <button
                  onClick={() => setShowInfo(false)}
                  style={{
                    marginTop: 14, width: '100%', padding: '7px 0',
                    borderRadius: 6, border: `1px solid ${T.border}`,
                    background: T.card, fontSize: 12, fontWeight: 500,
                    color: T.ink3, cursor: 'pointer', fontFamily: 'inherit',
                  }}
                >
                  Sluiten
                </button>
              </div>
            )}
          </div>
        </div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}></div>
      </div>
      <button
        onClick={onAdd}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          border: 'none', background: T.blue, color: '#fff',
          fontSize: 13, fontWeight: 500, cursor: 'pointer',
          fontFamily: 'inherit',
          boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
        }}
      >
        {ICONS.plus} Vaste last toevoegen
      </button>
    </div>
  )
}
