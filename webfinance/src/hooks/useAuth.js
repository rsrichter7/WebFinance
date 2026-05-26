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

  async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    return { data, error }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signOut() {
    clearAllCaches()
    await supabase.auth.signOut()
  }

  return { user, session, loading, signUp, signIn, signOut }
}
