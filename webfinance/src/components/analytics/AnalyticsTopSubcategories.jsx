// ─── AnalyticsTopSubcategories ───
// Top 10 subcategorieën op uitgavenbedrag met horizontale bars.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'
import { CATEGORIES } from '../../data/categories'
import { CATEGORY_CONFIG } from '../../data/categoryConfig'

function getCatForSub(sub) {
  for (const cat of CATEGORIES) {
    if (cat.subs.includes(sub)) return cat.name
  }
  return 'Overig'
}

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

export default function AnalyticsTopSubcategories({ allTransactions, period }) {
  const filtered = filterPeriod(allTransactions, period)

  const subtotals = {}
  for (const t of filtered) {
    subtotals[t.sub] = (subtotals[t.sub] || 0) + t.bedrag
  }

  const sorted = Object.entries(subtotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([sub, value]) => ({ sub, value }))

  const max = Math.max(...sorted.map(s => s.value), 1)

  if (sorted.length === 0) {
    return (
      <div style={{ fontSize: 13, color: T.ink4, textAlign: 'center', padding: '32px 0' }}>
        Geen uitgaven in deze periode
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {sorted.map(({ sub, value }, i) => {
        const parentCat = getCatForSub(sub)
        const cfg   = CATEGORY_CONFIG[parentCat] || {}
        const color = T[cfg.colorKey] || T.ink3
        return (
          <div key={sub}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 11.5, fontWeight: 600, color: T.ink4, width: 16, ...TAB }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: T.ink2 }}>{sub}</span>
              </div>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>{fmt(value)}</span>
            </div>
            <div style={{ height: 7, background: T.rule, borderRadius: 4, overflow: 'hidden' }}>
              <div style={{
                height: '100%', borderRadius: 4,
                width: `${Math.max((value / max) * 100, 1.5)}%`,
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
