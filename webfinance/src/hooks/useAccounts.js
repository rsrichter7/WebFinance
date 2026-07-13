// ─── useAccounts Hook ───
// Enige plek voor rekeningen (meerdere bankrekeningen) state en logica.
// Gecacht op household_id — mutaties wissen de cache en herladen.

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { useAuth } from './useAuth'
import { registerCache } from './cacheManager'

const KOLOMMEN = 'id, household_id, user_id, naam, gedeeld, iban, volgorde, bron, extern_account_id, provider, aspsp_naam, laatst_gesynct, sessie_id, koppeling_vervalt, startsaldo_bedrag, startsaldo_datum, created_at'

// DB (snake_case) → frontend rekening object
function dbNaarFrontend(row) {
  return {
    id:                row.id,
    householdId:       row.household_id,
    userId:            row.user_id,
    naam:              row.naam,
    gedeeld:           row.gedeeld,
    iban:              row.iban,
    volgorde:          row.volgorde,
    bron:              row.bron,
    externAccountId:   row.extern_account_id,
    provider:          row.provider,
    aspspNaam:         row.aspsp_naam,
    laatstGesynct:     row.laatst_gesynct,
    sessieId:          row.sessie_id,
    koppelingVervalt:  row.koppeling_vervalt,
    startsaldoBedrag:  row.startsaldo_bedrag ?? null,
    startsaldoDatum:   row.startsaldo_datum ?? null,
    createdAt:         row.created_at,
  }
}

// Frontend rekening object → DB (snake_case), alleen aanwezige velden
function frontendNaarDb(acc) {
  const updates = {}
  if (acc.naam             !== undefined) updates.naam               = acc.naam
  if (acc.gedeeld          !== undefined) updates.gedeeld            = acc.gedeeld
  if (acc.iban             !== undefined) updates.iban               = acc.iban
  if (acc.volgorde         !== undefined) updates.volgorde           = acc.volgorde
  if (acc.bron             !== undefined) updates.bron               = acc.bron
  if (acc.externAccountId  !== undefined) updates.extern_account_id  = acc.externAccountId
  if (acc.provider         !== undefined) updates.provider           = acc.provider
  if (acc.aspspNaam        !== undefined) updates.aspsp_naam         = acc.aspspNaam
  if (acc.laatstGesynct    !== undefined) updates.laatst_gesynct     = acc.laatstGesynct
  if (acc.sessieId         !== undefined) updates.sessie_id          = acc.sessieId
  if (acc.koppelingVervalt !== undefined) updates.koppeling_vervalt  = acc.koppelingVervalt
  if (acc.userId           !== undefined) updates.user_id            = acc.userId
  if (acc.startsaldoBedrag !== undefined) updates.startsaldo_bedrag  = acc.startsaldoBedrag
  if (acc.startsaldoDatum  !== undefined) updates.startsaldo_datum   = acc.startsaldoDatum
  return updates
}

let accCache = { data: null, householdId: null }
function clearCache() { accCache = { data: null, householdId: null } }
registerCache(clearCache)

export default function useAccounts() {
  const { householdId, loading: householdLoading } = useHousehold()
  const { user } = useAuth()

  const cacheHit = accCache.data !== null && accCache.householdId === householdId && householdId !== null

  const [accounts, setAccounts] = useState(cacheHit ? accCache.data : [])
  const [loading, setLoading]   = useState(!cacheHit)
  const [error, setError]       = useState(null)

  // ─── Rekeningen ophalen uit Supabase ───
  const fetchAccounts = useCallback(async () => {
    if (!householdId) return

    // Cache geldig voor dit huishouden
    if (accCache.data !== null && accCache.householdId === householdId) {
      setAccounts(accCache.data)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('rekeningen')
      .select(KOLOMMEN)
      .eq('household_id', householdId)
      .order('volgorde', { ascending: true })
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const mapped = (data ?? []).map(dbNaarFrontend)
    accCache = { data: mapped, householdId }
    setAccounts(mapped)
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    if (!householdLoading) fetchAccounts()
  }, [fetchAccounts, householdLoading])

  // ─── Rekening toevoegen — hoogste volgorde+1, cache wissen ───
  const addAccount = useCallback(async (data) => {
    if (!householdId) return

    const hoogsteVolgorde = accounts.reduce((max, acc) => Math.max(max, acc.volgorde ?? 0), 0)

    const { error: err } = await supabase.from('rekeningen').insert({
      household_id: householdId,
      volgorde:     hoogsteVolgorde + 1,
      bron:         'handmatig',
      ...frontendNaarDb(data),
      user_id:      data.gedeeld ? null : (user?.id ?? null),
    })

    if (err) { setError(err.message); return }

    accCache = { data: null, householdId: null }
    fetchAccounts()
  }, [householdId, accounts, user, fetchAccounts])

  // ─── Rekening bijwerken — cache wissen ───
  const updateAccount = useCallback(async (id, data) => {
    const updates = frontendNaarDb(data)
    if (Object.keys(updates).length > 0) {
      const { error: err } = await supabase.from('rekeningen').update(updates).eq('id', id)
      if (err) { setError(err.message); return }
    }
    accCache = { data: null, householdId: null }
    fetchAccounts()
  }, [fetchAccounts])

  // ─── Rekening verwijderen (cascade ruimt gekoppelde data op) — cache wissen ───
  const removeAccount = useCallback(async (id) => {
    const { error: err } = await supabase.from('rekeningen').delete().eq('id', id)
    if (err) { setError(err.message); return }
    accCache = { data: null, householdId: null }
    fetchAccounts()
  }, [fetchAccounts])

  return {
    accounts,
    loading,
    error,
    addAccount,
    updateAccount,
    removeAccount,
    refresh: fetchAccounts,
  }
}
