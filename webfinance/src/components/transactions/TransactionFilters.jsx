// ─── TransactionFilters ───
// Zoekbalk, filterdropdowns en totaalbadges.
// Alle filterlogica leeft in useTransactions — dit component toont alleen de UI.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { CATEGORIES, SOORTEN, PERSONEN } from '../../data/categories'

const MAANDEN = [
  { value: '', label: 'Alle maanden' },
  { value: '0', label: 'Januari' }, { value: '1', label: 'Februari' },
  { value: '2', label: 'Maart' }, { value: '3', label: 'April' },
  { value: '4', label: 'Mei' }, { value: '5', label: 'Juni' },
  { value: '6', label: 'Juli' }, { value: '7', label: 'Augustus' },
  { value: '8', label: 'September' }, { value: '9', label: 'Oktober' },
  { value: '10', label: 'November' }, { value: '11', label: 'December' },
]

function FilterSelect({ value, onChange, options, width = 140 }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        padding: '7px 12px', borderRadius: 8,
        border: `1px solid ${T.border}`, background: T.card,
        fontSize: 13, color: T.ink, cursor: 'pointer',
        outline: 'none', fontFamily: 'inherit', width,
      }}
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  )
}

export default function TransactionFilters({ filters, updateFilter, totals }) {
  return (
    <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* Zoekbalk + filters */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Zoekbalk */}
        <div style={{ position: 'relative', flex: '0 0 280px' }}>
          <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.ink4, display: 'inline-flex' }}>
            {ICONS.search}
          </span>
          <input
            type="text"
            placeholder="Zoek op omschrijving of winkel..."
            value={filters.search}
            onChange={e => updateFilter('search', e.target.value)}
            style={{
              width: '100%', padding: '7px 12px 7px 34px', borderRadius: 8,
              border: `1px solid ${T.border}`, background: T.card,
              fontSize: 13, color: T.ink, outline: 'none', fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Type */}
        <FilterSelect
          value={filters.type}
          onChange={v => updateFilter('type', v)}
          options={[
            { value: '', label: 'Type: Alles' },
            { value: 'Uitgave', label: 'Uitgave' },
            { value: 'Inkomst', label: 'Inkomst' },
          ]}
          width={130}
        />

        {/* Categorie */}
        <FilterSelect
          value={filters.categorie}
          onChange={v => updateFilter('categorie', v)}
          options={[
            { value: '', label: 'Categorie: Alle' },
            ...CATEGORIES.map(c => ({ value: c.name, label: c.name })),
          ]}
          width={180}
        />

        {/* Soort */}
        <FilterSelect
          value={filters.soort}
          onChange={v => updateFilter('soort', v)}
          options={[
            { value: '', label: 'Soort: Alles' },
            ...SOORTEN.map(s => ({ value: s, label: s })),
          ]}
          width={140}
        />

        {/* Wie */}
        <FilterSelect
          value={filters.wie}
          onChange={v => updateFilter('wie', v)}
          options={[
            { value: '', label: 'Wie: Iedereen' },
            ...PERSONEN.map(p => ({ value: p.initials, label: p.name })),
          ]}
          width={160}
        />

        {/* Maand */}
        <FilterSelect
          value={filters.maand}
          onChange={v => updateFilter('maand', v)}
          options={MAANDEN}
          width={140}
        />
      </div>

      {/* Totalen badges */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <div style={{
          padding: '6px 14px', background: T.card, borderRadius: 8,
          border: `1px solid ${T.border}`, fontSize: 13, boxShadow: T.shadow,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: T.ink4 }}>Uitgaven</span>
          <span style={{ fontWeight: 600, color: T.red, ...TAB }}>{fmt(totals.uitgaven)}</span>
        </div>

        <div style={{
          padding: '6px 14px', background: T.card, borderRadius: 8,
          border: `1px solid ${T.border}`, fontSize: 13, boxShadow: T.shadow,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: T.ink4 }}>Inkomsten</span>
          <span style={{ fontWeight: 600, color: T.green, ...TAB }}>{fmt(totals.inkomsten)}</span>
        </div>

        <div style={{
          padding: '6px 14px', background: T.card, borderRadius: 8,
          border: `1px solid ${T.border}`, fontSize: 13, boxShadow: T.shadow,
          display: 'flex', alignItems: 'center', gap: 6,
        }}>
          <span style={{ color: T.ink4 }}>Saldo</span>
          <span style={{ fontWeight: 600, color: totals.saldo >= 0 ? T.green : T.red, ...TAB }}>
            {totals.saldo >= 0 ? '+' : ''}{fmt(totals.saldo)}
          </span>
        </div>
      </div>
    </div>
  )
}
