// ─── SettingsHousehold ───
// Beheer van huishoudenprofielen: toevoegen, bewerken en verwijderen van personen.

import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import useProfiles, { PROFIEL_KLEUREN, genInitialen } from '../../hooks/useProfiles'
import SettingsHouseholdInvitations from './SettingsHouseholdInvitations'

export default function SettingsHousehold() {
  const { T } = useTheme()
  const { profiles, persons, addProfile, updateProfile, removeProfile } = useProfiles()
  const [modal, setModal] = useState(null)

  function handleSave(data) {
    if (modal.type === 'edit') updateProfile(modal.profile.id, data)
    else addProfile(data)
    setModal(null)
  }

  const iconBtn     = { width: 30, height: 30, borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, cursor: 'pointer', display: 'grid', placeItems: 'center' }
  const addBtn      = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Huishouden</div>
        <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.5 }}>
          Beheer wie toegang heeft en hoe uitgaven worden bijgehouden.
        </div>
      </div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: T.ink, marginBottom: 2 }}>Profielen</div>
        <div style={{ fontSize: 13, color: T.ink3 }}>Voor het bijhouden van wie wat uitgeeft</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
        {profiles.map(p => (
          <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', background: T.card, borderRadius: 10, border: `1px solid ${T.border}`, opacity: p.isGezamenlijk ? 0.6 : 1 }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: p.kleur.bg, color: p.kleur.fg, display: 'grid', placeItems: 'center', fontSize: 11, fontWeight: 700 }}>
              {p.initialen}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: T.ink }}>{p.naam}</div>
              <div style={{ fontSize: 12, color: T.ink3 }}>
                {p.isGezamenlijk ? 'Altijd aanwezig · niet verwijderbaar' : `Initialen: ${p.initialen}`}
              </div>
            </div>
            {!p.isGezamenlijk && (
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => setModal({ type: 'edit', profile: p })} style={iconBtn}>{ICONS.edit}</button>
                <button
                  onClick={() => persons.length > 1 && setModal({ type: 'delete', profile: p })}
                  style={{ ...iconBtn, opacity: persons.length <= 1 ? 0.3 : 1, cursor: persons.length <= 1 ? 'not-allowed' : 'pointer' }}
                  title={persons.length <= 1 ? 'Minimaal één persoon vereist' : `${p.naam} verwijderen`}
                >
                  {ICONS.trash}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => setModal({ type: 'add' })} style={addBtn}>
        <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span>
        Persoon toevoegen
      </button>

      <SettingsHouseholdInvitations />

      {modal && modal.type !== 'delete' && createPortal(
        <ProfielModal modal={modal} onSave={handleSave} onClose={() => setModal(null)} />,
        document.body
      )}
      {modal?.type === 'delete' && createPortal(
        <DeleteModal profile={modal.profile} onConfirm={() => { removeProfile(modal.profile.id); setModal(null) }} onClose={() => setModal(null)} />,
        document.body
      )}
    </div>
  )
}

function ProfielModal({ modal, onSave, onClose }) {
  const { T } = useTheme()
  const isEdit = modal.type === 'edit'
  const [naam,  setNaam]  = useState(isEdit ? modal.profile.naam  : '')
  const [kleur, setKleur] = useState(isEdit ? modal.profile.kleur : PROFIEL_KLEUREN[0])
  const initialen = genInitialen(naam)

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, outline: 'none', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box' }
  const primaryBtn  = { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const secondaryBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 28, width: 360, zIndex: 201 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 20 }}>
          {isEdit ? 'Persoon bewerken' : 'Persoon toevoegen'}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={L}>Naam *</label>
          <input value={naam} onChange={e => setNaam(e.target.value)} placeholder="Bijv. Anne de Reus" style={I} autoFocus />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: kleur.bg, color: kleur.fg, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, flexShrink: 0 }}>
            {initialen}
          </div>
          <div style={{ fontSize: 13, color: T.ink3 }}>
            Initialen: <strong style={{ color: T.ink }}>{initialen}</strong>
            <div style={{ fontSize: 12, color: T.ink4, marginTop: 2 }}>Automatisch gegenereerd</div>
          </div>
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={L}>Kleur</label>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PROFIEL_KLEUREN.map((k, i) => (
              <div key={i} onClick={() => setKleur(k)} title={k.label} style={{ width: 32, height: 32, borderRadius: '50%', background: k.bg, cursor: 'pointer', display: 'grid', placeItems: 'center', outline: kleur === k ? `3px solid ${k.fg}` : '3px solid transparent', outlineOffset: 2 }}>
                {kleur === k && <span style={{ color: k.fg, fontSize: 12, lineHeight: 1, fontWeight: 700 }}>✓</span>}
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => naam.trim() && onSave({ naam: naam.trim(), initialen, kleur })} style={primaryBtn}>Opslaan</button>
          <button onClick={onClose} style={secondaryBtn}>Annuleren</button>
        </div>
      </div>
    </>
  )
}

function DeleteModal({ profile, onConfirm, onClose }) {
  const { T } = useTheme()
  const primaryBtn  = { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: T.red, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const secondaryBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 28, width: 340, zIndex: 201 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 8 }}>{profile.naam} verwijderen?</div>
        <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.5, marginBottom: 24 }}>
          Bestaande transacties en vaste lasten behouden hun wie-waarde. Dit kan niet ongedaan worden gemaakt.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onConfirm} style={primaryBtn}>Verwijderen</button>
          <button onClick={onClose} style={secondaryBtn}>Annuleren</button>
        </div>
      </div>
    </>
  )
}
