// ─── useSettings Hook ───
// Centrale instellingen per gebruiker. Data komt uit Supabase (user_settings tabel).
// Gecacht op user_id — wijzigingen bijwerken de cache direct (geen refetch nodig).

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'
import { registerCache } from './cacheManager'

const DEFAULTS = {
  datumformaat:       'long',
  taal:               'nl',
  thema:              'light',
  custom_categories:  { customSubs: {}, customCats: [] },
  kosten_inkomen:     {},
  verdeel_methode:    'ratio',
  startsaldo:         null,
  profiel_naam:       '',
  profiel_email:      '',
  analytics_order:    ['categories', 'subcategories', 'soort', 'inkexp'],
  import_max_regels:  1000,
  notif_budget:        true,
  notif_vaste_lasten:  true,
  dashboard_periode:  'loon',
  loon_dag:           25,
}

const SELECT_COLS = 'datumformaat, taal, thema, custom_categories, kosten_inkomen, verdeel_methode, startsaldo, profiel_naam, profiel_email, analytics_order, import_max_regels, notif_budget, notif_vaste_lasten, dashboard_periode, loon_dag'

let sCache = { settings: null, userId: null }
function clearCache() { sCache = { settings: null, userId: null } }
registerCache(clearCache)

function syncLocalStorage(data) {
  if (data.datumformaat)      localStorage.setItem('webfinance_datumformaat', data.datumformaat)
  if (data.custom_categories) localStorage.setItem('webfinance_custom_categories', JSON.stringify(data.custom_categories))
  if (data.thema)             localStorage.setItem('webfinance_thema', data.thema)
}

export default function useSettings() {
  const { user, loading: authLoading } = useAuth()

  const cacheHit = sCache.userId !== null && sCache.userId === user?.id

  const [settings, setSettings] = useState(cacheHit ? sCache.settings : DEFAULTS)
  const [loading, setLoading]   = useState(!cacheHit)
  const [error, setError]       = useState(null)

  const fetchSettings = useCallback(async () => {
    if (!user) return

    // Cache geldig voor dezelfde gebruiker
    if (sCache.userId === user.id && sCache.settings !== null) {
      setSettings(sCache.settings)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('user_settings')
      .select(SELECT_COLS)
      .eq('user_id', user.id)
      .maybeSingle()

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    if (data) {
      const merged = { ...DEFAULTS }
      for (const [k, v] of Object.entries(data)) {
        if (v !== null && v !== undefined) merged[k] = v
      }
      sCache = { settings: merged, userId: user.id }
      setSettings(merged)
      syncLocalStorage(merged)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    if (!authLoading) {
      if (user) fetchSettings()
      else { setSettings(DEFAULTS); setLoading(false) }
    }
  }, [fetchSettings, authLoading, user])

  const updateSetting = useCallback(async (key, value) => {
    if (!user) return
    const updated = { ...(sCache.settings || settings), [key]: value }
    sCache = { settings: updated, userId: user.id }
    setSettings(updated)
    syncLocalStorage({ [key]: value })
    await supabase.from('user_settings')
      .update({ [key]: value })
      .eq('user_id', user.id)
  }, [user, settings])

  const updateSettings = useCallback(async (updates) => {
    if (!user) return
    const updated = { ...(sCache.settings || settings), ...updates }
    sCache = { settings: updated, userId: user.id }
    setSettings(updated)
    syncLocalStorage(updates)
    await supabase.from('user_settings')
      .update(updates)
      .eq('user_id', user.id)
  }, [user, settings])

  return { settings, loading, error, updateSetting, updateSettings }
}
