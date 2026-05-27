// ─── SettingsDeleteAccount ───
// Account verwijderen met bevestigingsdialoog en inline tekstveld.
// Vereist dat de delete_my_account() SQL-functie in Supabase bestaat.

import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { supabase } from '../../supabaseClient'
import { useAuth } from '../../hooks/useAuth'

export default function SettingsDeleteAccount() {
  const navigate       = useNavigate()
  const { signOut }    = useAuth()
  const [open,   setOpen]   = useState(false)
  const [invoer, setInvoer] = useState('')
  const [bezig,  setBezig]  = useState(false)
  const [fout,   setFout]   = useState('')

  async function verwijderAccount() {
    if (invoer !== 'VERWIJDEREN') return
    setBezig(true)
    setFout('')

    const { error } = await supabase.rpc('delete_my_account')
    if (error) {
      setFout('Er is iets misgegaan: ' + error.message)
      setBezig(false)
      return
    }

    await signOut()
    navigate('/login?deleted=true')
  }

  function annuleer() {
    setOpen(false)
    setInvoer('')
    setFout('')
  }

  const geldig = invoer === 'VERWIJDEREN' && !bezig

  return (
    <div style={{ padding: 16, background: T.redSoft, border: '1px solid #FECACA', borderRadius: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 4 }}>
        Account verwijderen (AVG)
      </div>
      <div style={{ fontSize: 12, color: T.ink3, lineHeight: 1.5, marginBottom: 14 }}>
        Let op: dit verwijdert permanent al je gegevens — transacties, vaste lasten, budgetten,
        spaardoelen, profielen en instellingen. Als je onderdeel bent van een huishouden worden
        alle gedeelde gegevens van dat huishouden ook verwijderd. Dit kan niet ongedaan worden gemaakt.
      </div>

      {!open ? (
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: 7,
            padding: '9px 16px', borderRadius: 8,
            background: T.red, color: '#fff', border: 'none',
            fontSize: 13, fontWeight: 600, cursor: 'pointer',
          }}
        >
          {ICONS.trash} Account en alle gegevens verwijderen
        </button>
      ) : (
        <div style={{ background: T.card, border: '1px solid #FECACA', borderRadius: 10, padding: 18 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.redText, marginBottom: 10 }}>
            Weet je het zeker?
          </div>
          <p style={{ fontSize: 13, color: T.ink2, lineHeight: 1.6, margin: '0 0 16px' }}>
            Dit verwijdert permanent al je <strong>transacties</strong>, <strong>vaste lasten</strong>,{' '}
            <strong>budgetten</strong>, <strong>spaardoelen</strong>, <strong>profielen</strong> en{' '}
            <strong>instellingen</strong>. Dit kan niet ongedaan worden gemaakt.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
            <label style={{ fontSize: 12, color: T.ink2 }}>
              Typ{' '}
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: T.red }}>VERWIJDEREN</span>
              {' '}om te bevestigen
            </label>
            <input
              value={invoer}
              onChange={e => setInvoer(e.target.value)}
              placeholder="VERWIJDEREN"
              style={{
                padding: '8px 12px', border: `1px solid ${T.border}`,
                borderRadius: 8, fontSize: 13, color: T.ink,
                outline: 'none', fontFamily: 'inherit',
              }}
            />
          </div>

          {fout && (
            <div style={{ fontSize: 12, color: T.redText, marginBottom: 12 }}>{fout}</div>
          )}

          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={annuleer} style={secBtn}>Annuleer</button>
            <button
              onClick={verwijderAccount}
              disabled={!geldig}
              style={{
                flex: 1, padding: '8px 14px', borderRadius: 8,
                background: T.red, color: '#fff', border: 'none',
                fontSize: 13, fontWeight: 600,
                cursor: geldig ? 'pointer' : 'not-allowed',
                opacity: geldig ? 1 : 0.45,
              }}
            >
              {bezig ? 'Bezig met verwijderen…' : 'Definitief verwijderen'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const secBtn = {
  flex: 1, padding: '8px 14px', borderRadius: 8,
  background: T.card, color: T.ink,
  border: `1px solid ${T.border}`,
  fontSize: 13, fontWeight: 500, cursor: 'pointer',
}
