// ─── Sidebar ───
// De navigatie-sidebar die op elke pagina verschijnt.
// Gebruikt React Router's NavLink voor actieve state.

import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import usePremium from '../../hooks/usePremium'
import { useAuth } from '../../hooks/useAuth'
import useFeedback from '../../hooks/useFeedback'
import FeedbackForm from '../feedback/FeedbackForm'
import useProfiles, { genInitialen } from '../../hooks/useProfiles'
import useSettings from '../../hooks/useSettings'

const NAV_ITEMS = [
  { to: '/',             label: 'Dashboard',    icon: ICONS.dashboard },
  { to: '/transacties',  label: 'Transacties',  icon: ICONS.tx },
  { to: '/analytics',    label: 'Analyse',      icon: ICONS.analytics },
  { to: '/budgetten',    label: 'Budgetten',    icon: ICONS.budget },
  { to: '/vaste-lasten', label: 'Vaste lasten', icon: ICONS.fixed },
  { to: '/kalender',     label: 'Kalender',     icon: ICONS.cal, premium: true },
  { to: '/instellingen', label: 'Instellingen', icon: ICONS.settings },
]

export default function Sidebar() {
  const { T } = useTheme()
  const [collapsed, setCollapsed]       = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [profielHover, setProfielHover] = useState(false)
  const { isPremium } = usePremium()
  const { user, signOut } = useAuth()
  const { unreadCount, isAdmin, submitFeedback } = useFeedback()
  const { persons } = useProfiles()
  const { settings } = useSettings()
  const navigate = useNavigate()
  const w = collapsed ? 64 : 240

  async function handleSignOut() { await signOut(); navigate('/login') }

  const profielNaam = settings.profiel_naam || ''
  const mijnProfiel = profielNaam
    ? (persons.find(p => p.naam === profielNaam) || persons[0] || null)
    : (persons[0] || null)
  const avatarKleur = mijnProfiel?.kleur || { bg: '#E0E7FF', fg: '#3730A3' }
  const initialen   = mijnProfiel?.initialen || genInitialen(profielNaam) || (user?.email?.slice(0, 2).toUpperCase() ?? '?')
  const displayNaam = profielNaam || user?.email || ''

  return (
    <aside style={{
      width: w, flex: `0 0 ${w}px`, background: T.card,
      borderRight: `1px solid ${T.border}`,
      display: 'flex', flexDirection: 'column',
      padding: collapsed ? '20px 8px' : '20px 14px',
      transition: 'width 0.2s ease, padding 0.2s ease', overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: collapsed ? '4px 4px 18px' : '4px 8px 18px', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: T.ink, color: T.bg, display: 'grid', placeItems: 'center', fontSize: 16, fontWeight: 600, flexShrink: 0 }}>€</div>
        {!collapsed && <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>Webfinance</div>}
      </div>

      {!collapsed && (
        <div style={{ fontSize: 11, fontWeight: 500, color: T.ink4, padding: '4px 10px', letterSpacing: 0.4, textTransform: 'uppercase' }}>Menu</div>
      )}

      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2, marginTop: 6 }}>
        {NAV_ITEMS.map(item => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'}
            style={({ isActive }) => ({
              display: 'flex', alignItems: 'center', gap: 10,
              padding: collapsed ? '8px' : '8px 10px', borderRadius: 8,
              background: isActive ? T.bg : 'transparent',
              color: isActive ? T.ink : T.ink2,
              fontSize: 14, fontWeight: isActive ? 500 : 400,
              position: 'relative', cursor: 'pointer', textDecoration: 'none',
              justifyContent: collapsed ? 'center' : 'flex-start',
            })}
          >
            {({ isActive }) => (
              <>
                <span style={{ color: isActive ? T.blue : T.ink3, display: 'inline-flex' }}>{item.icon}</span>
                {!collapsed && <span style={{ flex: 1 }}>{item.label}</span>}
                {!collapsed && item.premium && !isPremium && (
                  <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.3, padding: '2px 6px', borderRadius: 4, background: T.amberSoft, color: T.amber }}>PREMIUM</span>
                )}
                {isActive && <span style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 2, background: T.blue, borderRadius: 2 }} />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />

      {!collapsed && !isPremium && (
        <div style={{ margin: '12px 4px', padding: 12, border: `1px solid ${T.border}`, borderRadius: 10, background: T.bg }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ color: T.amber, display: 'inline-flex' }}>{ICONS.lock}</span>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.ink }}>Upgrade naar Premium</div>
          </div>
          <div style={{ fontSize: 11.5, color: T.ink3, lineHeight: 1.4, marginBottom: 8 }}>Import, kalender en meer.</div>
          <div style={{ fontSize: 12, fontWeight: 500, color: T.blue, cursor: 'pointer' }}>Bekijk plannen →</div>
        </div>
      )}

      <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 8 }}>
        {/* Profiel */}
        <div
          onClick={() => navigate('/instellingen')}
          onMouseEnter={() => setProfielHover(true)}
          onMouseLeave={() => setProfielHover(false)}
          style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '6px 8px', borderRadius: 8, cursor: 'pointer',
            background: profielHover ? T.bg : 'transparent',
            transition: 'background 0.15s',
            justifyContent: collapsed ? 'center' : 'flex-start',
            marginBottom: 2,
          }}
        >
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: avatarKleur.bg, color: avatarKleur.fg, display: 'grid', placeItems: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
            {initialen}
          </div>
          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.ink, wordBreak: 'break-word', lineHeight: 1.3 }}>{displayNaam}</div>
                {isPremium
                  ? <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: T.blueSoft, color: T.blueText, border: `1px solid ${T.blue}33`, letterSpacing: 0.3, flexShrink: 0 }}>PREMIUM</span>
                  : <span style={{ fontSize: 10, fontWeight: 600, padding: '1px 5px', borderRadius: 3, background: T.bg, color: T.ink3, border: `1px solid ${T.border}`, letterSpacing: 0.3, flexShrink: 0 }}>GRATIS</span>
                }
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <button onClick={() => setFeedbackOpen(true)} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          width: '100%', padding: collapsed ? '8px' : '8px 10px',
          borderRadius: 8, border: 'none', background: 'transparent',
          fontSize: 14, color: T.ink3, cursor: 'pointer',
          fontFamily: "'Inter', sans-serif",
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <span style={{ color: T.ink3, display: 'inline-flex', position: 'relative' }}>
            {ICONS.messageSquare}
            {isAdmin && unreadCount > 0 && (
              <span style={{ position: 'absolute', top: -5, right: -6, background: T.red, color: '#fff', fontSize: 11, minWidth: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, pointerEvents: 'none' }}>
                {unreadCount}
              </span>
            )}
          </span>
          {!collapsed && <span>Feedback</span>}
        </button>

        {/* Uitloggen */}
        {!collapsed && (
          <button onClick={handleSignOut} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            width: '100%', padding: '6px 8px', marginBottom: 4,
            borderRadius: 6, border: 'none', background: 'transparent',
            fontSize: 13, color: T.ink3, cursor: 'pointer',
            fontFamily: "'Inter', sans-serif",
          }}>
            <span style={{ display: 'inline-flex' }}>
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            Uitloggen
          </button>
        )}
      </div>

      <FeedbackForm open={feedbackOpen} onClose={() => setFeedbackOpen(false)} onSubmit={submitFeedback} />

      <button onClick={() => setCollapsed(!collapsed)} style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        marginTop: 4, padding: '6px 8px', borderRadius: 6,
        fontSize: 11.5, color: T.ink3, cursor: 'pointer',
        border: `1px solid ${T.border}`, background: 'transparent',
      }}>
        <span style={{ display: 'inline-flex', transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>{ICONS.collapse}</span>
        {!collapsed && <span>Inklappen</span>}
      </button>
    </aside>
  )
}
