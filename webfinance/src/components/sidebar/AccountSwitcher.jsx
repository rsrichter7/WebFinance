// ─── AccountSwitcher ───
// Compacte dropdown in de sidebar om de actieve rekening te kiezen.
// Filtert in deze fase nog niets — onthoudt alleen welke rekening actief is.

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { useActiveAccount } from '../../hooks/useActiveAccount'
import { ICONS } from '../ui/Icons'

function AccountAvatar({ naam, T, size = 22 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%', flexShrink: 0,
      background: T.blueSoft, color: T.blue,
      display: 'grid', placeItems: 'center',
      fontSize: size * 0.5, fontWeight: 600,
    }}>
      {(naam || '?').charAt(0).toUpperCase()}
    </div>
  )
}

export default function AccountSwitcher({ collapsed }) {
  const { T } = useTheme()
  const navigate = useNavigate()
  const { accounts, activeAccount, activeAccountId, setActiveAccount } = useActiveAccount()

  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState({ left: 0, top: 0, width: 0 })
  const anchorRef = useRef(null)
  const panelRef = useRef(null)

  // Bereken positie op basis van anker-knop
  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect()
      setPos({ left: rect.left, top: rect.bottom + 6, width: Math.max(rect.width, 220) })
    }
  }, [open])

  // Sluit bij klik buiten het panel
  useEffect(() => {
    if (!open) return
    function handleClick(e) {
      if (
        panelRef.current && !panelRef.current.contains(e.target) &&
        anchorRef.current && !anchorRef.current.contains(e.target)
      ) setOpen(false)
    }
    function handleKey(e) { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  function kies(id) { setActiveAccount(id); setOpen(false) }
  function beheren() { navigate('/instellingen'); setOpen(false) }

  const persoonlijk = accounts.filter(a => !a.gedeeld)
  const gedeeld = accounts.filter(a => a.gedeeld)

  return (
    <>
      <button
        ref={anchorRef}
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          width: '100%', padding: collapsed ? '8px' : '7px 8px',
          margin: collapsed ? '0 0 10px' : '0 0 10px',
          borderRadius: 8, border: `1px solid ${T.border}`,
          background: open ? T.bg : 'transparent',
          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}
      >
        <AccountAvatar naam={activeAccount?.naam} T={T} />
        {!collapsed && (
          <>
            <span style={{
              flex: 1, minWidth: 0, textAlign: 'left', fontSize: 13, fontWeight: 500,
              color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {activeAccount?.naam || 'Rekening'}
            </span>
            <span style={{ color: T.ink3, display: 'inline-flex', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              {ICONS.chevDown}
            </span>
          </>
        )}
      </button>

      {open && createPortal(
        <div ref={panelRef} style={{
          position: 'fixed', left: pos.left, top: pos.top, width: pos.width,
          background: T.card, border: `1px solid ${T.border}`,
          borderRadius: 12, boxShadow: T.shadow,
          padding: 6, zIndex: 1000,
        }}>
          {[['Persoonlijk', persoonlijk], ['Gedeeld', gedeeld]].map(([label, lijst]) => lijst.length > 0 && (
            <div key={label}>
              <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, padding: '6px 10px 4px', letterSpacing: 0.4, textTransform: 'uppercase' }}>
                {label}
              </div>
              {lijst.map(acc => (
                <AccountRow key={acc.id} acc={acc} T={T} actief={acc.id === activeAccountId} onClick={() => kies(acc.id)} />
              ))}
            </div>
          ))}

          <div style={{ borderTop: `1px solid ${T.border}`, marginTop: 6, paddingTop: 6 }}>
            <button onClick={beheren} style={{
              display: 'flex', alignItems: 'center', width: '100%', padding: '8px 10px',
              borderRadius: 8, border: 'none', background: 'transparent',
              fontSize: 13, color: T.blue, cursor: 'pointer', fontFamily: 'inherit', fontWeight: 500,
            }}>
              Rekeningen beheren
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

function AccountRow({ acc, T, actief, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 8,
      padding: '7px 10px', borderRadius: 8, cursor: 'pointer',
      background: actief ? T.blueSoft : 'transparent',
    }}>
      <AccountAvatar naam={acc.naam} T={T} size={20} />
      <span style={{
        flex: 1, minWidth: 0, fontSize: 13, color: T.ink,
        fontWeight: actief ? 600 : 400,
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {acc.naam}
      </span>
      {actief && <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.check}</span>}
    </div>
  )
}
