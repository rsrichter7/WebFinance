// ─── BudgetTopBar ───
// Paginatitel met maand/jaar selector.

import React, { useState } from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'

const MAANDEN = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December'
]

export default function BudgetTopBar({ geselecteerdeMaand, onMaandWijzig }) {
  const { maand, jaar } = geselecteerdeMaand

  function vorige() {
    if (maand === 1) onMaandWijzig({ maand: 12, jaar: jaar - 1 })
    else onMaandWijzig({ maand: maand - 1, jaar })
  }

  function volgende() {
    if (maand === 12) onMaandWijzig({ maand: 1, jaar: jaar + 1 })
    else onMaandWijzig({ maand: maand + 1, jaar })
  }

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
    }}>
      <div>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
          Budgetten
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button onClick={vorige} style={{
          width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.card, cursor: 'pointer', display: 'grid', placeItems: 'center',
          color: T.ink3, fontSize: 14,
        }}>‹</button>
        <div style={{
          padding: '6px 16px', borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.bg, fontSize: 13, fontWeight: 500, color: T.ink,
          minWidth: 140, textAlign: 'center',
        }}>
          {MAANDEN[maand - 1]} {jaar}
        </div>
        <button onClick={volgende} style={{
          width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`,
          background: T.card, cursor: 'pointer', display: 'grid', placeItems: 'center',
          color: T.ink3, fontSize: 14,
        }}>›</button>
      </div>
    </div>
  )
}