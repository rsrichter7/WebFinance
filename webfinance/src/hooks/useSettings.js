// ─── useSettings Hook ───
// Centrale instellingen per gebruiker. Data komt uit Supabase (user_settings tabel).
// Synct datumformaat, custom_categories en premium ook naar localStorage voor backward compat.

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'

const DEFAULTS = {
  datumformaat:      'long',
  taal:              'nl',
  thema:             'light',
  premium:           false,
  custom_categories: { customSubs: {}, customCats: [] },
  kosten_inkomen:    {},
  verdeel_methode:   'ratio',
  startsaldo:        null,
  profiel_naam:      '',
  profiel_email:     '',
  analytics_order:   ['categories', 'subcategories', 'soort', 'inkexp'],
}

const SELECT_COLS = 'datumformaat, taal, thema, premium, custom_categories, kosten_inkomen, verdeel_methode, startsaldo, profiel_naam, profiel_email, analytics_order'

function syncLocalStorage(data) {
  if (data.datumformaat)      localStorage.setItem('webfinance_datumformaat', data.datumformaat)
  if (data.custom_categories) localStorage.setItem('webfinance_custom_categories', JSON.stringify(data.custom_categories))
  if (typeof data.premium === 'boolean') localStorage.setItem('webfinance_premium', JSON.stringify(data.premium))
}

export default function useSettings() {
  const { user, loading: authLoading } = useAuth()
  const [settings, setSettings] = useState(DEFAULTS)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)

  const fetchSettings = useCallback(async () => {
    if (!user) return
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
    setSettings(prev => ({ ...prev, [key]: value }))
    syncLocalStorage({ [key]: value })
    await supabase.from('user_settings').upsert(
      { user_id: user.id, [key]: value, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
  }, [user])

  const updateSettings = useCallback(async (updates) => {
    if (!user) return
    setSettings(prev => ({ ...prev, ...updates }))
    syncLocalStorage(updates)
    await supabase.from('user_settings').upsert(
      { user_id: user.id, ...updates, updated_at: new Date().toISOString() },
      { onConflict: 'user_id' }
    )
  }, [user])

  return { settings, loading, error, updateSetting, updateSettings }
}
