// ─── DashboardCostSplit ───
// Kostenverdeling: gemiddelde maandkosten, bijdrage per persoon, werkelijk betaald, verschil.
// Dynamisch via useProfiles. Berekent over alle beschikbare maanden.

import React, { useState, useMemo } from 'react'
import { T, fmt } from '../../tokens'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'
import useProfiles from '../../hooks/useProfiles'
import DashboardIncomeModal, { loadNettoInkomen } from './DashboardIncomeModal'

const KEY_METHODE = 'webfinance_verdeel_methode'
function loadMethode() { return localStorage.getItem(KEY_METHODE) || 'ratio' }

export default function DashboardCostSplit({ allTransactions }) {
  const { persons } = useProfiles()
  const [inkomen,   setInkomen]   = useState(loadNettoInkomen)
  const [methode,   setMethode]   = useState(loadMethode)
  const [showModal, setShowModal] = useState(false)

  const totaalInkomen = persons.reduce((s, p) => s + (inkomen[p.initialen] || 0), 0)
  const heeftInkomen  = totaalInkomen > 0

  // ─── Unieke maanden met minstens 1 uitgave ───
  const aantalMaanden = useMemo(() => {
    const set = new Set()
    for (const t of allTransactions) {
      if (t.type === 'Uitgave') {
        const d = new Date(t.datum)
        set.add(`${d.getFullYear()}-${d.getMonth()}`)
      }
    }
    return set.size || 1
  }, [allTransactions])

  // ─── Gemiddelde maandelijkse kosten (over alle maanden) ───
  const gemKosten = useMemo(() => {
    const totaal = allTransactions.filter(t => t.type === 'Uitgave').reduce((s, t) => s + t.bedrag, 0)
    return totaal / aantalMaanden
  }, [allTransactions, aantalMaanden])

  // ─── Werkelijk betaald per persoon (gem. per maand, GZ gedeeld) ───
  const betaaldMap = useMemo(() => {
    const map = {}
    for (const p of persons) map[p.initialen] = 0
    for (const t of allTransactions) {
      if (t.type !== 'Uitgave') continue
      if (t.wie === 'GZ' && persons.length > 0) {
        for (const p of persons) map[p.initialen] += t.bedrag / persons.length
      } else if (map[t.wie] !== undefined) {
        map[t.wie] += t.bedrag
      }
    }
    for (const k of Object.keys(map)) map[k] = map[k] / aantalMaanden
    return map
  }, [allTransactions, aantalMaanden, persons])

  function pctVoor(p) {
    if (!heeftInkomen || methode === '50/50') return 100 / Math.max(persons.length, 1)
    return ((inkomen[p.initialen] || 0) / totaalInkomen) * 100
  }

  function bijdrageVoor(p) {
    if (!heeftInkomen || methode === '50/50') return gemKosten / Math.max(persons.length, 1)
    return gemKosten * ((inkomen[p.initialen] || 0) / totaalInkomen)
  }

  function wisselMethode(m) {
    setMethode(m)
    try { localStorage.setItem(KEY_METHODE, m) } catch {}
  }

  return (
    <Card style={{ overflow: 'visible' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>Kostenverdeling</div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Verdeling op basis van netto salaris</div>
        </div>
        <button onClick={() => setShowModal(true)} style={editBtn}>
          <span style={{ display: 'inline-flex' }}>{ICONS.edit}</span>
          Bewerken
        </button>
      </div>

      {!heeftInkomen ? (
        <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
          <div style={{ fontSize: 13, color: T.ink3, marginBottom: 14, lineHeight: 1.5 }}>
            Stel je netto inkomen in om de<br />kostenverdeling te berekenen
          </div>
          <button onClick={() => setShowModal(true)} style={primaryBtn}>
            <span style={{ display: 'inline-flex' }}>{ICONS.edit}</span>
            Inkomen instellen
          </button>
        </div>
      ) : (
        <>
          {/* Gemiddelde maandkosten */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, color: T.ink3, marginBottom: 2 }}>Gem. maandelijkse kosten</div>
            <div style={{ fontSize: 24, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums', letterSpacing: -0.5 }}>
              {fmt(gemKosten)}
            </div>
            <div style={{ fontSize: 11, color: T.ink4, marginTop: 1 }}>op basis van {aantalMaanden} maand{aantalMaanden !== 1 ? 'en' : ''}</div>
          </div>

          {/* Persoon blokken */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            {persons.map(p => {
              const pct      = pctVoor(p)
              const bijdrage = bijdrageVoor(p)
              const betaald  = betaaldMap[p.initialen] || 0
              const verschil = betaald - bijdrage
              const teVeel   = verschil > 0.005
              const teWeinig = verschil < -0.005
              return (
                <div key={p.initialen} style={{ flex: 1, padding: '10px 12px', borderRadius: 10, background: p.kleur.bg, border: `1.5px solid ${p.kleur.fg}22` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                    <div style={{ width: 22, height: 22, borderRadius: '50%', background: p.kleur.fg + '22', color: p.kleur.fg, display: 'grid', placeItems: 'center', fontSize: 9, fontWeight: 700, flexShrink: 0 }}>
                      {p.initialen}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: p.kleur.fg }}>{p.naam} ({pct.toFixed(0)}%)</span>
                  </div>
                  <Row label="Inkomen"  waarde={inkomen[p.initialen] || 0} kleur={p.kleur.fg} />
                  <Row label="Bijdrage" waarde={bijdrage} kleur={p.kleur.fg} />
                  <Row label="Betaald"  waarde={betaald}  kleur={p.kleur.fg} />
                  {(teVeel || teWeinig) && (
                    <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 7px', borderRadius: 5, fontSize: 11, fontWeight: 600, background: teVeel ? T.redSoft : T.greenSoft, color: teVeel ? T.redText : T.greenText }}>
                      {teVeel ? '▲' : '▼'} {fmt(Math.abs(verschil))} {teVeel ? 'te veel' : 'te weinig'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Verhoudingsbalk */}
          <div style={{ height: 7, borderRadius: 4, overflow: 'hidden', display: 'flex', marginBottom: 12 }}>
            {persons.map(p => (
              <div key={p.initialen} style={{ width: `${pctVoor(p)}%`, background: p.kleur.fg, opacity: 0.85, transition: 'width 0.4s' }} />
            ))}
          </div>
        </>
      )}

      {/* Footer: methode toggle */}
      <div style={{ paddingTop: 10, borderTop: `1px solid ${T.rule}`, display: 'flex', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', gap: 3, padding: 3, background: T.rule, borderRadius: 8 }}>
          {[['ratio', 'Naar ratio'], ['50/50', '50/50']].map(([m, label]) => (
            <button key={m} onClick={() => wisselMethode(m)} style={{ padding: '4px 10px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', border: 'none', background: methode === m ? T.card : 'transparent', color: methode === m ? T.ink : T.ink4, boxShadow: methode === m ? T.shadow : 'none' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {showModal && <DashboardIncomeModal persons={persons} inkomen={inkomen} onSave={d => { setInkomen(d); setShowModal(false) }} onClose={() => setShowModal(false)} />}
    </Card>
  )
}

function Row({ label, waarde, kleur }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11.5, color: kleur, opacity: 0.85, marginBottom: 2 }}>
      <span>{label}</span>
      <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>{fmt(waarde)}</span>
    </div>
  )
}

const editBtn    = { display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 6, border: `1px solid ${T.border}`, background: T.card, color: T.ink3, fontSize: 12, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit', flexShrink: 0 }
const primaryBtn = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
