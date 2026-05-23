// ─── SettingsDataManagement ───
// Exporteer, importeer of wis lokale Webfinance-instellingen.
// Transactie- en financiële data staat nu in Supabase.

import React, { useState, useRef } from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'

// Alleen lokale keys die niet in Supabase staan
const WF_KEYS = [
  'webfinance_admin_unlocked',
  'webfinance_datumformaat',
  'webfinance_custom_categories',
  'webfinance_premium',
]

export default function SettingsDataManagement() {
  const [deleteInput,      setDeleteInput]      = useState('')
  const [showConfirm,      setShowConfirm]      = useState(false)
  const [showImportConfirm, setShowImportConfirm] = useState(false)
  const [importData,       setImportData]       = useState(null)
  const importRef = useRef()

  function exportJSON() {
    const data = {}
    WF_KEYS.forEach(k => { const v = localStorage.getItem(k); if (v !== null) { try { data[k] = JSON.parse(v) } catch { data[k] = v } } })
    dl(JSON.stringify(data, null, 2), 'webfinance-instellingen.json', 'application/json')
  }

  function dl(content, filename, type) {
    const url = URL.createObjectURL(new Blob([content], { type }))
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      try { setImportData(JSON.parse(ev.target.result)); setShowImportConfirm(true) }
      catch { alert('Ongeldig JSON-bestand') }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function confirmImport() {
    Object.entries(importData).forEach(([k, v]) => localStorage.setItem(k, JSON.stringify(v)))
    setShowImportConfirm(false); setImportData(null)
    window.location.reload()
  }

  function wipeAll() {
    if (deleteInput !== 'DELETE') return
    WF_KEYS.forEach(k => localStorage.removeItem(k))
    setShowConfirm(false)
    window.location.reload()
  }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Data beheer</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Exporteer of wis je lokale instellingen</div>
      </div>

      <div style={{ marginBottom: 20, padding: 14, background: T.blueSoft, border: `1px solid ${T.border}`, borderRadius: 10, fontSize: 12.5, color: T.blueText, lineHeight: 1.5 }}>
        <strong>Let op:</strong> Transacties, vaste lasten en budgetten staan nu in Supabase en worden hier niet geëxporteerd. Alleen lokale instellingen (datumformaat, categorieën) worden opgeslagen.
      </div>

      <SubSection title="Exporteren">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DataRow icon={ICONS.download} title="Instellingen (JSON)" desc="Lokale instellingen: datumformaat, custom categorieën" action="Exporteer JSON" onAction={exportJSON} />
        </div>
      </SubSection>

      <SubSection title="Importeren">
        <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFile} />
        <DataRow icon={ICONS.upload} title="Instellingen terugzetten" desc="Selecteer een eerder geëxporteerd JSON-bestand" action="Bestand kiezen" onAction={() => importRef.current?.click()} />
      </SubSection>

      <SubSection title="Gevarenzone" description="Niet ongedaan te maken">
        <div style={{ border: '1px solid #FECACA', borderRadius: 10, padding: 14, background: T.redSoft, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.redText }}>Lokale instellingen wissen</div>
            <div style={{ fontSize: 12, color: T.ink2, marginTop: 2 }}>Verwijdert lokale instellingen. Data in Supabase blijft bewaard.</div>
          </div>
          <button onClick={() => setShowConfirm(true)} style={{ padding: '8px 14px', borderRadius: 8, background: T.card, color: T.red, border: '1px solid #FECACA', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {ICONS.trash} Wissen
          </button>
        </div>
      </SubSection>

      {showConfirm && (
        <Overlay onClose={() => { setShowConfirm(false); setDeleteInput('') }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.redSoft, color: T.red, display: 'grid', placeItems: 'center', marginBottom: 12 }}>{ICONS.warn}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Weet je het zeker?</div>
          <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 16 }}>
            Hiermee verwijder je <strong style={{ color: T.ink }}>lokale instellingen</strong>. Data in Supabase blijft bewaard.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: T.ink2 }}>Typ <span style={{ fontFamily: 'monospace', color: T.red }}>DELETE</span> om te bevestigen</label>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="DELETE" style={{ padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, color: T.ink, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setShowConfirm(false); setDeleteInput('') }} style={secBtn}>Annuleer</button>
            <button onClick={wipeAll} disabled={deleteInput !== 'DELETE'} style={{ ...dangerBtn, opacity: deleteInput !== 'DELETE' ? 0.45 : 1 }}>Wissen</button>
          </div>
        </Overlay>
      )}

      {showImportConfirm && (
        <Overlay onClose={() => { setShowImportConfirm(false); setImportData(null) }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 8 }}>Instellingen terugzetten?</div>
          <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 20 }}>Dit overschrijft de huidige lokale instellingen. Weet je het zeker?</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setShowImportConfirm(false); setImportData(null) }} style={secBtn}>Annuleer</button>
            <button onClick={confirmImport} style={{ ...secBtn, background: T.blue, color: '#fff', border: 'none' }}>Terugzetten</button>
          </div>
        </Overlay>
      )}
    </div>
  )
}

function SubSection({ title, description, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: description ? 4 : 12 }}>{title}</div>
      {description && <div style={{ fontSize: 12, color: T.ink3, marginBottom: 14 }}>{description}</div>}
      {children}
    </div>
  )
}

function DataRow({ icon, title, desc, action, onAction }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: 14, border: `1px solid ${T.border}`, borderRadius: 10, background: T.card }}>
      <div style={{ width: 34, height: 34, borderRadius: 8, background: T.bg, color: T.ink2, display: 'grid', placeItems: 'center' }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>{title}</div>
        <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{desc}</div>
      </div>
      <button onClick={onAction} style={{ padding: '7px 14px', borderRadius: 8, background: T.card, color: T.ink, border: `1px solid ${T.border}`, fontSize: 12.5, fontWeight: 500, cursor: 'pointer' }}>{action}</button>
    </div>
  )
}

function Overlay({ children, onClose }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.35)', display: 'grid', placeItems: 'center', zIndex: 50 }}>
      <div onClick={e => e.stopPropagation()} style={{ width: 380, background: T.card, borderRadius: 12, boxShadow: '0 30px 60px -12px rgba(17,24,39,0.30)', padding: 22, border: `1px solid ${T.border}` }}>
        {children}
      </div>
    </div>
  )
}

const secBtn = { flex: 1, padding: '8px 14px', borderRadius: 8, background: T.card, color: T.ink, border: `1px solid ${T.border}`, fontSize: 13, fontWeight: 500, cursor: 'pointer' }
const dangerBtn = { flex: 1, padding: '8px 14px', borderRadius: 8, background: T.red, color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }
