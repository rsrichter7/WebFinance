// ─── SettingsDataManagement ───
// Data beheer: exporteer alle Supabase-data, importeer transacties,
// herstel lokale instellingen en verwijder je account.

import React, { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import { T } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { supabase } from '../../supabaseClient'
import { useAuth } from '../../hooks/useAuth'
import { useHousehold } from '../../hooks/useHousehold'
import ImportFlow from '../transactions/ImportFlow'
import SettingsDeleteAccount from './SettingsDeleteAccount'
import useTransactions from '../../hooks/useTransactions'

const WF_KEYS = [
  'webfinance_admin_unlocked',
  'webfinance_datumformaat',
  'webfinance_custom_categories',
  'webfinance_premium',
]

export default function SettingsDataManagement() {
  const { user }                              = useAuth()
  const { householdId }                       = useHousehold()
  const { allTransactions, deleteAllTransactions } = useTransactions()
  const [deleteInput,           setDeleteInput]           = useState('')
  const [showConfirm,           setShowConfirm]           = useState(false)
  const [showImportConfirm,     setShowImportConfirm]     = useState(false)
  const [importData,            setImportData]            = useState(null)
  const [csvImportOpen,         setCsvImportOpen]         = useState(false)
  const [exporting,             setExporting]             = useState(false)
  const [showDeleteTxConfirm,   setShowDeleteTxConfirm]   = useState(false)
  const [deletingTx,            setDeletingTx]            = useState(false)
  const [deleteTxSuccess,       setDeleteTxSuccess]       = useState(false)
  const importRef = useRef()

  async function handleDeleteAllTx() {
    setDeletingTx(true)
    const { error: err } = await deleteAllTransactions()
    setDeletingTx(false)
    setShowDeleteTxConfirm(false)
    if (!err) {
      setDeleteTxSuccess(true)
      setTimeout(() => setDeleteTxSuccess(false), 4000)
    }
  }

  async function exportAlleGegevens() {
    if (!householdId) return
    setExporting(true)
    const vandaag = new Date().toISOString().split('T')[0]

    const [
      { data: transacties },
      { data: vasteLasten },
      { data: budgetten },
      { data: spaardoelen },
      { data: profielen },
      { data: instellingen },
    ] = await Promise.all([
      supabase.from('transactions').select('*').eq('household_id', householdId),
      supabase.from('fixed_expenses').select('*').eq('household_id', householdId),
      supabase.from('budgets').select('*').eq('household_id', householdId),
      supabase.from('savings_goals').select('*').eq('household_id', householdId),
      supabase.from('profiles').select('*').eq('household_id', householdId),
      supabase.from('user_settings').select('*').eq('user_id', user?.id),
    ])

    const wb = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet((transacties || []).map(r => ({
        'Datum': r.datum ?? '', 'Bedrag': r.bedrag ?? 0, 'Type': r.type ?? '',
        'Winkel': r.winkel ?? '', 'Categorie': r.categorie ?? '',
        'Subcategorie': r.subcategorie ?? '', 'Soort': r.soort ?? '',
        'Wie': r.wie ?? '', 'Beschrijving': r.beschrijving ?? '', 'Bron': r.bron ?? '',
      }))),
      'Transacties'
    )

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet((vasteLasten || []).map(r => ({
        'Naam': r.naam ?? '', 'Bedrag': r.bedrag ?? 0, 'Frequentie': r.frequentie ?? '',
        'Categorie': r.categorie ?? '', 'Subcategorie': r.subcategorie ?? '',
        'Soort': r.soort ?? '', 'Wie': r.wie ?? '', 'Afschrijfdag': r.afschrijfdag ?? '',
      }))),
      'Vaste Lasten'
    )

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet((budgetten || []).map(r => ({
        'Categorie': r.categorie ?? '', 'Bedrag': r.bedrag ?? 0, 'Modus': r.modus ?? '',
      }))),
      'Budgetten'
    )

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet((spaardoelen || []).map(r => ({
        'Naam': r.naam ?? '', 'Doelbedrag': r.doelbedrag ?? 0, 'Deadline': r.deadline ?? '',
      }))),
      'Spaardoelen'
    )

    XLSX.utils.book_append_sheet(wb,
      XLSX.utils.json_to_sheet((profielen || []).map(r => ({
        'Naam': r.naam ?? '', 'Initialen': r.initialen ?? '',
        'Kleur': typeof r.kleur === 'object' ? JSON.stringify(r.kleur) : (r.kleur ?? ''),
      }))),
      'Profielen'
    )

    const META = new Set(['id', 'user_id', 'household_id', 'created_at', 'updated_at'])
    const instRows = Object.entries(instellingen?.[0] || {})
      .filter(([k]) => !META.has(k))
      .map(([k, v]) => ({
        'Instelling': k,
        'Waarde': typeof v === 'object' ? JSON.stringify(v) : String(v ?? ''),
      }))
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(instRows), 'Instellingen')

    XLSX.writeFile(wb, `webfinance-export-${vandaag}.xlsx`)
    setExporting(false)
  }

  function exportJSON() {
    const data = {}
    WF_KEYS.forEach(k => {
      const v = localStorage.getItem(k)
      if (v !== null) { try { data[k] = JSON.parse(v) } catch { data[k] = v } }
    })
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
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Exporteer, importeer of verwijder je gegevens</div>
      </div>

      <SubSection title="Gegevens exporteren">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DataRow
            icon={ICONS.download}
            title="Alle gegevens (Excel)"
            desc="Transacties, budgetten, spaardoelen en meer — 6 tabbladen"
            action={exporting ? 'Bezig…' : 'Download Excel'}
            onAction={exportAlleGegevens}
          />
          <DataRow
            icon={ICONS.download}
            title="Lokale instellingen (JSON)"
            desc="Datumformaat en aangepaste categorieën"
            action="Exporteer JSON"
            onAction={exportJSON}
          />
        </div>
      </SubSection>

      <SubSection title="Importeren">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <DataRow
            icon={ICONS.upload}
            title="Transacties importeren (CSV)"
            desc="Importeer transacties vanuit bankafschrift"
            action="Importeren"
            onAction={() => setCsvImportOpen(true)}
          />
          <input ref={importRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFile} />
          <DataRow
            icon={ICONS.upload}
            title="Instellingen terugzetten"
            desc="Selecteer een eerder geëxporteerd JSON-bestand"
            action="Bestand kiezen"
            onAction={() => importRef.current?.click()}
          />
        </div>
      </SubSection>

      <SubSection title="Gevarenzone" description="Niet ongedaan te maken">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* Alle transacties verwijderen */}
          <div style={{ border: '1px solid #FECACA', borderRadius: 10, padding: 14, background: T.redSoft, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.redText }}>Alle transacties verwijderen</div>
              <div style={{ fontSize: 12, color: T.ink2, marginTop: 2 }}>
                {deleteTxSuccess
                  ? <span style={{ color: T.green, fontWeight: 500 }}>✓ Alle transacties zijn verwijderd</span>
                  : `Verwijdert alle ${allTransactions.length} transacties permanent.`
                }
              </div>
            </div>
            <button
              onClick={() => setShowDeleteTxConfirm(true)}
              style={{ padding: '8px 14px', borderRadius: 8, background: T.card, color: T.red, border: '1px solid #FECACA', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {ICONS.trash} Verwijderen
            </button>
          </div>
          {/* Lokale instellingen resetten */}
          <div style={{ border: '1px solid #FECACA', borderRadius: 10, padding: 14, background: T.redSoft, display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.redText }}>Lokale instellingen resetten</div>
              <div style={{ fontSize: 12, color: T.ink2, marginTop: 2 }}>Reset lokale instellingen naar standaardwaarden. Je gegevens blijven bewaard.</div>
            </div>
            <button onClick={() => setShowConfirm(true)} style={{ padding: '8px 14px', borderRadius: 8, background: T.card, color: T.red, border: '1px solid #FECACA', fontSize: 13, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
              {ICONS.trash} Resetten
            </button>
          </div>
        </div>
      </SubSection>

      {/* Scheiding voor account-verwijdering */}
      <div style={{ height: 1, background: T.border, margin: '8px 0 24px' }} />

      <SettingsDeleteAccount />

      {showDeleteTxConfirm && (
        <Overlay onClose={() => !deletingTx && setShowDeleteTxConfirm(false)}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.redSoft, color: T.red, display: 'grid', placeItems: 'center', marginBottom: 12 }}>{ICONS.trash}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Alle transacties verwijderen?</div>
          <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 20 }}>
            Dit verwijdert <strong style={{ color: T.ink }}>{allTransactions.length} transacties</strong> permanent,
            inclusief automatische transacties en spaardoel-stortingen.{' '}
            Dit kan niet ongedaan worden gemaakt.
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => setShowDeleteTxConfirm(false)} disabled={deletingTx} style={secBtn}>Annuleren</button>
            <button onClick={handleDeleteAllTx} disabled={deletingTx} style={{ ...dangerBtn, opacity: deletingTx ? 0.6 : 1 }}>
              {deletingTx ? 'Verwijderen…' : 'Verwijderen'}
            </button>
          </div>
        </Overlay>
      )}

      {showConfirm && (
        <Overlay onClose={() => { setShowConfirm(false); setDeleteInput('') }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: T.redSoft, color: T.red, display: 'grid', placeItems: 'center', marginBottom: 12 }}>{ICONS.warn}</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Weet je het zeker?</div>
          <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 16 }}>
            Hiermee reset je de <strong style={{ color: T.ink }}>lokale instellingen</strong> naar standaardwaarden. Je gegevens blijven bewaard.
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: T.ink2 }}>Typ <span style={{ fontFamily: 'monospace', color: T.red }}>DELETE</span> om te bevestigen</label>
            <input value={deleteInput} onChange={e => setDeleteInput(e.target.value)} placeholder="DELETE" style={{ padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 13, color: T.ink, outline: 'none', fontFamily: 'inherit' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => { setShowConfirm(false); setDeleteInput('') }} style={secBtn}>Annuleer</button>
            <button onClick={wipeAll} disabled={deleteInput !== 'DELETE'} style={{ ...dangerBtn, opacity: deleteInput !== 'DELETE' ? 0.45 : 1 }}>Resetten</button>
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

      <ImportFlow open={csvImportOpen} onClose={() => setCsvImportOpen(false)} />
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

const secBtn    = { flex: 1, padding: '8px 14px', borderRadius: 8, background: T.card, color: T.ink, border: `1px solid ${T.border}`, fontSize: 13, fontWeight: 500, cursor: 'pointer' }
const dangerBtn = { flex: 1, padding: '8px 14px', borderRadius: 8, background: T.red, color: '#fff', border: 'none', fontSize: 13, fontWeight: 500, cursor: 'pointer' }
