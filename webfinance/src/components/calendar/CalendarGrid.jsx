// ─── CalendarGrid ───
// Maandweergave: weekdag-headers + 7-koloms dagenraster.
// Exporteert ook buildDayMap voor gebruik in andere componenten.

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import CalendarDayCell from './CalendarDayCell'

const WEEKDAYS = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo']

function getOccurrencesInMonth(item, year, month) {
  const results = []
  const start = new Date(item.startdatum)
  const targetStart = new Date(year, month, 1)
  const targetEnd   = new Date(year, month + 1, 0)
  if (start > targetEnd) return results
  let cur = new Date(start)
  let safety = 0
  while (cur <= targetEnd && safety < 300) {
    if (cur >= targetStart) results.push({ day: cur.getDate(), item })
    if (item.herhaling === 'Wekelijks')        { cur = new Date(cur); cur.setDate(cur.getDate() + 7) }
    else if (item.herhaling === 'Maandelijks') { cur = new Date(cur); cur.setMonth(cur.getMonth() + 1) }
    else if (item.herhaling === 'Jaarlijks')   { cur = new Date(cur); cur.setFullYear(cur.getFullYear() + 1) }
    else break
    safety++
  }
  return results
}

export function buildDayMap(allTransactions, items, year, month, dismissedExpected = []) {
  const map = {}

  for (const item of items) {
    for (const { day } of getOccurrencesInMonth(item, year, month)) {
      if (!map[day]) map[day] = { expected: [], actual: [] }
      map[day].expected.push({
        id: item.id, name: item.omschrijving, winkel: item.winkel || '',
        amount: item.bedrag, income: item.type === 'Inkomst',
      })
    }
  }
  for (const tx of allTransactions) {
    const d = new Date(tx.datum)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!map[day]) map[day] = { expected: [], actual: [] }
      map[day].actual.push({
        id: tx.id, vasteLast: tx.vasteLast, name: tx.beschrijving, winkel: tx.winkel || '',
        amount: tx.bedrag, income: tx.type === 'Inkomst',
      })
    }
  }

  // Filter verwachte items voor vandaag en het verleden:
  // verwijder automatische matches (vaste last betaald) en handmatig verwijderde
  const today = new Date()
  const p = n => String(n).padStart(2, '0')

  for (const dayStr of Object.keys(map)) {
    const day = parseInt(dayStr)
    if (new Date(year, month, day) > today) continue // toekomstige dagen overslaan

    const datum   = `${year}-${p(month + 1)}-${p(day)}`
    const dayData = map[day]

    dayData.expected = dayData.expected.filter(exp => {
      // Handmatig verwijderd door gebruiker
      if (dismissedExpected.some(d => d.vastelastId === exp.id && d.datum === datum)) return false
      // Automatische match: zoek in ±1 dag naar gekoppelde of vergelijkbare transactie
      for (const delta of [0, -1, 1]) {
        const acts = map[day + delta]?.actual || []
        for (const a of acts) {
          if (a.vasteLast === exp.id) return false // directe koppeling via vaste_last_id
          if (Math.abs(a.amount - exp.amount) < 0.01 &&
              a.name && exp.name &&
              a.name.toLowerCase() === exp.name.toLowerCase()) return false // naam + bedrag
        }
      }
      return true
    })
  }

  return map
}

export default function CalendarGrid({ allTransactions, items, year, month, selectedDay, viewFilter, onSelectDay, dismissed = [] }) {
  const { T } = useTheme()
  const today = new Date()
  const todayDay = today.getFullYear() === year && today.getMonth() === month ? today.getDate() : -1

  const dayMap = useMemo(() => buildDayMap(allTransactions, items, year, month, dismissed), [allTransactions, items, year, month, dismissed])

  const paidIds = useMemo(() => {
    const paid = allTransactions.filter(tx => {
      const d = new Date(tx.datum)
      return d.getFullYear() === year && d.getMonth() === month && tx.vasteLast
    })
    return new Set(paid.map(tx => tx.vasteLast))
  }, [allTransactions, year, month])

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDOW    = (new Date(year, month, 1).getDay() + 6) % 7
  const cells = [...Array(firstDOW).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]
  while (cells.length % 7 !== 0) cells.push(null)

  const weeks = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: `1px solid ${T.border}` }}>
        {WEEKDAYS.map(d => (
          <div key={d} style={{ padding: '10px 8px', textAlign: 'center', background: T.cardAlt, fontSize: 11.5, fontWeight: 500, color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.3 }}>{d}</div>
        ))}
      </div>
      <div style={{ padding: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {week.map((day, di) => {
              const isFuture = day ? new Date(year, month, day) > today : false
              return (
                <CalendarDayCell key={di} day={day} dayData={day ? dayMap[day] : null}
                  isToday={day === todayDay} isSelected={day === selectedDay}
                  viewFilter={viewFilter} paidIds={paidIds} isFuture={isFuture}
                  onClick={() => day && onSelectDay(day)} />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}
