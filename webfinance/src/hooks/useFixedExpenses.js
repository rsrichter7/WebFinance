// ─── useFixedExpenses Hook ───
// Beheer van vaste lasten: CRUD, groepering en totalen. Puur overzicht, geen automatische transacties.
// Gecacht op household_id — cache wordt bij mutaties gewist.

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { useActiveAccount } from './useActiveAccount'
import { registerCache, subscribe } from './cacheManager'
import { CATEGORIES } from '../data/categories'
import { CATEGORY_CONFIG } from '../data/categoryConfig'
import { T } from '../tokens'

const KOLOMMEN = 'id, naam, bedrag, frequentie, categorie, subcategorie, soort, wie, afschrijfdag, actief, type, winkel, is_hoofdinkomst, account_id, created_at'

let feCache = { data: null, householdId: null, accountId: null }
function clearCache() { feCache = { data: null, householdId: null, accountId: null } }
registerCache(clearCache)

// Reconstrueer startdatum vanuit created_at en afschrijfdag
function maakStartdatum(createdAt, afschrijfdag) {
  const d = new Date(createdAt || new Date())
  const maxDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const dag = Math.min(afschrijfdag || 1, maxDay)
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(dag)}`
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
    actief:          row.actief ?? true,
    type:            row.type ?? 'Uitgave',
    winkel:          row.winkel ?? '',
    isHoofdinkomst:  row.is_hoofdinkomst ?? false,
    accountId:       row.account_id,
    startdatum:      maakStartdatum(row.created_at, row.afschrijfdag),
    createdAt:       row.created_at,
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
    actief:           item.actief !== false,
    type:             item.type ?? 'Uitgave',
    winkel:           item.winkel ?? '',
    is_hoofdinkomst:  item.isHoofdinkomst ?? false,
  }
}

// Normaliseer bedrag naar maandbedrag voor statistieken
function toMonthly(item) {
  if (item.herhaling === 'Wekelijks')  return item.bedrag * 52 / 12
  if (item.herhaling === 'Jaarlijks')  return item.bedrag / 12
  if (item.herhaling === 'Kwartaal')   return item.bedrag / 3
  return item.bedrag
}

// Groepeer items per categorie voor weergave
function groupByCategorie(items) {
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
}

export default function useFixedExpenses() {
  const { householdId, loading: householdLoading } = useHousehold()
  const { activeAccountId, loading: accountsLoading } = useActiveAccount()

  const cacheHit = feCache.data !== null && feCache.householdId === householdId && feCache.accountId === activeAccountId && householdId !== null

  const [items, setItems]               = useState(cacheHit ? feCache.data : [])
  const [loading, setLoading]           = useState(!cacheHit)
  const [error, setError]               = useState(null)
  const [formOpen, setFormOpen]         = useState(false)
  const [editingItem, setEditingItem]   = useState(null)

  // ─── Data ophalen uit Supabase ───
  const fetchItems = useCallback(async () => {
    if (!householdId || !activeAccountId) return

    // Cache geldig voor dit huishouden + deze rekening
    if (feCache.data !== null && feCache.householdId === householdId && feCache.accountId === activeAccountId) {
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
      .eq('account_id', activeAccountId)
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const mapped = (data ?? []).map(dbNaarFrontend)
    feCache = { data: mapped, householdId, accountId: activeAccountId }
    setItems(mapped)
    setLoading(false)
  }, [householdId, activeAccountId])

  useEffect(() => {
    if (!householdLoading && !accountsLoading) fetchItems()
  }, [fetchItems, householdLoading, accountsLoading])

  useEffect(() => {
    const unsub = subscribe('fixed_expenses:changed', () => {
      clearCache()
      fetchItems()
    })
    return unsub
  }, [fetchItems])

  // ─── Vaste last toevoegen — cache wissen zodat auto-transacties opnieuw lopen ───
  const addItem = useCallback(async (item) => {
    if (!householdId || !activeAccountId) return
    const row = { ...frontendNaarDb(item), household_id: householdId, account_id: activeAccountId }
    const { error: err } = await supabase.from('fixed_expenses').insert(row)
    if (!err) {
      clearCache()
      fetchItems()
    }
  }, [householdId, activeAccountId, fetchItems])

  // ─── Vaste last verwijderen — cache wissen ───
  const removeItem = useCallback(async (id) => {
    const { error: err } = await supabase.from('fixed_expenses').delete().eq('id', id)
    if (!err) {
      clearCache()
      fetchItems()
    }
  }, [fetchItems])

  // ─── Vaste last bewerken — cache wissen ───
  const updateItem = useCallback(async (id, changes) => {
    const dbFields = frontendNaarDb(changes)
    const { error: err } = await supabase.from('fixed_expenses').update(dbFields).eq('id', id)
    if (!err) {
      clearCache()
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

  // ─── Hoofdinkomst: expliciete keuze of fallback op hoogste maandbedrag ───
  const hoofdinkomst = useMemo(() => {
    const inkomsten = items.filter(i => i.type === 'Inkomst')
    if (inkomsten.length === 0) return null
    const expliciet = inkomsten.find(i => i.isHoofdinkomst)
    if (expliciet) return expliciet
    return inkomsten.reduce((best, i) => toMonthly(i) > toMonthly(best) ? i : best, inkomsten[0])
  }, [items])

  // ─── Hoofdinkomst instellen: eerst alles op false, dan gekozen op true ───
  const setHoofdinkomst = useCallback(async (id) => {
    if (!householdId) return
    const inkomstIds = items.filter(i => i.type === 'Inkomst').map(i => i.id)
    for (const iid of inkomstIds) {
      await supabase.from('fixed_expenses').update({ is_hoofdinkomst: false }).eq('id', iid)
    }
    await supabase.from('fixed_expenses').update({ is_hoofdinkomst: true }).eq('id', id)
    clearCache()
    fetchItems()
  }, [householdId, items, fetchItems])

  // ─── Groepeer per categorie (gesplitst op type) ───
  const groupedUitgaven  = useMemo(() => groupByCategorie(items.filter(i => i.type === 'Uitgave')),  [items])
  const groupedInkomsten = useMemo(() => groupByCategorie(items.filter(i => i.type === 'Inkomst')), [items])

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
    groupedUitgaven,
    groupedInkomsten,
    totals,
    donutData,
    hoofdinkomst,
    setHoofdinkomst,
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
