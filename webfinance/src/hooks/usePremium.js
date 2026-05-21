// ─── usePremium ───
// Centrale premium-status voor de hele app.
// Leest/schrijft naar LocalStorage key "webfinance_premium"

import { useState, useEffect } from 'react'

const KEY = 'webfinance_premium'

export default function usePremium() {
  const [isPremium, setIsPremiumState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) === true } catch { return false }
  })

  // Luister naar wijzigingen vanuit andere tabbladen
  useEffect(() => {
    function onStorage(e) {
      if (e.key === KEY) {
        try { setIsPremiumState(JSON.parse(e.newValue) === true) } catch { setIsPremiumState(false) }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  function setPremium(val) {
    setIsPremiumState(val)
    localStorage.setItem(KEY, JSON.stringify(val))
  }

  return { isPremium, setPremium }
}
