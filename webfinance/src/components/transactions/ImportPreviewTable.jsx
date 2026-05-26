// ─── ImportPreviewTable ───
// Preview-tabel voor CSV-import: selectie, categorie/soort/wie aanpassen per rij.

import React, { useMemo } from 'react'
import { T, fmt, TAB } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { getMergedCategories } from '../../data/categories'

const SOORTEN = ['Noodzaak', 'Wens', 'Sparen']

const STATUS_STYLE = {
  nieuw:      { color: T.greenText, bg: T.greenSoft,  label: 'Nieuw'      },
  duplicaat:  { color: T.amberText, bg: T.amberSoft,  label: 'Duplicaat'  },
  vaste_last: { color: T.blueText,  bg: T.blueSoft,   label: 'Vaste last' },
}

export default function ImportPreviewTable({ rows, onUpdate, profiles, customCategories, onAiHelp }) {
  const allCats = useMemo(() => getMergedCategories(customCategories), [customCategories])
  const selected = rows.filter(r => r.selected).length

  function toggleAll(val) {
    rows.forEach((_, i) => onUpdate(i, { selected: val }))
  }
  function selectOnlyNew() {
    rows.forEach((r, i) => onUpdate(i, { selected: r.status === 'nieuw' }))
  }
  function updateRow(i, field, value) {
    const updates = { [field]: value, _aiTagged: false }
    if (field === 'categorie') updates.subcategorie = ''
    onUpdate(i, updates)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ fontSize: 13, color: T.ink2, fontWeight: 500 }}>
          {selected} van {rows.length} geselecteerd
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <CtrlBtn onClick={() => toggleAll(true)}>Alles selecteren</CtrlBtn>
          <CtrlBtn onClick={() => toggleAll(false)}>Alles deselecteren</CtrlBtn>
          <CtrlBtn onClick={selectOnlyNew}>Alleen nieuwe</CtrlBtn>
          <div style={{ width: 1, height: 20, background: T.border, margin: '0 4px' }} />
          <button onClick={onAiHelp} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 12px', borderRadius: 6,
            border: `1px solid ${T.violet}`, background: T.violetSoft,
            fontSize: 12, color: T.violet, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
          }}>
            <span style={{ display: 'inline-flex' }}>{ICONS.sparkle}</span>
            AI-hulp voor categorisering
          </button>
        </div>
      </div>

      <div style={{ maxHeight: 420, overflow: 'auto', border: `1px solid ${T.border}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: T.bg, position: 'sticky', top: 0, zIndex: 1 }}>
              <Th w={40}></Th>
              <Th w={100}>Datum</Th>
              <Th w={110} right>Bedrag</Th>
              <Th w={140}>Winkel / Bron</Th>
              <Th>Beschrijving</Th>
              <Th w={140}>Categorie</Th>
              <Th w={150}>Subcategorie</Th>
              <Th w={120}>Soort</Th>
              <Th w={100}>Wie</Th>
              <Th w={90} center>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const catObj = allCats.find(c => c.name === row.categorie)
              const subs = catObj ? catObj.subs : []
              const isDup = row.status === 'duplicaat'
              const isInvalid = row._invalid && row.selected
              return (
                <tr
                  key={i}
                  data-invalid={isInvalid ? 'true' : undefined}
                  style={{ opacity: isDup ? 0.5 : 1, borderTop: `1px solid ${T.border}`, background: isInvalid ? T.redSoft : T.card }}
                >
                  <Td center>
                    <input
                      type="checkbox"
                      checked={row.selected}
                      onChange={e => updateRow(i, 'selected', e.target.checked)}
                      style={{ cursor: 'pointer', width: 14, height: 14 }}
                    />
                  </Td>
                  <Td><span style={TAB}>{row.datum}</span></Td>
                  <Td right>
                    <span style={{ ...TAB, color: row.type === 'Inkomst' ? T.green : T.ink, fontWeight: 500 }}>
                      {row.type === 'Uitgave' ? '−' : '+'}{fmt(row.bedrag)}
                    </span>
                  </Td>
                  <Td truncate={130}>{row.winkel || '—'}</Td>
                  <Td truncate={180}>{row.beschrijving || '—'}</Td>
                  <Td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {row._aiTagged && (
                        <span title="Gesuggereerd door AI" style={{ color: T.violet, display: 'inline-flex', flexShrink: 0 }}>{ICONS.sparkle}</span>
                      )}
                      <select value={row.categorie} onChange={e => updateRow(i, 'categorie', e.target.value)} style={selStyle}>
                        <option value="">—</option>
                        {allCats.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                  </Td>
                  <Td>
                    <select value={row.subcategorie} onChange={e => updateRow(i, 'subcategorie', e.target.value)} style={selStyle} disabled={!row.categorie}>
                      <option value="">—</option>
                      {subs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Td>
                  <Td>
                    <select value={row.soort} onChange={e => updateRow(i, 'soort', e.target.value)} style={selStyle}>
                      <option value="">—</option>
                      {SOORTEN.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Td>
                  <Td>
                    <select value={row.wie} onChange={e => updateRow(i, 'wie', e.target.value)} style={selStyle}>
                      {profiles.map(p => (
                        <option key={p.initialen} value={p.initialen}>{p.initialen} — {p.naam}</option>
                      ))}
                    </select>
                  </Td>
                  <Td center>
                    <StatusBadge status={row.status} />
                  </Td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Th({ children, w, center, right }) {
  return (
    <th style={{
      padding: '9px 12px',
      textAlign: center ? 'center' : right ? 'right' : 'left',
      fontSize: 11.5, fontWeight: 600, color: T.ink3, letterSpacing: 0.3,
      whiteSpace: 'nowrap', width: w, borderBottom: `1px solid ${T.border}`,
    }}>
      {children}
    </th>
  )
}

function Td({ children, center, right, truncate }) {
  return (
    <td style={{
      padding: '8px 12px',
      textAlign: center ? 'center' : right ? 'right' : 'left',
      maxWidth: truncate,
      overflow: truncate ? 'hidden' : undefined,
      textOverflow: truncate ? 'ellipsis' : undefined,
      whiteSpace: truncate ? 'nowrap' : undefined,
    }}>
      {children}
    </td>
  )
}

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.nieuw
  return (
    <span style={{
      fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
      background: s.bg, color: s.color, whiteSpace: 'nowrap',
    }}>
      {s.label}
    </span>
  )
}

function CtrlBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 10px', borderRadius: 6, border: `1px solid ${T.border}`,
      background: T.card, fontSize: 12, color: T.ink2, cursor: 'pointer',
      fontFamily: 'inherit',
    }}>
      {children}
    </button>
  )
}

const selStyle = {
  padding: '4px 6px', borderRadius: 6, border: `1px solid ${T.border}`,
  background: T.card, fontSize: 12, color: T.ink, outline: 'none',
  fontFamily: "'Inter', system-ui, sans-serif", cursor: 'pointer', maxWidth: 145,
}
