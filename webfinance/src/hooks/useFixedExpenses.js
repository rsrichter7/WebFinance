// ─── useFixedExpenses Hook ───
// Beheer van vaste lasten: CRUD, groepering, totalen en auto-transacties.

import { useState, useMemo, useCallback } from 'react'
import { SAMPLE_VASTE_LASTEN } from '../data/fixed'
import { CATEGORIES } from '../data/categories'
import { CATEGORY_CONFIG } from '../data/categoryConfig'
import { T } from '../tokens'

const STORAGE_KEY = 'webfinance_fixed'
const TX_KEY = 'webfinance_transactions'

let idCounter = Date.now()
const nextId = () => ++idCounter

// Bereken volgende datum op basis van herhaling
function advanceDate(dateStr, herhaling) {
  const d = new Date(dateStr)
  if (herhaling === 'Wekelijks')        d.setDate(d.getDate() + 7)
  else if (herhaling === 'Maandelijks') d.setMonth(d.getMonth() + 1)
  else if (herhaling === 'Jaarlijks')   d.setFullYear(d.getFullYear() + 1)
  return d.toISOString().split('T')[0]
}

// Vooruit springen naar de eerstvolgende toekomstige datum
function nextFutureDate(dateStr, herhaling) {
  const today = new Date().toISOString().split('T')[0]
  let next = dateStr
  let safety = 0
  while (next <= today && safety < 1000) {
    next = advanceDate(next, herhaling)
    safety++
  }
  return next
}

// Bereken de vroegste datum waarvoor we transacties aanmaken (max 1 maand terug)
function earliestAutoDate() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().split('T')[0]
}

// Normaliseer bedrag naar maandbedrag voor statistieken
function toMonthly(item) {
  if (item.herhaling === 'Wekelijks') return item.bedrag * 52 / 12
  if (item.herhaling === 'Jaarlijks') return item.bedrag / 12
  return item.bedrag
}

// Schrijf gemiste auto-transacties naar webfinance_transactions
function processAutoTransactions(items, isNewItem = false) {
  const today = new Date().toISOString().split('T')[0]
  const minDate = isNewItem ? earliestAutoDate() : null
  const newTx = []

  const processed = items.map(item => {
    let next = item.nextDatum || item.startdatum
    let safety = 0
    while (next <= today && safety < 1000) {
      // Bij nieuw toegevoegde vaste lasten: max 1 maand terug
      const shouldCreate = !minDate || next >= minDate
      if (shouldCreate) {
        newTx.push({
          id: nextId(),
          datum: next,
          bedrag: item.bedrag,
          omschrijving: item.omschrijving,
          type: item.type,
          categorie: item.categorie,
          sub: item.sub,
          winkel: item.winkel || '',
          soort: item.soort || 'Noodzaak',
          wie: item.wie || 'GZ',
          notitie: '',
          vasteLast: item.id,
          bron: 'auto',
        })
      }
      next = advanceDate(next, item.herhaling)
      safety++
    }
    return { ...item, nextDatum: next }
  })

  if (newTx.length > 0) {
    try {
      const existingStr = localStorage.getItem(TX_KEY)
      const existing = existingStr ? JSON.parse(existingStr) : []
      const keys = new Set(existing.filter(t => t.vasteLast).map(t => `${t.vasteLast}_${t.datum}`))
      const toAdd = newTx.filter(t => !keys.has(`${t.vasteLast}_${t.datum}`))
      if (toAdd.length > 0) {
        localStorage.setItem(TX_KEY, JSON.stringify([...toAdd, ...existing]))
      }
    } catch {}
  }

  return processed
}

function saveItems(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

// Laad data uit LocalStorage of gebruik sample data
function loadAndProcess() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) {
        const processed = processAutoTransactions(parsed)
        saveItems(processed)
        return processed
      }
    }
  } catch {}

  // Geen geldige data — initialiseer vanuit sample
  const init = SAMPLE_VASTE_LASTEN.map(i => ({
    ...i,
    nextDatum: nextFutureDate(i.startdatum, i.herhaling),
  }))
  saveItems(init)
  return init
}

export default function useFixedExpenses() {
  const [items, setItems] = useState(loadAndProcess)
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  // Vaste last toevoegen — maakt direct auto-transacties aan (max 1 maand terug)
  const addItem = useCallback((item) => {
    const newItem = {
      ...item,
      id: nextId(),
      bron: 'auto',
      nextDatum: item.startdatum,
    }
    setItems(prev => {
      // Verwerk auto-transacties alleen voor het nieuwe item
      const processed = processAutoTransactions([newItem], true)
      const updated = [...prev, ...processed]
      saveItems(updated)
      return updated
    })
  }, [])

  const removeItem = useCallback((id) => {
    setItems(prev => {
      const updated = prev.filter(i => i.id !== id)
      saveItems(updated)
      return updated
    })
  }, [])

  const updateItem = useCallback((id, changes) => {
    setItems(prev => {
      const updated = prev.map(i => i.id === id ? { ...i, ...changes } : i)
      saveItems(updated)
      return updated
    })
  }, [])

  const openEdit = useCallback((item) => {
    setEditingItem(item)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingItem(null)
  }, [])

  // Groepeer per categorie
  const grouped = useMemo(() => {
    if (!items || items.length === 0) return []

    const map = {}
    for (const item of items) {
      const cat = item.categorie
      if (!cat) continue
      if (!map[cat]) map[cat] = []
      map[cat].push(item)
    }

    return CATEGORIES
      .filter(cat => map[cat.name] && map[cat.name].length > 0)
      .map(cat => {
        const cfg = CATEGORY_CONFIG[cat.name] || { icon: 'grip', colorKey: 'ink3', softKey: 'rule' }
        const catItems = map[cat.name]
        return {
          name: cat.name,
          items: catItems,
          icon: cfg.icon,
          color: T[cfg.colorKey] || T.ink3,
          colorSoft: T[cfg.softKey] || T.rule,
          subtotal: catItems.reduce((s, i) => s + toMonthly(i), 0),
        }
      })
  }, [items])

  // Totalen
  const totals = useMemo(() => {
    const uitgaven = items.filter(i => i.type === 'Uitgave').reduce((s, i) => s + toMonthly(i), 0)
    const inkomsten = items.filter(i => i.type === 'Inkomst').reduce((s, i) => s + toMonthly(i), 0)
    return { uitgaven, inkomsten, restant: inkomsten - uitgaven }
  }, [items])

  // Donut data (alleen uitgaven)
  const donutData = useMemo(() => {
    const map = {}
    for (const i of items.filter(i => i.type === 'Uitgave')) {
      map[i.categorie] = (map[i.categorie] || 0) + toMonthly(i)
    }
    return Object.entries(map).map(([cat, value]) => {
      const config = CATEGORY_CONFIG[cat]
      return { label: cat, value, color: T[config?.colorKey] || T.ink3 }
    })
  }, [items])

  return {
    items,
    grouped,
    totals,
    donutData,
    addItem,
    removeItem,
    updateItem,
    formOpen,
    setFormOpen,
    editingItem,
    openEdit,
    closeForm,
  }
}