// ─── useCustomAnalyses Hook ───
// Enige plek voor state en logica van de analyses op de Analyse-pagina.
// Huishouden-breed gecacht (geen account_id — analyses zijn niet rekening-gebonden).

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { registerCache } from './cacheManager'

let caCache = { state: null, householdId: null }
function clearCache() { caCache = { state: null, householdId: null } }
registerCache(clearCache)

function dbNaarFrontend(row) {
  return {
    id:       row.id,
    naam:     row.naam,
    familie:  row.familie,
    config:   row.config ?? {},
    volgorde: row.volgorde ?? 0,
  }
}

export default function useCustomAnalyses() {
  const { householdId, loading: householdLoading } = useHousehold()

  const cacheHit = caCache.state !== null && caCache.householdId === householdId && householdId !== null
  const cached   = cacheHit ? caCache.state : null

  const [analyses, setAnalyses] = useState(cached || [])
  const [loading, setLoading]   = useState(!cacheHit)
  const [error, setError]       = useState(null)

  const fetchAll = useCallback(async (silent = false) => {
    if (!householdId) return

    if (caCache.state !== null && caCache.householdId === householdId) {
      setAnalyses(caCache.state)
      setLoading(false)
      return
    }

    if (!silent) setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('custom_analyses')
      .select('id, naam, familie, config, volgorde')
      .eq('household_id', householdId)
      .order('volgorde', { ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const processed = (data ?? []).map(dbNaarFrontend)
    caCache = { state: processed, householdId }
    setAnalyses(processed)
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    if (!householdLoading) fetchAll()
  }, [fetchAll, householdLoading])

  function invalideerEnHerlaad() {
    caCache = { state: null, householdId: null }
    fetchAll(true)
  }

  const herordenAnalyses = useCallback(async (nieuweVolgordeArrayVanIds) => {
    const vorige = analyses
    const herordend = nieuweVolgordeArrayVanIds.map((id, i) => {
      const item = vorige.find(a => a.id === id)
      return { ...item, volgorde: i }
    })
    setAnalyses(herordend)
    caCache = { state: herordend, householdId }

    await Promise.all(
      nieuweVolgordeArrayVanIds.map((id, i) =>
        supabase.from('custom_analyses').update({ volgorde: i }).eq('id', id)
      )
    )
  }, [analyses, householdId])

  const verwijderAnalyse = useCallback(async (id) => {
    await supabase.from('custom_analyses').delete().eq('id', id)
    invalideerEnHerlaad()
  }, [fetchAll])

  const voegAnalyseToe = useCallback(async (data) => {
    if (!householdId) return
    await supabase.from('custom_analyses').insert({
      household_id: householdId,
      naam:         data.naam,
      familie:      data.familie,
      config:       data.config,
      volgorde:     analyses.length,
    })
    invalideerEnHerlaad()
  }, [householdId, analyses.length, fetchAll])

  const wijzigAnalyse = useCallback(async (id, data) => {
    await supabase.from('custom_analyses').update({
      naam:    data.naam,
      familie: data.familie,
      config:  data.config,
    }).eq('id', id)
    invalideerEnHerlaad()
  }, [fetchAll])

  return {
    analyses,
    loading,
    error,
    herordenAnalyses,
    verwijderAnalyse,
    voegAnalyseToe,
    wijzigAnalyse,
  }
}
