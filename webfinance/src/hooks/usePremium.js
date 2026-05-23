// ─── usePremium ───
// Centrale premium-status voor de hele app.
// Leest/schrijft via useSettings (Supabase), synct ook naar localStorage.

import { useCallback } from 'react'
import useSettings from './useSettings'

export default function usePremium() {
  const { settings, updateSetting } = useSettings()

  const setPremium = useCallback((val) => {
    updateSetting('premium', val)
  }, [updateSetting])

  return { isPremium: settings.premium === true, setPremium }
}
