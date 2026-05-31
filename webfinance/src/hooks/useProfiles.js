// ─── useProfiles Hook ───
// Enige plek voor profielen (huishoudensleden) state en logica.
// Gecacht op household_id — mutaties wissen de cache en herladen (volgorde van DB bewaard).

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { useAuth } from './useAuth'
import { registerCache } from './cacheManager'

export const PROFIEL_KLEUREN = [
  { bg: '#E0E7FF', fg: '#3730A3', label: 'Blauw'  },
  { bg: '#FCE7F3', fg: '#9D174D', label: 'Roze'   },
  { bg: '#ECFDF5', fg: '#047857', label: 'Groen'  },
  { bg: '#FEF3C7', fg: '#92400E', label: 'Amber'  },
  { bg: '#F5F3FF', fg: '#5B21B6', label: 'Paars'  },
  { bg: '#F0FDFA', fg: '#0F766E', label: 'Teal'   },
  { bg: '#FEF2F2', fg: '#991B1B', label: 'Rood'   },
  { bg: '#F3F4F6', fg: '#374151', label: 'Grijs'  },
]

// Tussenvoegsels die overgeslagen worden bij initialen-generatie
const TUSSENVOEGSELS = new Set(['de', 'van', 'der', 'den', 'het', 'ter', 'ten', 'op', 'aan', 'in', 'uit'])

export function genInitialen(naam) {
  if (!naam || !naam.trim()) return '?'
  const woorden = naam.trim().split(/\s+/)
  if (woorden.length === 1) return woorden[0].substring(0, 2).toUpperCase()
  const voornaam = woorden[0]
  let achternaam = woorden[woorden.length - 1]
  for (let i = woorden.length - 1; i > 0; i--) {
    if (!TUSSENVOEGSELS.has(woorden[i].toLowerCase())) { achternaam = woorden[i]; break }
  }
  return (voornaam[0] + achternaam[0]).toUpperCase()
}

// Kleur-veld (JSON string of enkele hex) → { bg, fg } object
function parseKleur(kleurStr) {
  if (!kleurStr) return { bg: '#F3F4F6', fg: '#6B7280' }
  try {
    const parsed = JSON.parse(kleurStr)
    if (parsed && typeof parsed === 'object') return parsed
  } catch {}
  return PROFIEL_KLEUREN.find(k => k.bg === kleurStr) || { bg: kleurStr, fg: '#374151' }
}

// DB (snake_case) → frontend profiel object
function dbNaarFrontend(row) {
  return {
    id:            row.id,
    naam:          row.naam,
    initialen:     row.initialen,
    kleur:         parseKleur(row.kleur),
    isGezamenlijk: !row.is_deletable,
    userId:        row.user_id || null,
  }
}

let prCache = { data: null, householdId: null }
function clearCache() { prCache = { data: null, householdId: null } }
registerCache(clearCache)

export default function useProfiles() {
  const { householdId, loading: householdLoading } = useHousehold()
  const { user } = useAuth()

  const cacheHit = prCache.data !== null && prCache.householdId === householdId && householdId !== null

  const [profiles, setProfiles] = useState(cacheHit ? prCache.data : [])
  const [loading, setLoading]   = useState(!cacheHit)
  const [error, setError]       = useState(null)

  // ─── Profielen ophalen uit Supabase ───
  const fetchProfiles = useCallback(async () => {
    if (!householdId) return

    // Cache geldig voor dit huishouden
    if (prCache.data !== null && prCache.householdId === householdId) {
      setProfiles(prCache.data)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const { data, error: err } = await supabase
      .from('profiles')
      .select('id, naam, initialen, kleur, is_deletable, user_id')
      .eq('household_id', householdId)
      .order('is_deletable', { ascending: false }) // GZ (false) altijd als laatste
      .order('created_at', { ascending: true })

    if (err) {
      setError(err.message)
      setLoading(false)
      return
    }

    const mapped = (data ?? []).map(dbNaarFrontend)
    prCache = { data: mapped, householdId }
    setProfiles(mapped)
    setLoading(false)
  }, [householdId])

  useEffect(() => {
    if (!householdLoading) fetchProfiles()
  }, [fetchProfiles, householdLoading])

  // Alleen personen (zonder Gezamenlijk)
  const persons = useMemo(() => profiles.filter(p => !p.isGezamenlijk), [profiles])

  // Zoek profiel op initialen — geeft null terug als niet gevonden
  const getByInitialen = useCallback((initialen) =>
    profiles.find(p => p.initialen === initialen) || null
  , [profiles])

  // ─── Profiel toevoegen — cache wissen (DB-volgorde bewaren) ───
  const addProfile = useCallback(async (data) => {
    if (!householdId) return
    await supabase.from('profiles').insert({
      household_id: householdId,
      naam:         data.naam,
      initialen:    data.initialen,
      kleur:        JSON.stringify(data.kleur),
      is_deletable: true,
    })
    prCache = { data: null, householdId: null }
    fetchProfiles()
  }, [householdId, fetchProfiles])

  // ─── Profiel bijwerken — cache wissen ───
  const updateProfile = useCallback(async (id, data) => {
    const updates = {}
    if (data.naam      !== undefined) updates.naam      = data.naam
    if (data.initialen !== undefined) updates.initialen = data.initialen
    if (data.kleur     !== undefined) updates.kleur     = JSON.stringify(data.kleur)
    if (Object.keys(updates).length > 0) {
      await supabase.from('profiles').update(updates).eq('id', id)
    }
    // Sync naar auth metadata als dit het eigen profiel is
    if (data.naam !== undefined && user) {
      const profiel = profiles.find(p => p.id === id)
      if (profiel?.userId === user.id) {
        await supabase.auth.updateUser({ data: { full_name: data.naam } })
      }
    }
    prCache = { data: null, householdId: null }
    fetchProfiles()
  }, [fetchProfiles, profiles, user])

  // ─── Profiel verwijderen (GZ en enige persoon zijn beschermd) — cache wissen ───
  const removeProfile = useCallback(async (id) => {
    const profiel = profiles.find(p => p.id === id)
    if (!profiel || profiel.isGezamenlijk) return
    if (profiles.filter(p => !p.isGezamenlijk).length <= 1) return
    await supabase.from('profiles').delete().eq('id', id)
    prCache = { data: null, householdId: null }
    fetchProfiles()
  }, [profiles, fetchProfiles])

  return {
    profiles,
    persons,
    addProfile,
    updateProfile,
    removeProfile,
    getByInitialen,
    loading,
    error,
  }
}
