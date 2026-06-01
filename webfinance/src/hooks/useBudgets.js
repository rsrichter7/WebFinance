// ─── useBudgets Hook ───
// Enige plek voor budget state en logica.
// Gecacht op household_id — cache wordt bij mutaties gewist (3 tabellen, complexe state).

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { registerCache } from './cacheManager'
import { CATEGORIES } from '../data/categories'

const STANDAARD_VERDELING = { noodzaak: 50, wens: 30, sparen: 20 }

// Financieel wordt uitgesloten van budgetberekeningen
const UITGESLOTEN_CAT = 'Financieel'

let bCache = { state: null, householdId: null }
function clearCache() { bCache = { state: null, householdId: null } }
registerCache(clearCache)

function verwerkData(budgetData, goalData, txData) {
  const categorieBudgetten = (budgetData ?? []).map(b => ({
    id:                    b.id,
    categorie:             b.categorie,
    totaalBudget:          b.bedrag ?? 0,
    subcategorieBudgetten: b.subcategoriebudgetten ?? {},
  }))

  const eerste = budgetData?.[0]
  const budgetModus         = eerste?.modus     || '50/30/20'
  const handmatigeVerdeling = eerste?.verdeling || STANDAARD_VERDELING

  const allTransactions = (txData ?? []).map(t => ({
    datum:        t.datum,
    bedrag:       t.bedrag,
    type:         t.type,
    categorie:    t.categorie,
    subcategorie: t.subcategorie ?? '',
    soort:        t.soort ?? '',
    spaardoelId:  t.spaardoel_id ?? null,
  }))

  const spaardoelen = (goalData ?? []).map(g => ({
    id:          g.id,
    naam:        g.naam,
    doelbedrag:  g.doelbedrag,
    deadline:    g.deadline ?? null,
    icoon:       g.icoon ?? null,
    huidigBedrag: allTransactions
      .filter(t => t.spaardoelId === g.id)
      .reduce((s, t) => s + t.bedrag, 0),
  }))

  return { categorieBudgetten, budgetModus, handmatigeVerdeling, allTransactions, spaardoelen }
}

