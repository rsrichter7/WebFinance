// ─── DashboardTopBar ───
// Begroeting + periode-selector (maand of loonperiode) + transactie-knop.

import React, { useState, useRef, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import PageInfoPopover from '../ui/PageInfoPopover'
import { kortLabel } from '../../utils/loonperiode'

const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]
const MAANDEN_LANG = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
const WEEKDAGEN   = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']

function begroeting() {
  const uur = new Date().getHours()
  if (uur < 12) return 'Goedemorgen'
  if (uur < 18) return 'Goedemiddag'
  return 'Goedenavond'
}

// Kleine kalender-picker voor de startdatum van een loonperiode
function MiniDatePicker({ value, onSelect, T }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const init = value ? new Date(value + 'T00:00:00') : new Date()
  const [viewYear, setViewYear]   = useState(init.getFullYear())
  const [viewMonth, setViewMonth] = useState(init.getMonth())

  useEffect(() => {
    if (open && value) {
      const d = new Date(value + 'T00:00:00')
      setViewYear(d.getFullYear()); setViewMonth(d.getMonth())
    }
  }, [open, value])

  useEffect(() => {
    if (!open) return
    function h(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  const firstDay  = new Date(viewYear, viewMonth, 1)
  let startDay = firstDay.getDay() - 1; if (startDay < 0) startDay = 6
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()
  const days = []
  for (let i = 0; i < startDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) {
    const ds = `${viewYear}-${String(viewMonth + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
    days.push({ d, ds })
  }

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setOpen(v => !v)} title="Grens aanpassen" style={{
        background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
        fontSize: 13, fontWeight: 500, color: T.blue, padding: '2px 0',
        textDecoration: 'underline dotted', textDecorationColor: T.border,
      }}>
        {value ? kortLabel(value) : '—'}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 9999,
          background: T.card, border: `1px solid ${T.border}`, borderRadius: 10,
          boxShadow: '0 8px 24px rgba(17,24,39,0.13)', width: 252, padding: '12px 14px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <button onClick={() => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) } else setViewMonth(m => m - 1) }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: T.ink3, padding: '2px 6px' }}>‹</button>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{MAANDEN_LANG[viewMonth]} {viewYear}</span>
            <button onClick={() => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) } else setViewMonth(m => m + 1) }}
              style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: 18, color: T.ink3, padding: '2px 6px' }}>›</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0, marginBottom: 4 }}>
            {WEEKDAGEN.map(d => <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 600, color: T.ink4 }}>{d}</div>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 2 }}>
            {days.map((item, i) => item ? (
              <button key={item.ds} onClick={() => { onSelect(item.ds); setOpen(false) }} style={{
                width: '100%', aspectRatio: '1', border: 'none', borderRadius: 6,
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 12,
                background: item.ds === value ? T.blue : 'transparent',
                color: item.ds === value ? '#fff' : T.ink,
              }}>{item.d}</button>
            ) : <div key={`e-${i}`} />)}
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardTopBar({
  maand, jaar, onMaandWijzig, onAddTx, voornaam,
  dashboardPeriode, startDatum, eindDatum, periodeLabel,
  onPeriodeVorige, onPeriodeVolgende, onOverrideStart,
}) {
  const { T } = useTheme()

  function vorige() {
    if (dashboardPeriode === 'loon') { onPeriodeVorige(); return }
    if (maand === 1) onMaandWijzig({ maand: 12, jaar: jaar - 1 })
    else onMaandWijzig({ maand: maand - 1, jaar })
  }

  function volgende() {
    if (dashboardPeriode === 'loon') { onPeriodeVolgende(); return }
    if (maand === 12) onMaandWijzig({ maand: 1, jaar: jaar + 1 })
    else onMaandWijzig({ maand: maand + 1, jaar })
  }

  const navBtnStyle = {
    width: 32, height: 32, borderRadius: 6, border: `1px solid ${T.border}`,
    background: T.card, cursor: 'pointer', display: 'grid', placeItems: 'center',
    color: T.ink3, fontSize: 14,
  }

  const labelStyle = {
    padding: '6px 16px', borderRadius: 6, border: `1px solid ${T.border}`,
    background: T.bg, fontSize: 13, fontWeight: 500, color: T.ink,
    minWidth: 148, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
  }

  const selectorLabel = dashboardPeriode === 'loon' && startDatum && eindDatum ? (
    <div style={labelStyle}>
      <MiniDatePicker
        value={startDatum}
        onSelect={(dateStr) => onOverrideStart(startDatum.slice(0, 7), dateStr)}
        T={T}
      />
      <span style={{ color: T.ink3, padding: '0 2px' }}>–</span>
      <span>{kortLabel(eindDatum)}</span>
    </div>
  ) : (
    <div style={{ ...labelStyle, textTransform: 'capitalize' }}>
      {MAANDEN[maand - 1]} {jaar}
    </div>
  )

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px', borderBottom: `1px solid ${T.border}`, background: T.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>
          {begroeting()}{voornaam ? `, ${voornaam}` : ''}
        </div>
        <PageInfoPopover
          titel="Hoe werkt deze pagina?"
          intro="Het dashboard geeft een overzicht van je financiën per periode."
          bullets={[
            'Bekijk hoeveel je vrij te besteden hebt na vaste lasten en gemiddelde uitgaven.',
            'De mini-stats tonen inkomsten, uitgaven en huidig saldo.',
            'De trend-grafiek laat het verloop van de afgelopen maanden zien.',
            'Kies Loonperiode in Instellingen → Voorkeuren voor salaris-gebaseerde periodes.',
          ]}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <button onClick={vorige} style={navBtnStyle}>‹</button>
          {selectorLabel}
          <button onClick={volgende} style={navBtnStyle}>›</button>
        </div>
        <button onClick={onAddTx} style={{
          height: 32, padding: '0 14px', borderRadius: 8, border: 'none',
          background: T.gradAccent, color: '#fff', fontSize: 13, fontWeight: 500,
          cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: '0 2px 8px rgba(30, 90, 168, 0.25)',
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {ICONS.plus}
          Transactie
        </button>
      </div>
    </div>
  )
}
