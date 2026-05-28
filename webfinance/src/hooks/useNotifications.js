// ─── useNotifications hook ───
// Verzamelt notificaties uit alle bronnen en beheert gelezen-status via localStorage.
// Uitbreidbaar: voeg nieuwe bronnen toe als extra functies onderaan.

import { useState, useMemo } from 'react'
import useFeedback from './useFeedback'

const LS_KEY = 'webfinance_notifications_read'

function getFeedbackNotifications(allFeedback, isAdmin) {
  if (!isAdmin) return []
  const openItems = allFeedback.filter(f => f.status === 'open')
  if (openItems.length === 0) return []
  const count = openItems.length
  return [{
    id:     `feedback-${count}`,
    type:   'feedback',
    titel:  'Nieuwe feedback',
    bericht: `${count} openstaand${count === 1 ? '' : 'e'} feedback item${count === 1 ? '' : 's'}`,
    datum:  openItems[0]?.createdAt || new Date().toISOString(),
    link:   '/instellingen',
  }]
}

export default function useNotifications() {
  const { allFeedback, isAdmin, loading } = useFeedback()

  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }
    catch { return [] }
  })

  const notifications = useMemo(() => {
    const all = [
      ...getFeedbackNotifications(allFeedback, isAdmin),
      // Hier later: ...getBudgetNotifications(), ...getSavingsNotifications()
    ]
    return all.map(n => ({ ...n, gelezen: readIds.includes(n.id) }))
  }, [allFeedback, isAdmin, readIds])

  const unreadCount = notifications.filter(n => !n.gelezen).length

  function markAsRead(id) {
    setReadIds(prev => {
      if (prev.includes(id)) return prev
      const next = [...prev, id]
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }

  function markAllAsRead() {
    const allIds = notifications.map(n => n.id)
    setReadIds(allIds)
    localStorage.setItem(LS_KEY, JSON.stringify(allIds))
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead, loading }
}
