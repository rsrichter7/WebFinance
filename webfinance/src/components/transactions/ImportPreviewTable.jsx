// ─── ImportPreviewTable ───
// Preview-tabel voor CSV-import: selectie, categorie/soort/wie aanpassen per rij.

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt, TAB } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { getMergedCategories } from '../../data/categories'

const SOORTEN = ['Noodzaak', 'Wens', 'Sparen']

export default function ImportPreviewTable({ rows, onUpdate, profiles, customCategories, onAiHelp }) {
  const { T } = useTheme()
  const allCats = useMemo(() => getMergedCategories(customCategories), [customCategories])
  const selected = rows.filter(r => r.selected).length

  const STATUS_STYLE = {
    nieuw:      { color: T.greenText, bg: T.greenSoft,  label: 'Nieuw'      },
    duplicaat:  { color: T.amberText, bg: T.amberSoft,  label: 'Duplicaat'  },
    vaste_last: { color: T.blueText,  bg: T.blueSoft,   label: 'Vaste last' },
  }

  const selStyle = {
    padding: '4px 6px', borderRadius: 6, border: `1px solid ${T.border}`,
    background: T.card, fontSize: 12, color: T.ink, outline: 'none',
    fontFamily: "'Inter', system-ui, sans-serif", cursor: 'pointer', maxWidth: 145,
  }

  function toggleAll(val) { rows.forEach((_, i) => onUpdate(i, { selected: val })) }
  function selectOnlyNew() { rows.forEach((r, i) => onUpdate(i, { selected: r.status === 'nieuw' })) }
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
          <CtrlBtn onClick={() => toggleAll(true)} T={T}>Alles selecteren</CtrlBtn>
          <CtrlBtn onClick={() => toggleAll(false)} T={T}>Alles deselecteren</CtrlBtn>
          <CtrlBtn onClick={selectOnlyNew} T={T}>Alleen nieuwe</CtrlBtn>
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

      <StatusLegenda T={T} STATUS_STYLE={STATUS_STYLE} />
      <div style={{ maxHeight: 420, overflow: 'auto', border: `1px solid ${T.border}`, borderRadius: 10 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12.5 }}>
          <thead>
            <tr style={{ background: T.bg, position: 'sticky', top: 0, zIndex: 1 }}>
              <Th w={40} T={T}></Th>
              <Th w={100} T={T}>Datum</Th>
              <Th w={110} right T={T}>Bedrag</Th>
              <Th w={140} T={T}>Winkel / Bron</Th>
              <Th T={T}>Beschrijving</Th>
              <Th w={140} T={T}>Categorie</Th>
              <Th w={150} T={T}>Subcategorie</Th>
              <Th w={120} T={T}>Soort</Th>
              <Th w={100} T={T}>Wie</Th>
              <Th w={90} center T={T}>Status</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const catObj = allCats.find(c => c.name === row.categorie)
              const subs = catObj ? catObj.subs : []
              const isInvalid = row._invalid && row.selected
              const rowBg = isInvalid ? T.redSoft
                : row.status === 'duplicaat' ? T.amberSoft
                : row.status === 'vaste_last' ? T.blueSoft
                : T.card
              return (
                <tr
                  key={i}
                  data-invalid={isInvalid ? 'true' : undefined}
                  style={{ borderTop: `1px solid ${T.border}`, background: rowBg }}
                >
                  <Td center T={T}>
                    <input type="checkbox" checked={row.selected}
                      onChange={e => updateRow(i, 'selected', e.target.checked)}
                      style={{ cursor: 'pointer', width: 14, height: 14 }} />
                  </Td>
                  <Td T={T}><span style={TAB}>{row.datum}</span></Td>
                  <Td right T={T}>
                    <span style={{ ...TAB, color: row.type === 'Inkomst' ? T.green : T.ink, fontWeight: 500 }}>
                      {row.type === 'Uitgave' ? '−' : '+'}{fmt(row.bedrag)}
                    </span>
                  </Td>
                  <Td truncate={130} T={T}>{row.winkel || '—'}</Td>
                  <Td truncate={180} T={T}>{row.beschrijving || '—'}</Td>
                  <Td T={T}>
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
                  <Td T={T}>
                    <select value={row.subcategorie} onChange={e => updateRow(i, 'subcategorie', e.target.value)} style={selStyle} disabled={!row.categorie}>
                      <option value="">—</option>
                      {subs.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Td>
                  <Td T={T}>
                    <select value={row.soort} onChange={e => updateRow(i, 'soort', e.target.value)} style={selStyle}>
                      <option value="">—</option>
                      {SOORTEN.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </Td>
                  <Td T={T}>
                    <select value={row.wie} onChange={e => updateRow(i, 'wie', e.target.value)} style={selStyle}>
                      {profiles.map(p => <option key={p.initialen} value={p.initialen}>{p.initialen} — {p.naam}</option>)}
                    </select>
                  </Td>
                  <Td center T={T}>
                    <StatusBadge status={row.status} STATUS_STYLE={STATUS_STYLE} />
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

function Th({ children, w, center, right, T }) {
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

function Td({ children, center, right, truncate, T }) {
  return (
    <td style={{
      padding: '8px 12px',
      textAlign: center ? 'center' : right ? 'right' : 'left',
      maxWidth: truncate, overflow: truncate ? 'hidden' : undefined,
      textOverflow: truncate ? 'ellipsis' : undefined,
      whiteSpace: truncate ? 'nowrap' : undefined,
    }}>
      {children}
    </td>
  )
}

function StatusBadge({ status, STATUS_STYLE }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.nieuw
  return (
    <span style={{ fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 6, background: s.bg, color: s.color, whiteSpace: 'nowrap' }}>
      {s.label}
    </span>
  )
}

function StatusLegenda({ T, STATUS_STYLE }) {
  return (
    <div style={{ display: 'flex', gap: 20, marginBottom: 10, flexWrap: 'wrap' }}>
      <LegendaItem color={STATUS_STYLE.nieuw.color}      label="Nieuw"      desc="wordt geïmporteerd" />
      <LegendaItem color={STATUS_STYLE.duplicaat.color}  label="Duplicaat"  desc="mogelijk al eerder geïmporteerd (standaard uitgevinkt)" />
      <LegendaItem color={STATUS_STYLE.vaste_last.color} label="Vaste last" desc="gekoppeld aan bestaande vaste last" />
    </div>
  )
}

function LegendaItem({ color, label, desc }) {
  const { T } = useTheme()
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: T.ink3 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, flexShrink: 0 }} />
      <span style={{ fontWeight: 600, color: T.ink2 }}>{label}</span>
      <span>— {desc}</span>
    </div>
  )
}

function CtrlBtn({ children, onClick, T }) {
  return (
    <button onClick={onClick} style={{
      padding: '5px 10px', borderRadius: 6, border: `1px solid ${T.border}`,
      background: T.card, fontSize: 12, color: T.ink2, cursor: 'pointer', fontFamily: 'inherit',
    }}>
      {children}
    </button>
  )
}
