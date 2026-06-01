// ─── BudgetSettingsForm ───
// Slide-in panel voor het handmatig instellen van het maandelijkse budget.

import React, { useState, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'

const MAANDEN = [
  'januari', 'februari', 'maart', 'april', 'mei', 'juni',
  'juli', 'augustus', 'september', 'oktober', 'november', 'december',
]

export default function BudgetSettingsForm({
  open, onClose,
  effectiefInkomen, budgetInkomenBron, setHandmatigInkomen,
  allTransactions,
}) {
  const { T } = useTheme()
  const [input, setInput] = useState(() =>
    budgetInkomenBron === 'handmatig' ? String(effectiefInkomen) : ''
  )

  const maandData = useMemo(() => {
    const now  = new Date()
    const curY = now.getFullYear()
    const curM = now.getMonth()
    const map  = {}
    for (const t of allTransactions) {
      if (t.type !== 'Inkomst') continue
      const d = new Date(t.datum)
      const y = d.getFullYear()
      const m = d.getMonth()
      if (y === curY && m === curM) continue
      const key = `${y}-${m}`
      map[key] = (map[key] || 0) + t.bedrag
    }
    return Object.entries(map)
      .map(([key, total]) => {
        const [y, m] = key.split('-').map(Number)
        return { label: `${MAANDEN[m]} ${y}`, total, sortKey: y * 12 + m }
      })
      .sort((a, b) => b.sortKey - a.sortKey)
      .slice(0, 6)
  }, [allTransactions])

  const gemiddeld = maandData.length > 0
    ? Math.round(maandData.reduce((s, e) => s + e.total, 0) / maandData.length * 100) / 100
    : 0

  const isHandmatig  = budgetInkomenBron === 'handmatig'
  const toonReset    = isHandmatig

  function handleOpslaan() {
    const n = parseFloat(String(input).replace(',', '.'))
    if (n > 0) {
      setHandmatigInkomen(n)
      onClose()
    }
  }

  function handleReset() {
    setHandmatigInkomen(null)
    setInput('')
    onClose()
  }

  if (!open) return null

  const labelStyle   = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }
  const inputStyle   = { width: '100%', padding: '9px 12px 9px 28px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: T.card, fontSize: 13, color: T.ink, outline: 'none', fontFamily: "'Inter', system-ui, sans-serif", boxSizing: 'border-box', ...TAB }
  const primaryBtn   = { width: '100%', padding: '10px 0', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }
  const secondaryBtn = { width: '100%', padding: '8px 0', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, color: T.ink2, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.25)', zIndex: 300 }} />
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, width: 380,
        background: T.card, borderLeft: `1px solid ${T.border}`,
        boxShadow: '-8px 0 32px rgba(17,24,39,0.12)',
        zIndex: 301, display: 'flex', flexDirection: 'column',
        fontFamily: "'Inter', system-ui, sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: `1px solid ${T.border}` }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.ink }}>Budget instellen</div>
              <div style={{ fontSize: 12.5, color: T.ink3, marginTop: 3, lineHeight: 1.4 }}>
                Stel je maandelijks budget in of gebruik het gemiddelde inkomen
              </div>
            </div>
            <button onClick={onClose} style={{ background: 'none', border: 'none', padding: 4, cursor: 'pointer', color: T.ink3, fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Budget input */}
          <div>
            <label style={labelStyle}>Maandelijks budget</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: T.ink3, fontSize: 13 }}>€</span>
              <input
                type="text" inputMode="decimal" value={input}
                onChange={e => setInput(e.target.value)}
                placeholder={fmt(gemiddeld)}
                style={inputStyle}
                autoFocus
              />
            </div>
            <div style={{ fontSize: 12, color: T.ink4, marginTop: 5 }}>
              {isHandmatig
                ? 'Handmatig ingesteld'
                : gemiddeld > 0 ? 'Gebaseerd op gemiddeld inkomen' : 'Geen inkomstdata beschikbaar'
              }
            </div>
          </div>

          {toonReset && (
            <button onClick={handleReset} style={secondaryBtn}>
              Gebruik gemiddeld inkomen
            </button>
          )}

          {/* Maandoverzicht */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 12 }}>Inkomen per maand</div>
            {maandData.length === 0 ? (
              <div style={{ fontSize: 13, color: T.ink4 }}>Geen inkomstdata beschikbaar</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                {maandData.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: `1px solid ${T.rule}` }}>
                    <span style={{ fontSize: 13, color: T.ink2, textTransform: 'capitalize' }}>{m.label}</span>
                    <span style={{ fontSize: 13, color: T.ink, fontWeight: 500, ...TAB }}>{fmt(m.total)}</span>
                  </div>
                ))}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '11px 0 0' }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>Gemiddeld</span>
                  <span style={{ fontSize: 14, fontWeight: 700, color: T.ink, ...TAB }}>{fmt(gemiddeld)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${T.border}`, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={handleOpslaan} style={primaryBtn}>Opslaan</button>
          <button onClick={onClose} style={secondaryBtn}>Annuleren</button>
        </div>
      </div>
    </>
  )
}
