// ─── SettingsNotifications ───
// Notificatie-overzicht, instelbare meldingen en komende functies.

import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import { Toggle } from '../ui/Card'
import useNotifications from '../../hooks/useNotifications'
import useSettings from '../../hooks/useSettings'
import { fmtDate } from '../../tokens'
import { bankKoppelingZichtbaar } from '../../config/features'

// Alleen de twee nog-niet-gebouwde meldingen blijven hier staan
const TOEKOMSTIG = [
  { label: 'Maandelijks overzicht', desc: 'Eerste van de maand' },
  { label: 'Productupdates',        desc: 'Nieuwe features en verbeteringen' },
]

export default function SettingsNotifications() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, loading } = useNotifications()
  const { settings, updateSetting } = useSettings()

  const notifBudget         = settings.notif_budget          !== false
  const notifVasteLasten    = settings.notif_vaste_lasten    !== false
  const notifBankKoppeling  = settings.notif_bank_koppeling  !== false

  const PER_PAGINA    = 3
  const [pagina, setPagina]       = useState(1)
  const [hover, setHover]         = useState(null)
  const [hoverNotif, setHoverNotif] = useState(null)
  const aantalPaginas = Math.max(1, Math.ceil(notifications.length / PER_PAGINA))
  const pagNotifs     = notifications.slice((pagina - 1) * PER_PAGINA, pagina * PER_PAGINA)

  // Reset naar pagina 1 als het totaal verandert (bijv. toggle uitgeschakeld)
  useEffect(() => { setPagina(1) }, [notifications.length])

  function handleClick(notif) {
    markAsRead(notif.id)
    if (notif.link) navigate(notif.link)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Notificaties</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Meldingen voor jullie huishouden</div>
      </div>

      {/* Alles als gelezen markeren — alleen zichtbaar bij ongelezen items */}
      {unreadCount > 0 && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
          <button onClick={markAllAsRead} style={{ background: 'none', border: 'none', padding: 0, fontSize: 13, color: T.blue, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500 }}>
            Alles als gelezen markeren
          </button>
        </div>
      )}

      {/* Notificatie-lijst */}
      {loading ? (
        <div style={{ fontSize: 13, color: T.ink3, padding: '16px 0', marginBottom: 28 }}>Laden…</div>
      ) : notifications.length === 0 ? (
        <div style={{ border: `1px dashed ${T.borderHi}`, borderRadius: 12, padding: 36, textAlign: 'center', background: T.cardAlt, marginBottom: 28 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: T.rule, color: T.ink4, display: 'grid', placeItems: 'center', margin: '0 auto 12px' }}>
            {ICONS.bell}
          </div>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.ink3 }}>Geen notificaties</div>
        </div>
      ) : (
        <>
          <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: aantalPaginas > 1 ? 12 : 28 }}>
            {pagNotifs.map((n, i) => (
              <div
                key={n.id}
                onMouseEnter={() => setHoverNotif(n.id)}
                onMouseLeave={() => setHoverNotif(null)}
                onClick={() => handleClick(n)}
                style={{
                  display: 'flex', gap: 12, padding: '14px 16px', position: 'relative',
                  borderBottom: i < pagNotifs.length - 1 ? `1px solid ${T.rule}` : 'none',
                  background: n.gelezen ? T.card : T.blueSoft,
                  cursor: n.link ? 'pointer' : 'default', transition: 'background 0.15s',
                }}
              >
                {n._isDb && hoverNotif === n.id && (
                  <button
                    onClick={e => { e.stopPropagation(); deleteNotification(n.id) }}
                    style={{
                      position: 'absolute', top: 8, right: 12,
                      background: 'none', border: 'none', color: T.ink3,
                      cursor: 'pointer', fontSize: 16, lineHeight: 1,
                      padding: '2px 5px', borderRadius: 4, fontFamily: 'inherit',
                    }}
                  >×</button>
                )}
                <div style={{ paddingTop: 6, flexShrink: 0, width: 8 }}>
                  {!n.gelezen && <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.blue }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13.5, fontWeight: n.gelezen ? 500 : 600, color: n.gelezen ? T.ink3 : T.ink }}>{n.titel}</div>
                  <div style={{ fontSize: 13, color: n.gelezen ? T.ink4 : T.ink3, marginTop: 2, lineHeight: 1.4 }}>{n.bericht}</div>
                  <div style={{ fontSize: 11, color: T.ink4, marginTop: 5 }}>{fmtDate(n.datum, 'long')}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Paginering — alleen tonen als er meer dan 1 pagina is */}
          {aantalPaginas > 1 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
              <button
                onClick={() => setPagina(p => Math.max(1, p - 1))}
                disabled={pagina === 1}
                onMouseEnter={() => setHover('prev')}
                onMouseLeave={() => setHover(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: hover === 'prev' && pagina !== 1 ? T.rule : T.card, color: T.ink2, fontSize: 13, cursor: pagina === 1 ? 'not-allowed' : 'pointer', opacity: pagina === 1 ? 0.4 : 1, fontFamily: 'inherit' }}
              >
                ← Vorige
              </button>
              <span style={{ fontSize: 13, color: T.ink3 }}>Pagina {pagina} van {aantalPaginas}</span>
              <button
                onClick={() => setPagina(p => Math.min(aantalPaginas, p + 1))}
                disabled={pagina === aantalPaginas}
                onMouseEnter={() => setHover('next')}
                onMouseLeave={() => setHover(null)}
                style={{ padding: '8px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: hover === 'next' && pagina !== aantalPaginas ? T.rule : T.card, color: T.ink2, fontSize: 13, cursor: pagina === aantalPaginas ? 'not-allowed' : 'pointer', opacity: pagina === aantalPaginas ? 0.4 : 1, fontFamily: 'inherit' }}
              >
                Volgende →
              </button>
            </div>
          )}
        </>
      )}

      {/* Meldingen — functionele toggles */}
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 2 }}>Meldingen</div>
      <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>Kies welke meldingen je wil ontvangen</div>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: `1px solid ${T.rule}` }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Budget bijna overschreden</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Per categorie · bij ≥ 80%</div>
          </div>
          <Toggle on={notifBudget} onChange={() => updateSetting('notif_budget', !notifBudget)} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: bankKoppelingZichtbaar() ? `1px solid ${T.rule}` : 'none' }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Aankomende vaste lasten</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>3 dagen voor afschrijving</div>
          </div>
          <Toggle on={notifVasteLasten} onChange={() => updateSetting('notif_vaste_lasten', !notifVasteLasten)} />
        </div>
        {bankKoppelingZichtbaar() && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Bankkoppeling verloopt</div>
              <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>14 dagen voor het verlopen van de koppeling</div>
            </div>
            <Toggle on={notifBankKoppeling} onChange={() => updateSetting('notif_bank_koppeling', !notifBankKoppeling)} />
          </div>
        )}
      </div>

      {/* Komende functies — toggles niet-functioneel */}
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 2 }}>Komende functies</div>
      <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>Deze meldingen worden binnenkort toegevoegd</div>
      <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden' }}>
        {TOEKOMSTIG.map((n, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderBottom: i < TOEKOMSTIG.length - 1 ? `1px solid ${T.rule}` : 'none', opacity: 0.55 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{n.label}</div>
              <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{n.desc}</div>
            </div>
            <div style={{ width: 36, height: 20, borderRadius: 10, background: T.borderHi, padding: 2, display: 'flex', alignItems: 'center', cursor: 'not-allowed', flexShrink: 0 }}>
              <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
