// ─── useAuth ───
// Centrale auth-hook: sessie, inloggen, registreren, uitloggen.
// Wist alle caches bij uitloggen zodat stale data niet zichtbaar blijft.

import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { clearAllCaches } from './cacheManager'

export function useAuth() {
  const [user, setUser]       = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email, password, naam) {
    const opties = naam ? { options: { data: { full_name: naam } } } : {}
    const { data, error } = await supabase.auth.signUp({ email, password, ...opties })
    const needsConfirmation = !error && data.session === null
    return { data, error, needsConfirmation }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' })
    return { data, error }
  }

  async function signOut() {
    clearAllCaches()
    await supabase.auth.signOut()
  }

  async function refreshUser() {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (u) setUser(u)
  }

  return { user, session, loading, signUp, signIn, signOut, signInWithGoogle, refreshUser }
}
