// ─── SettingsDataManagement ───
// Exporteer, importeer of wis alle Webfinance-gegevens.

import React, { useState, useRef } from 'react'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'

const WF_KEYS = [
  'webfinance_transactions', 'webfinance_fixed', 'webfinance_budgets',
  'webfinance_spaardoelen', 'webfinance_budget_modus', 'webfinance_budget_verdeling',
  'webfinance_analytics_order', 'webfinance_profiel', 'webfinance_taal',
  'webfinance_theme', 'webfinance_custom_categories',
  'webfinance_admin_unlocked', 'webfinance_premium',
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
    dl(JSON.stringify(data, null, 2), 'webfinance-backup.json', 'application/json')
  }

  function exportCSV() {
    try {
      const txs = JSON.parse(localStorage.getItem('webfinance_transactions')) || []
      const headers = ['datum', 'beschrijving', 'bedrag', 'categorie', 'subcategorie', 'soort', 'bron']
      const rows = txs.map(t => headers.map(h => `"${String(t[h] ?? '').replace(/"/g, '""')}"`).join(','))
      dl([headers.join(','), ...rows].join('\n'), 'webfinance-transacties.csv', 'text/csv')
    } catch {}
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
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Exporteer, importeer of wis je gegevens</div>
      </div>

      <SubSection title="Exporteren">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DataRow icon={ICONS.download} title="Backup (JSON)"       desc="Alle data: transacties, categorieën, vaste lasten en instellingen" action="Exporteer JSON" onAction={exportJSON} />
          <DataRow icon={ICONS.download} title="Transacties (CSV)"   desc="Alleen transacties, importeerbaar in Excel of Numbers"             action="Exporteer CSV"  onAction={exportCSV} />
        </div>
      </SubSection>

      <SubSection title="Importeren">
        <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFile} />
        <DataRow icon={ICONS.upload} title="Backup terugzetten" desc="Selecteer een eerder geëxporteerd JSON-bestand" action="Bestand kiezen" onAction={() => importRef.current?.click()} />
      </SubSection>

      <SubSection title="Gevarenzone" description="Niet ongedaan te maken">
        <div style={{ border: '1px solid #FECACA', borderRadius: 10, padding: 14, background: T.redSoft, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: T.redText }}>Alle data wissen</div>
            <div style={{ fontSize: 12, color: T.ink2, marginTop: 2 }}>Verwijdert alle transacties, vaste lasten en instellingen permanent</div>
          </div>
          <button onClick={() => setShowConfirm(true)} style={{ padding: '8px 14px', borderRadius: 8, background: T.card, color: T.red, border: '1px solid #FECACA', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
            {ICONS.trash} Alles wissen
          </button>
        </div>
      </SubSection>

      {showConfirm && (
        <Overlay onClose={() => { setShowConfirm(false); setDeleteInput('') }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.redSoft, color: T.red, display: 'grid', placeItems: 'center', marginBottom: 12 }}>{ICONS.warn}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Weet je het zeker?</div>
          <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 16 }}>
            Hiermee verwijder je <strong style={{ color: T.ink }}>alle data</strong> uit Webfinance. Dit kan niet ongedaan worden gemaakt.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: T.ink2 }}>Typ <span style={{ fontFamily: 'monospace', color: T.red }}>DELETE</span> om te bevestigen</label>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="DELETE" style={{ padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, color: T.ink, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setShowConfirm(false); setDeleteInput('') }} style={secBtn}>Annuleer</button>
            <button onClick={wipeAll} disabled={deleteInput !== 'DELETE'} style={{ ...dangerBtn, opacity: deleteInput !== 'DELETE' ? 0.45 : 1 }}>Alles wissen</button>
          </div>
        </Overlay>
      )}

      {showImportConfirm && (
        <Overlay onClose={() => { setShowImportConfirm(false); setImportData(null) }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 8 }}>Backup terugzetten?</div>
          <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 20 }}>Dit overschrijft alle huidige data. Weet je het zeker?</div>
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
