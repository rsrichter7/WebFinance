// ─── useHousehold ───
// Haalt het household_id op van de ingelogde gebruiker.
// Gecacht op user_id — slechts één Supabase-query per sessie.

import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'
import { registerCache } from './cacheManager'

let hhCache = { householdId: null, userId: null }
function clearCache() { hhCache = { householdId: null, userId: null } }
registerCache(clearCache)

export function useHousehold() {
  const { user } = useAuth()

  const cacheHit = hhCache.userId !== null && hhCache.userId === user?.id

  const [householdId, setHouseholdId] = useState(cacheHit ? hhCache.householdId : null)
  const [loading, setLoading]         = useState(!cacheHit)

  useEffect(() => {
    if (!user) {
      setHouseholdId(null)
      setLoading(false)
      return
    }

    // Cache geldig voor dezelfde gebruiker
    if (hhCache.userId === user.id) {
      setHouseholdId(hhCache.householdId)
      setLoading(false)
      return
    }

    // Eerste keer ophalen voor deze gebruiker
    supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        const hId = data?.household_id ?? null
        hhCache = { householdId: hId, userId: user.id }
        setHouseholdId(hId)
        setLoading(false)
      })
  }, [user])

  return { householdId, loading }
}
