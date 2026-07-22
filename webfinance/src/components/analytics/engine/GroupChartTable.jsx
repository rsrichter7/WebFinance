// ─── GroupChartTable ───
// Eenvoudige tabelweergave voor familie 'groep': groepwaarde + bedrag/aantal, aflopend gesorteerd.

import React from 'react'
import { useTheme } from '../../../hooks/useTheme'
import { TAB, fmt } from '../../../tokens'

export default function GroupChartTable({ items, metric }) {
  const { T } = useTheme()
  const formatValue = (v) => metric === 'aantal' ? String(Math.round(v)) : fmt(v)

  if (items.length === 0) {
    return <div style={{ fontSize: 13, color: T.ink4, textAlign: 'center', padding: '32px 0' }}>Geen gegevens in deze periode</div>
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
      <tbody>
        {items.map(item => (
          <tr key={item.label} style={{ borderBottom: `1px solid ${T.rule}` }}>
            <td style={{ padding: '8px 0', color: T.ink2 }}>{item.label || '—'}</td>
            <td style={{ padding: '8px 0', textAlign: 'right', fontWeight: 600, color: T.ink, ...TAB }}>{formatValue(item.value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
