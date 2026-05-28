// ─── CalendarWeekView ───
// Weekweergave: 7 grote dagkaarten naast elkaar (ma–zo).

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmtShort } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { buildDayMap } from './CalendarGrid'

const WEEKDAYS_NL = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MAANDEN_KORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

export function getMondayOfWeek(year, month, day) {
  const d = new Date(year, month, day)
  const dow = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - dow)
  return d
}

export default function CalendarWeekView({ allTransactions, items, year, month, selectedDay, viewFilter, onSelectDay }) {
  const { T } = useTheme()
  const today = new Date()
  const refDay = selectedDay ?? today.getDate()

  const monday = useMemo(() => getMondayOfWeek(year, month, refDay), [year, month, refDay])

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday); d.setDate(monday.getDate() + i)
      return { y: d.getFullYear(), m: d.getMonth(), d: d.getDate(), date: new Date(d) }
    }), [monday])

  const dayMaps = useMemo(() => {
    const maps = {}
    for (const { y, m } of weekDays) {
      const key = `${y}-${m}`
      if (!maps[key]) maps[key] = buildDayMap(allTransactions, items, y, m)
    }
    return maps
  }, [allTransactions, items, weekDays])

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${T.border}` }}>
        {WEEKDAYS_NL.map(label => (
          <div key={label} style={{ padding: '10px 8px', textAlign: 'center', background: T.cardAlt, fontSize: 11.5, fontWeight: 500, color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.3 }}>{label}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
        {weekDays.map(({ y, m, d, date }, i) => {
          const isToday    = date.toDateString() === today.toDateString()
          const isSelected = d === selectedDay && m === month && y === year
          const isFuture   = date > today
          const dayData    = dayMaps[`${y}-${m}`]?.[d] || { expected: [], actual: [] }

          const showExpected = viewFilter !== 'Werkelijk'
          const showActual   = viewFilter !== 'Verwacht'
          const expItems = showExpected ? dayData.expected : []
          const actItems = showActual   ? dayData.actual   : []

          return (
            <div key={i} onClick={() => onSelectDay(d, m, y)} style={{
              borderRight: i < 6 ? `1px solid ${T.border}` : 'none',
              padding: 10, minHeight: 150,
              background: isSelected ? T.blueSoft : T.card,
              opacity: isFuture ? 0.75 : 1, cursor: 'pointer',
            }}>
              <div style={{ marginBottom: 10 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', display: 'grid', placeItems: 'center', background: isToday ? T.blue : 'transparent', color: isToday ? '#fff' : T.ink, fontSize: 14, fontWeight: isToday ? 700 : 600 }}>{d}</div>
                <div style={{ fontSize: 10.5, color: T.ink4, marginTop: 2 }}>{MAANDEN_KORT[m]}</div>
              </div>

              {expItems.map((e, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 5 }}>
                  <span style={{ color: e.income ? T.green : T.blue, display: 'inline-flex', marginTop: 1, flexShrink: 0 }}>
                    {e.income ? ICONS.arrUp : ICONS.clock}
                  </span>
                  <span style={{ fontSize: 10.5, color: e.income ? T.greenText : T.blueText, fontWeight: 500, ...TAB, lineHeight: 1.3 }}>
                    {e.income ? '+' : ''}{fmtShort(e.amount)}
                  </span>
                </div>
              ))}

              {actItems.filter(a => !a.income).map((a, j) => (
                <div key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 4, marginBottom: 5 }}>
                  <span style={{ color: T.ink4, display: 'inline-flex', marginTop: 1, flexShrink: 0 }}>{ICONS.arrDown}</span>
                  <span style={{ fontSize: 10.5, color: T.ink2, fontWeight: 500, ...TAB, lineHeight: 1.3 }}>{fmtShort(a.amount)}</span>
                </div>
              ))}

              {expItems.length === 0 && actItems.length === 0 && (
                <div style={{ fontSize: 10.5, color: T.ink4 }}>—</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
