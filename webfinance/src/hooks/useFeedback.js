// ─── useFeedback Hook ───
// Feedback van gebruikers: verzenden, inzien en beheren als admin.
// Admin-check via localStorage (zelfde aanpak als SettingsAdmin).

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { useAuth } from './useAuth'

const ADMIN_KEY = 'webfinance_admin_unlocked'

function dbNaarFrontend(row) {
  return {
    id:            row.id,
    householdId:   row.household_id,
    userId:        row.user_id,
    onderwerp:     row.onderwerp,
    bericht:       row.bericht,
    afbeeldingUrl: row.afbeelding_url ?? null,
    status:        row.status,
    adminNotitie:  row.admin_notitie ?? '',
    createdAt:     row.created_at,
    updatedAt:     row.updated_at,
  }
}

export default function useFeedback() {
  const { householdId, loading: householdLoading } = useHousehold()
  const { user } = useAuth()

  const [myFeedback, setMyFeedback]   = useState([])
  const [allFeedback, setAllFeedback] = useState([])
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState(null)

  const isAdmin = localStorage.getItem(ADMIN_KEY) === 'true'

  const fetchMyFeedback = useCallback(async () => {
    if (!householdId || !user) return
    const { data, error: err } = await supabase
      .from('feedback')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    if (!err) setMyFeedback((data ?? []).map(dbNaarFrontend))
  }, [householdId, user])

  const fetchAllFeedback = useCallback(async () => {
    if (localStorage.getItem(ADMIN_KEY) !== 'true') return
    setLoading(true)
    setError(null)
    const { data, error: err } = await supabase.rpc('get_all_feedback')
    if (err) {
      setError(err.message)
    } else {
      setAllFeedback((data ?? []).map(dbNaarFrontend))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    if (householdLoading || !householdId) return
    fetchMyFeedback()
    if (localStorage.getItem(ADMIN_KEY) === 'true') fetchAllFeedback()
  }, [householdLoading, householdId, fetchMyFeedback, fetchAllFeedback])

  const submitFeedback = useCallback(async ({ onderwerp, bericht, afbeelding }) => {
    if (!householdId || !user) return { error: 'Niet ingelogd' }

    let afbeelding_url = null
    if (afbeelding) {
      try {
        const ext = afbeelding.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadErr } = await supabase.storage
          .from('feedback-images')
          .upload(path, afbeelding)
        if (!uploadErr) {
          const { data: urlData } = supabase.storage.from('feedback-images').getPublicUrl(path)
          afbeelding_url = urlData?.publicUrl ?? null
        }
      } catch (_) {
        // Storage niet beschikbaar — doorgaan zonder afbeelding
      }
    }

    const { error: err } = await supabase.from('feedback').insert({
      household_id:  householdId,
      user_id:       user.id,
      onderwerp:     onderwerp.trim(),
      bericht:       bericht.trim(),
      afbeelding_url,
      status:        'open',
    })

    if (err) return { error: err.message }
    await fetchMyFeedback()
    if (localStorage.getItem(ADMIN_KEY) === 'true') await fetchAllFeedback()
    return { error: null }
  }, [householdId, user, fetchMyFeedback, fetchAllFeedback])

  const updateStatus = useCallback(async (feedbackId, status, notitie = '') => {
    const { error: err } = await supabase.rpc('update_feedback_status', {
      feedback_id: feedbackId,
      new_status:  status,
      notitie:     notitie || '',
    })
    if (!err) await fetchAllFeedback()
    return { error: err?.message ?? null }
  }, [fetchAllFeedback])

  const unreadCount = allFeedback.filter(f => f.status === 'open').length

  return {
    myFeedback,
    allFeedback,
    submitFeedback,
    updateStatus,
    fetchAllFeedback,
    unreadCount,
    loading,
    error,
    isAdmin,
  }
}
