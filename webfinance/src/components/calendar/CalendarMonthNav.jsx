// ─── CalendarMonthNav ───
// Navigatiebalk: pijltjes links/rechts + maand- of weeklabel in het midden.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'

const MAANDEN = [
  'januari','februari','maart','april','mei','juni',
  'juli','augustus','september','oktober','november','december',
]
const MAANDEN_KORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

function getMondayOfWeek(year, month, day) {
  const d = new Date(year, month, day)
  const dow = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dow)
  return d
}

export default function CalendarMonthNav({ year, month, selDay, viewMode, onPrev, onNext }) {
  const { T } = useTheme()

  let label
  if (viewMode === 'Week') {
    const mon = getMondayOfWeek(year, month, selDay || 1)
    const sun = new Date(mon)
    sun.setDate(mon.getDate() + 6)
    const sameMonth = mon.getMonth() === sun.getMonth()
    if (sameMonth) {
      label = `${mon.getDate()} – ${sun.getDate()} ${MAANDEN[mon.getMonth()]} ${mon.getFullYear()}`
    } else {
      label = `${mon.getDate()} ${MAANDEN_KORT[mon.getMonth()]} – ${sun.getDate()} ${MAANDEN_KORT[sun.getMonth()]} ${sun.getFullYear()}`
    }
  } else {
    label = `${MAANDEN[month]} ${year}`
  }

  const btnStyle = {
    border: `1px solid ${T.border}`, background: T.card, borderRadius: 8,
    padding: '6px 10px', cursor: 'pointer', display: 'inline-flex',
    color: T.ink3, fontFamily: 'inherit',
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
      <button onClick={onPrev} style={btnStyle}>{ICONS.chevLeft}</button>
      <span style={{ fontSize: 17, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>{label}</span>
      <button onClick={onNext} style={btnStyle}>{ICONS.chevRight}</button>
    </div>
  )
}
