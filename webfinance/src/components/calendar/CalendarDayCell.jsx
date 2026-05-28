// ─── CalendarDayCell ───
// Individuele dagcel in het kalender-maandgrid.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmtShort } from '../../tokens'
import { ICONS } from '../ui/Icons'

export default function CalendarDayCell({ day, dayData, isToday, isSelected, viewFilter, paidIds, onClick, isFuture }) {
  const { T } = useTheme()

  if (!day) return <div style={{ padding: 6, minHeight: 90 }} />

  const expected = dayData?.expected || []
  const actual   = dayData?.actual   || []

  const showExpected = viewFilter !== 'Werkelijk'
  const showActual   = viewFilter !== 'Verwacht'

  const expUitgaven  = showExpected ? expected.filter(e => !e.income) : []
  const expInkomsten = showExpected ? expected.filter(e => e.income)  : []
  const actUitgaven  = showActual   ? actual.filter(a => !a.income)   : []

  const totalExpected = expUitgaven.reduce((s, e) => s + e.amount, 0)
  const totalIncome   = expInkomsten.reduce((s, e) => s + e.amount, 0)
  const totalActual   = actUitgaven.reduce((s, a) => s + a.amount, 0)

  const hasExpected = expUitgaven.length > 0
  const hasIncome   = expInkomsten.length > 0
  const hasActual   = actUitgaven.length > 0

  const isPaid = showExpected && expUitgaven.some(e => paidIds?.has(e.id))

  let bg = T.card
  if (!isFuture && hasActual && totalActual > 500) bg = T.redSoft
  if (hasIncome) bg = T.greenSoft

  return (
    <div onClick={onClick} style={{
      padding: 8, minHeight: 90,
      border: `1px solid ${isSelected ? T.blue : T.border}`,
      borderRadius: 8, background: bg, cursor: 'pointer',
      boxShadow: isSelected ? `0 0 0 2px ${T.blueSoft}` : 'none',
      opacity: isFuture ? 0.75 : 1, transition: 'border-color 0.15s, box-shadow 0.15s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{
          fontSize: 13, fontWeight: isToday ? 700 : 500,
          color: isToday ? '#fff' : T.ink,
          background: isToday ? T.blue : 'transparent',
          width: 22, height: 22, borderRadius: '50%', display: 'grid', placeItems: 'center',
        }}>{day}</span>
        {isPaid && <span style={{ color: T.green, display: 'inline-flex' }}>{ICONS.check}</span>}
      </div>
      {hasExpected && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
          <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.clock}</span>
          <span style={{ fontSize: 10.5, color: T.blueText, fontWeight: 500, ...TAB }}>{fmtShort(totalExpected)}</span>
        </div>
      )}
      {hasIncome && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
          <span style={{ color: T.green, display: 'inline-flex' }}>{ICONS.arrUp}</span>
          <span style={{ fontSize: 10.5, color: T.greenText, fontWeight: 500, ...TAB }}>+{fmtShort(totalIncome)}</span>
        </div>
      )}
      {hasActual && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <span style={{ color: T.ink4, display: 'inline-flex' }}>{ICONS.arrDown}</span>
          <span style={{ fontSize: 10.5, color: T.ink2, fontWeight: 500, ...TAB }}>{fmtShort(totalActual)}</span>
        </div>
      )}
    </div>
  )
}
