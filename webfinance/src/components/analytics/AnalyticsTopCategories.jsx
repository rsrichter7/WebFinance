// ─── AnalyticsTopCategories ───
// Horizontale bar chart van uitgaven per categorie, gesorteerd op bedrag.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'
import { CATEGORY_CONFIG } from '../../data/categoryConfig'
import { CATEGORIES } from '../../data/categories'
import { ICONS } from '../ui/Icons'

const ALL_CATS = CATEGORIES.map(c => c.name)

function filterPeriod(transactions, period) {
  return transactions.filter(t => {
    if (t.type !== 'Uitgave') return false
    const d = new Date(t.datum)
    if (period.modus === 'maand')
      return d.getFullYear() === period.jaar && d.getMonth() === period.maand
    if (period.modus === 'kwartaal')
      return d.getFullYear() === period.jaar && Math.floor(d.getMonth() / 3) === period.kwartaal
    return d.getFullYear() === period.jaar
  })
}

export default function AnalyticsTopCategories({ allTransactions, period }) {
  const filtered = filterPeriod(allTransactions, period)

  const totals = Object.fromEntries(ALL_CATS.map(c => [c, 0]))
  for (const t of filtered) {
    if (totals[t.categorie] !== undefined) totals[t.categorie] += t.bedrag
  }

  const sorted = ALL_CATS
    .map(cat => ({ cat, value: totals[cat] }))
    .sort((a, b) => b.value - a.value)

  const max = Math.max(...sorted.map(s => s.value), 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
      {sorted.map(({ cat, value }) => {
        const cfg   = CATEGORY_CONFIG[cat] || {}
        const color = T[cfg.colorKey] || T.ink3
        const soft  = T[cfg.softKey]  || T.rule
        const icon  = ICONS[cfg.icon]
        return (
          <div key={cat}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 24, height: 24, borderRadius: 6,
                  background: soft, color, flexShrink: 0,
                  display: 'grid', placeItems: 'center',
                }}>{icon}</span>
                <span style={{ fontSize: 13, color: T.ink2 }}>{cat}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>{fmt(value)}</span>
            </div>
            <div style={{ height: 7, background: T.rule, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${value === 0 ? 0 : Math.max((value / max) * 100, 1.5)}%`,
                background: color,
                transition: 'width 0.35s ease',
              }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}
