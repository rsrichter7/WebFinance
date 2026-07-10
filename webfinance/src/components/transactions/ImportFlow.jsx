// ─── ImportFlow ───
// CSV-importflow: upload (stap 1) → preview (stap 2) → importeer.
// Detecteert bank automatisch, controleert duplicaten en koppelt vaste lasten.

import React, { useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import { supabase } from '../../supabaseClient'
import { useHousehold } from '../../hooks/useHousehold'
import { useActiveAccount } from '../../hooks/useActiveAccount'
import useProfiles from '../../hooks/useProfiles'
import useSettings from '../../hooks/useSettings'
import { parseCSV, markDuplicates, matchFixedExpenses } from '../../utils/csvParser'
import ImportPreviewTable from './ImportPreviewTable'
import ImportAiModal from './ImportAiModal'
import BankInstructies from './BankInstructies'

export default function ImportFlow({ open, onClose, onImportComplete }) {
  const { T } = useTheme()
  const { householdId } = useHousehold()
  const { activeAccountId, activeAccount } = useActiveAccount()
  const { profiles }    = useProfiles()
  const { settings }    = useSettings()

  const [stap, setStap]                   = useState(1)
  const [rows, setRows]                   = useState([])
  const [detectedBank, setDetectedBank]   = useState('')
  const [isDragging, setIsDragging]       = useState(false)
  const [importing, setImporting]         = useState(false)
  const [importedCount, setImportedCount] = useState(0)
  const [error, setError]                 = useState('')
  const [validationError, setValidationError] = useState('')
  const [aiModalOpen, setAiModalOpen]     = useState(false)
  const fileRef                           = useRef()
  const contentRef                        = useRef()

  const maxRows = settings.import_max_regels ?? 1000

  const secBtn = { padding: '9px 18px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const priBtn = { padding: '9px 20px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  function reset() {
    setStap(1); setRows([]); setError(''); setValidationError('')
    setImportedCount(0); setImporting(false); setAiModalOpen(false); setDetectedBank('')
  }

  function handleAiApply(results) {
    setValidationError('')
    setRows(prev => {
      const next = [...prev]
      for (const r of results) {
        if (r.index >= 0 && r.index < next.length) next[r.index] = { ...next[r.index], ...r }
      }
      return next
    })
  }

  function handleClose() { reset(); onClose() }

  async function processFile(file) {
    const name = file?.name ?? ''
    if (!name.endsWith('.csv') && !name.endsWith('.txt')) {
      setError('Selecteer een .csv of .txt bestand.'); return
    }
    setError('')
    const text   = await file.text()
    const result = parseCSV(text)
    if (result.error || !result.transactions.length) {
      setError(result.error ?? 'Geen transacties gevonden in dit bestand.')
      return
    }
    let limited = result.transactions
    let limitWarning = ''
    if (result.transactions.length > maxRows) {
      limited = result.transactions.slice(0, maxRows)
      limitWarning = `CSV bevat ${result.transactions.length} regels — alleen de eerste ${maxRows} worden geladen.`
    }
    const [{ data: existing }, { data: fixedItems }] = await Promise.all([
      supabase.from('transactions').select('datum, bedrag, winkel').eq('household_id', householdId).eq('account_id', activeAccountId),
      supabase.from('fixed_expenses').select('id, naam, categorie, subcategorie, soort, wie').eq('household_id', householdId).eq('actief', true),
    ])
    let processed = markDuplicates(limited, existing ?? [])
    processed     = matchFixedExpenses(processed, fixedItems ?? [])
    setDetectedBank(result.bankLabel)
    setRows(processed)
    if (limitWarning) setError(limitWarning)
    setStap(2)
  }

  function handleFileInput(e) {
    const file = e.target.files?.[0]
    if (file) processFile(file)
    e.target.value = ''
  }

  function handleDrop(e) {
    e.preventDefault(); setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  function updateRow(index, updates) {
    setValidationError('')
    setRows(prev => prev.map((r, i) => i !== index ? r : { ...r, ...updates, _invalid: false }))
  }

  async function handleImport() {
    const selected = rows.filter(r => r.selected)
    if (!selected.length || !householdId) return
    const incomplete = selected.filter(r => !r.categorie || !r.subcategorie || !r.soort)
    if (incomplete.length > 0) {
      const ev = incomplete.length === 1
      setValidationError(
        `${incomplete.length} transactie${ev ? '' : 's'} ${ev ? 'heeft' : 'hebben'} nog geen categorie, subcategorie of soort. Vul deze eerst in voordat je importeert.`
      )
      setRows(prev => prev.map(r =>
        r.selected && (!r.categorie || !r.subcategorie || !r.soort)
          ? { ...r, _invalid: true } : { ...r, _invalid: false }
      ))
      setTimeout(() => {
        const el = contentRef.current?.querySelector('[data-invalid="true"]')
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }, 50)
      return
    }
    setValidationError('')
    setImporting(true)
    const toInsert = selected.map(r => ({
      household_id: householdId, account_id: activeAccountId, datum: r.datum, bedrag: r.bedrag, type: r.type,
      beschrijving: r.beschrijving, winkel: r.winkel, categorie: r.categorie || '',
      subcategorie: r.subcategorie || '', soort: r.soort || null, wie: r.wie,
      bron: 'import', vaste_last_id: r.vaste_last_id ?? null,
    }))
    const { error: err } = await supabase.from('transactions').insert(toInsert)
    setImporting(false)
    if (err) { setError('Fout bij importeren: ' + err.message); return }
    setImportedCount(selected.length)
    onImportComplete?.()
    setTimeout(handleClose, 1800)
  }

  if (!open) return null

  const selectedCount = rows.filter(r => r.selected).length

  return createPortal(
    <>
      <div onClick={handleClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200 }} />
      <div style={{
        position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
        width: 'min(1100px, 95vw)', maxHeight: '90vh',
        background: T.card, borderRadius: 14, boxShadow: '0 30px 80px rgba(0,0,0,0.3)',
        zIndex: 201, display: 'flex', flexDirection: 'column', overflow: 'hidden',
        border: `1px solid ${T.border}`,
      }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>
              {stap === 1 ? 'Transacties importeren' : 'Preview — controleer en importeer'}
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Stap {stap} van 2</div>
          </div>
          <button onClick={handleClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        <div ref={contentRef} style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {stap === 1 && (
            <UploadStap
              T={T}
              secBtn={secBtn}
              isDragging={isDragging}
              onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onPickFile={() => fileRef.current?.click()}
              fileRef={fileRef}
              onFileInput={handleFileInput}
              error={error}
            />
          )}
          {stap === 2 && (
            <>
              {importedCount > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.greenSoft, color: T.green, display: 'grid', placeItems: 'center', fontSize: 22 }}>✓</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>{importedCount} transacties geïmporteerd!</div>
                </div>
              ) : (
                <>
                  {detectedBank && (
                    <div style={{ marginBottom: 14, padding: '8px 14px', borderRadius: 8, background: T.greenSoft, color: T.green, fontSize: 13, fontWeight: 500, border: `1px solid ${T.green}22` }}>
                      {detectedBank} CSV gedetecteerd — {rows.length} transacties gevonden
                    </div>
                  )}
                  {activeAccount && (
                    <div style={{ marginBottom: 14, fontSize: 12.5, color: T.ink3 }}>
                      Importeren naar: <span style={{ fontWeight: 500, color: T.ink2 }}>{activeAccount.naam}</span>
                    </div>
                  )}
                  {validationError && (
                    <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 8, background: T.redSoft, color: T.redText, fontSize: 13, border: '1px solid #FECACA', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ display: 'inline-flex', marginTop: 1, flexShrink: 0, color: T.red }}>{ICONS.warn}</span>
                      {validationError}
                    </div>
                  )}
                  <ImportPreviewTable rows={rows} onUpdate={updateRow} profiles={profiles} customCategories={settings.custom_categories} onAiHelp={() => setAiModalOpen(true)} />
                  {error && (
                    <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 8, background: T.amberSoft, color: T.amberText, fontSize: 12.5, border: `1px solid #FDE68A` }}>{error}</div>
                  )}
                </>
              )}
            </>
          )}
        </div>

        {stap === 2 && importedCount === 0 && (
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <button onClick={() => { setStap(1); setError(''); setValidationError('') }} style={secBtn}>← Terug</button>
            <button onClick={handleImport} disabled={importing || selectedCount === 0} style={{ ...priBtn, opacity: selectedCount === 0 ? 0.45 : 1 }}>
              {importing ? 'Bezig…' : `${selectedCount} transacties importeren`}
            </button>
          </div>
        )}
      </div>
      <ImportAiModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        rows={rows}
        customCategories={settings.custom_categories}
        onApply={handleAiApply}
      />
    </>,
    document.body
  )
}

