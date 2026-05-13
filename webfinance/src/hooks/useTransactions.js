// ─── useTransactions Hook ───
// Enige plek waar transactiedata en logica leeft.
// Componenten gebruiken deze hook en hebben GEEN eigen transactie-state.

import { useState, useMemo, useCallback } from 'react'
import { SAMPLE_TRANSACTIONS } from '../data/transactions'

const STORAGE_KEY = 'webfinance_transactions'

// Unieke id generator
let idCounter = Date.now()
const nextId = () => ++idCounter

// Lees uit LocalStorage, of gebruik sample data
function loadTransactions() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return SAMPLE_TRANSACTIONS
}

// Sla op naar LocalStorage
function saveTransactions(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export default function useTransactions() {
  // ─── State ───
  const [transactions, setTransactions] = useState(loadTransactions)
  const [formOpen, setFormOpen] = useState(false)

  const [filters, setFilters] = useState({
    search: '',
    type: '',
    categorie: '',
    soort: '',
    wie: '',
    maand: '',
  })

  const [sort, setSort] = useState({ field: 'datum', dir: 'desc' })

  // ─── Transactie toevoegen ───
  const addTransaction = useCallback((tx) => {
    const newTx = { ...tx, id: nextId() }
    setTransactions(prev => {
      const updated = [newTx, ...prev]
      saveTransactions(updated)
      return updated
    })
  }, [])

  // ─── Transactie verwijderen ───
  const removeTransaction = useCallback((id) => {
    setTransactions(prev => {
      const updated = prev.filter(t => t.id !== id)
      saveTransactions(updated)
      return updated
    })
  }, [])

  // ─── Filter updaten ───
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  // ─── Sortering updaten ───
  const updateSort = useCallback((field) => {
    setSort(prev => ({
      field,
      dir: prev.field === field && prev.dir === 'desc' ? 'asc' : 'desc',
    }))
  }, [])

  // ─── Gefilterde en gesorteerde transacties ───
  const filtered = useMemo(() => {
    let result = [...transactions]

    // Zoeken
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(t =>
        t.omschrijving.toLowerCase().includes(q) ||
        t.winkel.toLowerCase().includes(q)
      )
    }

    // Type filter
    if (filters.type) {
      result = result.filter(t => t.type === filters.type)
    }

    // Categorie filter
    if (filters.categorie) {
      result = result.filter(t => t.categorie === filters.categorie)
    }

    // Soort filter
    if (filters.soort) {
      result = result.filter(t => t.soort === filters.soort)
    }

    // Wie filter
    if (filters.wie) {
      result = result.filter(t => t.wie === filters.wie)
    }

    // Maand filter
    if (filters.maand) {
      result = result.filter(t => {
        const month = new Date(t.datum).getMonth()
        return month === parseInt(filters.maand)
      })
    }

    // Sorteren
    result.sort((a, b) => {
      let va = a[sort.field]
      let vb = b[sort.field]

      if (sort.field === 'bedrag') {
        va = a.bedrag
        vb = b.bedrag
      }

      if (va < vb) return sort.dir === 'asc' ? -1 : 1
      if (va > vb) return sort.dir === 'asc' ? 1 : -1
      return 0
    })

    return result
  }, [transactions, filters, sort])

  // ─── Totalen berekenen ───
  const totals = useMemo(() => {
    const uitgaven = filtered.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
    const inkomsten = filtered.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0)
    return { uitgaven, inkomsten, saldo: inkomsten - uitgaven }
  }, [filtered])

  return {
    // Data
    transactions: filtered,
    totals,
    transactionCount: filtered.length,

    // Acties
    addTransaction,
    removeTransaction,

    // Filters
    filters,
    updateFilter,

    // Sortering
    sort,
    updateSort,

    // Formulier
    formOpen,
    setFormOpen,
  }
}
