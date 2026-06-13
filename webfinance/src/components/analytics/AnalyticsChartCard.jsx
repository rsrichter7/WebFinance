// ─── AnalyticsChartCard ───
// Card wrapper voor analysegrafieken: titel, periode-filter en drag handle.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import AnalyticsPeriodFilter, { initPeriod } from './AnalyticsPeriodFilter'

export default function AnalyticsChartCard({
  title, children, isDragging, isOver,
  onDragStart, onDragOver, onDrop, onDragEnd,
}) {
  const { T } = useTheme()
  const [period, setPeriod] = useState(initPeriod)

  return (
    <div
      draggable
      onDragStart={(e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart() }}
      onDragOver={(e) => { e.preventDefault(); onDragOver() }}
      onDrop={(e) => { e.preventDefault(); onDrop() }}
      onDragEnd={onDragEnd}
      style={{
        background: T.card, border: `${isOver ? 2 : 1}px solid ${isOver ? T.blue : T.border}`,
        borderRadius: 12, boxShadow: T.shadow, padding: 22, overflow: 'visible',
        opacity: isDragging ? 0.45 : 1, transition: 'border 0.12s, opacity 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18, gap: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <AnalyticsPeriodFilter value={period} onChange={setPeriod} />
          <div style={{ color: T.ink3, cursor: 'grab', display: 'inline-flex' }}>
            {ICONS.grip}
          </div>
        </div>
      </div>
      {children(period)}
    </div>
  )
}
