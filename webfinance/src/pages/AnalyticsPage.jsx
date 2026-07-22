// ─── AnalyticsPage ───
// Analyse pagina: database-gedreven analyses in een versleepbaar grid.

import React, { useState } from 'react'
import useTransactions from '../hooks/useTransactions'
import useCustomAnalyses from '../hooks/useCustomAnalyses'
import AnalyticsTopBar    from '../components/analytics/AnalyticsTopBar'
import AnalyticsChartCard from '../components/analytics/AnalyticsChartCard'
import AnalysisChart      from '../components/analytics/engine/AnalysisChart'
import ConfirmDialog      from '../components/ui/ConfirmDialog'

export default function AnalyticsPage() {
  const { allTransactions, loading: txLoading } = useTransactions()
  const { analyses, loading: analysesLoading, herordenAnalyses, verwijderAnalyse } = useCustomAnalyses()

  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const [teVerwijderen, setTeVerwijderen] = useState(null)

  function handleDrop(targetId) {
    if (!dragId || dragId === targetId) return
    const ids  = analyses.map(a => a.id)
    const from = ids.indexOf(dragId)
    const to   = ids.indexOf(targetId)
    const next = [...ids]
    next[from] = targetId
    next[to]   = dragId
    herordenAnalyses(next)
  }

  function endDrag() {
    setDragId(null)
    setOverId(null)
  }

  if (txLoading || analysesLoading) {
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
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {analyses.map(analyse => (
            <AnalyticsChartCard
              key={analyse.id}
              title={analyse.naam}
              isDragging={dragId === analyse.id}
              isOver={overId === analyse.id && dragId !== analyse.id}
              onDragStart={() => setDragId(analyse.id)}
              onDragOver={() => setOverId(analyse.id)}
              onDrop={() => { handleDrop(analyse.id); endDrag() }}
              onDragEnd={endDrag}
              onDelete={() => setTeVerwijderen(analyse)}
            >
              {period => (
                <AnalysisChart
                  familie={analyse.familie}
                  config={analyse.config}
                  allTransactions={allTransactions}
                  period={period}
                />
              )}
            </AnalyticsChartCard>
          ))}
        </div>
      </div>

      <ConfirmDialog
        open={!!teVerwijderen}
        title="Analyse verwijderen"
        message={`Weet je zeker dat je "${teVerwijderen?.naam}" wilt verwijderen?`}
        onConfirm={() => { verwijderAnalyse(teVerwijderen.id); setTeVerwijderen(null) }}
        onClose={() => setTeVerwijderen(null)}
      />
    </>
  )
}
