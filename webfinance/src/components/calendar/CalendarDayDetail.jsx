// ─── CalendarDayDetail ───
// Detailpaneel (rechts): toont de verwachte en werkelijke items van de geselecteerde dag.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { ICONS } from '../ui/Icons'

const MAANDEN = [
  'januari','februari','maart','april','mei','juni',
  'juli','augustus','september','oktober','november','december',
]

function ItemRow({ label, icon, iconColor, amount, amountColor, isLast }) {
  const { T } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: isLast ? 'none' : `1px solid ${T.rule}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
        <span style={{ color: iconColor, display: 'inline-flex', flexShrink: 0 }}>{icon}</span>
        <span style={{ fontSize: 13, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 500, color: amountColor, ...TAB, flexShrink: 0, marginLeft: 8 }}>{amount}</span>
    </div>
  )
}

export default function CalendarDayDetail({ day, month, year, dayData, onAdd }) {
  const { T } = useTheme()

  if (!day) {
    return (
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, padding: 18 }}>
        <div style={{ fontSize: 13, color: T.ink4 }}>Selecteer een dag</div>
      </div>
    )
  }

  const expected = dayData?.expected || []
  const actual   = dayData?.actual   || []
  const expUitgaven  = expected.filter(e => !e.income)
  const expInkomsten = expected.filter(e => e.income)
  const actUitgaven  = actual.filter(a => !a.income)
  const actInkomsten = actual.filter(a => a.income)
  const allExpected = [...expUitgaven, ...expInkomsten]
  const allActual   = [...actUitgaven, ...actInkomsten]
  const hasExpected = allExpected.length > 0
  const hasActual   = allActual.length > 0

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, boxShadow: T.shadow, padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink }}>{day} {MAANDEN[month]} {year}</div>
        <button onClick={onAdd} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 10px', borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, fontSize: 12, fontWeight: 500, color: T.ink2, cursor: 'pointer', fontFamily: 'inherit' }}>
          {ICONS.plus}<span>Toevoegen</span>
        </button>
      </div>

      {hasExpected && (
        <div style={{ marginBottom: hasActual ? 16 : 0 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>Verwacht</div>
          {allExpected.map((e, i) => (
            <ItemRow key={i} label={e.name} icon={e.income ? ICONS.arrUp : ICONS.clock}
              iconColor={e.income ? T.green : T.blue}
              amount={`${e.income ? '+' : '−'} ${fmt(e.amount)}`}
              amountColor={e.income ? T.greenText : T.blueText}
              isLast={i === allExpected.length - 1} />
          ))}
        </div>
      )}

      {hasActual && (
        <div>
          <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 }}>Werkelijk</div>
          {allActual.map((a, i) => (
            <ItemRow key={i} label={a.name} icon={a.income ? ICONS.arrUp : ICONS.arrDown}
              iconColor={a.income ? T.green : T.ink4}
              amount={`${a.income ? '+' : '−'} ${fmt(a.amount)}`}
              amountColor={a.income ? T.greenText : T.ink}
              isLast={i === allActual.length - 1} />
          ))}
        </div>
      )}

      {!hasExpected && !hasActual && (
        <div style={{ fontSize: 13, color: T.ink4, padding: '12px 0' }}>Geen transacties op deze dag</div>
      )}
    </div>
  )
}
