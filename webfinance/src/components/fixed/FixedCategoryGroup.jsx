// ─── FixedCategoryGroup ───
// Gegroepeerde tabel per hoofdcategorie voor vaste lasten.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'

const COLS = '1.4fr 120px 110px 1fr 100px 70px'

export default function FixedCategoryGroup({ icon, title, color, colorSoft, items, subtotal, onEdit, onRemove }) {
  const ico = ICONS[icon] || ICONS.grip

  return (
    <Card style={{ padding: 0, overflow: 'visible', minHeight: 'auto' }}>

      {/* Categorie header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px', borderBottom: `1px solid ${T.border}`,
        background: T.cardAlt,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: colorSoft, display: 'grid', placeItems: 'center', color,
        }}>
          {ico}
        </div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.ink }}>{title}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>
          {fmt(subtotal)}
          <span style={{ fontSize: 11, fontWeight: 400, color: T.ink3 }}> / maand</span>
        </div>
      </div>

      {/* Kolomkoppen */}
      <div style={{
        display: 'grid', gridTemplateColumns: COLS,
        padding: '10px 18px', borderBottom: `1px solid ${T.rule}`,
        fontSize: 11, fontWeight: 500, color: T.ink4, letterSpacing: 0.3, textTransform: 'uppercase',
      }}>
        <div>Omschrijving</div>
        <div style={{ textAlign: 'right' }}>Bedrag</div>
        <div>Herhaling</div>
        <div>Subcategorie</div>
        <div>Winkel / Bron</div>
        <div />
      </div>

      {/* Rijen met zebra-striping */}
      {items.map((item, i) => (
        <div key={item.id} style={{
          display: 'grid', gridTemplateColumns: COLS,
          padding: '12px 18px', alignItems: 'center',
          background: i % 2 === 1 ? T.cardAlt : T.card,
          borderBottom: i === items.length - 1 ? 'none' : `1px solid ${T.rule}`,
          fontSize: 13.5,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: item.type === 'Inkomst' ? T.green : T.ink4, display: 'inline-flex' }}>
              {item.type === 'Inkomst' ? ICONS.arrUp : ICONS.arrDown}
            </span>
            <span style={{ fontWeight: 500, color: T.ink }}>{item.omschrijving}</span>
          </div>
          <div style={{ textAlign: 'right', fontWeight: 500, color: T.ink, ...TAB }}>
            {item.type === 'Inkomst' ? '+' : '−'} {fmt(item.bedrag)}
          </div>
          <div style={{ color: T.ink3, fontSize: 12.5 }}>{item.herhaling}</div>
          <div style={{ color: T.ink3, fontSize: 12.5 }}>{item.sub}</div>
          <div style={{ color: T.ink4, fontSize: 12.5 }}>{item.winkel || '—'}</div>
          <div style={{ display: 'inline-flex', gap: 4, justifyContent: 'flex-end', color: T.ink4 }}>
            <button
              onClick={() => onEdit(item)}
              style={{ border: 'none', background: 'transparent', padding: 5, borderRadius: 6, cursor: 'pointer', color: 'inherit', display: 'inline-flex' }}
            >
              {ICONS.edit}
            </button>
            <button
              onClick={() => onRemove(item.id)}
              style={{ border: 'none', background: 'transparent', padding: 5, borderRadius: 6, cursor: 'pointer', color: 'inherit', display: 'inline-flex' }}
            >
              {ICONS.trash}
            </button>
          </div>
        </div>
      ))}
    </Card>
  )
}