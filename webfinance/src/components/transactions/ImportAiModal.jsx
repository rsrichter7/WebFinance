// ─── ImportAiModal ───
// AI-hulp voor categorisering via kopieer/plak. Geen externe API-calls.

import React, { useState, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { getMergedCategories } from '../../data/categories'

const SOORTEN_GELDIG = new Set(['Noodzaak', 'Wens', 'Sparen'])

function buildPrompt(rows, allCats) {
  const toCat = rows.map((r, i) => ({ ...r, _origIndex: i })).filter(r => r.selected && !r.categorie)
  if (toCat.length === 0) return { prompt: '', toCat: [] }
  const catList = allCats.map(c => `- ${c.name}: ${c.subs.join(', ')}`).join('\n')
  const txList = toCat.map((r, i) => `${i + 1}. ${r.winkel || '(onbekend)'} | ${r.beschrijving || ''} | ${fmt(r.bedrag)} | ${r.type}`).join('\n')
  const prompt = [
    'Categoriseer de volgende banktransacties. Gebruik UITSLUITEND de categorieën en subcategorieën uit de lijst hieronder. Kies ook een soort (Noodzaak, Wens of Sparen).',
    '', 'BESCHIKBARE CATEGORIEËN:', catList,
    '', 'SOORTEN: Noodzaak, Wens, Sparen',
    '', 'TRANSACTIES:', txList,
    '', 'Geef het resultaat als CSV (zonder headers), in dit formaat:', 'regelnummer,categorie,subcategorie,soort',
    '', 'Voorbeeld:', '1,Dagelijks leven,Boodschappen,Noodzaak', '2,Wonen,Verzekeringen (woning),Noodzaak', '3,Vrije tijd,Shoppen,Wens',
  ].join('\n')
  return { prompt, toCat }
}

function parseAiResult(text, toCat, allCats) {
  const applied = []
  let skipped = 0
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0 && !/^regelnummer/i.test(l))
  for (const line of lines) {
    const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''))
    if (parts.length < 4) continue
    const [numStr, categorie, subcategorie, soort] = parts
    const num = parseInt(numStr)
    if (isNaN(num) || num < 1 || num > toCat.length) continue
    const catObj = allCats.find(c => c.name === categorie)
    if (!catObj || !catObj.subs.includes(subcategorie) || !SOORTEN_GELDIG.has(soort)) { skipped++; continue }
    applied.push({ index: toCat[num - 1]._origIndex, categorie, subcategorie, soort, _aiTagged: true, _invalid: false })
  }
  return { applied, skipped }
}

export default function ImportAiModal({ open, onClose, rows, customCategories, onApply }) {
  const { T } = useTheme()
  const allCats = useMemo(() => getMergedCategories(customCategories), [customCategories])
  const { prompt, toCat } = useMemo(() => buildPrompt(rows, allCats), [rows, allCats])

  const [copied, setCopied]       = useState(false)
  const [pasteText, setPasteText] = useState('')
  const [resultMsg, setResultMsg] = useState('')

  function handleClose() { setCopied(false); setPasteText(''); setResultMsg(''); onClose() }

  async function handleCopy() {
    try { await navigator.clipboard.writeText(prompt) } catch {}
    setCopied(true)
  }

  function handleApply() {
    if (!pasteText.trim()) return
    const { applied, skipped } = parseAiResult(pasteText, toCat, allCats)
    if (applied.length > 0) onApply(applied)
    const totaal = toCat.length
    const bericht = applied.length > 0
      ? `${applied.length} van ${totaal} transacties gecategoriseerd${skipped > 0 ? `, ${skipped} overgeslagen (onbekende categorie)` : ''}.`
      : `Geen geldige categoriseringen gevonden. Controleer of het formaat klopt.`
    setResultMsg(bericht)
    if (applied.length > 0) setTimeout(handleClose, 2000)
  }

  if (!open) return null

  const promptAreaStyle = {
    width: '100%', height: 220, resize: 'none', padding: '12px 14px',
    borderRadius: 8, border: `1px solid ${T.border}`, background: T.bg,
    fontSize: 12, fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    color: T.ink2, lineHeight: 1.6, outline: 'none', boxSizing: 'border-box',
  }
  const pasteAreaStyle = {
    width: '100%', resize: 'vertical', padding: '10px 14px',
    borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.card,
    fontSize: 12.5, fontFamily: 'ui-monospace, SFMono-Regular, monospace',
    color: T.ink, lineHeight: 1.6, outline: 'none', boxSizing: 'border-box',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 210, display: 'grid', placeItems: 'center' }}>
      <div onClick={handleClose} style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} />
      <div style={{
        position: 'relative', width: 'min(700px, 94vw)', maxHeight: '90vh',
        background: T.card, borderRadius: 14, boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
        border: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '18px 22px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: T.violet, display: 'inline-flex' }}>{ICONS.sparkle}</span>
            <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>Categoriseer met AI</div>
          </div>
          <button onClick={handleClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 22, display: 'flex', flexDirection: 'column', gap: 20 }}>
          {toCat.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center', color: T.ink3, fontSize: 13 }}>
              Alle geselecteerde transacties hebben al een categorie. Er is geen AI-hulp nodig.
            </div>
          ) : (
            <>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Stap 1 — Kopieer de prompt</div>
                <div style={{ fontSize: 12.5, color: T.ink3, marginBottom: 10, lineHeight: 1.5 }}>
                  Kopieer onderstaande tekst en plak deze in ChatGPT, Claude of een ander AI-programma. Kopieer daarna het resultaat en plak het hieronder.
                </div>
                <textarea readOnly value={prompt} style={promptAreaStyle} onClick={e => e.target.select()} />
                <button
                  onClick={handleCopy}
                  style={{
                    marginTop: 10, padding: '8px 16px', borderRadius: 8, border: 'none',
                    background: copied ? T.green : T.blue, color: '#fff',
                    fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'background 0.2s',
                  }}
                >
                  {copied ? <>{ICONS.check} Gekopieerd ✓</> : <>{ICONS.upload} Kopieer naar klembord</>}
                </button>
              </div>

              {copied && (
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 4 }}>Stap 2 — Plak het resultaat van de AI</div>
                  <div style={{ fontSize: 12.5, color: T.ink3, marginBottom: 10 }}>
                    Plak de CSV-output van de AI hieronder en klik op "Resultaat toepassen".
                  </div>
                  <textarea
                    value={pasteText}
                    onChange={e => { setPasteText(e.target.value); setResultMsg('') }}
                    placeholder={'1,Dagelijks leven,Boodschappen,Noodzaak\n2,Wonen,Verzekeringen (woning),Noodzaak\n...'}
                    rows={8}
                    style={pasteAreaStyle}
                  />
                  {resultMsg && (
                    <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 8, background: T.blueSoft, color: T.blueText, fontSize: 13, border: `1px solid ${T.border}` }}>
                      {resultMsg}
                    </div>
                  )}
                  <button
                    onClick={handleApply}
                    disabled={!pasteText.trim()}
                    style={{ marginTop: 12, padding: '9px 20px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: pasteText.trim() ? 'pointer' : 'default', opacity: pasteText.trim() ? 1 : 0.45, fontFamily: 'inherit' }}
                  >
                    Resultaat toepassen
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
