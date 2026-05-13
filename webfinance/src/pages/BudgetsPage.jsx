import React from 'react'
import { T } from '../tokens'

export default function BudgetsPage() {
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card }}>
        <div>
          <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Budgetten</div>
          <div style={{ fontSize: 13, color: T.ink3, marginTop: 2 }}>Beheer je budgetten en spaardoelen · mei 2026</div>
        </div>
      </div>
      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: T.ink3 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>💰</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, marginBottom: 8 }}>Budgetten</div>
          <div style={{ fontSize: 14 }}>Binnenkort beschikbaar</div>
        </div>
      </div>
    </>
  )
}
