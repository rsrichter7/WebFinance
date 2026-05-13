import React from 'react'
import { T } from '../tokens'

export default function CalendarPage() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Financiële kalender</div>
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>PREMIUM</span>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: T.ink3 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🗓️</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, marginBottom: 8 }}>Kalender</div>
          <div style={{ fontSize: 14 }}>Premium feature — binnenkort beschikbaar</div>
        </div>
      </div>
    </>
  )
}
