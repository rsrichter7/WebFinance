// ─── AnalyticsPremiumSection ───
// Vergrendelde premium sectie met ghost widgets en blur overlay.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'

const GHOST_WIDGETS = [
  { title: 'Noodzaak / Wens / Sparen', type: 'donut'   },
  { title: '50/30/20 score',           type: 'bars'    },
  { title: 'Weekdag analyse',          type: 'weekday' },
  { title: 'Uitgaven per persoon',     type: 'persons' },
]

function GhostWidget({ title, type }) {
  const { T } = useTheme()
  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 18, opacity: 0.45 }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: T.ink3, marginBottom: 14 }}>{title}</div>
      {type === 'donut' && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 90 }}>
          <div style={{ width: 76, height: 76, borderRadius: '50%', border: `8px solid ${T.rule}`, borderTopColor: T.blue, borderRightColor: T.violet }} />
        </div>
      )}
      {type === 'bars' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[68, 42, 22].map((w, i) => (
            <div key={i} style={{ height: 8, background: T.rule, borderRadius: 4 }}>
              <div style={{ height: '100%', width: `${w}%`, background: T.blue, borderRadius: 4, opacity: 0.35 }} />
            </div>
          ))}
        </div>
      )}
      {type === 'weekday' && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-end', height: 60 }}>
          {[40, 25, 60, 35, 80, 55, 20].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: T.rule, borderRadius: 3 }} />
          ))}
        </div>
      )}
      {type === 'persons' && (
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-end', height: 60 }}>
          {[65, 55].map((h, i) => (
            <div key={i} style={{ flex: 1, height: `${h}%`, background: T.rule, borderRadius: 4 }} />
          ))}
        </div>
      )}
    </div>
  )
}

export default function AnalyticsPremiumSection() {
  const { T, resolvedTheme } = useTheme()
  const overlayBg = resolvedTheme === 'dark' ? 'rgba(15,17,23,0.82)' : 'rgba(255,255,255,0.72)'

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Mijn overzichten</div>
        <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber, letterSpacing: 0.3 }}>PREMIUM</span>
      </div>
      <div style={{ fontSize: 13, color: T.ink3, marginBottom: 16 }}>
        Stel je eigen dashboard samen met aanpasbare widgets en diepere analyses.
      </div>

      <div style={{ position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {GHOST_WIDGETS.map(w => <GhostWidget key={w.title} {...w} />)}
        </div>

        <div style={{
          position: 'absolute', inset: 0, background: overlayBg, backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          borderRadius: 12, zIndex: 2,
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: T.amberSoft, border: '1px solid #FDE68A', display: 'grid', placeItems: 'center', color: T.amber, marginBottom: 14 }}>
            <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Upgrade naar Premium</div>
          <div style={{ fontSize: 13, color: T.ink3, marginBottom: 16, textAlign: 'center', maxWidth: 280 }}>
            Stel je eigen dashboard samen met aanpasbare widgets en analyses
          </div>
          <button style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(37,99,235,0.18)' }}>
            Bekijk Premium
          </button>
        </div>
      </div>
    </div>
  )
}