export default function useBudgets() {
  const { householdId, loading: householdLoading } = useHousehold()
  const now = new Date()

  const cacheHit = bCache.state !== null && bCache.householdId === householdId && householdId !== null
  const cached   = cacheHit ? bCache.state : null

  const [budgetModus, setBudgetModusState]               = useState(cached?.budgetModus || '50/30/20')
  const [handmatigeVerdeling, setHandmatigeVerdelingState] = useState(cached?.handmatigeVerdeling || STANDAARD_VERDELING)
  const [categorieBudgetten, setCategorieBudgetten]      = useState(cached?.categorieBudgetten || [])
  const [spaardoelen, setSpaardoelen]                    = useState(cached?.spaardoelen || [])
  const [allTransactions, setAllTransactions]            = useState(cached?.allTransactions || [])
  const [geselecteerdeMaand, setGeselecteerdeMaand]      = useState({
    maand: now.getMonth() + 1,
    jaar:  now.getFullYear(),
  })
  const [loading, setLoading] = useState(!cacheHit)
  const [error, setError]     = useState(null)

  // Handmatig overschreven budgetinkomen (per user, opgeslagen in localStorage)
  const [handmatigBedrag, setHandmatigBedragState] = useState(() => {
    const v = localStorage.getItem('webfinance_budget_inkomen')
    return v ? parseFloat(v) : null
  })

  function setHandmatigInkomen(bedrag) {
    if (!bedrag || parseFloat(bedrag) <= 0) {
      localStorage.removeItem('webfinance_budget_inkomen')
      setHandmatigBedragState(null)
    } else {
      const n = parseFloat(String(bedrag).replace(',', '.'))
      localStorage.setItem('webfinance_budget_inkomen', String(n))
      setHandmatigBedragState(n)
    }
  }

  // ─── Alles ophalen uit Supabase ───
  const fetchAll = useCallback(async (silent = false) => {
    if (!householdId) return

    if (bCache.state !== null && bCache.householdId === householdId) {
      const s = bCache.state
      setBudgetModusState(s.budgetModus)
      setHandmatigeVerdelingState(s.handmatigeVerdeling)
      setCategorieBudgetten(s.categorieBudgetten)
      setAllTransactions(s.allTransactions)
      setSpaardoelen(s.spaardoelen)
      setLoading(false)
      return
    }

    if (!silent) setLoading(true)
    setError(null)

    const [
      { data: budgetData, error: budgetErr },
      { data: goalData,   error: goalErr },
      { data: txData,     error: txErr },
    ] = await Promise.all([
      supabase.from('budgets')
        .select('id, categorie, bedrag, modus, verdeling, subcategoriebudgetten')
        .eq('household_id', householdId),
      supabase.from('savings_goals')
        .select('id, naam, doelbedrag, deadline, icoon')
        .eq('household_id', householdId),
      supabase.from('transactions')
        .select('datum, bedrag, type, categorie, subcategorie, soort, spaardoel_id')
        .eq('household_id', householdId),
    ])

    if (budgetErr || goalErr || txErr) {
      setError(budgetErr?.message || goalErr?.message || txErr?.message)
      setLoading(false)
      return
    }

    const processed = verwerkData(budgetData, goalData, txData)
    bCache = { state: processed, householdId }

    setBudgetModusState(processed.budgetModus)
    setHandmatigeVerdelingState(processed.handmatigeVerdeling)
    setCategorieBudgetten(processed.categorieBudgetten)
    setAllTransactions(processed.allTransactions)
    setSpaardoelen(processed.spaardoelen)
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    if (!householdLoading) fetchAll()
  }, [fetchAll, householdLoading])

  function invalideerEnHerlaad() {
    bCache = { state: null, householdId: null }
    fetchAll(true)
  }

  // ─── Gefilterde transacties voor geselecteerde maand ───
  const maandTransacties = useMemo(() =>
    allTransactions.filter(t => {
      const d = new Date(t.datum)
      return d.getMonth() + 1 === geselecteerdeMaand.maand &&
             d.getFullYear() === geselecteerdeMaand.jaar
    })
  , [allTransactions, geselecteerdeMaand])

  // Werkelijk inkomen voor de geselecteerde maand
  const inkomen = useMemo(() =>
    maandTransacties.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0)
  , [maandTransacties])

  // ─── Gemiddeld inkomen: laatste 6 voltooide maanden met inkomsten ───
  const gemiddeldInkomenData = useMemo(() => {
    const curY = now.getFullYear()
    const curM = now.getMonth()
    const maandMap = {}
    for (const t of allTransactions) {
      if (t.type !== 'Inkomst') continue
      const d = new Date(t.datum)
      const y = d.getFullYear()
      const m = d.getMonth()
      if (y === curY && m === curM) continue // huidige maand niet meenemen
      const key = `${y}-${m}`
      maandMap[key] = (maandMap[key] || 0) + t.bedrag
    }
    const sorted = Object.entries(maandMap)
      .map(([key, total]) => {
        const [y, m] = key.split('-').map(Number)
        return { sortKey: y * 12 + m, total }
      })
      .sort((a, b) => b.sortKey - a.sortKey)
      .slice(0, 6)
    if (sorted.length === 0) return { gemiddeld: 0, aantalMaanden: 0 }
    const totaal = sorted.reduce((s, e) => s + e.total, 0)
    return {
      gemiddeld: Math.round((totaal / sorted.length) * 100) / 100,
      aantalMaanden: sorted.length,
    }
  }, [allTransactions])

  // Effectief inkomen: handmatig > huidig maand > gemiddelde
  const effectiefInkomen = useMemo(() => {
    if (handmatigBedrag > 0) return handmatigBedrag
    if (inkomen > 0) return inkomen
    return gemiddeldInkomenData.gemiddeld
  }, [handmatigBedrag, inkomen, gemiddeldInkomenData])

  const budgetInkomenBron = handmatigBedrag > 0 ? 'handmatig' : inkomen > 0 ? 'huidig' : 'gemiddeld'
  const aantalMaanden = gemiddeldInkomenData.aantalMaanden

  const actieveVerdeling = budgetModus === 'handmatig' ? handmatigeVerdeling : STANDAARD_VERDELING

  // ─── 50/30/20 verdeling — Financieel uitgesloten ───
  const regelVerdeling = useMemo(() => {
    const budgets = {
      noodzaak: effectiefInkomen * (actieveVerdeling.noodzaak / 100),
      wens:     effectiefInkomen * (actieveVerdeling.wens / 100),
      sparen:   effectiefInkomen * (actieveVerdeling.sparen / 100),
    }
    const uitgaven = maandTransacties.filter(t => t.type === 'Uitgave' && t.categorie !== UITGESLOTEN_CAT)
    const besteed  = {
      noodzaak: uitgaven.filter(t => t.soort === 'Noodzaak').reduce((s, t) => s + t.bedrag, 0),
      wens:     uitgaven.filter(t => t.soort === 'Wens').reduce((s, t) => s + t.bedrag, 0),
      sparen:   uitgaven.filter(t => t.soort === 'Sparen').reduce((s, t) => s + t.bedrag, 0),
    }
    const result = {}
    for (const k of ['noodzaak', 'wens', 'sparen']) {
      const b = budgets[k]; const s = besteed[k]
      result[k] = { budget: b, besteed: s, pct: b > 0 ? (s / b) * 100 : 0 }
    }
    return result
  }, [maandTransacties, effectiefInkomen, actieveVerdeling])

  // ─── Categorie overzicht — Financieel uitgesloten ───
  const categorieOverzicht = useMemo(() => {
    const uitgaven = maandTransacties.filter(t => t.type === 'Uitgave')
    return CATEGORIES.filter(cat => cat.name !== UITGESLOTEN_CAT).map(cat => {
      const catTx      = uitgaven.filter(t => t.categorie === cat.name)
      const catBesteed = catTx.reduce((s, t) => s + t.bedrag, 0)
      const setting    = categorieBudgetten.find(b => b.categorie === cat.name)
      const catBudget  = setting?.totaalBudget || 0
      const subs = cat.subs.map(sub => {
        const subBesteed = catTx.filter(t => t.subcategorie === sub).reduce((s, t) => s + t.bedrag, 0)
        const subBudget  = setting?.subcategorieBudgetten?.[sub] || 0
        return { naam: sub, besteed: subBesteed, budget: subBudget, pct: subBudget > 0 ? (subBesteed / subBudget) * 100 : 0 }
      })
      return { categorie: cat.name, budget: catBudget, besteed: catBesteed, pct: catBudget > 0 ? (catBesteed / catBudget) * 100 : 0, subs }
    })
  }, [maandTransacties, categorieBudgetten])

  // Financieel uitgesloten uit totalen
  const totaalCategorieBudget = useMemo(() =>
    categorieBudgetten
      .filter(b => b.categorie !== UITGESLOTEN_CAT)
      .reduce((s, b) => s + b.totaalBudget, 0)
  , [categorieBudgetten])

  const totaalBesteed = useMemo(() =>
    maandTransacties
      .filter(t => t.type === 'Uitgave' && t.categorie !== UITGESLOTEN_CAT)
      .reduce((s, t) => s + t.bedrag, 0)
  , [maandTransacties])

  // ─── Budget acties ───
  const voegBudgetToe = useCallback(async (budget) => {
    if (!householdId) return
    await supabase.from('budgets').upsert({
      household_id:          householdId,
      categorie:             budget.categorie,
      bedrag:                budget.totaalBudget ?? budget.bedrag ?? 0,
      subcategoriebudgetten: budget.subcategorieBudgetten ?? {},
      modus:                 budgetModus,
      verdeling:             handmatigeVerdeling,
    }, { onConflict: 'household_id,categorie' })
    invalideerEnHerlaad()
  }, [householdId, budgetModus, handmatigeVerdeling, fetchAll])

  const verwijderBudget = useCallback(async (id) => {
    await supabase.from('budgets').delete().eq('id', id)
    invalideerEnHerlaad()
  }, [fetchAll])

  const wijzigBudget = useCallback(async (id, data) => {
    const updates = {}
    if (data.totaalBudget          !== undefined) updates.bedrag                = data.totaalBudget
    if (data.subcategorieBudgetten !== undefined) updates.subcategoriebudgetten = data.subcategorieBudgetten
    if (Object.keys(updates).length > 0) {
      await supabase.from('budgets').update(updates).eq('id', id)
    }
    invalideerEnHerlaad()
  }, [fetchAll])

  // ─── Spaardoel acties ───
  const voegSpaardoelToe = useCallback(async (doel) => {
    if (!householdId) return
    const { error: err } = await supabase.from('savings_goals').insert({
      household_id: householdId,
      naam:         doel.naam,
      doelbedrag:   doel.doelbedrag,
      deadline:     doel.deadline || null,
      icoon:        doel.icoon || null,
    })
    if (!err) invalideerEnHerlaad()
  }, [householdId, fetchAll])

  const verwijderSpaardoel = useCallback(async (id) => {
    await supabase.from('savings_goals').delete().eq('id', id)
    invalideerEnHerlaad()
  }, [fetchAll])

  const stortOpSpaardoel = useCallback(async (id, bedrag) => {
    if (!bedrag || bedrag <= 0 || !householdId) return
    const doel  = spaardoelen.find(d => d.id === id)
    const today = new Date().toISOString().split('T')[0]
    await supabase.from('transactions').insert({
      household_id: householdId,
      datum:         today,
      bedrag,
      beschrijving:  `Storting spaardoel: ${doel?.naam || ''}`,
      type:          'Uitgave',
      categorie:     'Financieel',
      subcategorie:  'Sparen / Beleggen',
      soort:         'Sparen',
      wie:           'GZ',
      bron:          'auto',
      spaardoel_id:  id,
    })
    invalideerEnHerlaad()
  }, [householdId, spaardoelen, fetchAll])

  // ─── Globale instellingen persisteren ───
  const setBudgetModus = useCallback(async (modus) => {
    setBudgetModusState(modus)
    if (bCache.state) bCache.state = { ...bCache.state, budgetModus: modus }
    if (householdId) {
      await supabase.from('budgets').update({ modus }).eq('household_id', householdId)
    }
  }, [householdId])

  const setHandmatigeVerdeling = useCallback(async (verdeling) => {
    setHandmatigeVerdelingState(verdeling)
    if (bCache.state) bCache.state = { ...bCache.state, handmatigeVerdeling: verdeling }
    if (householdId) {
      await supabase.from('budgets').update({ verdeling }).eq('household_id', householdId)
    }
  }, [householdId])

  return {
    budgetModus,
    setBudgetModus,
    categorieBudgetten,
    spaardoelen,
    geselecteerdeMaand,
    setGeselecteerdeMaand,
    inkomen,
    effectiefInkomen,
    budgetInkomenBron,
    aantalMaanden,
    setHandmatigInkomen,
    allTransactions,
    totaalBudget:        effectiefInkomen,
    totaalBesteed,
    totaalResterend:     effectiefInkomen - totaalBesteed,
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
    loading,
    error,
  }
}
