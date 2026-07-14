// ─── BankImportFlow ───
// Preview-flow voor bankkoppeling-sync: haalt nieuwe transacties op via /api/bank/sync
// en hergebruikt de CSV-preview-componenten (duplicaat-check, vaste lasten matching, AI-hulp).

import React, { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import { supabase } from '../../supabaseClient'
import { useHousehold } from '../../hooks/useHousehold'
import { useActiveAccount } from '../../hooks/useActiveAccount'
import useAccounts from '../../hooks/useAccounts'
import useProfiles from '../../hooks/useProfiles'
import useSettings from '../../hooks/useSettings'
import { clearAllCaches } from '../../hooks/cacheManager'
import { markDuplicates, matchFixedExpenses } from '../../utils/csvParser'
import ImportPreviewTable from './ImportPreviewTable'
import ImportAiModal from './ImportAiModal'

export default function BankImportFlow({ rekening, open, onClose }) {
  const { T } = useTheme()
  const navigate = useNavigate()
  const { householdId } = useHousehold()
  const { activeAccountId } = useActiveAccount()
  const { updateAccount } = useAccounts()
  const { profiles } = useProfiles()
  const { settings } = useSettings()

  const [loading, setLoading]                 = useState(false)
  const [rows, setRows]                       = useState([])
  const [error, setError]                     = useState('')
  const [herkoppelen, setHerkoppelen]         = useState(false)
  const [herkoppelBezig, setHerkoppelBezig]   = useState(false)
  const [importing, setImporting]             = useState(false)
  const [importedCount, setImportedCount]     = useState(0)
  const [validationError, setValidationError] = useState('')
  const [aiModalOpen, setAiModalOpen]         = useState(false)
  const contentRef                            = useRef()

  const secBtn = { padding: '9px 18px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const priBtn = { padding: '9px 20px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  useEffect(() => {
    if (open) fetchAndPrepare()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  function reset() {
    setLoading(false); setRows([]); setError(''); setHerkoppelen(false)
    setImporting(false); setImportedCount(0); setValidationError(''); setAiModalOpen(false)
    setHerkoppelBezig(false)
  }

  function handleClose() { reset(); onClose() }

  // Herkoppelen vanuit de syncfout — zelfde flow als SettingsAccounts.handleHerkoppelen
  async function handleHerkoppelen() {
    if (!rekening?.aspspNaam) { navigate('/instellingen?sectie=rekeningen'); return }
    setHerkoppelBezig(true)
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch('/api/bank/start', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ aspsp_naam: rekening.aspspNaam, gedeeld: rekening.gedeeld }),
    })
    const result = await response.json().catch(() => ({}))
    setHerkoppelBezig(false)
    if (!response.ok || !result.url) return
    window.location.href = result.url
  }

  async function fetchAndPrepare() {
    setLoading(true); setError(''); setHerkoppelen(false); setRows([])
    const { data: { session } } = await supabase.auth.getSession()
    const response = await fetch('/api/bank/sync', {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ rekening_id: activeAccountId }),
    })
    const result = await response.json().catch(() => ({}))

    if (!response.ok) {
      setError(result?.herkoppelen ? 'Koppeling verlopen — koppel opnieuw.' : (result?.error || 'Ophalen van transacties is mislukt.'))
      setHerkoppelen(!!result?.herkoppelen)
      setLoading(false)
      return
    }
    if (!result.transacties?.length) {
      setError('Geen nieuwe transacties gevonden.')
      setLoading(false)
      return
    }

    const [{ data: existing }, { data: fixedItems }] = await Promise.all([
      supabase.from('transactions').select('datum, bedrag, winkel').eq('household_id', householdId).eq('account_id', activeAccountId),
      supabase.from('fixed_expenses').select('id, naam, categorie, subcategorie, soort, wie').eq('household_id', householdId).eq('actief', true),
    ])
    const prepared = result.transacties.map((t, i) => ({ _id: i, selected: true, status: 'nieuw', ...t }))
    let processed = markDuplicates(prepared, existing ?? [])
    processed     = matchFixedExpenses(processed, fixedItems ?? [])
    setRows(processed)
    setLoading(false)
  }

  function updateRow(index, updates) {
    setValidationError('')
    setRows(prev => prev.map((r, i) => i !== index ? r : { ...r, ...updates, _invalid: false }))
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
      bron: 'bank', vaste_last_id: r.vaste_last_id ?? null, extern_transactie_id: r.extern_transactie_id ?? null,
    }))
    const { error: err } = await supabase.from('transactions').insert(toInsert)
    setImporting(false)
    if (err) { setError('Fout bij importeren: ' + err.message); return }
    await updateAccount(activeAccountId, { laatstGesynct: new Date().toISOString() })
    clearAllCaches()
    setImportedCount(selected.length)
    setTimeout(handleClose, 1800)
  }

  if (!open) return null

  const selectedCount = rows.filter(r => r.selected).length
  const naam = rekening?.naam ?? 'deze rekening'

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
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>Bank synchroniseren — {naam}</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Controleer en importeer nieuwe transacties</div>
          </div>
          <button onClick={handleClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        <div ref={contentRef} style={{ flex: 1, overflow: 'auto', padding: 24 }}>
          {loading && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 14 }}>
              <span className="wf-spin" style={{ display: 'inline-flex', color: T.ink3 }}>{ICONS.refresh}</span>
              <div style={{ fontSize: 13, color: T.ink3 }}>Transacties ophalen bij de bank…</div>
            </div>
          )}

          {!loading && error && rows.length === 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 24px', gap: 14 }}>
              <span style={{ color: T.red, display: 'inline-flex' }}>{ICONS.warn}</span>
              <div style={{ fontSize: 13.5, color: T.ink2, textAlign: 'center', maxWidth: 380 }}>{error}</div>
              {herkoppelen && (
                rekening?.aspspNaam ? (
                  <button onClick={handleHerkoppelen} disabled={herkoppelBezig} style={{ ...priBtn, opacity: herkoppelBezig ? 0.6 : 1 }}>
                    {herkoppelBezig ? 'Bezig…' : 'Opnieuw koppelen'}
                  </button>
                ) : (
                  <button onClick={() => navigate('/instellingen?sectie=rekeningen')} style={secBtn}>
                    Ga naar Instellingen → Rekeningen
                  </button>
                )
              )}
            </div>
          )}

          {!loading && rows.length > 0 && (
            <>
              {importedCount > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 24px', gap: 14 }}>
                  <div style={{ width: 52, height: 52, borderRadius: '50%', background: T.greenSoft, color: T.green, display: 'grid', placeItems: 'center', fontSize: 22 }}>✓</div>
                  <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>{importedCount} transacties geïmporteerd!</div>
                </div>
              ) : (
                <>
                  {validationError && (
                    <div style={{ marginBottom: 14, padding: '12px 16px', borderRadius: 8, background: T.redSoft, color: T.redText, fontSize: 13, border: '1px solid #FECACA', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                      <span style={{ display: 'inline-flex', marginTop: 1, flexShrink: 0, color: T.red }}>{ICONS.warn}</span>
                      {validationError}
                    </div>
                  )}
                  {error && (
                    <div style={{ marginBottom: 14, padding: '10px 14px', borderRadius: 8, background: T.amberSoft, color: T.amberText, fontSize: 12.5, border: `1px solid #FDE68A` }}>{error}</div>
                  )}
                  <ImportPreviewTable rows={rows} onUpdate={updateRow} profiles={profiles} customCategories={settings.custom_categories} onAiHelp={() => setAiModalOpen(true)} />
                </>
              )}
            </>
          )}
        </div>

        {!loading && (
          <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            {rows.length > 0 && importedCount === 0 ? (
              <button onClick={handleImport} disabled={importing || selectedCount === 0} style={{ ...priBtn, opacity: selectedCount === 0 ? 0.45 : 1 }}>
                {importing ? 'Bezig…' : `${selectedCount} transacties importeren`}
              </button>
            ) : importedCount === 0 ? (
              <button onClick={handleClose} style={secBtn}>Sluiten</button>
            ) : null}
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
