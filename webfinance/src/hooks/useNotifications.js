// ─── useNotifications hook ───
// Combineert database-notificaties met in-memory notificaties (budget, vaste lasten, feedback).
// DB-notificaties: gelezen-status via Supabase. In-memory: via localStorage.

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'
import useFeedback from './useFeedback'
import useBudgets from './useBudgets'
import useFixedExpenses from './useFixedExpenses'
import useSettings from './useSettings'
import { fmt, fmtDate } from '../tokens'

const LS_KEY = 'webfinance_notifications_read'

// ─── In-memory helpers ───

// Admin-notificatie voor openstaande feedback-items
function getFeedbackNotifications(allFeedback, isAdmin) {
  if (!isAdmin) return []
  const open = allFeedback.filter(f => f.status === 'open')
  if (open.length === 0) return []
  const n = open.length
  return [{ id: `feedback-${n}`, type: 'feedback', titel: 'Nieuwe feedback', bericht: `${n} openstaand${n === 1 ? '' : 'e'} feedback item${n === 1 ? '' : 's'}`, datum: open[0]?.createdAt || new Date().toISOString(), link: '/instellingen', _isDb: false }]
}

// Budget-notificaties: categorieën met >= 80% verbruikt in de huidige maand
function getBudgetNotifications(categorieOverzicht, geselecteerdeMaand) {
  const { maand, jaar } = geselecteerdeMaand
  return categorieOverzicht
    .filter(c => c.budget > 0 && c.pct >= 80)
    .map(c => {
      const over = c.pct >= 100
      return {
        id:      `budget-${c.categorie}-${maand}-${jaar}`,
        type:    'budget',
        titel:   over ? 'Budget overschreden' : 'Budget bijna op',
        bericht: over
          ? `${c.categorie}: ${fmt(c.besteed)} uitgegeven van ${fmt(c.budget)} budget`
          : `${c.categorie}: ${fmt(c.besteed)} van ${fmt(c.budget)} (${Math.round(c.pct)}%)`,
        datum:   new Date().toISOString(),
        link:    '/budgetten',
        _isDb:   false,
      }
    })
}

// Bepaal de eerstvolgende afschrijfdatum voor een vaste last (>= vandaag)
function volgendeAfschrijfDatum(item, vandaag) {
  const dag = item.afschrijfdag ?? 1
  const now = new Date(vandaag)
  const p   = n => String(n).padStart(2, '0')

  if (item.herhaling === 'Maandelijks') {
    const maxDag = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dezeM  = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(Math.min(dag, maxDag))}`
    if (dezeM >= vandaag) return dezeM
    const v = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return `${v.getFullYear()}-${p(v.getMonth() + 1)}-${p(Math.min(dag, new Date(v.getFullYear(), v.getMonth() + 1, 0).getDate()))}`
  }

  if (item.herhaling === 'Kwartaal') {
    // Zelfde logica als auto-transacties: alleen huidige maand
    const maxDag = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
    const dezeM  = `${now.getFullYear()}-${p(now.getMonth() + 1)}-${p(Math.min(dag, maxDag))}`
    return dezeM >= vandaag ? dezeM : null
  }

  if (item.herhaling === 'Jaarlijks') {
    const base   = new Date(item.createdAt || vandaag)
    const mnd    = base.getMonth() + 1
    const maxDag = new Date(now.getFullYear(), mnd, 0).getDate()
    const dezeJ  = `${now.getFullYear()}-${p(mnd)}-${p(Math.min(dag, maxDag))}`
    if (dezeJ >= vandaag) return dezeJ
    return `${now.getFullYear() + 1}-${p(mnd)}-${p(Math.min(dag, new Date(now.getFullYear() + 1, mnd, 0).getDate()))}`
  }

  if (item.herhaling === 'Wekelijks') {
    let cur = new Date(item.startdatum || item.createdAt || vandaag)
    for (let i = 0; cur.toISOString().split('T')[0] < vandaag && i < 200; i++) cur.setDate(cur.getDate() + 7)
    return cur.toISOString().split('T')[0]
  }

  return null
}

// Vaste lasten-notificaties: afschrijvingen binnen 3 dagen
function getVasteLastenNotifications(items) {
  const vandaag = new Date().toISOString().split('T')[0]
  const grens   = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  return items
    .filter(item => item.actief)
    .reduce((acc, item) => {
      const datum = volgendeAfschrijfDatum(item, vandaag)
      if (!datum || datum > grens) return acc
      acc.push({
        id:      `vaste-last-${item.id}-${datum}`,
        type:    'vaste_lasten',
        titel:   'Aankomende afschrijving',
        bericht: `${item.omschrijving}: ${fmt(item.bedrag)} op ${fmtDate(datum, 'long')}`,
        datum:   new Date().toISOString(),
        link:    '/vaste-lasten',
        _isDb:   false,
      })
      return acc
    }, [])
}

// Database-rij naar frontend notificatie-object
function mapDbNotification(row) {
  return { id: row.id, type: row.type, titel: row.titel, bericht: row.bericht, datum: row.created_at, gelezen: row.gelezen, link: row.link ?? null, _isDb: true }
}

// ─── Hook ───

export default function useNotifications() {
  const { user } = useAuth()
  const { allFeedback, isAdmin, loading: feedbackLoading } = useFeedback()
  const { categorieOverzicht, geselecteerdeMaand, loading: budgetLoading } = useBudgets()
  const { items: fixedItems, loading: fixedLoading } = useFixedExpenses()
  const { settings } = useSettings()

  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]') }
    catch { return [] }
  })
  const [dbNotifications, setDbNotifications] = useState([])
  const [dbLoading, setDbLoading]             = useState(false)

  // Haal database-notificaties op
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

  useEffect(() => { fetchDbNotifications() }, [fetchDbNotifications])

  // Combineer alle bronnen: DB → budget → vaste lasten → feedback
  const notifications = useMemo(() => {
    const budget      = settings.notif_budget       !== false ? getBudgetNotifications(categorieOverzicht, geselecteerdeMaand) : []
    const vasteLasten = settings.notif_vaste_lasten !== false ? getVasteLastenNotifications(fixedItems) : []
    const local = [
      ...getFeedbackNotifications(allFeedback, isAdmin),
      ...budget,
      ...vasteLasten,
    ].map(n => ({ ...n, gelezen: readIds.includes(n.id) }))
    return [...dbNotifications, ...local]
  }, [dbNotifications, allFeedback, isAdmin, readIds, categorieOverzicht, geselecteerdeMaand, fixedItems, settings])

  const unreadCount = notifications.filter(n => !n.gelezen).length
  const loading     = feedbackLoading || dbLoading || budgetLoading || fixedLoading

  // Markeer één notificatie als gelezen (DB via Supabase, overig via localStorage)
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
