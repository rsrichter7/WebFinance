// ─── SettingsHouseholdInvitations ───
// Drie secties: uitnodigingslink aanmaken, openstaande uitnodigingen, huishoudleden.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import useInvitations from '../../hooks/useInvitations'
import useProfiles from '../../hooks/useProfiles'
import { fmtDate } from '../../tokens'

export default function SettingsHouseholdInvitations() {
  const { T } = useTheme()
  const { myInvitations, createInvitation, cancelInvitation } = useInvitations()
  const { persons } = useProfiles()
  const [uitnodigingLink, setUitnodigingLink] = useState(null)
  const [bezig, setBezig] = useState(false)
  const [gekopieerd, setGekopieerd] = useState(false)

  async function handleMaakLink() {
    setBezig(true)
    const link = await createInvitation()
    setUitnodigingLink(link)
    setBezig(false)
  }

  async function handleKopieer() {
    if (!uitnodigingLink) return
    await navigator.clipboard.writeText(uitnodigingLink)
    setGekopieerd(true)
    setTimeout(() => setGekopieerd(false), 2000)
  }

  const titH  = { fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 4 }
  const desc  = { fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 14 }
  const row   = { display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.card, borderRadius: 10, border: `1px solid ${T.border}` }

  return (
    <div>
      <div style={{ height: 1, background: T.border, margin: '28px 0' }} />

      {/* Leden uitnodigen */}
      <div style={{ marginBottom: 24 }}>
        <div style={titH}>Leden uitnodigen</div>
        <div style={desc}>
          Deel een uitnodigingslink met iemand die je wil toevoegen aan je huishouden.
          De link is 7 dagen geldig.
        </div>

        {!uitnodigingLink ? (
          <button onClick={handleMaakLink} disabled={bezig} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '9px 16px', borderRadius: 8, border: 'none',
            background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: bezig ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            opacity: bezig ? 0.7 : 1,
          }}>
            <span style={{ display: 'inline-flex' }}>{ICONS.link}</span>
            {bezig ? 'Even wachten…' : 'Uitnodigingslink maken'}
          </button>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input readOnly value={uitnodigingLink} style={{
                flex: 1, padding: '9px 12px', borderRadius: 8,
                border: `1px solid ${T.border}`, background: T.rule,
                fontSize: 12, color: T.ink3, fontFamily: 'monospace', outline: 'none',
              }} />
              <button onClick={handleKopieer} style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '9px 14px', borderRadius: 8,
                border: `1px solid ${T.border}`,
                background: gekopieerd ? T.greenSoft : T.card,
                color: gekopieerd ? T.green : T.ink2,
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: 'inherit', whiteSpace: 'nowrap',
                transition: 'background 0.15s, color 0.15s',
              }}>
                <span style={{ display: 'inline-flex' }}>
                  {gekopieerd ? ICONS.check : ICONS.copy}
                </span>
                {gekopieerd ? 'Gekopieerd!' : 'Kopiëren'}
              </button>
            </div>
            <div style={{ fontSize: 12, color: T.ink4 }}>
              Deze link is 7 dagen geldig.{' '}
              <button onClick={() => setUitnodigingLink(null)} style={{
                background: 'none', border: 'none', padding: 0,
                fontSize: 12, color: T.blue, cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Nieuwe link aanmaken
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Openstaande uitnodigingen — alleen tonen als er uitnodigingen zijn */}
      {myInvitations.length > 0 && (
        <div>
          <div style={{ height: 1, background: T.border, margin: '28px 0' }} />
          <div style={titH}>Openstaande uitnodigingen</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 14 }}>
            {myInvitations.map(inv => (
              <div key={inv.id} style={row}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>
                    Aangemaakt: {fmtDate(inv.created_at, 'long')}
                  </div>
                  <div style={{ fontSize: 12, color: T.ink4, marginTop: 2 }}>
                    Verloopt op: {fmtDate(inv.expires_at, 'long')}
                  </div>
                </div>
                <button onClick={() => cancelInvitation(inv.id)} style={{
                  padding: '6px 12px', borderRadius: 6,
                  border: `1px solid ${T.border}`, background: T.card,
                  color: T.ink3, fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  Intrekken
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Huishoudleden — toont personen (profiles, zonder GZ) */}
      {persons.length > 0 && (
        <div>
          <div style={{ height: 1, background: T.border, margin: '28px 0' }} />
          <div style={titH}>Huishoudleden</div>
          <div style={{ ...desc, marginBottom: 14 }}>
            Personen die toegang hebben tot dit huishouden.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {persons.map(p => (
              <div key={p.id} style={row}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: p.kleur.bg, color: p.kleur.fg,
                  display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700,
                }}>
                  {p.initialen}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{p.naam}</div>
                  <div style={{ fontSize: 12, color: T.ink3 }}>Lid</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
