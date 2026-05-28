// ─── BudgetCategoryTable ───
// Tabel met budget per categorie, altijd alle categorieën zichtbaar.
// Inline bewerken van subcategorie-budgetten via edit-knop.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { Card, ProgressBar, PctBadge } from '../ui/Card'
import { ICONS } from '../ui/Icons'
import { CATEGORY_CONFIG } from '../../data/categoryConfig'

const COLS = '1fr 120px 120px 180px 90px 40px'

function KopRij() {
  const { T } = useTheme()
  return (
    <div style={{ display: 'grid', gridTemplateColumns: COLS, padding: '10px 22px', borderBottom: `1px solid ${T.border}`, fontSize: 11, fontWeight: 600, color: T.ink3, textTransform: 'uppercase', letterSpacing: 0.5 }}>
      <span>Categorie</span>
      <span style={{ textAlign: 'right' }}>Budget</span>
      <span style={{ textAlign: 'right' }}>Besteed</span>
      <span style={{ paddingLeft: 8 }}>Voortgang</span>
      <span style={{ textAlign: 'center' }}>Status</span>
      <span />
    </div>
  )
}

function SubRij({ sub, editing, editValue, onEditChange }) {
  const { T } = useTheme()
  const pct = sub.budget > 0 ? sub.pct : 0
  return (
    <div style={{ display: 'grid', gridTemplateColumns: COLS, alignItems: 'center', padding: '8px 22px 8px 52px', borderBottom: `1px solid ${T.rule}`, background: T.cardAlt }}>
      <span style={{ fontSize: 12, color: T.ink3 }}>{sub.naam}</span>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        {editing ? (
          <div style={{ position: 'relative', width: 100 }}>
            <span style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 12 }}>€</span>
            <input type="text" inputMode="decimal" value={editValue}
              onChange={e => onEditChange(sub.naam, e.target.value)} placeholder="0,00"
              style={{ width: '100%', padding: '5px 8px 5px 22px', borderRadius: 6, border: `1.5px solid ${T.blue}`, background: T.card, fontSize: 12, color: T.ink, fontFamily: "'Inter', system-ui, sans-serif", ...TAB, outline: 'none', textAlign: 'right' }} />
          </div>
        ) : (
          <span style={{ fontSize: 12, color: T.ink3, ...TAB }}>{sub.budget > 0 ? fmt(sub.budget) : '—'}</span>
        )}
      </div>
      <span style={{ textAlign: 'right', fontSize: 12, color: T.ink3, ...TAB }}>{fmt(sub.besteed)}</span>
      <div style={{ padding: '0 8px' }}><ProgressBar pct={pct} size={5} /></div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>{sub.budget > 0 && <PctBadge pct={Math.min(pct, 100)} />}</div>
      <span />
    </div>
  )
}

function CatRij({ item, onSave }) {
  const { T } = useTheme()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValues, setEditValues] = useState({})

  const config = CATEGORY_CONFIG[item.categorie] || {}
  const color = T[config.colorKey] || T.ink3
  const soft = T[config.softKey] || T.rule
  const icon = ICONS[config.icon] || ICONS.grip
  const pct = item.budget > 0 ? item.pct : 0
  const hasSubs = item.subs && item.subs.length > 0

  function startEdit(e) {
    e.stopPropagation(); setOpen(true); setEditing(true)
    const values = {}
    item.subs.forEach(sub => { values[sub.naam] = sub.budget > 0 ? String(sub.budget) : '' })
    setEditValues(values)
  }

  function handleEditChange(naam, value) { setEditValues(prev => ({ ...prev, [naam]: value })) }

  function handleSave(e) {
    e.stopPropagation()
    const cleaned = {}
    for (const [k, v] of Object.entries(editValues)) {
      const parsed = parseFloat(String(v).replace(',', '.'))
      if (parsed > 0) cleaned[k] = parsed
    }
    const totaal = Object.values(cleaned).reduce((s, v) => s + v, 0)
    onSave(item.categorie, { subcategorieBudgetten: cleaned, totaalBudget: totaal })
    setEditing(false)
  }

  function handleCancel(e) { e.stopPropagation(); setEditing(false) }

  return (
    <>
      <div onClick={() => hasSubs && setOpen(o => !o)} style={{
        display: 'grid', gridTemplateColumns: COLS, alignItems: 'center',
        padding: '12px 22px', borderBottom: `1px solid ${T.border}`,
        cursor: hasSubs ? 'pointer' : 'default',
        background: open ? T.cardAlt : 'transparent',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {hasSubs ? <span style={{ color: T.ink4, display: 'flex' }}>{open ? ICONS.chevDown : ICONS.chevRight}</span> : <span style={{ width: 14 }} />}
          <div style={{ width: 28, height: 28, borderRadius: 7, background: soft, color, display: 'grid', placeItems: 'center', flexShrink: 0 }}>{icon}</div>
          <span style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{item.categorie}</span>
        </div>
        <span style={{ textAlign: 'right', fontSize: 13, fontWeight: 500, color: T.ink, ...TAB }}>{item.budget > 0 ? fmt(item.budget) : '—'}</span>
        <span style={{ textAlign: 'right', fontSize: 13, fontWeight: 500, color: T.ink, ...TAB }}>{fmt(item.besteed)}</span>
        <div style={{ padding: '0 8px' }}><ProgressBar pct={pct} size={7} /></div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>{item.budget > 0 && <PctBadge pct={Math.min(pct, 100)} />}</div>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <span onClick={startEdit} style={{ color: editing ? T.blue : T.ink4, cursor: 'pointer', display: 'flex' }}>{ICONS.edit}</span>
        </div>
      </div>

      {open && item.subs.map(sub => (
        <SubRij key={sub.naam} sub={sub} editing={editing}
          editValue={editing ? (editValues[sub.naam] || '') : ''}
          onEditChange={handleEditChange} />
      ))}

      {editing && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, padding: '10px 22px', borderBottom: `1px solid ${T.border}`, background: T.cardAlt }}>
          <button onClick={handleCancel} style={{ padding: '6px 14px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Annuleer</button>
          <button onClick={handleSave} style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: T.blue, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Opslaan</button>
        </div>
      )}
    </>
  )
}

export default function BudgetCategoryTable({ categorieOverzicht, onSave, budgetLimiet, totaalCategorieBudget }) {
  const { T } = useTheme()
  const resterendBudget = budgetLimiet - totaalCategorieBudget
  return (
    <Card style={{ padding: 0, overflow: 'visible' }}>
      <div style={{ padding: '16px 22px 14px', borderBottom: `1px solid ${T.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Budget per categorie</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Klik op een categorie voor subcategorieën</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: T.ink3 }}>Nog te verdelen</div>
          <div style={{ fontSize: 14, fontWeight: 600, ...TAB, color: resterendBudget >= 0 ? T.green : T.red }}>{fmt(resterendBudget)}</div>
        </div>
      </div>
      <KopRij />
      {categorieOverzicht.map(item => <CatRij key={item.categorie} item={item} onSave={onSave} />)}
    </Card>
  )
}
