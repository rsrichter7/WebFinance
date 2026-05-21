// ─── useProfiles Hook ───
// Enige plek voor profielen (huishoudensleden) state en logica.
// LocalStorage key: "webfinance_profielen"

import { useState, useCallback } from 'react'

const KEY = 'webfinance_profielen'

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

const DEFAULT_PROFILES = [
  { id: 'prof_1',  naam: 'Ronald Richter', initialen: 'RR', kleur: { bg: '#E0E7FF', fg: '#3730A3' }, isGezamenlijk: false },
  { id: 'prof_gz', naam: 'Gezamenlijk',    initialen: 'GZ', kleur: { bg: '#F3F4F6', fg: '#6B7280' }, isGezamenlijk: true  },
]

// Tussenvoegsels die overgeslagen worden bij initialen-generatie
const TUSSENVOEGSELS = new Set(['de', 'van', 'der', 'den', 'het', 'ter', 'ten', 'op', 'aan', 'in', 'uit'])

export function genInitialen(naam) {
  if (!naam || !naam.trim()) return '?'
  const woorden = naam.trim().split(/\s+/)
  if (woorden.length === 1) return woorden[0].substring(0, 2).toUpperCase()

  const voornaam = woorden[0]
  // Zoek achternaam: eerste significante woord van achter naar voor
  let achternaam = woorden[woorden.length - 1]
  for (let i = woorden.length - 1; i > 0; i--) {
    if (!TUSSENVOEGSELS.has(woorden[i].toLowerCase())) { achternaam = woorden[i]; break }
  }
  return (voornaam[0] + achternaam[0]).toUpperCase()
}

function load() {
  try {
    const s = localStorage.getItem(KEY)
    if (s) {
      const p = JSON.parse(s)
      if (Array.isArray(p) && p.length > 0) return p
    }
  } catch {}
  return DEFAULT_PROFILES
}

function persist(data) {
  try { localStorage.setItem(KEY, JSON.stringify(data)) } catch {}
}

let idCounter = Date.now()
const nextId = () => `prof_${++idCounter}`

export default function useProfiles() {
  const [profiles, setProfiles] = useState(load)

  // Alleen personen (zonder Gezamenlijk)
  const persons = profiles.filter(p => !p.isGezamenlijk)

  // Zoek profiel op initialen — geeft null terug als niet gevonden
  const getByInitialen = useCallback((initialen) => {
    return profiles.find(p => p.initialen === initialen) || null
  }, [profiles])

  const addProfile = useCallback((data) => {
    setProfiles(prev => {
      const gz   = prev.find(p => p.isGezamenlijk)
      const rest = prev.filter(p => !p.isGezamenlijk)
      const nieuw = { ...data, id: nextId(), isGezamenlijk: false }
      const updated = gz ? [...rest, nieuw, gz] : [...rest, nieuw]
      persist(updated)
      return updated
    })
  }, [])

  const updateProfile = useCallback((id, data) => {
    setProfiles(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...data } : p)
      persist(updated)
      return updated
    })
  }, [])

  const removeProfile = useCallback((id) => {
    setProfiles(prev => {
      if (prev.filter(p => !p.isGezamenlijk).length <= 1) return prev
      const updated = prev.filter(p => p.id !== id)
      persist(updated)
      return updated
    })
  }, [])

  return { profiles, persons, addProfile, updateProfile, removeProfile, getByInitialen }
}
