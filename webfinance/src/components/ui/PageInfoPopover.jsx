// ─── PageInfoPopover ───
// Vraagteken-knop met uitleg-popover voor alle pagina's.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

export default function PageInfoPopover({ titel, intro, bullets }) {
  const { T } = useTheme()
  const [showInfo, setShowInfo] = useState(false)

  return (
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
            {titel}
          </div>
          <div style={{ marginBottom: 10 }}>
            {intro}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {bullets.map((bullet, i) => (
              <div key={i} style={{ display: 'flex', gap: 8 }}>
                <span style={{ color: T.blue, fontWeight: 600, flexShrink: 0 }}>•</span>
                <span>{bullet}</span>
              </div>
            ))}
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
  )
}
