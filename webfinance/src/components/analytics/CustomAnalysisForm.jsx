// ─── CustomAnalysisForm ───
// Slide-in formulier voor toevoegen en bewerken van analyses op de Analyse-pagina.

import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { getMergedCategories, SOORTEN } from '../../data/categories'
import useProfiles from '../../hooks/useProfiles'
import { validateVerplichteTekst } from '../../utils/validation'
import MultiSelectDropdown from '../ui/MultiSelectDropdown'
import CustomAnalysisFamilyFields, { ToggleRow } from './CustomAnalysisFamilyFields'

const FAMILIE_OPTIES = [
  { value: 'groep', label: 'Verdeling' },
  { value: 'trend', label: 'Trend over tijd' },
]
const MEET_OPTIES = [
  { value: 'som',    label: 'Totaalbedrag' },
  { value: 'aantal', label: 'Aantal transacties' },
]
const TYPE_OPTIES = [
  { value: 'Inkomst', label: 'Inkomsten' },
  { value: 'Uitgave', label: 'Uitgaven' },
  { value: 'Beide',   label: 'Beide' },
]

const EMPTY_FORM = {
  naam: '', familie: 'groep', dimensie: 'categorie', grafiekvorm: 'staaf',
  metric: 'som', type: 'Uitgave', soort: [], categorie: [], wie: [], toonReferentie5030: false,
}

const CATS = getMergedCategories().map(c => c.name)

function formUitConfig(analyse) {
  const c = analyse.config || {}
  return {
    naam:                analyse.naam,
    familie:             analyse.familie,
    dimensie:            c.dimensie || 'categorie',
    grafiekvorm:         c.grafiekvorm || (analyse.familie === 'trend' ? 'lijn' : 'staaf'),
    metric:              c.metric || 'som',
    type:                c.filters?.type || 'Uitgave',
    soort:               c.filters?.soort || [],
    categorie:           c.filters?.categorie || [],
    wie:                 c.filters?.wie || [],
    toonReferentie5030:  c.toonReferentie5030 === true,
  }
}

function configUitForm(form) {
  const filters = { type: form.type, soort: form.soort, categorie: form.categorie, wie: form.wie }
  if (form.familie === 'trend') return { metric: form.metric, grafiekvorm: form.grafiekvorm, filters }
  return {
    dimensie: form.dimensie, metric: form.metric, grafiekvorm: form.grafiekvorm, filters,
    toonReferentie5030: (form.dimensie === 'soort' && form.grafiekvorm === 'donut') ? form.toonReferentie5030 : false,
  }
}

export default function CustomAnalysisForm({ open, editingAnalyse, onClose, onSave }) {
  const { T } = useTheme()
  const { persons } = useProfiles()
  const [form, setForm] = useState(EMPTY_FORM)
  const [pogingOpslaan, setPogingOpslaan] = useState(false)

  const isEdit = !!editingAnalyse

  useEffect(() => {
    if (!open) return
    setPogingOpslaan(false)
    setForm(editingAnalyse ? formUitConfig(editingAnalyse) : EMPTY_FORM)
  }, [open, editingAnalyse])

  function update(field, value) {
    setForm(prev => {
      const next = { ...prev, [field]: value }
      if (field === 'familie') next.grafiekvorm = value === 'trend' ? 'lijn' : 'staaf'
      const toonCheckbox = next.familie === 'groep' && next.dimensie === 'soort' && next.grafiekvorm === 'donut'
      if (!toonCheckbox) next.toonReferentie5030 = false
      return next
    })
  }

  const naamValidatie = validateVerplichteTekst(form.naam, 'Naam')

  function handleSave() {
    if (!naamValidatie.valid) { setPogingOpslaan(true); return }
    onSave({ naam: form.naam.trim(), familie: form.familie, config: configUitForm(form) }, isEdit)
    onClose()
  }

  if (!open) return null

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const I = {
    width: '100%', padding: '9px 12px', borderRadius: 8,
    border: `1.5px solid ${T.border}`, background: T.card,
    fontSize: 13, color: T.ink, outline: 'none',
    fontFamily: "'Inter', system-ui, sans-serif",
  }

  const wieOpties = persons.map(p => ({ value: p.initialen, label: p.naam }))

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.15)', zIndex: 90 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 420,
        background: T.card, borderLeft: `1px solid ${T.border}`,
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        zIndex: 100, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: `1px solid ${T.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: 17, fontWeight: 600, color: T.ink }}>
              {isEdit ? 'Analyse bewerken' : 'Nieuwe analyse'}
            </div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
              {isEdit ? 'Wijzig de gegevens' : 'Stel een eigen grafiek samen'}
            </div>
          </div>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: 20, color: T.ink3, cursor: 'pointer', padding: '4px 8px', borderRadius: 6 }}>×</button>
        </div>

        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label style={L}>Naam *</label>
            <input type="text" placeholder="bijv. Uitgaven per winkel" value={form.naam}
              onChange={e => update('naam', e.target.value)}
              style={{ ...I, borderColor: pogingOpslaan && !naamValidatie.valid ? T.red : T.border }} />
            {pogingOpslaan && !naamValidatie.valid && (
              <div style={{ fontSize: 11.5, color: T.red, marginTop: 4 }}>{naamValidatie.error}</div>
            )}
          </div>

          <div>
            <label style={L}>Type grafiek *</label>
            <ToggleRow options={FAMILIE_OPTIES} value={form.familie} onChange={v => update('familie', v)} T={T} />
          </div>

          <CustomAnalysisFamilyFields form={form} update={update} T={T} L={L} />

          <div>
            <label style={L}>Meet *</label>
            <ToggleRow options={MEET_OPTIES} value={form.metric} onChange={v => update('metric', v)} T={T} />
          </div>

          <div>
            <label style={L}>Type transacties *</label>
            <ToggleRow options={TYPE_OPTIES} value={form.type} onChange={v => update('type', v)} T={T} />
          </div>

          <MultiSelectDropdown label="Soort" options={SOORTEN} selected={form.soort} onChange={v => update('soort', v)} />
          <MultiSelectDropdown label="Categorie" options={CATS} selected={form.categorie} onChange={v => update('categorie', v)} />
          <MultiSelectDropdown label="Wie" options={wieOpties} selected={form.wie} onChange={v => update('wie', v)} />
        </div>

        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', gap: 10 }}>
          <button onClick={handleSave} style={{
            flex: 1, padding: '10px 0', borderRadius: 8, border: 'none',
            background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>
            Opslaan
          </button>
        </div>
      </div>
    </>
  )
}
