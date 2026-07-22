// ─── GroupChartBar ───
// Horizontale staven voor familie 'groep' — icoonbadge bij een vaste iconconfig, anders een rangnummer.

import React from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { TAB, fmt } from '../../../tokens'

export default function GroupChartBar({ items, metric }) {
  const { T } = useTheme()
  const max = Math.max(...items.map(i => i.value), 1)
  const formatValue = (v) => metric === 'aantal' ? String(Math.round(v)) : fmt(v)

  if (items.length === 0) {
    return <div style={{ fontSize: 13, color: T.ink4, textAlign: 'center', padding: '32px 0' }}>Geen gegevens in deze periode</div>
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((item, i) => (
        <div key={item.label}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {item.icon ? (
                <span style={{ width: 24, height: 24, borderRadius: 6, background: item.soft, color: item.color, flexShrink: 0, display: 'grid', placeItems: 'center' }}>
                  {item.icon}
                </span>
              ) : (
                <span style={{ fontSize: 11.5, fontWeight: 600, color: T.ink4, width: 16, ...TAB }}>{i + 1}</span>
              )}
              <span style={{ fontSize: 13, color: T.ink2 }}>{item.label || '—'}</span>
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>{formatValue(item.value)}</span>
          </div>
          <div style={{ height: 7, background: T.rule, borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 4,
              width: `${item.value === 0 ? 0 : Math.max((item.value / max) * 100, 1.5)}%`,
              background: item.color, transition: 'width 0.35s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}
