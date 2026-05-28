// ─── useTheme ───
// Thema-context: biedt het actieve T-object aan alle componenten.
// Leest thema uit useSettings (ingelogd) of localStorage/systeemvoorkeur (niet ingelogd).

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './useAuth'
import useSettings from './useSettings'
import { lightTokens, darkTokens } from '../tokens'

const ThemeContext = createContext(null)

function getSystemTheme() {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeProvider({ children }) {
  const { user } = useAuth()
  const { settings, loading, updateSetting } = useSettings()

  const [systemTheme, setSystemTheme] = useState(getSystemTheme)
  const [localTheme, setLocalTheme] = useState(
    () => localStorage.getItem('webfinance_thema') || 'light'
  )

  // Sync localTheme vanuit settings zodra ze geladen zijn
  useEffect(() => {
    if (!loading && settings.thema) {
      setLocalTheme(settings.thema)
    }
  }, [settings.thema, loading])

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = e => setSystemTheme(e.matches ? 'dark' : 'light')
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  const resolvedTheme = localTheme === 'auto' ? systemTheme : (localTheme || 'light')

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme)
    localStorage.setItem('webfinance_thema', localTheme)
  }, [resolvedTheme, localTheme])

  function setTheme(value) {
    setLocalTheme(value)
    const resolved = value === 'auto' ? getSystemTheme() : value
    document.documentElement.setAttribute('data-theme', resolved)
    localStorage.setItem('webfinance_thema', value)
    if (user) {
      updateSetting('thema', value).catch(err => console.error('Thema opslaan mislukt:', err))
    }
  }

  const T = resolvedTheme === 'dark' ? darkTokens : lightTokens

  return (
    <ThemeContext.Provider value={{ theme: localTheme, resolvedTheme, T, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
    const T = isDark ? darkTokens : lightTokens
    return { theme: isDark ? 'dark' : 'light', resolvedTheme: isDark ? 'dark' : 'light', T, setTheme: () => {} }
  }
  return ctx
}
