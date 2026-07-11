// ─── BankKoppelModal ───
// Bank kiezen en koppelen via Enable Banking: haalt bankenlijst op, laat
// persoonlijk/gedeeld kiezen en stuurt de gebruiker door naar de bank-login.

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../hooks/useTheme'
import { Toggle } from '../ui/Card'
import { supabase } from '../../supabaseClient'

export default function BankKoppelModal({ onClose }) {
  const { T } = useTheme()
  const [banken, setBanken]   = useState([])
  const [laden, setLaden]     = useState(true)
  const [aspspNaam, setAspspNaam] = useState('')
  const [gedeeld, setGedeeld] = useState(false)
  const [bezig, setBezig]     = useState(false)
  const [fout, setFout]       = useState('')

  useEffect(() => {
    async function haalBankenOp() {
      setLaden(true); setFout('')
      try {
        const response = await fetch('/api/bank/aspsps')
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || 'Kon bankenlijst niet ophalen')
        setBanken(data.banken || [])
        if (data.banken?.length) setAspspNaam(data.banken[0].naam)
      } catch (err) {
        setFout(err.message)
      } finally {
        setLaden(false)
      }
    }
    haalBankenOp()
  }, [])

  async function koppel() {
    if (!aspspNaam) return
    setBezig(true); setFout('')

    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch('/api/bank/start', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ aspsp_naam: aspspNaam, gedeeld }),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok || !data.url) {
      setFout(data.error || 'Koppelen mislukt')
      setBezig(false)
      return
    }

    window.location.href = data.url
  }

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = { width: '100%', padding: '9px 12px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, outline: 'none', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box' }
  const primaryBtn   = { flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const secondaryBtn = { flex: 1, padding: '10px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  const kanKoppelen = !!aspspNaam && !bezig && !laden

  return createPortal(
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 200 }} />
      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: T.card, border: `1px solid ${T.border}`, borderRadius: 14, boxShadow: '0 20px 60px rgba(0,0,0,0.25)', padding: 28, width: 380, zIndex: 201 }}>
        <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 20 }}>Koppel je bank</div>

        <div style={{ marginBottom: 16 }}>
          <label style={L}>Bank</label>
          {laden ? (
            <div style={{ fontSize: 13, color: T.ink3 }}>Banken laden…</div>
          ) : (
            <select value={aspspNaam} onChange={e => setAspspNaam(e.target.value)} style={I}>
              {banken.map(b => (
                <option key={b.naam} value={b.naam}>{b.naam}</option>
              ))}
            </select>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>Delen met huishouden</div>
            <div style={{ fontSize: 12, color: T.ink3 }}>Gedeelde rekeningen zijn zichtbaar voor alle leden</div>
          </div>
          <Toggle on={gedeeld} onChange={() => setGedeeld(g => !g)} />
        </div>

        {fout && <div style={{ fontSize: 12, color: T.redText, marginBottom: 16 }}>{fout}</div>}

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={koppel} disabled={!kanKoppelen} style={{ ...primaryBtn, opacity: kanKoppelen ? 1 : 0.5, cursor: kanKoppelen ? 'pointer' : 'not-allowed' }}>
            {bezig ? 'Bezig…' : 'Koppelen'}
          </button>
          <button onClick={onClose} style={secondaryBtn}>Annuleren</button>
        </div>
      </div>
    </>,
    document.body
  )
}
