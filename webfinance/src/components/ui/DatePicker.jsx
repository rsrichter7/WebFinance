// ─── DatePicker ───
// Custom datumkiezer met kalenderweergave.
// Zelfde look & feel als de CustomDropdown-filters.

import React, { useState, useRef, useEffect } from 'react'
import { T } from '../../tokens'

const WEEKDAGEN = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MAANDNAMEN = [
  'Januari', 'Februari', 'Maart', 'April', 'Mei', 'Juni',
  'Juli', 'Augustus', 'September', 'Oktober', 'November', 'December',
]

// Geeft een array van dag-objecten voor de kalenderweergave
function getCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()

  // Maandag = 0, Zondag = 6
  let startDay = firstDay.getDay() - 1
  if (startDay < 0) startDay = 6

  const days = []

  // Lege cellen voor dagen vóór de eerste
  for (let i = 0; i < startDay; i++) {
    days.push({ day: null, date: null })
  }

  // Dagen van de maand
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    days.push({ day: d, date: dateStr })
  }

  return days
}

export default function DatePicker({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Huidige weergavemaand (los van geselecteerde datum)
  const selected = value ? new Date(value) : new Date()
  const [viewYear, setViewYear] = useState(selected.getFullYear())
  const [viewMonth, setViewMonth] = useState(selected.getMonth())

  // Reset view naar geselecteerde datum wanneer dropdown opent
  useEffect(() => {
    if (open) {
      const d = value ? new Date(value) : new Date()
      setViewYear(d.getFullYear())
      setViewMonth(d.getMonth())
    }
  }, [open])

  // Sluit bij klik erbuiten
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Navigatie
  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear(y => y - 1)
    } else {
      setViewMonth(m => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear(y => y + 1)
    } else {
      setViewMonth(m => m + 1)
    }
  }

  // Dag selecteren
  function selectDate(dateStr) {
    onChange(dateStr)
    setOpen(false)
  }

  // Vandaag als string
  const todayStr = new Date().toISOString().split('T')[0]

  // Kalender dagen
  const days = getCalendarDays(viewYear, viewMonth)

  // Formateer de geselecteerde datum voor de knop
  function formatButtonLabel() {
    if (!value) return 'Kies datum'
    const d = new Date(value)
    return `${d.getDate()} ${MAANDNAMEN[d.getMonth()].substring(0, 3)} ${d.getFullYear()}`
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger knop */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', padding: '9px 12px', borderRadius: 8,
          border: `1.5px solid ${open ? T.blue : T.border}`,
          background: T.card, fontSize: 13, color: T.ink,
          cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          textAlign: 'left',
        }}
      >
        <span>{formatButtonLabel()}</span>
        <span style={{ fontSize: 14, color: T.ink4 }}>📅</span>
      </button>

      {/* Kalender dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 4,
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, boxShadow: '0 8px 24px rgba(17,24,39,0.10)',
          width: 280, zIndex: 60, overflow: 'hidden',
          padding: '12px 14px',
        }}>
          {/* Maand/jaar header met navigatie */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 12,
          }}>
            <button
              type="button"
              onClick={prevMonth}
              style={navBtnStyle}
              onMouseEnter={e => e.currentTarget.style.background = T.rule}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              ‹
            </button>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
              {MAANDNAMEN[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              style={navBtnStyle}
              onMouseEnter={e => e.currentTarget.style.background = T.rule}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              ›
            </button>
          </div>

          {/* Weekdagen header */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 0, marginBottom: 4,
          }}>
            {WEEKDAGEN.map(d => (
              <div key={d} style={{
                textAlign: 'center', fontSize: 11, fontWeight: 600,
                color: T.ink4, padding: '4px 0',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Dagen grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
            gap: 2,
          }}>
            {days.map((d, i) => {
              if (!d.day) {
                return <div key={`empty-${i}`} />
              }

              const isSelected = d.date === value
              const isToday = d.date === todayStr

              return (
                <button
                  type="button"
                  key={d.date}
                  onClick={() => selectDate(d.date)}
                  onMouseEnter={e => {
                    if (!isSelected) e.currentTarget.style.background = T.rule
                  }}
                  onMouseLeave={e => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent'
                  }}
                  style={{
                    width: '100%', aspectRatio: '1', border: 'none',
                    borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
                    fontSize: 13, fontWeight: isToday ? 600 : 400,
                    background: isSelected ? T.blue : 'transparent',
                    color: isSelected ? '#fff' : isToday ? T.blue : T.ink,
                    display: 'grid', placeItems: 'center',
                    position: 'relative',
                  }}
                >
                  {d.day}
                  {/* Vandaag-indicator (stip onder het getal) */}
                  {isToday && !isSelected && (
                    <span style={{
                      position: 'absolute', bottom: 3,
                      width: 4, height: 4, borderRadius: '50%',
                      background: T.blue,
                    }} />
                  )}
                </button>
              )
            })}
          </div>

          {/* Vandaag-knop */}
          <div style={{ marginTop: 8, borderTop: `1px solid ${T.rule}`, paddingTop: 8 }}>
            <button
              type="button"
              onClick={() => selectDate(todayStr)}
              onMouseEnter={e => e.currentTarget.style.background = T.rule}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{
                width: '100%', padding: '6px 0', border: 'none',
                background: 'transparent', borderRadius: 6,
                fontSize: 12, fontWeight: 500, color: T.blue,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Vandaag
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Navigatie-knop stijl
const navBtnStyle = {
  border: 'none', background: 'transparent',
  width: 28, height: 28, borderRadius: 6,
  fontSize: 18, color: T.ink3, cursor: 'pointer',
  display: 'grid', placeItems: 'center',
  fontFamily: 'inherit',
}
