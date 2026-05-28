// ─── AnalyticsChartCard ───
// Card wrapper voor analysegrafieken: titel, periode-filter en drag handle.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import AnalyticsPeriodFilter, { initPeriod } from './AnalyticsPeriodFilter'

export default function AnalyticsChartCard({
  title, children, isPremium, isDragging, isOver,
  onDragStart, onDragOver, onDrop, onDragEnd,
}) {
  const { T } = useTheme()
  const [period, setPeriod] = useState(initPeriod)
  const [tipVisible, setTipVisible] = useState(false)

  return (
    <div
      draggable={isPremium}
      onDragStart={isPremium ? (e) => { e.dataTransfer.effectAllowed = 'move'; onDragStart() } : undefined}
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
          <div
            style={{ color: isPremium ? T.ink3 : T.ink4, cursor: isPremium ? 'grab' : 'not-allowed', display: 'inline-flex', position: 'relative' }}
            onMouseEnter={() => !isPremium && setTipVisible(true)}
            onMouseLeave={() => setTipVisible(false)}
          >
            {ICONS.grip}
            {tipVisible && (
              <div style={{
                position: 'absolute', top: 26, right: 0,
                background: T.ink, color: '#fff',
                fontSize: 11.5, padding: '5px 10px', borderRadius: 6, whiteSpace: 'nowrap',
                zIndex: 99, boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              }}>
                Premium: grafieken herordenen
              </div>
            )}
          </div>
        </div>
      </div>
      {children(period)}
    </div>
  )
}
