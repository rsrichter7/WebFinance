// ─── TransactionTable ───
// Tabel met alle transacties. Sortering wordt afgehandeld door useTransactions.
// Dit component ontvangt alleen data en callbacks via props.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { PERSONEN } from '../../data/categories'

const MONTHS_NL = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return `${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`
}

function SortHeader({ label, field, sort, onSort }) {
  const active = sort.field === field
  const arrow = active ? (sort.dir === 'asc' ? ' ↑' : ' ↓') : ' ↕'
  return (
    <th
      onClick={() => onSort(field)}
      style={{
        padding: '11px 16px', fontSize: 11, fontWeight: 600,
        color: active ? T.ink : T.ink4, background: T.cardAlt,
        textAlign: 'left', cursor: 'pointer', userSelect: 'none',
        whiteSpace: 'nowrap', letterSpacing: 0.3, textTransform: 'uppercase',
        borderBottom: `1px solid ${T.border}`,
      }}
    >
      {label}{arrow}
    </th>
  )
}

function SoortBadge({ soort }) {
  const styles = {
    Noodzaak: { bg: T.rule, color: T.ink3 },
    Wens: { bg: T.blueSoft, color: T.blueText },
    Sparen: { bg: T.greenSoft, color: T.greenText },
  }
  const s = styles[soort] || styles.Noodzaak
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px',
      borderRadius: 4, background: s.bg, color: s.color,
    }}>
      {soort}
    </span>
  )
}

function WieAvatar({ initials }) {
  const person = PERSONEN.find(p => p.initials === initials)
  const color = person ? person.color : { bg: T.rule, fg: T.ink3 }
  return (
    <div style={{
      width: 26, height: 26, borderRadius: '50%',
      background: color.bg, color: color.fg,
      display: 'grid', placeItems: 'center',
      fontSize: 10, fontWeight: 600, flexShrink: 0,
    }}>
      {initials}
    </div>
  )
}

export default function TransactionTable({ transactions, sort, onSort, onDelete, count }) {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, boxShadow: T.shadow, overflow: 'hidden',
    }}>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <SortHeader label="Datum" field="datum" sort={sort} onSort={onSort} />
              <SortHeader label="Bedrag" field="bedrag" sort={sort} onSort={onSort} />
              <SortHeader label="Omschrijving" field="omschrijving" sort={sort} onSort={onSort} />
              <th style={{ padding: '11px 16px', fontSize: 11, fontWeight: 600, color: T.ink4, background: T.cardAlt, textAlign: 'left', letterSpacing: 0.3, textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>Categorie</th>
              <th style={{ padding: '11px 16px', fontSize: 11, fontWeight: 600, color: T.ink4, background: T.cardAlt, textAlign: 'left', letterSpacing: 0.3, textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>Winkel / Bron</th>
              <th style={{ padding: '11px 16px', fontSize: 11, fontWeight: 600, color: T.ink4, background: T.cardAlt, textAlign: 'left', letterSpacing: 0.3, textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>Soort</th>
              <th style={{ padding: '11px 16px', fontSize: 11, fontWeight: 600, color: T.ink4, background: T.cardAlt, textAlign: 'left', letterSpacing: 0.3, textTransform: 'uppercase', borderBottom: `1px solid ${T.border}` }}>Wie</th>
              <th style={{ padding: '11px 16px', fontSize: 11, background: T.cardAlt, borderBottom: `1px solid ${T.border}`, width: 50 }} />
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx, i) => (
              <tr
                key={tx.id}
                style={{ background: i % 2 === 1 ? T.cardAlt : T.card }}
                onMouseEnter={e => e.currentTarget.querySelector('.del-btn').style.opacity = 1}
                onMouseLeave={e => e.currentTarget.querySelector('.del-btn').style.opacity = 0}
              >
                <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}`, whiteSpace: 'nowrap', color: T.ink3 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                    {formatDate(tx.datum)}
                    {tx.bron === 'auto' && (
                      <span style={{
                        fontSize: 10, fontWeight: 600, padding: '1px 6px',
                        borderRadius: 4, background: T.violetSoft, color: T.violet,
                        letterSpacing: 0.3,
                      }}>
                        AUTO
                      </span>
                    )}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}`, whiteSpace: 'nowrap', fontWeight: 600, color: T.ink, ...TAB }}>
                  <span style={{ color: tx.type === 'Inkomst' ? T.green : T.ink4, marginRight: 4, fontSize: 11 }}>
                    {tx.type === 'Inkomst' ? '↑' : '↓'}
                  </span>
                  {fmt(tx.bedrag)}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}`, fontWeight: 500, color: T.ink }}>
                  {tx.omschrijving}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}` }}>
                  <div style={{ color: T.ink2 }}>{tx.categorie}</div>
                  <div style={{ color: T.ink4, fontSize: 11.5 }}>{tx.sub}</div>
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}`, color: T.ink4 }}>
                  {tx.winkel}
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}` }}>
                  <SoortBadge soort={tx.soort} />
                </td>
                <td style={{ padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}` }}>
                  <WieAvatar initials={tx.wie} />
                </td>
                <td style={{ padding: '12px 16px', borderBottom: `1px solid ${T.rule}` }}>
                  <button
                    className="del-btn"
                    onClick={() => onDelete(tx.id)}
                    style={{
                      border: 'none', background: 'transparent',
                      padding: 5, borderRadius: 6, cursor: 'pointer',
                      color: T.ink4, display: 'inline-flex', opacity: 0,
                      transition: 'opacity 0.15s, color 0.15s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = T.red}
                    onMouseLeave={e => e.currentTarget.style.color = T.ink4}
                  >
                    {ICONS.trash}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{
        padding: '12px 16px', borderTop: `1px solid ${T.border}`,
        fontSize: 13, color: T.ink3, background: T.cardAlt,
      }}>
        {count} transactie{count !== 1 ? 's' : ''}
      </div>
    </div>
  )
}
