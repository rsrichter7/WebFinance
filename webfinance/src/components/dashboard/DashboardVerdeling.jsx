// ─── DashboardVerdeling ───
// Verdeling huishouduitgaven per persoon: stacked bar + statusbadge.

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { fmt } from '../../tokens'
import { verdelingPerPersoon } from '../../utils/dashboardCalculations'

const GRADS = ['gradBlue', 'gradPink', 'gradGreen', 'gradAmber']

export default function DashboardVerdeling({ allTransactions, persons, settings, startDatum, eindDatum, animDelay = 0 }) {
  const { T } = useTheme()

  const verdeling = useMemo(
    () => verdelingPerPersoon(allTransactions, persons, settings, startDatum, eindDatum),
    [allTransactions, persons, settings, startDatum, eindDatum]
  )

  if (!verdeling || persons.length < 2) return null

  const totaal = verdeling.totaal || 1
  const persoonLijst = persons.map(p => ({ ...p, ...verdeling.perPersoon[p.initialen] }))
  const methodeTekst = settings.verdeel_methode === 'ratio' ? 'Op basis van inkomensverhouding' : 'Op basis van 50/50'

  return (
    <div className="wf-anim-card wf-card-hover" style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      boxShadow: T.shadow, padding: '18px 20px',
      animationDelay: `${animDelay}ms`,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 2 }}>Jullie verdeling</div>
      <div style={{ fontSize: 11.5, color: T.ink4, marginBottom: 16 }}>{methodeTekst}</div>

      {/* Stacked bar */}
      <div style={{ height: 32, borderRadius: 8, overflow: 'hidden', display: 'flex', marginBottom: 14 }}>
        {persoonLijst.map((p, i) => {
          const pct = totaal > 0 ? Math.max(2, (p.betaald / totaal) * 100) : (100 / persoonLijst.length)
          return (
            <div key={p.initialen} style={{
              width: `${pct}%`, background: T[GRADS[i % GRADS.length]],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'width 0.6s ease',
            }}>
              {pct > 15 && (
                <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{Math.round(pct)}%</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {persoonLijst.map((p, i) => (
          <div key={p.initialen} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 10, height: 10, borderRadius: 3, background: T[GRADS[i % GRADS.length]], flexShrink: 0 }} />
            <span style={{ fontSize: 12.5, color: T.ink2, flex: 1 }}>{p.naam.split(' ')[0]}</span>
            <span style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
              {fmt(p.betaald || 0)}
            </span>
          </div>
        ))}
      </div>

      {/* Status badge */}
      <div style={{
        padding: '6px 10px', borderRadius: 8,
        background: verdeling.gelijkVerdeeld ? T.greenSoft : T.amberSoft,
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <div style={{
          width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
          background: verdeling.gelijkVerdeeld ? T.green : T.amber,
        }} />
        <span style={{
          fontSize: 11.5, fontWeight: 500,
          color: verdeling.gelijkVerdeeld ? T.greenText : T.amberText,
        }}>
          {verdeling.gelijkVerdeeld
            ? `Gelijk verdeeld · verschil ${fmt(verdeling.maxVerschil)}`
            : `Verschil van ${fmt(verdeling.maxVerschil)}`}
        </span>
      </div>
    </div>
  )
}
