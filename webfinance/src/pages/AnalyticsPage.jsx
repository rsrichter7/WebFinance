// ─── AnalyticsPage ───
// Analyse pagina: database-gedreven analyses in een versleepbaar grid, met eigen analyses toevoegen/bewerken.

import React, { useState } from 'react'
import { useTheme } from '../hooks/useTheme'
import useTransactions from '../hooks/useTransactions'
import useCustomAnalyses from '../hooks/useCustomAnalyses'
import AnalyticsTopBar      from '../components/analytics/AnalyticsTopBar'
import AnalyticsChartCard   from '../components/analytics/AnalyticsChartCard'
import AnalysisChart        from '../components/analytics/engine/AnalysisChart'
import CustomAnalysisForm   from '../components/analytics/CustomAnalysisForm'
import ConfirmDialog        from '../components/ui/ConfirmDialog'
import { ICONS } from '../components/ui/Icons'

export default function AnalyticsPage() {
  const { T } = useTheme()
  const { allTransactions, loading: txLoading } = useTransactions()
  const {
    analyses, loading: analysesLoading,
    herordenAnalyses, verwijderAnalyse, voegAnalyseToe, wijzigAnalyse,
  } = useCustomAnalyses()

  const [dragId, setDragId] = useState(null)
  const [overId, setOverId] = useState(null)
  const [teVerwijderen, setTeVerwijderen] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [editingAnalyse, setEditingAnalyse] = useState(null)

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

  function openNieuweAnalyse() {
    setEditingAnalyse(null)
    setFormOpen(true)
  }

  function openBewerkAnalyse(analyse) {
    setEditingAnalyse(analyse)
    setFormOpen(true)
  }

  function handleSaveAnalyse(data, isEdit) {
    if (isEdit) wijzigAnalyse(editingAnalyse.id, data)
    else voegAnalyseToe(data)
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
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={openNieuweAnalyse} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: 'none', background: T.blue, color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
          }}>
            <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span>
            Nieuwe analyse
          </button>
        </div>

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
              onEdit={() => openBewerkAnalyse(analyse)}
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

      <CustomAnalysisForm
        open={formOpen}
        editingAnalyse={editingAnalyse}
        onClose={() => setFormOpen(false)}
        onSave={handleSaveAnalyse}
      />

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
