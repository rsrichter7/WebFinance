// ─── BudgetForm ───
// Slide-in formulier voor het instellen van een categorie-budget.

import React, { useState, useEffect, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { CATEGORIES } from '../../data/categories'
import { CATEGORY_CONFIG } from '../../data/categoryConfig'
import { ICONS } from '../ui/Icons'

export default function BudgetForm({ open, editingItem, onClose, onSave, bestaandeCategorieën }) {
  const { T } = useTheme()
  const [categorie, setCategorie] = useState('')
  const [subBudgetten, setSubBudgetten] = useState({})

  const beschikbareCategorieën = useMemo(() => {
    return CATEGORIES.filter(c =>
      !bestaandeCategorieën?.includes(c.name) || c.name === editingItem?.categorie
    )
  }, [bestaandeCategorieën, editingItem])

  useEffect(() => {
    if (!open) return
    if (editingItem) {
      setCategorie(editingItem.categorie)
      setSubBudgetten({ ...editingItem.subcategorieBudgetten })
    } else {
      setCategorie(beschikbareCategorieën[0]?.name || '')
      setSubBudgetten({})
    }
  }, [open, editingItem, beschikbareCategorieën])

  const currentCat = CATEGORIES.find(c => c.name === categorie)
  const subs = currentCat ? currentCat.subs : []
  const config = CATEGORY_CONFIG[categorie] || { icon: 'grip', colorKey: 'ink3', softKey: 'rule' }
  const isEdit = !!editingItem
  const totaal = Object.values(subBudgetten).reduce((s, v) => s + (parseFloat(v) || 0), 0)

  function updateSub(sub, value) { setSubBudgetten(prev => ({ ...prev, [sub]: value })) }

  function handleSave() {
    if (!categorie) return
    const cleaned = {}
    for (const [k, v] of Object.entries(subBudgetten)) {
      const parsed = parseFloat(String(v).replace(',', '.'))
      if (parsed > 0) cleaned[k] = parsed
    }
    const totaalBudget = Object.values(cleaned).reduce((s, v) => s + v, 0)
    if (totaalBudget <= 0) return
    onSave({ ...(editingItem || {}), categorie, subcategorieBudgetten: cleaned, totaalBudget }, isEdit)
    onClose()
  }

  if (!open) return null

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1.5px solid ${T.border}`, background: T.card,
    fontSize: 13, color: T.ink, outline: 'none',
    fontFamily: "'Inter', system-ui, sans-serif",
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 90 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: T.card, borderLeft: `1px solid ${T.border}`,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>{isEdit ? 'Budget bewerken' : 'Budget instellen'}</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{isEdit ? 'Wijzig het budget voor deze categorie' : 'Stel een budget in per categorie'}</div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div>
            <label style={L}>Categorie</label>
            <select value={categorie} onChange={e => { setCategorie(e.target.value); setSubBudgetten({}) }} disabled={isEdit} style={{ ...I, opacity: isEdit ? 0.6 : 1 }}>
              {beschikbareCategorieën.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          {categorie && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, background: T[config.softKey], border: `1px solid ${T.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: T.card, display: 'grid', placeItems: 'center', color: T[config.colorKey] }}>
                {ICONS[config.icon]}
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>{categorie}</div>
                <div style={{ fontSize: 12, color: T.ink3 }}>{subs.length} subcategorieën</div>
              </div>
              <div style={{ marginLeft: 'auto', fontSize: 18, fontWeight: 700, color: T[config.colorKey], ...TAB }}>
                {fmt(totaal)}
              </div>
            </div>
          )}

          <div>
            <label style={L}>Budget per subcategorie</label>
            <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' }}>
              {subs.map((sub, i) => (
                <div key={sub} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderBottom: i < subs.length - 1 ? `1px solid ${T.rule}` : 'none', background: i % 2 === 0 ? T.card : T.cardAlt }}>
                  <span style={{ fontSize: 13, color: T.ink, flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sub}</span>
                  <div style={{ position: 'relative', width: 120 }}>
                    <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 13 }}>€</span>
                    <input type="text" inputMode="decimal" placeholder="0,00" value={subBudgetten[sub] || ''}
                      onChange={e => updateSub(sub, e.target.value)}
                      style={{ width: '100%', padding: '7px 10px 7px 24px', borderRadius: 6, border: `1.5px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, fontFamily: "'Inter', system-ui, sans-serif", ...TAB, outline: 'none', textAlign: 'right' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderRadius: 10, background: T.bg, border: `1px solid ${T.border}` }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Totaal budget</span>
            <span style={{ fontSize: 20, fontWeight: 700, color: totaal > 0 ? T.green : T.ink3, ...TAB }}>{fmt(totaal)}</span>
          </div>
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 10 }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
            background: totaal > 0 ? T.blue : T.border, color: totaal > 0 ? '#fff' : T.ink4,
            fontSize: 13, fontWeight: 500, cursor: totaal > 0 ? 'pointer' : 'default', fontFamily: 'inherit',
          }}>
            {isEdit ? 'Budget bijwerken' : 'Budget opslaan'}
          </button>
        </div>
      </div>
    </>
  )
}
