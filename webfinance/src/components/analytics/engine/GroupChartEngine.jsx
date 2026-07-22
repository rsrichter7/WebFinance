// ─── GroupChartEngine ───
// Tekenaar voor familie 'groep': groepeert transacties op config.dimensie en rendert
// staaf/donut/tabel. Categorie en soort hebben een vaste volgorde + kleur/icoonconfig
// (net als de oorspronkelijke vaste componenten); overige dimensies zijn datagedreven.

import React from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { CATEGORY_CONFIG } from '../../../data/categoryConfig'
import { CATEGORIES } from '../../../data/categories'
import { ICONS } from '../../ui/Icons'
import GroupChartBar from './GroupChartBar'
import GroupChartDonut from './GroupChartDonut'
import GroupChartTable from './GroupChartTable'
import { filterPeriode, filterByConfig, neutralColor } from './filterUtils'

const ALL_CATS = CATEGORIES.map(c => c.name)

const SOORT_DEFS = [
  { key: 'Noodzaak', colorKey: 'blue',   softKey: 'blueSoft',   target: 50 },
  { key: 'Wens',     colorKey: 'violet', softKey: 'violetSoft', target: 30 },
  { key: 'Sparen',   colorKey: 'green',  softKey: 'greenSoft',  target: 20 },
]

function berekenGroepen(transactions, dimensie, metric) {
  const totals = {}
  for (const t of transactions) {
    const key = t[dimensie] ?? ''
    if (!totals[key]) totals[key] = { som: 0, aantal: 0 }
    totals[key].som += t.bedrag
    totals[key].aantal += 1
  }
  return Object.entries(totals).map(([key, v]) => ({ key, value: metric === 'aantal' ? v.aantal : v.som }))
}

export default function GroupChartEngine({ config, allTransactions, period }) {
  const { T } = useTheme()
  const { dimensie, metric, grafiekvorm } = config
  const gefilterd = filterByConfig(filterPeriode(allTransactions, period), config.filters)
  const groepen   = berekenGroepen(gefilterd, dimensie, metric)
  const byKey     = Object.fromEntries(groepen.map(g => [g.key, g.value]))

  let items
  if (dimensie === 'categorie') {
    items = ALL_CATS
      .map(cat => {
        const cfg = CATEGORY_CONFIG[cat] || {}
        return {
          label: cat,
          value: byKey[cat] || 0,
          icon:  ICONS[cfg.icon],
          color: T[cfg.colorKey] || T.ink3,
          soft:  T[cfg.softKey] || T.rule,
        }
      })
      .sort((a, b) => b.value - a.value)
  } else if (dimensie === 'soort') {
    items = SOORT_DEFS.map(s => ({
      label:  s.key,
      value:  byKey[s.key] || 0,
      icon:   null,
      color:  T[s.colorKey],
      soft:   T[s.softKey],
      target: s.target,
    }))
  } else {
    items = groepen
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map((g, i) => ({
        label: g.key,
        value: g.value,
        icon:  null,
        color: neutralColor(T, i),
        soft:  T.rule,
      }))
  }

  if (grafiekvorm === 'donut') {
    const toonReferentie = dimensie === 'soort' && config.toonReferentie5030 === true
    return <GroupChartDonut items={items} metric={metric} toonReferentie={toonReferentie} />
  }
  if (grafiekvorm === 'tabel') {
    return <GroupChartTable items={items} metric={metric} />
  }
  return <GroupChartBar items={items} metric={metric} />
}
