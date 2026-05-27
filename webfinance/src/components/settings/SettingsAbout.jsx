// ─── SettingsAbout ───
// Over Webfinance: versie, credits, bronnen en easter egg.
// 5x klikken op versienummer ontgrendelt de admin-sectie.

import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { T, TAB } from '../../tokens'

const ADMIN_KEY = 'webfinance_admin_unlocked'

export default function SettingsAbout({ onAdminUnlock }) {
  const [clicks,       setClicks]       = useState(0)
  const [justUnlocked, setJustUnlocked] = useState(false)

  function handleVersionClick() {
    const next = clicks + 1
    setClicks(next)
    if (next >= 5) {
      localStorage.setItem(ADMIN_KEY, 'true')
      setJustUnlocked(true)
      onAdminUnlock?.()
      setTimeout(() => setJustUnlocked(false), 3500)
    }
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Over Webfinance</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Versie, credits en beleid</div>
      </div>

      {/* App-kaart */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 16,
        padding: 18, border: `1px solid ${T.border}`, borderRadius: 12,
        background: T.card, marginBottom: 22,
      }}>
        <div style={{
          width: 56, height: 56, borderRadius: 12,
          background: T.ink, color: '#fff',
          display: 'grid', placeItems: 'center',
          fontSize: 28, fontWeight: 600, flexShrink: 0,
        }}>€</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>Webfinance</div>
          <div
            onClick={handleVersionClick}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: 12, color: T.ink3, ...TAB, cursor: 'pointer',
              marginTop: 2, padding: '2px 6px', borderRadius: 4,
              background: clicks > 0 ? T.bg : 'transparent',
              userSelect: 'none',
            }}
          >
            v0.1.0
            {clicks > 0 && clicks < 5 && (
              <span style={{ fontSize: 10, color: T.ink4 }}>· {clicks}/5</span>
            )}
          </div>
          <div style={{ fontSize: 12, color: T.ink4, marginTop: 4 }}>Persoonlijk financieel beheer · lokaal-eerst</div>
        </div>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 999,
          background: T.greenSoft, color: T.greenText, letterSpacing: 0.3,
        }}>BÈTA</span>
      </div>

      {/* Easter egg melding */}
      {justUnlocked && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 18,
          background: T.amberSoft, border: '1px solid #FDE68A',
          fontSize: 13, color: '#78350F', fontWeight: 500,
        }}>
          Admin modus geactiveerd — check de navigatie links.
        </div>
      )}

      {/* Credits */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 10 }}>Credits</div>
        <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.75 }}>
          Gebouwd door <strong style={{ color: T.ink }}>Ronald Richter</strong>, 2026.<br />
          Iconen geïnspireerd op <span style={{ color: T.blue }}>Lucide</span>.{' '}
          Typografie: <span style={{ color: T.blue }}>Inter</span> door Rasmus Andersson.
        </div>
      </div>

      {/* Privacy link */}
      <div style={{ marginBottom: 22 }}>
        <Link to="/privacy" style={{ fontSize: 13, color: T.blue, textDecoration: 'none', fontWeight: 500 }}>
          Lees ons privacybeleid →
        </Link>
      </div>

      <div style={{
        fontSize: 11.5, color: T.ink4,
        paddingTop: 16, borderTop: `1px solid ${T.rule}`,
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>© 2026 Webfinance</span>
        <span>MIT License</span>
      </div>
    </div>
  )
}
