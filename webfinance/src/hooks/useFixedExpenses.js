// ─── useFixedExpenses Hook ───
// Beheer van vaste lasten: CRUD, groepering, totalen en auto-transacties.
// Gecacht op household_id — cache wordt bij mutaties gewist zodat auto-transacties opnieuw lopen.

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { registerCache } from './cacheManager'
import { CATEGORIES } from '../data/categories'
import { CATEGORY_CONFIG } from '../data/categoryConfig'
import { T } from '../tokens'

const KOLOMMEN = 'id, naam, bedrag, frequentie, categorie, subcategorie, soort, wie, afschrijfdag, actief, created_at'

let feCache = { data: null, householdId: null }
function clearCache() { feCache = { data: null, householdId: null } }
registerCache(clearCache)

function pad(n) { return String(n).padStart(2, '0') }

// Reconstrueer startdatum vanuit created_at en afschrijfdag
function maakStartdatum(createdAt, afschrijfdag) {
  const d = new Date(createdAt || new Date())
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const dag = Math.min(afschrijfdag || 1, maxDay)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(dag)}`
}

// DB (snake_case) → frontend (legacy veldnamen voor componentcompatibiliteit)
function dbNaarFrontend(row) {
  return {
    id:           row.id,
    omschrijving: row.naam,
    bedrag:       row.bedrag,
    herhaling:    row.frequentie,
    categorie:    row.categorie,
    sub:          row.subcategorie ?? '',
    soort:        row.soort ?? 'Noodzaak',
    wie:          row.wie ?? 'GZ',
    afschrijfdag: row.afschrijfdag ?? 1,
    actief:       row.actief ?? true,
    type:         'Uitgave',
    winkel:       '',
    startdatum:   maakStartdatum(row.created_at, row.afschrijfdag),
    createdAt:    row.created_at,
  }
}

// Frontend → DB (alleen kolommen die bestaan in de tabel)
function frontendNaarDb(item) {
  const dag = item.startdatum
    ? parseInt(item.startdatum.split('-')[2], 10)
    : (item.afschrijfdag ?? new Date().getDate())
  return {
    naam:         item.omschrijving,
    bedrag:       item.bedrag,
    frequentie:   item.herhaling,
    categorie:    item.categorie,
    subcategorie: item.sub ?? '',
    soort:        item.soort ?? 'Noodzaak',
    wie:          item.wie ?? 'GZ',
    afschrijfdag: dag,
    actief:       item.actief !== false,
  }
}

// Normaliseer bedrag naar maandbedrag voor statistieken
function toMonthly(item) {
  if (item.herhaling === 'Wekelijks')  return item.bedrag * 52 / 12
  if (item.herhaling === 'Jaarlijks')  return item.bedrag / 12
  if (item.herhaling === 'Kwartaal')   return item.bedrag / 3
  return item.bedrag
}

// Vroegste datum waarvoor we auto-transacties aanmaken (max 1 maand terug)
function earliestAutoDate() {
  const d = new Date()
  d.setMonth(d.getMonth() - 1)
  return d.toISOString().split('T')[0]
}

// Genereer verwachte datums voor een vaste last binnen [minDate, today]
function berekenVerwachteDatums(item, minDate, today) {
  const dates = []
  const dag = item.afschrijfdag ?? 1
  const now = new Date()

  if (item.herhaling === 'Maandelijks') {
    for (let offset = -1; offset <= 0; offset++) {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
      const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(Math.min(dag, maxDay))}`
      if (dateStr >= minDate && dateStr <= today) dates.push(dateStr)
    }
  } else if (item.herhaling === 'Kwartaal') {
    for (let offset = -3; offset <= 0; offset += 3) {
      const d = new Date(now.getFullYear(), now.getMonth() + offset, 1)
      const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
      const dateStr = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(Math.min(dag, maxDay))}`
      if (dateStr >= minDate && dateStr <= today) dates.push(dateStr)
    }
  } else if (item.herhaling === 'Jaarlijks') {
    const base = new Date(item.createdAt || now)
    const maxDay = new Date(now.getFullYear(), base.getMonth() + 1, 0).getDate()
    const dateStr = `${now.getFullYear()}-${pad(base.getMonth() + 1)}-${pad(Math.min(dag, maxDay))}`
    if (dateStr >= minDate && dateStr <= today) dates.push(dateStr)
  } else if (item.herhaling === 'Wekelijks') {
    let cur = new Date(item.startdatum || item.createdAt || minDate)
    let safety = 0
    while (cur.toISOString().split('T')[0] <= today && safety < 10) {
      const dateStr = cur.toISOString().split('T')[0]
      if (dateStr >= minDate) dates.push(dateStr)
      cur.setDate(cur.getDate() + 7)
      safety++
    }
  }

  return dates
}

export default function useFixedExpenses() {
  const { householdId, loading: householdLoading } = useHousehold()

  const cacheHit = feCache.data !== null && feCache.householdId === householdId && householdId !== null

  const [items, setItems]               = useState(cacheHit ? feCache.data : [])
  const [loading, setLoading]           = useState(!cacheHit)
  const [error, setError]               = useState(null)
  const [formOpen, setFormOpen]         = useState(false)
  const [editingItem, setEditingItem]   = useState(null)

  // ─── Auto-transacties aanmaken voor gemiste periodes ───
  const verwerkAutoTransacties = useCallback(async (fixedItems) => {
    if (!householdId || fixedItems.length === 0) return
    const today = new Date().toISOString().split('T')[0]
    const minDate = earliestAutoDate()

    for (const item of fixedItems) {
      if (!item.actief) continue
      const dates = berekenVerwachteDatums(item, minDate, today)

      for (const datum of dates) {
        const { data: existing } = await supabase
          .from('transactions')
          .select('id')
          .eq('vaste_last_id', item.id)
          .eq('datum', datum)

        if (!existing || existing.length === 0) {
          await supabase.from('transactions').insert({
            household_id:  householdId,
            datum,
            beschrijving:  item.omschrijving,
            bedrag:        item.bedrag,
            type:          'Uitgave',
            categorie:     item.categorie,
            subcategorie:  item.sub ?? '',
            soort:         item.soort ?? 'Noodzaak',
            wie:           item.wie ?? 'GZ',
            bron:          'auto',
            vaste_last_id: item.id,
          })
        }
      }
    }
  }, [householdId])

  // ─── Data ophalen uit Supabase ───
  const fetchItems = useCallback(async () => {
    if (!householdId) return

    // Cache geldig voor dit huishouden (auto-transacties al gedraaid bij eerste fetch)
    if (feCache.data !== null && feCache.householdId === householdId) {
      setItems(feCache.data)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('fixed_expenses')
      .select(KOLOMMEN)
      .eq('household_id', householdId)
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const mapped = (data ?? []).map(dbNaarFrontend)
    feCache = { data: mapped, householdId }
    setItems(mapped)
    setLoading(false)
    await verwerkAutoTransacties(mapped)
  }, [householdId, verwerkAutoTransacties])

  useEffect(() => {
    if (!householdLoading) fetchItems()
  }, [fetchItems, householdLoading])

  // ─── Vaste last toevoegen — cache wissen zodat auto-transacties opnieuw lopen ───
  const addItem = useCallback(async (item) => {
    if (!householdId) return
    const row = { ...frontendNaarDb(item), household_id: householdId }
    const { error: err } = await supabase.from('fixed_expenses').insert(row)
    if (!err) {
      feCache = { data: null, householdId: null }
      fetchItems()
    }
  }, [householdId, fetchItems])

  // ─── Vaste last verwijderen — cache wissen ───
  const removeItem = useCallback(async (id) => {
    const { error: err } = await supabase.from('fixed_expenses').delete().eq('id', id)
    if (!err) {
      feCache = { data: null, householdId: null }
      fetchItems()
    }
  }, [fetchItems])

  // ─── Vaste last bewerken — cache wissen ───
  const updateItem = useCallback(async (id, changes) => {
    const dbFields = frontendNaarDb(changes)
    const { error: err } = await supabase.from('fixed_expenses').update(dbFields).eq('id', id)
    if (!err) {
      feCache = { data: null, householdId: null }
      fetchItems()
    }
  }, [fetchItems])

  const openEdit = useCallback((item) => {
    setEditingItem(item)
    setFormOpen(true)
  }, [])

  const closeForm = useCallback(() => {
    setFormOpen(false)
    setEditingItem(null)
  }, [])

  // ─── Groepeer per categorie ───
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
          name:      cat.name,
          items:     catItems,
          icon:      cfg.icon,
          color:     T[cfg.colorKey] || T.ink3,
          colorSoft: T[cfg.softKey] || T.rule,
          subtotal:  catItems.reduce((s, i) => s + toMonthly(i), 0),
        }
      })
  }, [items])

  // ─── Totalen ───
  const totals = useMemo(() => {
    const uitgaven  = items.filter(i => i.type === 'Uitgave').reduce((s, i) => s + toMonthly(i), 0)
    const inkomsten = items.filter(i => i.type === 'Inkomst').reduce((s, i) => s + toMonthly(i), 0)
    return { uitgaven, inkomsten, restant: inkomsten - uitgaven }
  }, [items])

  // ─── Donut data (alleen uitgaven) ───
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
    loading,
    error,
  }
}
