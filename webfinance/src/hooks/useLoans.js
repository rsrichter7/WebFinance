// ─── useLoans Hook ───
// Beheer van leningen: CRUD, berekeningen en gekoppelde vaste lasten.
// Bij toevoegen: automatisch een vaste last aanmaken in fixed_expenses.
// Bij verwijderen: gekoppelde vaste last meeverwijderen.

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { useActiveAccount } from './useActiveAccount'
import { registerCache, emit } from './cacheManager'
import { huidigeMaandlast, berekenEinddatum, resterendeMaanden } from '../utils/loanCalculations'

const KOLOMMEN = 'id, naam, type, aflossingsvorm, oorspronkelijk_bedrag, huidig_saldo, rente_percentage, looptijd_maanden, resterende_maanden, startdatum, einddatum, wie, rekening, notitie, vaste_last_id, account_id, created_at'

let loanCache = { data: null, householdId: null, accountId: null }
function clearCache() { loanCache = { data: null, householdId: null, accountId: null } }
registerCache(clearCache)

function dbNaarFrontend(row) {
  return {
    id:                    row.id,
    naam:                  row.naam,
    type:                  row.type,
    aflossingsvorm:        row.aflossingsvorm,
    oorspronkelijk_bedrag: row.oorspronkelijk_bedrag,
    huidig_saldo:          row.huidig_saldo,
    rente_percentage:      row.rente_percentage,
    looptijd_maanden:      row.looptijd_maanden,
    resterende_maanden:    row.resterende_maanden,
    startdatum:            row.startdatum,
    einddatum:             row.einddatum,
    wie:                   row.wie ?? 'GZ',
    rekening:              row.rekening ?? '',
    notitie:               row.notitie ?? '',
    vaste_last_id:         row.vaste_last_id,
    accountId:             row.account_id,
    createdAt:             row.created_at,
  }
}

function frontendNaarDb(data) {
  return {
    naam:                  data.naam,
    type:                  data.type,
    aflossingsvorm:        data.aflossingsvorm,
    oorspronkelijk_bedrag: data.oorspronkelijk_bedrag,
    huidig_saldo:          data.huidig_saldo,
    rente_percentage:      data.rente_percentage,
    looptijd_maanden:      data.looptijd_maanden,
    resterende_maanden:    data.resterende_maanden ?? 0,
    startdatum:            data.startdatum,
    einddatum:             data.einddatum ?? null,
    wie:                   data.wie ?? 'GZ',
    rekening:              data.rekening ?? '',
    notitie:               data.notitie ?? '',
  }
}

export default function useLoans() {
  const { householdId, loading: householdLoading } = useHousehold()
  const { activeAccountId, loading: accountsLoading } = useActiveAccount()

  const cacheHit = loanCache.data !== null && loanCache.householdId === householdId && loanCache.accountId === activeAccountId && householdId !== null

  const [loans, setLoans]     = useState(cacheHit ? loanCache.data : [])
  const [loading, setLoading] = useState(!cacheHit)
  const [error, setError]     = useState(null)

  const fetchLoans = useCallback(async () => {
    if (!householdId || !activeAccountId) return

    if (loanCache.data !== null && loanCache.householdId === householdId && loanCache.accountId === activeAccountId) {
      setLoans(loanCache.data)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('loans')
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
    loanCache = { data: mapped, householdId, accountId: activeAccountId }
    setLoans(mapped)
    setLoading(false)
  }, [householdId, activeAccountId])

  useEffect(() => {
    if (!householdLoading && !accountsLoading) fetchLoans()
  }, [fetchLoans, householdLoading, accountsLoading])

  // ─── Lening toevoegen + bijbehorende vaste last aanmaken ───
  const addLoan = useCallback(async (data) => {
    if (!householdId || !activeAccountId) return

    const einddatum = berekenEinddatum(data.startdatum, data.looptijd_maanden)
    const restMaanden = resterendeMaanden(einddatum)

    const { data: newLoan, error: loanErr } = await supabase
      .from('loans')
      .insert({ ...frontendNaarDb(data), einddatum, resterende_maanden: restMaanden, household_id: householdId, account_id: activeAccountId })
      .select()
      .single()

    if (loanErr) { setError(loanErr.message); return }

    // Maandlast berekenen en vaste last aanmaken
    const maandlast = huidigeMaandlast({ ...data, huidig_saldo: data.huidig_saldo })
    const afschrijfdag = new Date(data.startdatum).getDate()

    const { data: fe, error: feErr } = await supabase
      .from('fixed_expenses')
      .insert({
        household_id:  householdId,
        account_id:    activeAccountId,
        naam:          'Aflossing ' + data.naam,
        bedrag:        Math.round(maandlast * 100) / 100,
        frequentie:    'Maandelijks',
        categorie:     'Financieel',
        subcategorie:  'Aflossing lening',
        soort:         'Noodzaak',
        type:          'Uitgave',
        wie:           data.wie ?? 'GZ',
        afschrijfdag:  afschrijfdag,
        actief:        true,
        winkel:        '',
      })
      .select()
      .single()

    if (!feErr && fe) {
      await supabase.from('loans').update({ vaste_last_id: fe.id }).eq('id', newLoan.id)
    }

    clearCache()
    fetchLoans()
    emit('fixed_expenses:changed')
  }, [householdId, activeAccountId, fetchLoans])

  // ─── Lening bijwerken — herbereken maandlast bij financiële wijzigingen ───
  const updateLoan = useCallback(async (id, data) => {
    const bestaande = loans.find(l => l.id === id)
    const einddatum = berekenEinddatum(data.startdatum, data.looptijd_maanden)
    const restMaanden = resterendeMaanden(einddatum)

    const { error: err } = await supabase
      .from('loans')
      .update({ ...frontendNaarDb(data), einddatum, resterende_maanden: restMaanden })
      .eq('id', id)

    if (err) { setError(err.message); return }

    if (bestaande?.vaste_last_id) {
      const maandlast = huidigeMaandlast(data)
      await supabase.from('fixed_expenses')
        .update({
          bedrag: Math.round(maandlast * 100) / 100,
          naam:   'Aflossing ' + data.naam,
          wie:    data.wie ?? 'GZ',
        })
        .eq('id', bestaande.vaste_last_id)
    }

    clearCache()
    fetchLoans()
    emit('fixed_expenses:changed')
  }, [loans, fetchLoans])

  // ─── Lening verwijderen + gekoppelde vaste last meeverwijderen ───
  const deleteLoan = useCallback(async (id) => {
    const lening = loans.find(l => l.id === id)

    if (lening?.vaste_last_id) {
      await supabase.from('fixed_expenses').delete().eq('id', lening.vaste_last_id)
    }

    const { error: err } = await supabase.from('loans').delete().eq('id', id)
    if (!err) {
      clearCache()
      fetchLoans()
      emit('fixed_expenses:changed')
    }
  }, [loans, fetchLoans])

  return { loans, loading, error, addLoan, updateLoan, deleteLoan }
}
