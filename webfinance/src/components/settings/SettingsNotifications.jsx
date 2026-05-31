// ─── SettingsNotifications ───
// Notificatie-overzicht: lijst, gelezen markeren en komende functies onderaan.

import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import useNotifications from '../../hooks/useNotifications'
import { fmtDate } from '../../tokens'

const TOEKOMSTIG = [
  { label: 'Budget bijna overschreden',  desc: 'Per categorie · drempel instelbaar' },
  { label: 'Aankomende vaste lasten',    desc: '3 dagen voor afschrijving' },
  { label: 'Maandelijks overzicht',      desc: 'Eerste van de maand' },
  { label: 'Productupdates',             desc: 'Nieuwe features en verbeteringen' },
]

export default function SettingsNotifications() {
  const { T } = useTheme()
  const navigate = useNavigate()
  const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications()

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

      {/* "Alles als gelezen markeren" knop — alleen zichtbaar als er ongelezen zijn */}
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
        <div style={{ border: `1px solid ${T.border}`, borderRadius: 10, overflow: 'hidden', marginBottom: 28 }}>
          {notifications.map((n, i) => (
            <div
              key={n.id}
              onClick={() => handleClick(n)}
              style={{
                display: 'flex', gap: 12, padding: '14px 16px',
                borderBottom: i < notifications.length - 1 ? `1px solid ${T.rule}` : 'none',
                background: n.gelezen ? T.card : T.blueSoft,
                cursor: n.link ? 'pointer' : 'default',
                transition: 'background 0.15s',
              }}
            >
              {/* Ongelezen-bolletje */}
              <div style={{ paddingTop: 6, flexShrink: 0, width: 8 }}>
                {!n.gelezen && <div style={{ width: 8, height: 8, borderRadius: '50%', background: T.blue }} />}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: n.gelezen ? 500 : 600, color: T.ink }}>{n.titel}</div>
                <div style={{ fontSize: 13, color: T.ink3, marginTop: 2, lineHeight: 1.4 }}>{n.bericht}</div>
                <div style={{ fontSize: 11, color: T.ink4, marginTop: 5 }}>{fmtDate(n.datum, 'long')}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Komende functies — onderaan, toggles niet-functioneel */}
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
