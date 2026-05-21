// ─── AnalyticsPage ───
// Analyse pagina: vier grafieken in een versleepbaar 2×2 grid + premium sectie.

import React, { useState } from 'react'
import useTransactions from '../hooks/useTransactions'
import usePremium from '../hooks/usePremium'
import AnalyticsTopBar         from '../components/analytics/AnalyticsTopBar'
import AnalyticsChartCard      from '../components/analytics/AnalyticsChartCard'
import AnalyticsTopCategories  from '../components/analytics/AnalyticsTopCategories'
import AnalyticsTopSubcategories from '../components/analytics/AnalyticsTopSubcategories'
import AnalyticsSoortDonut     from '../components/analytics/AnalyticsSoortDonut'
import AnalyticsIncomeExpense  from '../components/analytics/AnalyticsIncomeExpense'
import AnalyticsPremiumSection from '../components/analytics/AnalyticsPremiumSection'

const ORDER_KEY     = 'webfinance_analytics_order'
const DEFAULT_ORDER = ['categories', 'subcategories', 'soort', 'inkexp']

const CHART_DEFS = {
  categories:    { title: 'Top categorieën',          Component: AnalyticsTopCategories    },
  subcategories: { title: 'Top subcategorieën',       Component: AnalyticsTopSubcategories  },
  soort:         { title: 'Noodzaak / Wens / Sparen', Component: AnalyticsSoortDonut        },
  inkexp:        { title: 'Inkomsten vs Uitgaven',    Component: AnalyticsIncomeExpense      },
}

function loadOrder() {
  try {
    const s = localStorage.getItem(ORDER_KEY)
    if (s) {
      const parsed = JSON.parse(s)
      if (Array.isArray(parsed) && parsed.length === DEFAULT_ORDER.length) return parsed
    }
  } catch {}
  return DEFAULT_ORDER
}

export default function AnalyticsPage() {
  const { allTransactions } = useTransactions()
  const { isPremium } = usePremium()

  const [order,  setOrder]  = useState(loadOrder)
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)

  function handleDrop(targetId) {
    if (!dragId || dragId === targetId) return
    const next = [...order]
    const from = next.indexOf(dragId)
    const to   = next.indexOf(targetId)
    next.splice(from, 1)
    next.splice(to, 0, dragId)
    setOrder(next)
    localStorage.setItem(ORDER_KEY, JSON.stringify(next))
  }

  function endDrag() {
    setDragId(null)
    setOverId(null)
  }

  return (
    <>
      <AnalyticsTopBar />
      <div style={{
        flex: 1, overflow: 'auto', padding: 28,
        display: 'flex', flexDirection: 'column', gap: 20,
      }}>
        {/* 2×2 grafiekengrid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {order.map(id => {
            const { title, Component } = CHART_DEFS[id]
            return (
              <AnalyticsChartCard
                key={id}
                title={title}
                isPremium={isPremium}
                isDragging={dragId === id}
                isOver={overId === id && dragId !== id}
                onDragStart={() => setDragId(id)}
                onDragOver={() => setOverId(id)}
                onDrop={() => { handleDrop(id); endDrag() }}
                onDragEnd={endDrag}
              >
                {period => <Component allTransactions={allTransactions} period={period} />}
              </AnalyticsChartCard>
            )
          })}
        </div>

        <AnalyticsPremiumSection />
      </div>
    </>
  )
}
