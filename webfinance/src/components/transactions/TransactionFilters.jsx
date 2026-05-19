// ─── TransactionFilters ───
// Zoekbalk, filterdropdowns en totaalbadges.
// Alle filterlogica leeft in useTransactions — dit component toont alleen de UI.

import React, { useState, useRef, useEffect } from 'react'
import { T, TAB, fmt } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { CATEGORIES, SOORTEN, PERSONEN } from '../../data/categories'

const MAANDEN = [
  { value: '0', label: 'Januari' }, { value: '1', label: 'Februari' },
  { value: '2', label: 'Maart' }, { value: '3', label: 'April' },
  { value: '4', label: 'Mei' }, { value: '5', label: 'Juni' },
  { value: '6', label: 'Juli' }, { value: '7', label: 'Augustus' },
  { value: '8', label: 'September' }, { value: '9', label: 'Oktober' },
  { value: '10', label: 'November' }, { value: '11', label: 'December' },
]

// ─── Herbruikbare custom dropdown (zelfde stijl als CategoryDropdown) ───
function CustomDropdown({ label, value, allLabel, options, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Sluit dropdown bij klik erbuiten
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Label op de knop
  const activeOption = options.find(o => o.value === value)
  const buttonLabel = activeOption ? activeOption.label : allLabel

  function select(val) {
    onChange(val)
    setOpen(false)
  }

  const itemStyle = (isActive) => ({
    padding: '8px 14px',
    fontSize: 13,
    color: isActive ? T.blue : T.ink,
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    borderRadius: 6,
    background: isActive ? T.blueSoft : 'transparent',
  })

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: '7px 12px', borderRadius: 8,
          border: `1px solid ${open ? T.blue : T.border}`,
          background: T.card,
          fontSize: 13, color: value ? T.ink : T.ink3,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          whiteSpace: 'nowrap',
        }}
      >
        <span>{buttonLabel}</span>
        <span style={{ fontSize: 10, color: T.ink4, flexShrink: 0 }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4,
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, boxShadow: '0 8px 24px rgba(17,24,39,0.10)',
          minWidth: 180, zIndex: 50, overflow: 'hidden',
        }}>
          <div style={{ padding: '6px 6px' }}>
            {/* "Alles" optie */}
            <div
              onClick={() => select('')}
              onMouseEnter={e => e.currentTarget.style.background = T.rule}
              onMouseLeave={e => e.currentTarget.style.background = !value ? T.blueSoft : 'transparent'}
              style={itemStyle(!value)}
            >
              {allLabel}
            </div>

            <div style={{ height: 1, background: T.rule, margin: '4px 0' }} />

            {/* Opties */}
            {options.map(o => (
              <div
                key={o.value}
                onClick={() => select(o.value)}
                onMouseEnter={e => e.currentTarget.style.background = T.rule}
                onMouseLeave={e => e.currentTarget.style.background = value === o.value ? T.blueSoft : 'transparent'}
                style={itemStyle(value === o.value)}
              >
                {o.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Twee-staps categorie dropdown ───
function CategoryDropdown({ categorie, subcategorie, onCategorieChange, onSubChange }) {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState('main')
  const ref = useRef(null)

  // Sluit dropdown bij klik erbuiten
  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false)
        setView('main')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  // Huidige geselecteerde categorie-object
  const activeCat = CATEGORIES.find(c => c.name === categorie)

  // Label voor de knop
  const buttonLabel = subcategorie
    ? `${categorie} › ${subcategorie}`
    : categorie || 'Categorie: Alle'

  // Klik op een hoofdcategorie → toon subcategorieën
  function selectCategory(catName) {
    setView(catName)
  }

  // Klik op "Alle [categorie]" → filter alleen op hoofdcategorie
  function selectCategoryOnly(catName) {
    onCategorieChange(catName)
    onSubChange('')
    setOpen(false)
    setView('main')
  }

  // Klik op een subcategorie → filter op subcategorie
  function selectSub(catName, subName) {
    onCategorieChange(catName)
    onSubChange(subName)
    setOpen(false)
    setView('main')
  }

  // Alles wissen
  function clearAll() {
    onCategorieChange('')
    onSubChange('')
    setOpen(false)
    setView('main')
  }

  // Terug naar hoofdmenu
  function goBack() {
    setView('main')
  }

  // Welke categorie wordt getoond in submenu?
  const subCat = CATEGORIES.find(c => c.name === view)

  const itemStyle = (isActive) => ({
    padding: '8px 14px',
    fontSize: 13,
    color: isActive ? T.blue : T.ink,
    fontWeight: isActive ? 600 : 400,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 6,
    background: isActive ? T.blueSoft : 'transparent',
  })

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* Trigger knop */}
      <button
        onClick={() => { setOpen(!open); setView('main') }}
        style={{
          padding: '7px 12px', borderRadius: 8,
          border: `1px solid ${open ? T.blue : T.border}`,
          background: T.card,
          fontSize: 13, color: categorie ? T.ink : T.ink3,
          cursor: 'pointer', fontFamily: 'inherit',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {buttonLabel}
        </span>
        <span style={{ fontSize: 10, color: T.ink4, flexShrink: 0 }}>▼</span>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: 4,
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 10, boxShadow: '0 8px 24px rgba(17,24,39,0.10)',
          minWidth: 220, zIndex: 50, overflow: 'hidden',
        }}>
          {view === 'main' ? (
            // ─── Hoofdcategorieën ───
            <div style={{ padding: '6px 6px' }}>
              {/* Alles wissen optie */}
              <div
                onClick={clearAll}
                onMouseEnter={e => e.currentTarget.style.background = T.rule}
                onMouseLeave={e => e.currentTarget.style.background = !categorie ? T.blueSoft : 'transparent'}
                style={itemStyle(!categorie)}
              >
                Alle categorieën
              </div>

              {/* Scheidingslijn */}
              <div style={{ height: 1, background: T.rule, margin: '4px 0' }} />

              {/* Categorieën */}
              {CATEGORIES.map(c => (
                <div
                  key={c.name}
                  onClick={() => selectCategory(c.name)}
                  onMouseEnter={e => e.currentTarget.style.background = T.rule}
                  onMouseLeave={e => e.currentTarget.style.background = categorie === c.name ? T.blueSoft : 'transparent'}
                  style={itemStyle(categorie === c.name)}
                >
                  <span>{c.name}</span>
                  <span style={{ fontSize: 11, color: T.ink4 }}>›</span>
                </div>
              ))}
            </div>
          ) : subCat ? (
            // ─── Subcategorieën ───
            <div style={{ padding: '6px 6px' }}>
              {/* Terug knop */}
              <div
                onClick={goBack}
                onMouseEnter={e => e.currentTarget.style.background = T.rule}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                style={{ ...itemStyle(false), color: T.ink3, fontSize: 12 }}
              >
                <span>← Terug</span>
              </div>

              {/* Categorie titel */}
              <div style={{
                padding: '6px 14px 4px', fontSize: 11, fontWeight: 600,
                color: T.ink4, textTransform: 'uppercase', letterSpacing: 0.5,
              }}>
                {subCat.name}
              </div>

              {/* Alle [categorie] optie */}
              <div
                onClick={() => selectCategoryOnly(subCat.name)}
                onMouseEnter={e => e.currentTarget.style.background = T.rule}
                onMouseLeave={e => {
                  const isActive = categorie === subCat.name && !subcategorie
                  e.currentTarget.style.background = isActive ? T.blueSoft : 'transparent'
                }}
                style={itemStyle(categorie === subCat.name && !subcategorie)}
              >
                Alle {subCat.name.toLowerCase()}
              </div>

              {/* Scheidingslijn */}
              <div style={{ height: 1, background: T.rule, margin: '4px 0' }} />

              {/* Subcategorieën */}
              {subCat.subs.map(s => (
                <div
                  key={s}
                  onClick={() => selectSub(subCat.name, s)}
                  onMouseEnter={e => e.currentTarget.style.background = T.rule}
                  onMouseLeave={e => e.currentTarget.style.background = subcategorie === s ? T.blueSoft : 'transparent'}
                  style={itemStyle(subcategorie === s)}
                >
                  {s}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default function TransactionFilters({ filters, updateFilter, totals, eersteJaar }) {
  return (
    <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
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
          <span style={{ color: T.ink4 }}>Balans</span>
          <span style={{ fontWeight: 600, color: totals.balans >= 0 ? T.green : T.red, ...TAB }}>
            {totals.balans >= 0 ? '+' : ''}{fmt(totals.balans)}
          </span>
        </div>
      </div>

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

        {/* Type — custom dropdown */}
        <CustomDropdown
          label="Type"
          value={filters.type}
          allLabel="Type: Alles"
          options={[
            { value: 'Uitgave', label: 'Uitgave' },
            { value: 'Inkomst', label: 'Inkomst' },
          ]}
          onChange={v => updateFilter('type', v)}
        />

        {/* Categorie — twee-staps dropdown */}
        <CategoryDropdown
          categorie={filters.categorie}
          subcategorie={filters.subcategorie}
          onCategorieChange={v => updateFilter('categorie', v)}
          onSubChange={v => updateFilter('subcategorie', v)}
        />

        {/* Soort — custom dropdown */}
        <CustomDropdown
          label="Soort"
          value={filters.soort}
          allLabel="Soort: Alles"
          options={SOORTEN.map(s => ({ value: s, label: s }))}
          onChange={v => updateFilter('soort', v)}
        />

        {/* Wie — custom dropdown */}
        <CustomDropdown
          label="Wie"
          value={filters.wie}
          allLabel="Wie: Iedereen"
          options={PERSONEN.map(p => ({ value: p.initials, label: p.name }))}
          onChange={v => updateFilter('wie', v)}
        />

{/* Maand — custom dropdown */}
        <CustomDropdown
          label="Maand"
          value={filters.maand}
          allLabel="Alle maanden"
          options={MAANDEN}
          onChange={v => updateFilter('maand', v)}
        />

        {/* Jaar — custom dropdown (dynamisch op basis van oudste transactie) */}
        <CustomDropdown
          label="Jaar"
          value={filters.jaar}
          allLabel="Alle jaren"
          options={(() => {
            const huidigJaar = new Date().getFullYear()
            const jaren = []
            for (let j = huidigJaar; j >= eersteJaar; j--) {
              jaren.push({ value: String(j), label: String(j) })
            }
            return jaren
          })()}
          onChange={v => updateFilter('jaar', v)}
        />
      </div>
    </div>
  )
}
