// ─── AnalyticsPeriodFilter ───
// Herbruikbare periode-selector: Maand / Kwartaal / Jaar pills + navigatie-pijltjes.

import React from 'react'
import { T } from '../../tokens'

const MAANDEN = [
  'januari','februari','maart','april','mei','juni',
  'juli','augustus','september','oktober','november','december',
]
const MODI = [['maand', 'Maand'], ['kwartaal', 'Kwartaal'], ['jaar', 'Jaar']]

export function initPeriod() {
  const now = new Date()
  return {
    modus:    'maand',
    maand:    now.getMonth(),
    kwartaal: Math.floor(now.getMonth() / 3),
    jaar:     now.getFullYear(),
  }
}

function periodeLabel({ modus, maand, kwartaal, jaar }) {
  if (modus === 'maand')    return `${MAANDEN[maand]} ${jaar}`
  if (modus === 'kwartaal') return `Q${kwartaal + 1} ${jaar}`
  return `${jaar}`
}

function navigate(p, dir) {
  if (p.modus === 'maand') {
    const m = p.maand + dir
    if (m < 0)  return { ...p, maand: 11, jaar: p.jaar - 1 }
    if (m > 11) return { ...p, maand: 0,  jaar: p.jaar + 1 }
    return { ...p, maand: m }
  }
  if (p.modus === 'kwartaal') {
    const q = p.kwartaal + dir
    if (q < 0) return { ...p, kwartaal: 3, jaar: p.jaar - 1 }
    if (q > 3) return { ...p, kwartaal: 0, jaar: p.jaar + 1 }
    return { ...p, kwartaal: q }
  }
  return { ...p, jaar: p.jaar + dir }
}

const navBtn = {
  width: 22, height: 22, borderRadius: 5,
  border: 'none', background: 'transparent',
  cursor: 'pointer', display: 'grid', placeItems: 'center',
  color: T.ink3, fontSize: 15, lineHeight: 1,
  fontFamily: 'inherit',
}

export default function AnalyticsPeriodFilter({ value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
      {/* Modus pills */}
      <div style={{
        display: 'inline-flex', padding: 2,
        background: T.bg, border: `1px solid ${T.border}`, borderRadius: 7,
      }}>
        {MODI.map(([key, lbl]) => {
          const active = value.modus === key
          return (
            <span
              key={key}
              onClick={() => onChange({ ...value, modus: key })}
              style={{
                padding: '3px 9px', fontSize: 11.5, fontWeight: 500,
                borderRadius: 5, cursor: 'pointer', userSelect: 'none',
                background: active ? T.card : 'transparent',
                color:      active ? T.ink  : T.ink3,
                boxShadow:  active ? '0 1px 2px rgba(17,24,39,0.06)' : 'none',
              }}
            >{lbl}</span>
          )
        })}
      </div>

      {/* Navigatie */}
      <button style={navBtn} onClick={() => onChange(navigate(value, -1))}>‹</button>
      <span style={{
        fontSize: 12, fontWeight: 500, color: T.ink,
        minWidth: 84, textAlign: 'center',
      }}>
        {periodeLabel(value)}
      </span>
      <button style={navBtn} onClick={() => onChange(navigate(value, 1))}>›</button>
    </div>
  )
}
