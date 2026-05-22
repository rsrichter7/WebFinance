// ─── useBudgets Hook ───
// Enige plek voor budget state en logica.
// Data komt uit Supabase (budgets, savings_goals, transactions tabellen).

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { CATEGORIES } from '../data/categories'

const STANDAARD_VERDELING = { noodzaak: 50, wens: 30, sparen: 20 }

export default function useBudgets() {
  const { householdId, loading: householdLoading } = useHousehold()
  const now = new Date()

  const [budgetModus, setBudgetModusState]               = useState('50/30/20')
  const [handmatigeVerdeling, setHandmatigeVerdelingState] = useState(STANDAARD_VERDELING)
  const [categorieBudgetten, setCategorieBudgetten]      = useState([])
  const [spaardoelen, setSpaardoelen]                    = useState([])
  const [allTransactions, setAllTransactions]            = useState([])
  const [geselecteerdeMaand, setGeselecteerdeMaand]      = useState({
    maand: now.getMonth() + 1,
    jaar:  now.getFullYear(),
  })
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  // ─── Alles ophalen uit Supabase ───
  const fetchAll = useCallback(async () => {
    if (!householdId) return
    setLoading(true)
    setError(null)

    const [
      { data: budgetData, error: budgetErr },
      { data: goalData,   error: goalErr },
      { data: txData,     error: txErr },
    ] = await Promise.all([
      supabase.from('budgets')
        .select('id, categorie, bedrag, modus, verdeling')
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

    // Budgetten mappen — subcategorieBudgetten niet in DB, leeg object als fallback
    setCategorieBudgetten((budgetData ?? []).map(b => ({
      id:                    b.id,
      categorie:             b.categorie,
      totaalBudget:          b.bedrag ?? 0,
      subcategorieBudgetten: {},
    })))

    // Globale modus en verdeling uit eerste rij
    const eerste = budgetData?.[0]
    if (eerste?.modus)     setBudgetModusState(eerste.modus)
    if (eerste?.verdeling) setHandmatigeVerdelingState(eerste.verdeling)

    // Transacties mappen (veldnamen DB → frontend)
    const txMapped = (txData ?? []).map(t => ({
      datum:        t.datum,
      bedrag:       t.bedrag,
      type:         t.type,
      categorie:    t.categorie,
      subcategorie: t.subcategorie ?? '',
      soort:        t.soort ?? '',
      spaardoelId:  t.spaardoel_id ?? null,
    }))
    setAllTransactions(txMapped)

    // Spaardoelen — huidigBedrag berekend uit transacties met spaardoel_id
    setSpaardoelen((goalData ?? []).map(g => ({
      id:          g.id,
      naam:        g.naam,
      doelbedrag:  g.doelbedrag,
      deadline:    g.deadline ?? null,
      icoon:       g.icoon ?? null,
      huidigBedrag: txMapped
        .filter(t => t.spaardoelId === g.id)
        .reduce((s, t) => s + t.bedrag, 0),
    })))

    setLoading(false)
  }, [householdId])

  useEffect(() => {
    if (!householdLoading) fetchAll()
  }, [fetchAll, householdLoading])

  // ─── Gefilterde transacties voor geselecteerde maand ───
  const maandTransacties = useMemo(() =>
    allTransactions.filter(t => {
      const d = new Date(t.datum)
      return d.getMonth() + 1 === geselecteerdeMaand.maand &&
             d.getFullYear() === geselecteerdeMaand.jaar
    })
  , [allTransactions, geselecteerdeMaand])

  const inkomen = useMemo(() =>
    maandTransacties.filter(t => t.type === 'Inkomst').reduce((s, t) => s + t.bedrag, 0)
  , [maandTransacties])

  const actieveVerdeling = budgetModus === 'handmatig' ? handmatigeVerdeling : STANDAARD_VERDELING

  // ─── 50/30/20 verdeling ───
  const regelVerdeling = useMemo(() => {
    const budgets = {
      noodzaak: inkomen * (actieveVerdeling.noodzaak / 100),
      wens:     inkomen * (actieveVerdeling.wens / 100),
      sparen:   inkomen * (actieveVerdeling.sparen / 100),
    }
    const uitgaven = maandTransacties.filter(t => t.type === 'Uitgave')
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
  }, [maandTransacties, inkomen, actieveVerdeling])

  // ─── Categorie overzicht met besteed en budget ───
  const categorieOverzicht = useMemo(() => {
    const uitgaven = maandTransacties.filter(t => t.type === 'Uitgave')
    return CATEGORIES.map(cat => {
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

  const totaalCategorieBudget = useMemo(() =>
    categorieBudgetten.reduce((s, b) => s + b.totaalBudget, 0)
  , [categorieBudgetten])

  const totaalBesteed = useMemo(() =>
    maandTransacties.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
  , [maandTransacties])

  // ─── Budget acties ───
  const voegBudgetToe = useCallback(async (budget) => {
    if (!householdId) return
    await supabase.from('budgets').upsert({
      household_id: householdId,
      categorie:    budget.categorie,
      bedrag:       budget.totaalBudget ?? budget.bedrag ?? 0,
      modus:        budgetModus,
      verdeling:    handmatigeVerdeling,
    }, { onConflict: 'household_id,categorie' })
    fetchAll()
  }, [householdId, budgetModus, handmatigeVerdeling, fetchAll])

  const verwijderBudget = useCallback(async (id) => {
    await supabase.from('budgets').delete().eq('id', id)
    fetchAll()
  }, [fetchAll])

  const wijzigBudget = useCallback(async (id, data) => {
    const updates = {}
    if (data.totaalBudget !== undefined) updates.bedrag = data.totaalBudget
    if (Object.keys(updates).length > 0) {
      await supabase.from('budgets').update(updates).eq('id', id)
    }
    fetchAll()
  }, [fetchAll])

  // ─── Spaardoel acties ───
  const voegSpaardoelToe = useCallback(async (doel) => {
    if (!householdId) return
    await supabase.from('savings_goals').insert({
      household_id: householdId,
      naam:         doel.naam,
      doelbedrag:   doel.doelbedrag,
      deadline:     doel.deadline || null,
      icoon:        doel.icoon || null,
    })
    fetchAll()
  }, [householdId, fetchAll])

  const verwijderSpaardoel = useCallback(async (id) => {
    await supabase.from('savings_goals').delete().eq('id', id)
    fetchAll()
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
    fetchAll()
  }, [householdId, spaardoelen, fetchAll])

  // ─── Globale instellingen persisteren naar alle budget-rijen ───
  const setBudgetModus = useCallback(async (modus) => {
    setBudgetModusState(modus)
    if (householdId) {
      await supabase.from('budgets').update({ modus }).eq('household_id', householdId)
    }
  }, [householdId])

  const setHandmatigeVerdeling = useCallback(async (verdeling) => {
    setHandmatigeVerdelingState(verdeling)
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
    totaalBudget:        inkomen,
    totaalBesteed,
    totaalResterend:     inkomen - totaalBesteed,
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
