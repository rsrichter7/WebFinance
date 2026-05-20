// ─── BudgetRuleSection ───
// Toont de budgetverdeling per soort met progress bars en modus-toggle.
// Bij handmatig modus zijn de percentages aanpasbaar via een bewerkknop.

import React, { useState, useEffect } from 'react'
import { T, TAB, fmt } from '../../tokens'
import { Card, ProgressBar, PctBadge } from '../ui/Card'
import { ICONS } from '../ui/Icons'

const REGELS = [
  {
    key: 'noodzaak',
    naam: 'Noodzaak',
    icon: ICONS.home,
    color: T.blue,
    soft: T.blueSoft,
    omschrijving: 'Huur, energie, boodschappen en andere vaste kosten.',
  },
  {
    key: 'wens',
    naam: 'Wens',
    icon: ICONS.coffee,
    color: T.violet,
    soft: T.violetSoft,
    omschrijving: 'Vrije tijd, uit eten, kleding en andere leuke uitgaven.',
  },
  {
    key: 'sparen',
    naam: 'Sparen',
    icon: ICONS.piggy,
    color: T.teal,
    soft: T.tealSoft,
    omschrijving: 'Spaardoelen, noodfonds en toekomstinvesteringen.',
  },
]

export default function BudgetRuleSection({
  regelVerdeling, inkomen, budgetModus, onModusWijzig,
  actieveVerdeling, handmatigeVerdeling, onVerdelingWijzig,
}) {
  const [bewerken, setBewerken] = useState(false)
  const [lokaleVerdeling, setLokaleVerdeling] = useState(handmatigeVerdeling)
  const isHandmatig = budgetModus === 'handmatig'
  const totaalPct = lokaleVerdeling.noodzaak + lokaleVerdeling.wens + lokaleVerdeling.sparen
  const isValid = totaalPct === 100

  useEffect(() => {
    setLokaleVerdeling(handmatigeVerdeling)
  }, [handmatigeVerdeling])

  useEffect(() => {
    if (!isHandmatig) setBewerken(false)
  }, [isHandmatig])

  function handlePctChange(key, value) {
    setLokaleVerdeling(prev => ({ ...prev, [key]: parseInt(value) || 0 }))
  }

  function handleOpslaan() {
    if (!isValid) return
    onVerdelingWijzig(lokaleVerdeling)
    setBewerken(false)
  }

  function handleAnnuleer() {
    setLokaleVerdeling(handmatigeVerdeling)
    setBewerken(false)
  }

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.ink }}>
            {isHandmatig ? 'Aangepaste verdeling' : '50 / 30 / 20 regel'}
          </div>
          <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>
            Gebaseerd op je maandelijks inkomen van {fmt(inkomen)}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isHandmatig && bewerken && (
            <span style={{
              fontSize: 11, fontWeight: 500, marginRight: 4, ...TAB,
              color: isValid ? T.green : T.red,
            }}>
              {totaalPct}% / 100%
            </span>
          )}
          {['50/30/20', 'handmatig'].map(m => (
            <button
              key={m}
              onClick={() => onModusWijzig(m)}
              style={{
                padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontFamily: 'inherit',
                border: `1px solid ${budgetModus === m ? T.blue : T.border}`,
                background: budgetModus === m ? T.blueSoft : T.card,
                color: budgetModus === m ? T.blueText : T.ink3,
                fontSize: 12, fontWeight: 500,
              }}
            >
              {m === '50/30/20' ? '50 / 30 / 20' : 'Handmatig'}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
        {REGELS.map(regel => {
          const data = regelVerdeling[regel.key]
          const pct = Math.min(data.pct, 100)
          const regelPct = actieveVerdeling[regel.key]
          const resterend = data.budget - data.besteed
          return (
            <div key={regel.key} style={{
              border: `1px solid ${T.border}`, borderRadius: 10, padding: 18,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%',
                    background: regel.soft, color: regel.color,
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    {regel.icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{regel.naam}</div>
                    <div style={{ fontSize: 11, color: T.ink3 }}>
                      {isHandmatig && bewerken ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={lokaleVerdeling[regel.key]}
                            onChange={e => handlePctChange(regel.key, e.target.value)}
                            style={{
                              width: 44, padding: '3px 4px', borderRadius: 5,
                              border: `1.5px solid ${T.blue}`, background: T.card,
                              fontSize: 12, fontWeight: 600, color: T.ink,
                              fontFamily: "'Inter', system-ui, sans-serif",
                              ...TAB, outline: 'none', textAlign: 'center',
                            }}
                          />
                          <span style={{ fontSize: 11, color: T.ink3 }}>% van inkomen</span>
                        </div>
                      ) : (
                        <span>{regelPct}% van inkomen</span>
                      )}
                    </div>
                  </div>
                </div>
                <PctBadge pct={pct} />
              </div>

              <div style={{ fontSize: 12, color: T.ink3, marginBottom: 12 }}>
                {regel.omschrijving}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 14 }}>
                <ProgressBar pct={data.pct} size={8} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
                {[
                  { label: 'Besteed', value: data.besteed },
                  { label: 'Budget', value: data.budget },
                  { label: 'Resterend', value: resterend },
                ].map(item => (
                  <div key={item.label}>
                    <div style={{ fontSize: 10, color: T.ink4, marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: T.ink, ...TAB }}>
                      {fmt(item.value)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Bewerk / Opslaan knoppen voor handmatige modus */}
      {isHandmatig && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
          {bewerken ? (
            <>
              <button onClick={handleAnnuleer} style={{
                padding: '6px 14px', borderRadius: 6,
                border: `1px solid ${T.border}`, background: T.card,
                color: T.ink3, fontSize: 12, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
              }}>
                Annuleer
              </button>
              <button onClick={handleOpslaan} style={{
                padding: '6px 14px', borderRadius: 6, border: 'none',
                background: isValid ? T.blue : T.border,
                color: isValid ? '#fff' : T.ink4,
                fontSize: 12, fontWeight: 500,
                cursor: isValid ? 'pointer' : 'default',
                fontFamily: 'inherit',
              }}>
                Opslaan
              </button>
            </>
          ) : (
            <button onClick={() => setBewerken(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              padding: '6px 14px', borderRadius: 6,
              border: `1px solid ${T.border}`, background: T.card,
              color: T.ink2, fontSize: 12, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {ICONS.edit} Verdeling aanpassen
            </button>
          )}
        </div>
      )}
    </Card>
  )
}