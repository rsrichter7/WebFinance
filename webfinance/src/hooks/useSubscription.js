// ─── useSubscription ───
// Leest de abonnementsstatus van het huishouden uit Supabase (subscriptions-tabel).
// Exporteert afgeleide booleans voor toegangscontrole en trial-weergave.

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { registerCache } from './cacheManager'

let subCache = { data: null, householdId: null }
function clearCache() { subCache = { data: null, householdId: null } }
registerCache(clearCache)

function derivedState(row) {
  if (!row) return { isTrialing: false, isActive: false, hasAccess: true, needsPayment: false, trialDaysLeft: 0 }

  const now        = new Date()
  const trialEnd   = row.trial_ends_at ? new Date(row.trial_ends_at) : null
  const isTrialing = row.status === 'trialing' && trialEnd !== null && trialEnd > now
  const isActive   = row.status === 'active'
  const hasAccess  = isTrialing || isActive

  const msLeft        = trialEnd ? trialEnd - now : 0
  const trialDaysLeft = Math.max(0, Math.ceil(msLeft / (1000 * 60 * 60 * 24)))

  return { isTrialing, isActive, hasAccess, needsPayment: !hasAccess, trialDaysLeft }
}

export default function useSubscription() {
  const { householdId, loading: householdLoading } = useHousehold()

  const cacheHit = subCache.householdId !== null && subCache.householdId === householdId

  const [subscription, setSubscription] = useState(cacheHit ? subCache.data : null)
  const [loading, setLoading]           = useState(!cacheHit)
  const [error, setError]               = useState(null)

  const fetchSubscription = useCallback(async () => {
    if (!householdId) return
    const { data, error: err } = await supabase
      .from('subscriptions')
      .select('status, plan, trial_ends_at, current_period_end')
      .eq('household_id', householdId)
      .maybeSingle()
    if (err) { setError(err); setLoading(false); return }
    subCache = { data, householdId }
    setSubscription(data)
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    if (householdLoading) return
    if (!householdId) { setLoading(false); return }
    if (cacheHit) {
      // State synchen vanuit cache: subscription kan null zijn als useState vóór cache-populatie draaide
      setSubscription(subCache.data)
      setLoading(false)
      return
    }
    fetchSubscription()
  }, [householdLoading, householdId, fetchSubscription])

  const derived = derivedState(subscription)

  return { subscription, loading, error, ...derived }
}
