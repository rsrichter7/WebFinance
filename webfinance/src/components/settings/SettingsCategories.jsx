// ─── SettingsCategories ───
// Beheer hoofd- en subcategorieën voor transacties.

import React, { useState, useEffect } from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { CATEGORIES } from '../../data/categories'
import useSettings from '../../hooks/useSettings'

const EMPTY = { customSubs: {}, customCats: [] }

export default function SettingsCategories() {
  const { settings, loading, updateSetting } = useSettings()
  const [custom,   setCustom]   = useState(EMPTY)
  const [expanded, setExpanded] = useState({})
  const [newSub,   setNewSub]   = useState({})
  const [newCat,   setNewCat]   = useState('')

  useEffect(() => {
    if (!loading && settings.custom_categories) {
      setCustom({ ...EMPTY, ...settings.custom_categories })
    }
  }, [loading, settings.custom_categories])

  function save(next) {
    setCustom(next)
    updateSetting('custom_categories', next)
  }

  function toggleExpanded(name) {
    setExpanded(e => ({ ...e, [name]: !e[name] }))
  }

  function addSub(catName) {
    const val = (newSub[catName] || '').trim()
    if (!val) return
    const next = { ...custom, customSubs: { ...custom.customSubs, [catName]: [...(custom.customSubs[catName] || []), val] } }
    save(next)
    setNewSub(s => ({ ...s, [catName]: '' }))
  }

  function deleteSub(catName, subName) {
    const next = { ...custom, customSubs: { ...custom.customSubs, [catName]: (custom.customSubs[catName] || []).filter(s => s !== subName) } }
    save(next)
  }

  function addCat() {
    const val = newCat.trim()
    if (!val) return
    const next = { ...custom, customCats: [...custom.customCats, { name: val }] }
    save(next)
    setNewCat('')
  }

  function deleteCat(name) {
    const { [name]: _, ...restSubs } = custom.customSubs
    const next = { ...custom, customCats: custom.customCats.filter(c => c.name !== name), customSubs: restSubs }
    save(next)
  }

  const allCats = [
    ...CATEGORIES.map(c => ({ ...c, isDefault: true })),
    ...custom.customCats.map(c => ({ name: c.name, subs: [], isDefault: false })),
  ]

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Categorieën</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Beheer hoofd- en subcategorieën voor je transacties</div>
      </div>

      <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: 14 }}>
        {allCats.map((cat, i) => {
          const isExp = !!expanded[cat.name]
          const customSubs = custom.customSubs[cat.name] || []
          const allSubs = [...cat.subs, ...customSubs]
          const isLast = i === allCats.length - 1

          return (
            <React.Fragment key={cat.name}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '12px 14px', background: T.card,
                borderBottom: (!isLast || isExp) ? `1px solid ${T.rule}` : 'none',
              }}>
                <span onClick={() => toggleExpanded(cat.name)} style={{ color: T.ink3, display: 'inline-flex', cursor: 'pointer' }}>
                  {isExp ? ICONS.chevDown : ICONS.chevRight}
                </span>
                <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500, color: T.ink }}>{cat.name}</span>
                <span style={{ fontSize: 11, color: T.ink4, fontVariantNumeric: 'tabular-nums' }}>{allSubs.length} sub</span>
                {!cat.isDefault && (
                  <button onClick={() => deleteCat(cat.name)} style={iconBtn}>
                    {ICONS.trash}
                  </button>
                )}
              </div>

              {isExp && (
                <>
                  {allSubs.map((sub, j) => (
                    <div key={j} style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '8px 14px 8px 42px', background: T.cardAlt,
                      borderBottom: `1px solid ${T.rule}`,
                    }}>
                      <span style={{ flex: 1, fontSize: 12.5, color: T.ink3 }}>{sub}</span>
                      {customSubs.includes(sub) && (
                        <button onClick={() => deleteSub(cat.name, sub)} style={iconBtn}>
                          {ICONS.trash}
                        </button>
                      )}
                    </div>
                  ))}
                  <div style={{
                    display: 'flex', gap: 8,
                    padding: '8px 14px 8px 42px', background: T.cardAlt,
                    borderBottom: !isLast ? `1px solid ${T.rule}` : 'none',
                  }}>
                    <input
                      value={newSub[cat.name] || ''}
                      onChange={e => setNewSub(s => ({ ...s, [cat.name]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && addSub(cat.name)}
                      placeholder="Nieuwe subcategorie…"
                      style={{ flex: 1, padding: '6px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12.5, color: T.ink, background: T.card, outline: 'none', fontFamily: 'inherit' }}
                    />
                    <button onClick={() => addSub(cat.name)} style={addSubBtn}>Toevoegen</button>
                  </div>
                </>
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input
          value={newCat}
          onChange={e => setNewCat(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addCat()}
          placeholder="Nieuwe hoofdcategorie…"
          style={{ flex: 1, padding: '8px 12px', border: `1px dashed ${T.borderHi}`, borderRadius: 8, fontSize: 13, color: T.ink, background: T.cardAlt, outline: 'none', fontFamily: 'inherit' }}
        />
        <button onClick={addCat} style={addMainBtn}>
          <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span> Toevoegen
        </button>
      </div>
    </div>
  )
}

const iconBtn    = { border: 'none', background: 'transparent', padding: 4, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex' }
const addSubBtn  = { padding: '6px 12px', borderRadius: 6, background: T.blue, color: '#fff', border: 'none', fontSize: 12, fontWeight: 500, cursor: 'pointer' }
const addMainBtn = { padding: '8px 14px', borderRadius: 8, background: T.blue, color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }
