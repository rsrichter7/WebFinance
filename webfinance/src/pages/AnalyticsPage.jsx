// ─── AnalyticsPage ───
// Analyse pagina: vier grafieken in een versleepbaar 2×2 grid + premium sectie.

import React, { useState, useEffect } from 'react'
import useTransactions from '../hooks/useTransactions'
import usePremium from '../hooks/usePremium'
import useSettings from '../hooks/useSettings'
import AnalyticsTopBar         from '../components/analytics/AnalyticsTopBar'
import AnalyticsChartCard      from '../components/analytics/AnalyticsChartCard'
import AnalyticsTopCategories  from '../components/analytics/AnalyticsTopCategories'
import AnalyticsTopSubcategories from '../components/analytics/AnalyticsTopSubcategories'
import AnalyticsSoortDonut     from '../components/analytics/AnalyticsSoortDonut'
import AnalyticsIncomeExpense  from '../components/analytics/AnalyticsIncomeExpense'
import AnalyticsPremiumSection from '../components/analytics/AnalyticsPremiumSection'

const DEFAULT_ORDER = ['categories', 'subcategories', 'soort', 'inkexp']

const CHART_DEFS = {
  categories:    { title: 'Top categorieën',          Component: AnalyticsTopCategories    },
  subcategories: { title: 'Top subcategorieën',       Component: AnalyticsTopSubcategories  },
  soort:         { title: 'Noodzaak / Wens / Sparen', Component: AnalyticsSoortDonut        },
  inkexp:        { title: 'Inkomsten vs Uitgaven',    Component: AnalyticsIncomeExpense      },
}

export default function AnalyticsPage() {
  const { allTransactions, loading: txLoading } = useTransactions()
  const { isPremium } = usePremium()
  const { settings, loading: settingsLoading, updateSetting } = useSettings()

  const [order,  setOrder]  = useState(DEFAULT_ORDER)
  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)

  useEffect(() => {
    if (!settingsLoading && Array.isArray(settings.analytics_order) && settings.analytics_order.length === DEFAULT_ORDER.length) {
      setOrder(settings.analytics_order)
    }
  }, [settingsLoading, settings.analytics_order])

  function handleDrop(targetId) {
    if (!dragId || dragId === targetId) return
    const next = [...order]
    const from = next.indexOf(dragId)
    const to   = next.indexOf(targetId)
    next[from] = targetId
    next[to]   = dragId
    setOrder(next)
    updateSetting('analytics_order', next)
  }

  function endDrag() {
    setDragId(null)
    setOverId(null)
  }

  if (txLoading) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6B7280', fontSize: 14, fontFamily: "'Inter', sans-serif" }}>
        Analyse laden…
      </div>
    )
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