function UploadStap({ T, secBtn, isDragging, onDragOver, onDragLeave, onDrop, onPickFile, fileRef, onFileInput, error }) {
  return (
    <div style={{ maxWidth: 580, margin: '0 auto' }}>
      <div
        onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}
        style={{
          border: `2px dashed ${isDragging ? T.blue : T.border}`,
          borderRadius: 12, padding: '48px 32px', textAlign: 'center',
          background: isDragging ? T.blueSoft : T.bg,
          transition: 'border-color 0.15s, background 0.15s', cursor: 'default',
        }}
      >
        <div style={{ color: isDragging ? T.blue : T.ink4, marginBottom: 12, display: 'flex', justifyContent: 'center' }}>
          <span style={{ transform: 'scale(1.8)', display: 'inline-flex' }}>{ICONS.upload}</span>
        </div>
        <div style={{ fontSize: 14, fontWeight: 500, color: T.ink, marginBottom: 6 }}>Sleep een CSV-bestand hierheen</div>
        <div style={{ fontSize: 13, color: T.ink3, marginBottom: 20 }}>of kies een bestand van je computer</div>
        <input ref={fileRef} type="file" accept=".csv,.txt" style={{ display: 'none' }} onChange={onFileInput} />
        <button onClick={onPickFile} style={{ ...secBtn, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <span style={{ display: 'inline-flex' }}>{ICONS.folder}</span>Bestand kiezen
        </button>
      </div>
      {error && (
        <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: T.redSoft, color: T.redText, fontSize: 13, border: '1px solid #FECACA' }}>{error}</div>
      )}
      <BankInstructies />
    </div>
  )
}
