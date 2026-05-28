// ─── BudgetSavingsGoals ───
// Spaardoelen overzicht met progress bars, storten en toevoegen.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { Card, Badge, ProgressBar } from '../ui/Card'
import { ICONS } from '../ui/Icons'

function StortInput({ onBevestig, onAnnuleer }) {
  const { T } = useTheme()
  const [bedrag, setBedrag] = useState('')

  const handleBevestig = () => {
    const parsed = parseFloat(bedrag.replace(',', '.'))
    if (parsed > 0) { onBevestig(parsed); setBedrag('') }
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, padding: '10px 12px', background: T.bg, borderRadius: 8, border: `1px solid ${T.border}` }}>
      <span style={{ fontSize: 12, color: T.ink3, whiteSpace: 'nowrap' }}>Bedrag:</span>
      <div style={{ position: 'relative', flex: 1, maxWidth: 140 }}>
        <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: T.ink3, pointerEvents: 'none' }}>€</span>
        <input type="text" inputMode="decimal" value={bedrag}
          onChange={e => setBedrag(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleBevestig()}
          placeholder="0,00" autoFocus
          style={{ width: '100%', padding: '6px 10px 6px 24px', borderRadius: 6, border: `1px solid ${T.border}`, fontSize: 13, fontFamily: 'inherit', ...TAB, outline: 'none', background: T.card, color: T.ink }} />
      </div>
      <button onClick={handleBevestig} style={{ padding: '6px 12px', borderRadius: 6, border: 'none', background: T.blue, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Storten</button>
      <button onClick={onAnnuleer} style={{ padding: '6px 10px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Annuleer</button>
    </div>
  )
}

function NieuwDoelForm({ onOpslaan, onAnnuleer }) {
  const { T } = useTheme()
  const [naam, setNaam] = useState('')
  const [doelbedrag, setDoelbedrag] = useState('')
  const [deadline, setDeadline] = useState('')

  function handleOpslaan() {
    const bedrag = parseFloat(doelbedrag.replace(',', '.'))
    if (!naam.trim() || !bedrag || bedrag <= 0) return
    onOpslaan({ naam: naam.trim(), doelbedrag: bedrag, deadline: deadline.trim() || null })
  }

  const I = { width: '100%', padding: '8px 12px', borderRadius: 6, border: `1.5px solid ${T.border}`, fontSize: 13, color: T.ink, fontFamily: 'inherit', outline: 'none', background: T.card }

  return (
    <div style={{ padding: 16, borderTop: `1px solid ${T.rule}`, background: T.bg, borderRadius: '0 0 12px 12px' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 12 }}>Nieuw spaardoel</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: T.ink3, marginBottom: 4 }}>Naam *</label>
            <input type="text" value={naam} onChange={e => setNaam(e.target.value)} placeholder="Bijv. Vakantie 2027" autoFocus style={I} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: T.ink3, marginBottom: 4 }}>Doelbedrag *</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: T.ink3, pointerEvents: 'none' }}>€</span>
              <input type="text" inputMode="decimal" value={doelbedrag} onChange={e => setDoelbedrag(e.target.value)}
                placeholder="0,00" style={{ ...I, paddingLeft: 24 }} />
            </div>
          </div>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: T.ink3, marginBottom: 4 }}>Deadline (optioneel)</label>
          <input type="text" value={deadline} onChange={e => setDeadline(e.target.value)} placeholder="Bijv. aug 2027" style={I} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
          <button onClick={onAnnuleer} style={{ padding: '7px 14px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Annuleer</button>
          <button onClick={handleOpslaan} style={{ padding: '7px 14px', borderRadius: 6, border: 'none', background: T.blue, color: '#fff', fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Toevoegen</button>
        </div>
      </div>
    </div>
  )
}

export default function BudgetSavingsGoals({ spaardoelen, onToevoegen, onStorten, onVerwijderen }) {
  const { T } = useTheme()
  const [stortId, setStortId] = useState(null)
  const [toonNieuw, setToonNieuw] = useState(false)

  const handleStorten = (id, bedrag) => { onStorten(id, bedrag); setStortId(null) }
  const handleNieuwOpslaan = (doel) => { onToevoegen(doel); setToonNieuw(false) }

  return (
    <Card style={{ padding: toonNieuw ? '22px 22px 0' : 22 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: T.teal }}>{ICONS.piggy}</span>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>Spaardoelen</div>
        </div>
        <button onClick={() => setToonNieuw(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 7, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
          {ICONS.plus} Spaardoel toevoegen
        </button>
      </div>

      {spaardoelen.length === 0 && !toonNieuw ? (
        <div style={{ textAlign: 'center', color: T.ink3, fontSize: 13, padding: '24px 0' }}>
          Nog geen spaardoelen aangemaakt
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {spaardoelen.map((doel, i) => {
            const huidig = doel.huidigBedrag || 0
            const pct = doel.doelbedrag > 0 ? (huidig / doel.doelbedrag) * 100 : 0
            const isLast = i === spaardoelen.length - 1
            return (
              <div key={doel.id} style={{ paddingBottom: 18, marginBottom: isLast && !toonNieuw ? 0 : 18, borderBottom: isLast && !toonNieuw ? 'none' : `1px solid ${T.rule}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: T.blue }}>{ICONS.target}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{doel.naam}</span>
                    {doel.deadline && <Badge color={T.ink3} bg={T.rule}>{doel.deadline}</Badge>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, color: T.ink3, ...TAB }}>{fmt(huidig)} / {fmt(doel.doelbedrag)}</span>
                    <button onClick={() => setStortId(stortId === doel.id ? null : doel.id)} style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${stortId === doel.id ? T.blue : T.border}`, background: stortId === doel.id ? T.blueSoft : T.card, color: T.blue, fontSize: 11, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>Storten</button>
                    <button onClick={() => onVerwijderen && onVerwijderen(doel.id)} style={{ padding: '4px 8px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink4, fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}>×</button>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <ProgressBar pct={pct} size={8} color={T.blue} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: T.blueText, ...TAB, minWidth: 34 }}>{pct.toFixed(0)}%</span>
                </div>
                {stortId === doel.id && (
                  <StortInput onBevestig={(bedrag) => handleStorten(doel.id, bedrag)} onAnnuleer={() => setStortId(null)} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {toonNieuw && <NieuwDoelForm onOpslaan={handleNieuwOpslaan} onAnnuleer={() => setToonNieuw(false)} />}
    </Card>
  )
}
