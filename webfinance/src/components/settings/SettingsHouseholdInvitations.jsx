// ─── SettingsHouseholdInvitations ───
// Drie secties: echte accounts met toegang (+ verwijderen), uitnodigingslink, openstaande uitnodigingen.

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../hooks/useTheme'
import { useAuth } from '../../hooks/useAuth'
import { ICONS } from '../ui/Icons'
import useInvitations from '../../hooks/useInvitations'
import VerwijderLidModal from './VerwijderLidModal'
import { fmtDate } from '../../tokens'

export default function SettingsHouseholdInvitations() {
  const { T } = useTheme()
  const { user } = useAuth()
  const {
    myInvitations, createInvitation, cancelInvitation,
    householdMembers, membersLoading, removeHouseholdMember,
  } = useInvitations()

  const [uitnodigingLink, setUitnodigingLink] = useState(null)
  const [linkBezig, setLinkBezig]             = useState(false)
  const [gekopieerd, setGekopieerd]           = useState(false)
  const [teVerwijderen, setTeVerwijderen]     = useState(null)
  const [verwijderBezig, setVerwijderBezig]   = useState(false)

  // Eigenaar-check: ingelogde user heeft rol 'eigenaar' in dit huishouden
  const isEigenaar = householdMembers.some(m => m.user_id === user?.id && m.role === 'eigenaar')

  async function handleMaakLink() {
    setLinkBezig(true)
    const link = await createInvitation()
    setUitnodigingLink(link)
    setLinkBezig(false)
  }

  async function handleKopieer() {
    if (!uitnodigingLink) return
    await navigator.clipboard.writeText(uitnodigingLink)
    setGekopieerd(true)
    setTimeout(() => setGekopieerd(false), 2000)
  }

  async function handleVerwijder() {
    setVerwijderBezig(true)
    const { error } = await removeHouseholdMember(teVerwijderen.user_id)
    setVerwijderBezig(false)
    if (!error) setTeVerwijderen(null)
  }

  const titH      = { fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 2 }
  const subDesc   = { fontSize: 13, color: T.ink3, marginBottom: 14 }
  const divider   = <div style={{ height: 1, background: T.border, margin: '28px 0' }} />
  const memberRow = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.card, borderRadius: 10, border: `1px solid ${T.border}` }
  const iconBtn   = { width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.red, cursor: 'pointer', display: 'grid', placeItems: 'center' }

  function RolBadge({ role }) {
    const isEig = role === 'eigenaar'
    return (
      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 4, background: isEig ? T.blueSoft : T.rule, color: isEig ? T.blue : T.ink3, letterSpacing: 0.2, whiteSpace: 'nowrap' }}>
        {isEig ? 'Eigenaar' : 'Lid'}
      </span>
    )
  }

  return (
    <div>
      {divider}

      {/* Accounts met toegang */}
      <div style={{ marginBottom: 24 }}>
        <div style={titH}>Accounts met toegang</div>
        <div style={subDesc}>Deze accounts kunnen inloggen en data inzien.</div>

        {membersLoading ? (
          <div style={{ fontSize: 13, color: T.ink3 }}>Laden…</div>
        ) : householdMembers.length === 0 ? (
          <div style={{ fontSize: 13, color: T.ink4 }}>Geen accounts gevonden.</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {householdMembers.map(m => (
              <div key={m.user_id} style={memberRow}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: m.role === 'eigenaar' ? T.blueSoft : T.rule, color: m.role === 'eigenaar' ? T.blue : T.ink3, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700 }}>
                  {m.email[0].toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {m.email}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink4, marginTop: 2 }}>
                    Lid sinds: {fmtDate(m.created_at, 'long')}
                  </div>
                </div>
                <RolBadge role={m.role} />
                {isEigenaar && m.role === 'lid' && (
                  <button onClick={() => setTeVerwijderen(m)} title={`${m.email} verwijderen`} style={iconBtn}>
                    {ICONS.trash}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {divider}

      {/* Leden uitnodigen */}
      <div style={{ marginBottom: 24 }}>
        <div style={titH}>Leden uitnodigen</div>
        <div style={subDesc}>
          Deel een uitnodigingslink met iemand die je wil toevoegen aan je huishouden.
          De link is 7 dagen geldig.
        </div>

        {!uitnodigingLink ? (
          <button onClick={handleMaakLink} disabled={linkBezig} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: linkBezig ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: linkBezig ? 0.7 : 1 }}>
            <span style={{ display: 'inline-flex' }}>{ICONS.link}</span>
            {linkBezig ? 'Even wachten…' : 'Uitnodigingslink maken'}
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input readOnly value={uitnodigingLink} style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.rule, fontSize: 12, color: T.ink3, fontFamily: 'monospace', outline: 'none' }} />
              <button onClick={handleKopieer} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 14px', borderRadius: 8, border: `1px solid ${T.border}`, background: gekopieerd ? T.greenSoft : T.card, color: gekopieerd ? T.green : T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap', transition: 'background 0.15s, color 0.15s' }}>
                <span style={{ display: 'inline-flex' }}>{gekopieerd ? ICONS.check : ICONS.copy}</span>
                {gekopieerd ? 'Gekopieerd!' : 'Kopiëren'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: T.ink4 }}>
              Deze link is 7 dagen geldig.{' '}
              <button onClick={() => setUitnodigingLink(null)} style={{ background: 'none', border: 'none', padding: 0, fontSize: 12, color: T.blue, cursor: 'pointer', fontFamily: 'inherit' }}>
                Nieuwe link aanmaken
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Openstaande uitnodigingen — alleen tonen als er uitnodigingen zijn */}
      {myInvitations.length > 0 && (
        <div>
          {divider}
          <div style={titH}>Openstaande uitnodigingen</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {myInvitations.map(inv => (
              <div key={inv.id} style={memberRow}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>
                    Aangemaakt: {fmtDate(inv.created_at, 'long')}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink4, marginTop: 2 }}>
                    Verloopt op: {fmtDate(inv.expires_at, 'long')}
                  </div>
                </div>
                <button onClick={() => cancelInvitation(inv.id)} style={{ padding: '6px 12px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
                  Intrekken
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {teVerwijderen && createPortal(
        <VerwijderLidModal
          member={teVerwijderen}
          onConfirm={handleVerwijder}
          onClose={() => setTeVerwijderen(null)}
          bezig={verwijderBezig}
        />,
        document.body
      )}
    </div>
  )
}
