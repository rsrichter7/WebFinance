// ─── useTransactions Hook ───
// Enige plek waar transactiedata en logica leeft.
// Data komt uit Supabase (transactions tabel, gefilterd op household_id).

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'

// Kolommen die we ophalen uit Supabase
const KOLOMMEN = 'id, datum, beschrijving, bedrag, type, categorie, subcategorie, soort, wie, winkel, bron, vaste_last_id, spaardoel_id, created_at'

// snake_case (database) → camelCase (frontend)
function dbNaarFrontend(row) {
  return {
    id:          row.id,
    datum:       row.datum,
    beschrijving: row.beschrijving,
    bedrag:      row.bedrag,
    type:        row.type,
    categorie:   row.categorie,
    subcategorie: row.subcategorie ?? '',
    soort:       row.soort ?? '',
    wie:         row.wie ?? '',
    winkel:      row.winkel ?? '',
    bron:        row.bron ?? 'handmatig',
    vasteLast:   row.vaste_last_id ?? null,
    spaardoelId: row.spaardoel_id ?? null,
    createdAt:   row.created_at,
  }
}

// camelCase (frontend) → snake_case (database)
function frontendNaarDb(tx) {
  const row = {
    datum:        tx.datum,
    beschrijving: tx.beschrijving,
    bedrag:       tx.bedrag,
    type:         tx.type,
    categorie:    tx.categorie,
    subcategorie: tx.subcategorie ?? '',
    soort:        tx.soort ?? '',
    wie:          tx.wie ?? '',
    winkel:       tx.winkel ?? '',
    bron:         tx.bron ?? 'handmatig',
    vaste_last_id: tx.vasteLast ?? null,
    spaardoel_id:  tx.spaardoelId ?? null,
  }
  return row
}

export default function useTransactions() {
  const { householdId, loading: householdLoading } = useHousehold()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [formOpen, setFormOpen]         = useState(false)

  const [filters, setFilters] = useState({
    search:       '',
    type:         '',
    categorie:    '',
    subcategorie: '',
    soort:        '',
    wie:          '',
    maand:        '',
    jaar:         String(new Date().getFullYear()),
  })

  const [sort, setSort] = useState({ field: 'datum', dir: 'desc' })

  // ─── Data ophalen uit Supabase ───
  const fetchTransactions = useCallback(async () => {
    if (!householdId) return
    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('transactions')
      .select(KOLOMMEN)
      .eq('household_id', householdId)
      .order('datum', { ascending: false })
      .order('created_at', { ascending: false })

    if (err) {
      setError(err.message)
    } else {
      setTransactions((data ?? []).map(dbNaarFrontend))
    }
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    if (!householdLoading) {
      fetchTransactions()
    }
  }, [fetchTransactions, householdLoading])

  // ─── Transactie toevoegen ───
  const addTransaction = useCallback(async (tx) => {
    if (!householdId) return
    const row = { ...frontendNaarDb(tx), household_id: householdId }
    const { error: err } = await supabase.from('transactions').insert(row)
    if (!err) fetchTransactions()
  }, [householdId, fetchTransactions])

  // ─── Transactie verwijderen ───
  const removeTransaction = useCallback(async (id) => {
    const { error: err } = await supabase.from('transactions').delete().eq('id', id)
    if (!err) fetchTransactions()
  }, [fetchTransactions])

  // ─── Transactie bewerken ───
  // Bron wordt altijd 'handmatig' na bewerking; vasteLast (vaste_last_id) blijft behouden
  const updateTransaction = useCallback(async (id, updatedFields) => {
    const dbFields = frontendNaarDb({ ...updatedFields, bron: 'handmatig' })
    // Behoud vasteLast-koppeling als niet meegestuurd
    if (updatedFields.vasteLast === undefined) delete dbFields.vaste_last_id
    const { error: err } = await supabase.from('transactions').update(dbFields).eq('id', id)
    if (!err) fetchTransactions()
  }, [fetchTransactions])

  // ─── Filter updaten ───
  const updateFilter = useCallback((key, value) => {
    setFilters(prev => {
      const next = { ...prev, [key]: value }
      if (key === 'categorie') next.subcategorie = ''
      return next
    })
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

    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(t =>
        t.beschrijving.toLowerCase().includes(q) ||
        t.winkel.toLowerCase().includes(q)
      )
    }

    if (filters.type)         result = result.filter(t => t.type === filters.type)
    if (filters.categorie)    result = result.filter(t => t.categorie === filters.categorie)
    if (filters.subcategorie) result = result.filter(t => t.subcategorie === filters.subcategorie)
    if (filters.soort)        result = result.filter(t => t.soort === filters.soort)
    if (filters.wie)          result = result.filter(t => t.wie === filters.wie)

    if (filters.maand) {
      result = result.filter(t => new Date(t.datum).getMonth() === parseInt(filters.maand))
    }

    if (filters.jaar) {
      result = result.filter(t => new Date(t.datum).getFullYear() === parseInt(filters.jaar))
    }

    result.sort((a, b) => {
      let va = a[sort.field]
      let vb = b[sort.field]
      if (sort.field === 'bedrag') { va = a.bedrag; vb = b.bedrag }
      if (va < vb) return sort.dir === 'asc' ? -1 : 1
      if (va > vb) return sort.dir === 'asc' ? 1 : -1
      // Bij gelijke datum: nieuwste createdAt eerst
      return new Date(b.createdAt) - new Date(a.createdAt)
    })

    return result
  }, [transactions, filters, sort])

  // ─── Totalen ───
  const totals = useMemo(() => {
    const uitgaven  = filtered.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
    const inkomsten = filtered.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0)
    return { uitgaven, inkomsten, balans: inkomsten - uitgaven }
  }, [filtered])

  // ─── Oudste jaar ───
  const eersteJaar = useMemo(() => {
    if (transactions.length === 0) return new Date().getFullYear()
    let min = Infinity
    for (const t of transactions) {
      const y = new Date(t.datum).getFullYear()
      if (y < min) min = y
    }
    return min
  }, [transactions])

  return {
    // Data
    transactions: filtered,
    allTransactions: transactions,
    totals,
    transactionCount: filtered.length,
    eersteJaar,
    loading,
    error,

    // Acties
    addTransaction,
    removeTransaction,
    updateTransaction,
    fetchTransactions,

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
