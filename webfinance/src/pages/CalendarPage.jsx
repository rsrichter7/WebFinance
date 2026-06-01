// ─── CalendarPage ───
// Financiële kalender pagina (premium): verwachte en werkelijke uitgaven per dag.

import React, { useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../hooks/useTheme'
import useTransactions    from '../hooks/useTransactions'
import useFixedExpenses   from '../hooks/useFixedExpenses'
import usePremium         from '../hooks/usePremium'
import CalendarTopBar     from '../components/calendar/CalendarTopBar'
import CalendarMonthNav   from '../components/calendar/CalendarMonthNav'
import CalendarGrid, { buildDayMap } from '../components/calendar/CalendarGrid'
import CalendarWeekView   from '../components/calendar/CalendarWeekView'
import { getMondayOfWeek } from '../components/calendar/CalendarWeekView'
import CalendarDayDetail  from '../components/calendar/CalendarDayDetail'
import CalendarStats      from '../components/calendar/CalendarStats'
import CalendarLegend     from '../components/calendar/CalendarLegend'
import TransactionForm    from '../components/transactions/TransactionForm'

const now  = new Date()
const padZ = n => String(n).padStart(2, '0')

export default function CalendarPage() {
  const { T, resolvedTheme } = useTheme()
  const { allTransactions, addTransaction } = useTransactions()
  const { items }      = useFixedExpenses()
  const { isPremium }  = usePremium()

  const [year,       setYear]       = useState(now.getFullYear())
  const [month,      setMonth]      = useState(now.getMonth())
  const [selDay,     setSelDay]     = useState(now.getDate())
  const [viewMode,   setViewMode]   = useState('Maand')
  const [viewFilter, setViewFilter] = useState('Beide')
  const [showForm,   setShowForm]   = useState(false)

  // Handmatig verwijderde verwachte uitgaven — persistent via localStorage
  const [dismissed, setDismissed] = useState(() => {
    try { return JSON.parse(localStorage.getItem('webfinance_dismissed_expected') || '[]') }
    catch { return [] }
  })

  function dismissExpected(vastelastId, datum) {
    const next = [...dismissed, { vastelastId, datum }]
    setDismissed(next)
    localStorage.setItem('webfinance_dismissed_expected', JSON.stringify(next))
  }

  function prevPeriod() {
    if (viewMode === 'Week') {
      const mon = getMondayOfWeek(year, month, selDay)
      mon.setDate(mon.getDate() - 7)
      setYear(mon.getFullYear()); setMonth(mon.getMonth()); setSelDay(mon.getDate())
    } else {
      if (month === 0) { setYear(y => y - 1); setMonth(11) } else setMonth(m => m - 1)
      setSelDay(1)
    }
  }

  function nextPeriod() {
    if (viewMode === 'Week') {
      const mon = getMondayOfWeek(year, month, selDay)
      mon.setDate(mon.getDate() + 7)
      setYear(mon.getFullYear()); setMonth(mon.getMonth()); setSelDay(mon.getDate())
    } else {
      if (month === 11) { setYear(y => y + 1); setMonth(0) } else setMonth(m => m + 1)
      setSelDay(1)
    }
  }

  function handleSelectDay(day, m, y) {
    setSelDay(day)
    if (m !== undefined) setMonth(m)
    if (y !== undefined) setYear(y)
  }

  const dayMap = useMemo(() => buildDayMap(allTransactions, items, year, month, dismissed), [allTransactions, items, year, month, dismissed])

  const totalIncome = useMemo(() =>
    Object.values(dayMap).reduce((s, d) => s + d.actual.filter(a => a.income).reduce((s2, a) => s2 + a.amount, 0), 0),
    [dayMap])
  const totalActual = useMemo(() =>
    Object.values(dayMap).reduce((s, d) => s + d.actual.filter(a => !a.income).reduce((s2, a) => s2 + a.amount, 0), 0),
    [dayMap])

  const initialDate = `${year}-${padZ(month + 1)}-${padZ(selDay)}`
  const overlayBg = resolvedTheme === 'dark' ? 'rgba(15,17,23,0.88)' : 'rgba(255,255,255,0.82)'

  return (
    <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <CalendarTopBar viewMode={viewMode} setViewMode={setViewMode} viewFilter={viewFilter} setViewFilter={setViewFilter} />

      <div style={{ flex: 1, overflow: 'auto', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ display: 'flex', gap: 20 }}>
          <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
            {viewMode === 'Maand'
              ? <CalendarGrid allTransactions={allTransactions} items={items} year={year} month={month} selectedDay={selDay} viewFilter={viewFilter} onSelectDay={setSelDay} dismissed={dismissed} />
              : <CalendarWeekView allTransactions={allTransactions} items={items} year={year} month={month} selectedDay={selDay} viewFilter={viewFilter} onSelectDay={handleSelectDay} />
            }
            <CalendarStats totalIncome={totalIncome} totalExpenses={totalActual} />
          </div>
          <div style={{ width: 280, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
            <CalendarMonthNav year={year} month={month} selDay={selDay} viewMode={viewMode} onPrev={prevPeriod} onNext={nextPeriod} />
            <CalendarDayDetail day={selDay} month={month} year={year} dayData={dayMap[selDay]} onAdd={() => setShowForm(true)} onDismissExpected={id => dismissExpected(id, initialDate)} />
            <CalendarLegend />
          </div>
        </div>
      </div>

      {showForm && createPortal(
        <TransactionForm open={showForm} onClose={() => setShowForm(false)}
          onSave={tx => { addTransaction(tx); setShowForm(false) }}
          initialDate={initialDate} />,
        document.body,
      )}

      {!isPremium && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: overlayBg, backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, marginBottom: 16, background: T.amberSoft, border: '1px solid #FDE68A', display: 'grid', placeItems: 'center', color: T.amber }}>
            <svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
              <rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>
            </svg>
          </div>
          <div style={{ fontSize: 17, fontWeight: 600, color: T.ink, marginBottom: 6 }}>Upgrade naar Premium</div>
          <div style={{ fontSize: 13, color: T.ink3, marginBottom: 20, textAlign: 'center', maxWidth: 300, lineHeight: 1.5 }}>
            De financiële kalender is een premium feature. Bekijk verwachte en werkelijke uitgaven per dag.
          </div>
          <button style={{ padding: '9px 24px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(37,99,235,0.18)' }}>
            Bekijk Premium
          </button>
        </div>
      )}
    </div>
  )
}
