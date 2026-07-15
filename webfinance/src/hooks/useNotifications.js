// ─── useNotifications hook ───
// Database-notificaties; budget en vaste lasten worden bij laden gesyncht naar de DB.
// Admin-feedback notificaties blijven in-memory (tijdelijk, geen persistentie nodig).

import { useState, useEffect, useMemo, useCallback } from 'react'
import { supabase } from '../supabaseClient'
import { useAuth } from './useAuth'
import useFeedback from './useFeedback'
import useBudgets from './useBudgets'
import useFixedExpenses from './useFixedExpenses'
import useAccounts from './useAccounts'
import useSettings from './useSettings'
import { fmt, fmtDate } from '../tokens'
import { bankKoppelingZichtbaar } from '../config/features'

const VEERTIEN_DAGEN_MS = 14 * 24 * 60 * 60 * 1000

// Admin-notificatie voor openstaande feedback-items
function getFeedbackNotifications(allFeedback, isAdmin) {
  if (!isAdmin) return []
  const open = allFeedback.filter(f => f.status === 'open')
  if (open.length === 0) return []
  const n = open.length
  return [{
    id: `feedback-${n}`, type: 'feedback', titel: 'Nieuwe feedback',
    bericht: `${n} openstaand${n === 1 ? '' : 'e'} feedback item${n === 1 ? '' : 's'}`,
    datum: open[0]?.createdAt || new Date().toISOString(), link: '/instellingen',
    _isDb: false, gelezen: false,
  }]
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

// Database-rij → frontend notificatie-object
function mapDbNotification(row) {
  return {
    id: row.id, type: row.type, titel: row.titel, bericht: row.bericht,
    datum: row.created_at, gelezen: row.gelezen ?? false, link: row.link ?? null, _isDb: true,
  }
}

// ─── Hook ───

export default function useNotifications() {
  const { user } = useAuth()
  const { allFeedback, isAdmin, loading: feedbackLoading } = useFeedback()
  const { categorieOverzicht, geselecteerdeMaand, loading: budgetLoading } = useBudgets()
  const { items: fixedItems, loading: fixedLoading } = useFixedExpenses()
  const { accounts, loading: accountsLoading } = useAccounts()
  const { settings } = useSettings()

  const [dbNotifications, setDbNotifications] = useState([])
  const [dbLoading, setDbLoading]             = useState(false)

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

  // Schrijf nieuwe budget en vaste lasten notificaties naar DB — idempotent via ref_key
  const syncNotifications = useCallback(async () => {
    if (!user) return
    const toInsert = []

    if (settings.notif_budget !== false) {
      const nu = new Date()
      const { maand, jaar } = geselecteerdeMaand
      if (maand === nu.getMonth() + 1 && jaar === nu.getFullYear()) {
        const maandStr = `${jaar}-${String(maand).padStart(2, '0')}`
        for (const c of categorieOverzicht) {
          if (c.budget > 0 && c.pct >= 80) {
            const over = c.pct >= 100
            toInsert.push({
              user_id: user.id,
              type:    'budget',
              titel:   over ? 'Budget overschreden' : 'Budget bijna op',
              bericht: over
                ? `${c.categorie}: ${fmt(c.besteed)} uitgegeven van ${fmt(c.budget)} budget`
                : `${c.categorie}: ${fmt(c.besteed)} van ${fmt(c.budget)} (${Math.round(c.pct)}%)`,
              link:    '/budgetten',
              ref_key: `budget_80pct_${c.categorie}_${maandStr}`,
              gelezen: false,
            })
          }
        }
      }
    }

    if (settings.notif_vaste_lasten !== false) {
      const vandaag = new Date().toISOString().split('T')[0]
      const grens   = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      for (const item of fixedItems) {
        if (!item.actief) continue
        const datum = volgendeAfschrijfDatum(item, vandaag)
        if (!datum || datum > grens) continue
        toInsert.push({
          user_id: user.id,
          type:    'vaste_lasten',
          titel:   'Aankomende afschrijving',
          bericht: `${item.omschrijving}: ${fmt(item.bedrag)} op ${fmtDate(datum, 'long')}`,
          link:    '/vaste-lasten',
          ref_key: `vaste_last_aankomend_${item.id}_${datum}`,
          gelezen: false,
        })
      }
    }

    if (bankKoppelingZichtbaar() && settings.notif_bank_koppeling !== false) {
      const nu = Date.now()
      for (const rekening of accounts) {
        if (!rekening.externAccountId || !rekening.koppelingVervalt) continue
        const vervalTijd = new Date(rekening.koppelingVervalt).getTime()
        if (vervalTijd - nu > VEERTIEN_DAGEN_MS) continue
        const verlopen = vervalTijd < nu
        const dagen    = Math.max(0, Math.ceil((vervalTijd - nu) / (24 * 60 * 60 * 1000)))
        toInsert.push({
          user_id: user.id,
          type:    'bank_koppeling',
          titel:   verlopen ? 'Bankkoppeling verlopen' : 'Bankkoppeling verloopt binnenkort',
          bericht: verlopen
            ? `${rekening.naam}: de koppeling is verlopen. Koppel opnieuw om te blijven synchroniseren.`
            : `${rekening.naam}: de koppeling verloopt over ${dagen} dag${dagen === 1 ? '' : 'en'}.`,
          link:    '/instellingen?sectie=rekeningen',
          ref_key: `bank_verval:${rekening.id}:${rekening.koppelingVervalt}`,
          gelezen: false,
        })
      }
    }

    if (toInsert.length === 0) return
    await supabase
      .from('notifications')
      .upsert(toInsert, { onConflict: 'ref_key', ignoreDuplicates: true })
    await fetchDbNotifications()
  }, [user, settings, categorieOverzicht, geselecteerdeMaand, fixedItems, accounts, fetchDbNotifications])

  useEffect(() => {
    if (!budgetLoading && !fixedLoading && !accountsLoading) syncNotifications()
  }, [syncNotifications, budgetLoading, fixedLoading, accountsLoading])

  const notifications = useMemo(() => {
    const feedback = getFeedbackNotifications(allFeedback, isAdmin)
    return [...dbNotifications, ...feedback]
  }, [dbNotifications, allFeedback, isAdmin])

  const unreadCount = notifications.filter(n => !n.gelezen).length
  const loading     = feedbackLoading || dbLoading || budgetLoading || fixedLoading || accountsLoading

  async function markAsRead(id) {
    const notif = notifications.find(n => n.id === id)
    if (!notif || notif.gelezen || !notif._isDb) return
    await supabase.from('notifications').update({ gelezen: true }).eq('id', id)
    setDbNotifications(prev => prev.map(n => n.id === id ? { ...n, gelezen: true } : n))
  }

  async function markAllAsRead() {
    const unreadDbIds = dbNotifications.filter(n => !n.gelezen).map(n => n.id)
    if (unreadDbIds.length === 0) return
    await supabase.from('notifications').update({ gelezen: true }).in('id', unreadDbIds)
    setDbNotifications(prev => prev.map(n => ({ ...n, gelezen: true })))
  }

  async function deleteNotification(id) {
    const notif = dbNotifications.find(n => n.id === id)
    if (!notif) return
    await supabase.from('notifications').delete().eq('id', id)
    setDbNotifications(prev => prev.filter(n => n.id !== id))
  }

  return { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading }
}
