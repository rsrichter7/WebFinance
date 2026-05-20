// ─── useBudgets Hook ───
// Enige plek voor budget state en logica.
// LocalStorage keys: "webfinance_budgets", "webfinance_spaardoelen"

import { useState, useMemo, useCallback } from 'react'
import { SAMPLE_TRANSACTIONS } from '../data/transactions'
import { sampleBudgets, sampleSpaardoelen } from '../data/budgets'
import { CATEGORIES } from '../data/categories'

const KEY_BUDGETS = 'webfinance_budgets'
const KEY_DOELEN = 'webfinance_spaardoelen'
const KEY_MODUS = 'webfinance_budget_modus'
const KEY_VERDELING = 'webfinance_budget_verdeling'
const STANDAARD_VERDELING = { noodzaak: 50, wens: 30, sparen: 20 }
const KEY_TX = 'webfinance_transactions'

function loadFromStorage(key, fallback) {
  try {
    const stored = localStorage.getItem(key)
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch {}
  return fallback
}

function saveToStorage(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)) } catch {}
}

let idCounter = Date.now()
const nextId = () => `b_${++idCounter}`

export default function useBudgets() {
  const now = new Date()

  const [budgetModusState, setBudgetModusState] = useState(
    () => localStorage.getItem(KEY_MODUS) || '50/30/20'
  )
  const [handmatigeVerdeling, setHandmatigeVerdelingState] = useState(() => {
    try {
      const stored = localStorage.getItem(KEY_VERDELING)
      if (stored) return JSON.parse(stored)
    } catch {}
    return STANDAARD_VERDELING
  })
  const [categorieBudgetten, setCategorieBudgetten] = useState(
    () => loadFromStorage(KEY_BUDGETS, sampleBudgets)
  )
  const [spaardoelen, setSpaardoelen] = useState(
    () => loadFromStorage(KEY_DOELEN, sampleSpaardoelen)
  )
  const [geselecteerdeMaand, setGeselecteerdeMaand] = useState({
    maand: now.getMonth() + 1,
    jaar: now.getFullYear(),
  })
  const [txVersion, setTxVersion] = useState(0)

  // Transacties lezen uit localStorage (zelfde bron als useTransactions)
  const [allTransactions] = useState(
    () => loadFromStorage(KEY_TX, SAMPLE_TRANSACTIONS)
  )

  // ─── Gefilterde transacties voor geselecteerde maand ───
  const maandTransacties = useMemo(() => {
    return allTransactions.filter(t => {
      const d = new Date(t.datum)
      return (
        d.getMonth() + 1 === geselecteerdeMaand.maand &&
        d.getFullYear() === geselecteerdeMaand.jaar
      )
    })
  }, [allTransactions, geselecteerdeMaand])

  // ─── Netto inkomen deze maand ───
  const inkomen = useMemo(() =>
    maandTransacties
      .filter(t => t.type === 'Inkomst')
      .reduce((s, t) => s + t.bedrag, 0)
  , [maandTransacties])

  // ─── 50/30/20 verdeling ───
  const actieveVerdeling = budgetModusState === 'handmatig' ? handmatigeVerdeling : STANDAARD_VERDELING

  const regelVerdeling = useMemo(() => {
    const budgets = {
      noodzaak: inkomen * (actieveVerdeling.noodzaak / 100),
      wens: inkomen * (actieveVerdeling.wens / 100),
      sparen: inkomen * (actieveVerdeling.sparen / 100),
    }
    const uitgaven = maandTransacties.filter(t => t.type === 'Uitgave')
    const besteed = {
      noodzaak: uitgaven.filter(t => t.soort === 'Noodzaak').reduce((s, t) => s + t.bedrag, 0),
      wens: uitgaven.filter(t => t.soort === 'Wens').reduce((s, t) => s + t.bedrag, 0),
      sparen: uitgaven.filter(t => t.soort === 'Sparen').reduce((s, t) => s + t.bedrag, 0),
    }
    const result = {}
    for (const k of ['noodzaak', 'wens', 'sparen']) {
      const b = budgets[k]; const s = besteed[k]
      result[k] = { budget: b, besteed: s, pct: b > 0 ? (s / b) * 100 : 0 }
    }
    return result
  }, [maandTransacties, inkomen, actieveVerdeling])

  // ─── Categorie overzicht met besteed en budget ───
  const categorieOverzicht = useMemo(() => {
    const uitgaven = maandTransacties.filter(t => t.type === 'Uitgave')
    return CATEGORIES.map(cat => {
      const catTx = uitgaven.filter(t => t.categorie === cat.name)
      const catBesteed = catTx.reduce((s, t) => s + t.bedrag, 0)
      const budgetSetting = categorieBudgetten.find(b => b.categorie === cat.name)
      const catBudget = budgetSetting?.totaalBudget || 0
      const pct = catBudget > 0 ? (catBesteed / catBudget) * 100 : 0
      const subs = cat.subs
        .map(sub => {
          const subBesteed = catTx.filter(t => t.sub === sub).reduce((s, t) => s + t.bedrag, 0)
          const subBudget = budgetSetting?.subcategorieBudgetten?.[sub] || 0
          return {
            naam: sub,
            besteed: subBesteed,
            budget: subBudget,
            pct: subBudget > 0 ? (subBesteed / subBudget) * 100 : 0,
          }
        })
      return { categorie: cat.name, budget: catBudget, besteed: catBesteed, pct, subs }
    })
  }, [maandTransacties, categorieBudgetten])

  // ─── Totalen ───
  const totaalCategorieBudget = useMemo(() =>
    categorieBudgetten.reduce((s, b) => s + b.totaalBudget, 0)
  , [categorieBudgetten])

  const totaalBesteed = useMemo(() =>
    maandTransacties.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
  , [maandTransacties])

  // ─── Spaardoelen met huidigBedrag berekend uit transacties ───
  const spaardoelenMetBedrag = useMemo(() => {
    let txList = []
    try {
      const stored = localStorage.getItem(KEY_TX)
      if (stored) txList = JSON.parse(stored)
    } catch {}

    return spaardoelen.map(doel => {
      const stortingen = txList.filter(t => t.spaardoelId === doel.id)
      const huidigBedrag = stortingen.reduce((s, t) => s + t.bedrag, 0)
      return { ...doel, huidigBedrag }
    })
  }, [spaardoelen, txVersion])

  // ─── Budget acties ───
  const voegBudgetToe = useCallback((budget) => {
    setCategorieBudgetten(prev => {
      const updated = [...prev, { ...budget, id: nextId() }]
      saveToStorage(KEY_BUDGETS, updated)
      return updated
    })
  }, [])

  const verwijderBudget = useCallback((id) => {
    setCategorieBudgetten(prev => {
      const updated = prev.filter(b => b.id !== id)
      saveToStorage(KEY_BUDGETS, updated)
      return updated
    })
  }, [])

  const wijzigBudget = useCallback((id, data) => {
    setCategorieBudgetten(prev => {
      const updated = prev.map(b => b.id === id ? { ...b, ...data } : b)
      saveToStorage(KEY_BUDGETS, updated)
      return updated
    })
  }, [])

  // ─── Spaardoel acties ───
  const voegSpaardoelToe = useCallback((doel) => {
    setSpaardoelen(prev => {
      const updated = [...prev, { ...doel, id: nextId(), huidigBedrag: 0 }]
      saveToStorage(KEY_DOELEN, updated)
      return updated
    })
  }, [])

  const verwijderSpaardoel = useCallback((id) => {
    setSpaardoelen(prev => {
      const updated = prev.filter(d => d.id !== id)
      saveToStorage(KEY_DOELEN, updated)
      return updated
    })
  }, [])

  const stortOpSpaardoel = useCallback((id, bedrag) => {
    if (!bedrag || bedrag <= 0) return

    // Doelnaam ophalen
    let doelNaam = ''
    setSpaardoelen(prev => {
      const doel = prev.find(d => d.id === id)
      if (doel) doelNaam = doel.naam
      return [...prev]
    })

    // Transactie aanmaken
    const today = new Date()
    const datum = today.getFullYear() + '-' +
      String(today.getMonth() + 1).padStart(2, '0') + '-' +
      String(today.getDate()).padStart(2, '0')

    const newTx = {
      id: Date.now(),
      datum,
      bedrag,
      omschrijving: `Storting spaardoel: ${doelNaam}`,
      type: 'Uitgave',
      categorie: 'Financieel',
      sub: 'Sparen / Beleggen',
      winkel: 'Webfinance',
      soort: 'Sparen',
      wie: 'GZ',
      bron: 'auto',
      spaardoelId: id,
    }

    try {
      const stored = localStorage.getItem(KEY_TX)
      const txList = stored ? JSON.parse(stored) : []
      txList.push(newTx)
      localStorage.setItem(KEY_TX, JSON.stringify(txList))
    } catch {}

    setTxVersion(v => v + 1)
  }, [])

  const setHandmatigeVerdeling = useCallback((verdeling) => {
    setHandmatigeVerdelingState(verdeling)
    try { localStorage.setItem(KEY_VERDELING, JSON.stringify(verdeling)) } catch {}
  }, [])

  const setBudgetModus = useCallback((modus) => {
    setBudgetModusState(modus)
    try { localStorage.setItem(KEY_MODUS, modus) } catch {}
  }, [])

  return {
    budgetModus: budgetModusState,
    setBudgetModus,
    categorieBudgetten,
    spaardoelen: spaardoelenMetBedrag,
    geselecteerdeMaand,
    setGeselecteerdeMaand,
    inkomen,
    totaalBudget: inkomen,
    totaalBesteed,
    totaalResterend: inkomen - totaalBesteed,
    totaalCategorieBudget,
    regelVerdeling,
    categorieOverzicht,
    actieveVerdeling,
    handmatigeVerdeling,
    setHandmatigeVerdeling,
    voegBudgetToe,
    verwijderBudget,
    wijzigBudget,
    voegSpaardoelToe,
    verwijderSpaardoel,
    stortOpSpaardoel,
  }
}