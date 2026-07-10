// ─── FixedSuggesties ───
// Toont herkende terugkerende uitgaven als suggestie voor een vaste last.
// Gebruiker bevestigt of negeert per suggestie — niets wordt automatisch toegevoegd.

import React, { useState, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import { ICONS } from '../ui/Icons'
import useTransactions from '../../hooks/useTransactions'
import useFixedExpenses from '../../hooks/useFixedExpenses'
import { detecteerVasteLasten } from '../../utils/vasteLastenDetectie'

const OPSLAG_KEY = 'webfinance_genegeerde_suggesties'

function leesGenegeerd() {
  try { return JSON.parse(localStorage.getItem(OPSLAG_KEY) || '[]') }
  catch { return [] }
}

export default function FixedSuggesties() {
  const { T } = useTheme()
  const { allTransactions } = useTransactions()
  const { items, addItem } = useFixedExpenses()
  const [genegeerd, setGenegeerd] = useState(leesGenegeerd)

  const suggesties = useMemo(
    () => detecteerVasteLasten(allTransactions, items, genegeerd),
    [allTransactions, items, genegeerd]
  )

  function negeer(key) {
    const next = [...genegeerd, key]
    setGenegeerd(next)
    localStorage.setItem(OPSLAG_KEY, JSON.stringify(next))
  }

  function voegToe(sugg) {
    addItem({
      omschrijving: sugg.omschrijving,
      bedrag:       sugg.bedrag,
      herhaling:    sugg.herhaling,
      categorie:    sugg.categorie,
      sub:          sugg.sub,
      soort:        sugg.soort,
      wie:          sugg.wie,
      afschrijfdag: sugg.afschrijfdag,
      type:         'Uitgave',
      actief:       true,
    })
  }

  if (suggesties.length === 0) return null

  return (
    <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 22, boxShadow: T.shadow }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ color: T.blue, display: 'inline-flex' }}>{ICONS.sparkle}</span>
        <div style={{ fontSize: 15, fontWeight: 700, color: T.ink }}>Herkende vaste lasten</div>
      </div>
      <div style={{ fontSize: 13, color: T.ink3, lineHeight: 1.5, marginBottom: 16 }}>
        Op basis van terugkerende transacties in je geschiedenis. Voeg toe of negeer een suggestie.
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {suggesties.map(sugg => (
          <div key={sugg.key} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
            padding: '12px 14px', borderRadius: 10, background: T.cardAlt, border: `1px solid ${T.border}`,
          }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: T.ink, textTransform: 'capitalize' }}>
                {sugg.omschrijving}
              </div>
              <div style={{ fontSize: 12, color: T.ink3, marginTop: 2, ...TAB }}>
                ≈ {fmt(sugg.bedrag)} · {sugg.herhaling.toLowerCase()} · rond dag {sugg.afschrijfdag} · {sugg.aantal} transacties
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
              <button onClick={() => voegToe(sugg)} style={{
                padding: '7px 14px', borderRadius: 8, border: 'none',
                background: T.blue, color: '#fff', fontSize: 12.5, fontWeight: 600,
                cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                Toevoegen
              </button>
              <button onClick={() => negeer(sugg.key)} style={{
                padding: '7px 14px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: 'transparent',
                color: T.ink3, fontSize: 12.5, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
              }}>
                Negeren
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
