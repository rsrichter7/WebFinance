// ─── SettingsSaldo ───
// Startsaldo instelling: beginsaldo + datum als basis voor saldoberekening op Dashboard.

import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt, fmtDate } from '../../tokens'
import DatePicker from '../ui/DatePicker'
import { ICONS } from '../ui/Icons'
import useSettings from '../../hooks/useSettings'

export default function SettingsSaldo() {
  const { T } = useTheme()
  const { settings, loading, updateSetting } = useSettings()
  const [bedrag, setBedrag] = useState('')
  const [datum, setDatum]   = useState('')
  const [saved, setSaved]   = useState(false)

  useEffect(() => {
    if (!loading && settings.startsaldo) {
      setBedrag(String(settings.startsaldo.bedrag ?? ''))
      setDatum(settings.startsaldo.datum || '')
    }
  }, [loading, settings.startsaldo])

  async function handleOpslaan() {
    const b = parseFloat(bedrag.replace(',', '.'))
    if (isNaN(b) || !datum) return
    await updateSetting('startsaldo', { bedrag: b, datum })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  async function handleWissen() {
    await updateSetting('startsaldo', null)
    setBedrag(''); setDatum(''); setSaved(false)
  }

  const isValid   = bedrag !== '' && !isNaN(parseFloat(bedrag.replace(',', '.'))) && datum !== ''
  const heeftData = bedrag !== '' || datum !== ''
  const opgeslagen = settings.startsaldo

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Startsaldo</div>
        <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.6 }}>
          Voer je banksaldo in op een bepaalde datum. Transacties van vóór deze datum worden niet meegerekend bij het huidige saldo op het Dashboard.
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 22, marginBottom: 16 }}>
        <div style={{ marginBottom: 18 }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: T.ink2, marginBottom: 6 }}>Beginsaldo</label>
          <div style={{ position: 'relative' }}>
            <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 600, color: T.ink3, pointerEvents: 'none' }}>€</span>
            <input type="number" step="0.01" value={bedrag} onChange={e => { setBedrag(e.target.value); setSaved(false) }} placeholder="0,00"
              style={{ width: '100%', padding: '9px 12px 9px 26px', border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, color: T.ink, background: T.card, fontFamily: "'Inter', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box', ...TAB }} />
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: T.ink2, marginBottom: 6 }}>Peildatum</label>
          <DatePicker value={datum} onChange={d => { setDatum(d); setSaved(false) }} />
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleOpslaan} disabled={!isValid || loading} style={{
            padding: '9px 20px', borderRadius: 8, border: 'none',
            background: isValid ? T.blue : T.border, color: isValid ? '#fff' : T.ink4,
            fontSize: 13, fontWeight: 600, cursor: isValid ? 'pointer' : 'default',
            fontFamily: "'Inter', system-ui, sans-serif",
          }}>
            Opslaan
          </button>
          {heeftData && (
            <button onClick={handleWissen} style={{
              padding: '9px 16px', borderRadius: 8, border: `1.5px solid ${T.border}`, background: 'transparent',
              color: T.ink3, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
            }}>
              Wissen
            </button>
          )}
          {saved && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: T.green, fontSize: 13, fontWeight: 500 }}>
              <span style={{ color: T.green, display: 'inline-flex' }}>{ICONS.check}</span>
              Opgeslagen
            </div>
          )}
        </div>
      </div>

      {opgeslagen && opgeslagen.datum && (
        <div style={{ padding: '12px 16px', borderRadius: 10, background: T.blueSoft, border: `1px solid ${T.border}`, fontSize: 13, color: T.ink2, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 600 }}>Huidig startsaldo:</span>{' '}
          <span style={{ ...TAB, fontWeight: 500 }}>{fmt(opgeslagen.bedrag)}</span>
          {' '}op{' '}
          <span style={{ fontWeight: 500 }}>{fmtDate(opgeslagen.datum)}</span>
          <div style={{ marginTop: 4, fontSize: 12, color: T.ink3 }}>
            Dashboard toont saldo = startsaldo + inkomsten − uitgaven vanaf deze datum.
          </div>
        </div>
      )}
    </div>
  )
}
