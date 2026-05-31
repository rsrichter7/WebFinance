// ─── useNotifications hook ───
// Combineert database-notificaties met in-memory bronnen (feedback, etc.).
// DB-notificaties: gelezen-status via Supabase. In-memory: via localStorage.

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'
import useFeedback from './useFeedback'

const LS_KEY = 'webfinance_notifications_read'

// In-memory notificaties voor admin: openstaande feedback-items samengevat
function getFeedbackNotifications(allFeedback, isAdmin) {
  if (!isAdmin) return []
  const openItems = allFeedback.filter(f => f.status === 'open')
  if (openItems.length === 0) return []
  const count = openItems.length
  return [{
    id:      `feedback-${count}`,
    type:    'feedback',
    titel:   'Nieuwe feedback',
    bericht: `${count} openstaand${count === 1 ? '' : 'e'} feedback item${count === 1 ? '' : 's'}`,
    datum:   openItems[0]?.createdAt || new Date().toISOString(),
    link:    '/instellingen',
    _isDb:   false,
  }]
}

// Database-rij naar frontend notificatie-object
function mapDbNotification(row) {
  return {
    id:      row.id,
    type:    row.type,
    titel:   row.titel,
    bericht: row.bericht,
    datum:   row.created_at,
    gelezen: row.gelezen,
    link:    row.link ?? null,
    _isDb:   true,
  }
}

export default function useNotifications() {
  const { user } = useAuth()
  const { allFeedback, isAdmin, loading: feedbackLoading } = useFeedback()

  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }
    catch { return [] }
  })
  const [dbNotifications, setDbNotifications] = useState([])
  const [dbLoading, setDbLoading]             = useState(false)

  // Haal notificaties op uit de database
  const fetchDbNotifications = useCallback(async () => {
    if (!user) return
    setDbLoading(true)
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setDbNotifications((data ?? []).map(mapDbNotification))
    setDbLoading(false)
  }, [user])

  useEffect(() => {
    fetchDbNotifications()
  }, [fetchDbNotifications])

  // Combineer DB- en in-memory notificaties (DB eerst, dan lokaal)
  const notifications = useMemo(() => {
    const local = getFeedbackNotifications(allFeedback, isAdmin)
      .map(n => ({ ...n, gelezen: readIds.includes(n.id) }))
    return [...dbNotifications, ...local]
  }, [dbNotifications, allFeedback, isAdmin, readIds])

  const unreadCount = notifications.filter(n => !n.gelezen).length
  const loading     = feedbackLoading || dbLoading

  // Markeer één notificatie als gelezen
  async function markAsRead(id) {
    const notif = notifications.find(n => n.id === id)
    if (!notif || notif.gelezen) return
    if (notif._isDb) {
      await supabase.from('notifications').update({ gelezen: true }).eq('id', id)
      setDbNotifications(prev => prev.map(n => n.id === id ? { ...n, gelezen: true } : n))
    } else {
      setReadIds(prev => {
        if (prev.includes(id)) return prev
        const next = [...prev, id]
        localStorage.setItem(LS_KEY, JSON.stringify(next))
        return next
      })
    }
  }

  // Markeer alle ongelezen notificaties als gelezen
  async function markAllAsRead() {
    const unreadDbIds = dbNotifications.filter(n => !n.gelezen).map(n => n.id)
    if (unreadDbIds.length > 0) {
      await supabase.from('notifications').update({ gelezen: true }).in('id', unreadDbIds)
      setDbNotifications(prev => prev.map(n => ({ ...n, gelezen: true })))
    }
    const localIds = notifications.filter(n => !n._isDb).map(n => n.id)
    setReadIds(localIds)
    localStorage.setItem(LS_KEY, JSON.stringify(localIds))
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead, loading }
}
