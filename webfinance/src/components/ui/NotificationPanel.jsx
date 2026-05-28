// ─── NotificationPanel ───
// Dropdown-panel met notificaties. Opent rechts van de sidebar via fixed positioning.
// Sluit bij klik buiten het panel.

import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from './Icons'
import { fmtDate } from '../../tokens'

export default function NotificationPanel({ open, onClose, notifications, unreadCount, onMarkAsRead, onMarkAllAsRead, anchorRef }) {
  const { T } = useTheme()
  const navigate = useNavigate()
  const panelRef = useRef(null)
  const [pos, setPos] = useState({ left: 0, bottom: 0 })

  // Bereken positie op basis van anker-knop
  useEffect(() => {
    if (open && anchorRef?.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({ left: rect.right + 8, bottom: window.innerHeight - rect.bottom })
    }
  }, [open, anchorRef])

  // Sluit bij klik buiten het panel
  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        anchorRef?.current && !anchorRef.current.contains(e.target)
      ) onClose()
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open, onClose, anchorRef])

  if (!open) return null

  function handleItemClick(n) {
    onMarkAsRead(n.id)
    if (n.link) { navigate(n.link); onClose() }
  }

  return (
    <div ref={panelRef} style={{
      position: 'fixed', left: pos.left, bottom: pos.bottom,
      width: 320, maxHeight: 400,
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, boxShadow: T.shadow,
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden', zIndex: 1000,
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 16px', borderBottom: `1px solid ${T.border}`, flexShrink: 0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Notificaties</div>
        {unreadCount > 0 && (
          <button onClick={onMarkAllAsRead} style={{
            fontSize: 12, color: T.ink3, background: 'none', border: 'none',
            cursor: 'pointer', padding: '2px 4px', fontFamily: 'inherit',
          }}>
            Alles gelezen
          </button>
        )}
      </div>

      {/* Lijst */}
      <div style={{ overflowY: 'auto', flex: 1 }}>
        {notifications.length === 0 ? (
          <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            gap: 8, padding: '32px 16px', color: T.ink3,
          }}>
            <span style={{ color: T.ink4 }}>{ICONS.bell}</span>
            <div style={{ fontSize: 13 }}>Geen notificaties</div>
          </div>
        ) : (
          notifications.map(n => (
            <div
              key={n.id}
              onClick={() => handleItemClick(n)}
              style={{
                padding: '12px 16px',
                background: n.gelezen ? 'transparent' : T.blueSoft,
                borderBottom: `1px solid ${T.border}`,
                cursor: n.link ? 'pointer' : 'default',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                {!n.gelezen && (
                  <div style={{
                    width: 7, height: 7, borderRadius: '50%', background: T.blue,
                    flexShrink: 0, marginTop: 5,
                  }} />
                )}
                <div style={{ flex: 1, minWidth: 0, paddingLeft: n.gelezen ? 17 : 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 2 }}>{n.titel}</div>
                  <div style={{ fontSize: 12.5, color: T.ink2, marginBottom: 4, lineHeight: 1.4 }}>{n.bericht}</div>
                  <div style={{ fontSize: 11.5, color: T.ink3 }}>{fmtDate(n.datum.slice(0, 10))}</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
