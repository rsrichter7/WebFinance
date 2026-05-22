// ─── useHousehold ───
// Haalt het household_id op van de ingelogde gebruiker.
// Wordt hergebruikt door alle hooks die per-huishouden data ophalen.

import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'

export function useHousehold() {
  const { user } = useAuth()
  const [householdId, setHouseholdId] = useState(null)
  const [loading, setLoading]         = useState(true)

  useEffect(() => {
    if (!user) {
      setHouseholdId(null)
      setLoading(false)
      return
    }

    supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id)
      .maybeSingle()
      .then(({ data }) => {
        setHouseholdId(data?.household_id ?? null)
        setLoading(false)
      })
  }, [user])

  return { householdId, loading }
}
