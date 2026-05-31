// ─── useInvitations ───
// Beheer van huishouden-uitnodigingen: aanmaken, intrekken, ophalen en accepteren.

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useHousehold } from './useHousehold'
import { useAuth } from './useAuth'
import { clearAllCaches } from './cacheManager'

export default function useInvitations() {
  const { user } = useAuth()
  const { householdId, loading: householdLoading } = useHousehold()
  const [myInvitations, setMyInvitations]     = useState([])
  const [loading, setLoading]                 = useState(false)
  const [householdMembers, setHouseholdMembers] = useState([])
  const [membersLoading, setMembersLoading]   = useState(false)

  // Haal openstaande uitnodigingen op voor de ingelogde user
  const fetchInvitations = useCallback(async () => {
    if (!householdId || !user) return
    setLoading(true)
    const { data } = await supabase
      .from('household_invitations')
      .select('*')
      .eq('invited_by', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
    setMyInvitations(data ?? [])
    setLoading(false)
  }, [householdId, user])

  // Haal echte gebruikersaccounts op via RPC (omzeilt RLS op household_members)
  const fetchHouseholdMembers = useCallback(async () => {
    if (!householdId) return
    setMembersLoading(true)
    const { data } = await supabase.rpc('get_household_members')
    setHouseholdMembers(data ?? [])
    setMembersLoading(false)
  }, [householdId])

  useEffect(() => {
    if (!householdLoading) {
      fetchInvitations()
      fetchHouseholdMembers()
    }
  }, [fetchInvitations, fetchHouseholdMembers, householdLoading])

  // Maak nieuwe uitnodiging aan, retourneer de deelbare link
  async function createInvitation() {
    if (!householdId || !user) return null
    const token = crypto.randomUUID()
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    const { error } = await supabase.from('household_invitations').insert({
      household_id: householdId,
      invited_by:   user.id,
      token,
      status:       'pending',
      expires_at:   expiresAt,
    })
    if (error) return null
    await fetchInvitations()
    return `${window.location.origin}/uitnodiging/${token}`
  }

  // Zet status op 'expired' zodat de link niet meer bruikbaar is
  const cancelInvitation = useCallback(async (id) => {
    if (!user) return
    await supabase
      .from('household_invitations')
      .update({ status: 'expired' })
      .eq('id', id)
      .eq('invited_by', user.id)
    setMyInvitations(prev => prev.filter(i => i.id !== id))
  }, [user])

  // Haal uitnodiging op via token (alleen als ingelogd)
  const getInvitationByToken = useCallback(async (token) => {
    const { data, error } = await supabase
      .from('household_invitations')
      .select('*')
      .eq('token', token)
      .maybeSingle()
    if (error || !data) return null
    return data
  }, [])

  // RPC: voeg de ingelogde user toe aan het huishouden van de uitnodiging
  const acceptInvitation = useCallback(async (token) => {
    const result = await supabase.rpc('accept_household_invitation', { invite_token: token })
    if (!result.error) clearAllCaches()
    return result
  }, [])

  // RPC: markeer uitnodiging als geweigerd
  const declineInvitation = useCallback(async (token) => {
    return await supabase.rpc('decline_household_invitation', { invite_token: token })
  }, [])

  return {
    myInvitations,
    loading,
    householdMembers,
    membersLoading,
    createInvitation,
    cancelInvitation,
    getInvitationByToken,
    acceptInvitation,
    declineInvitation,
  }
}
