// ─── SettingsSaldoCheck ───
// Saldo-controle: vergelijk het echte banksaldo met het berekende saldo en
// corrigeer het startsaldo in één klik bij een verschil.

import React, { useState, useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt } from '../../tokens'
import DatePicker from '../ui/DatePicker'
import useSettings from '../../hooks/useSettings'
import useTransactions from '../../hooks/useTransactions'
import { berekendSaldoOpDatum } from '../../utils/dashboardCalculations'

function isoVandaag() {
  const d = new Date(); const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}
function volgendeDag(datumStr) {
  const d = new Date(datumStr + 'T00:00:00'); d.setDate(d.getDate() + 1)
  const p = n => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

export default function SettingsSaldoCheck() {
  const { T } = useTheme()
  const { settings, updateSetting } = useSettings()
  const { allTransactions } = useTransactions()
  const [bedrag, setBedrag] = useState('')
  const [datum, setDatum]   = useState(isoVandaag())
  const [gecorrigeerd, setGecorrigeerd] = useState(false)

  const werkelijk   = parseFloat((bedrag || '').replace(',', '.'))
  const heeftInvoer = bedrag !== '' && !isNaN(werkelijk) && !!datum

  const berekend = useMemo(
    () => berekendSaldoOpDatum(allTransactions, settings.startsaldo, datum),
    [allTransactions, settings.startsaldo, datum]
  )
  const verschil = heeftInvoer ? werkelijk - berekend : 0
  const klopt = Math.abs(verschil) < 0.01
  const verschilKleur = klopt ? T.statGreen : T.statRed

  async function corrigeer() {
    if (!heeftInvoer) return
    await updateSetting('startsaldo', { bedrag: werkelijk, datum: volgendeDag(datum) })
    setGecorrigeerd(true)
    setTimeout(() => setGecorrigeerd(false), 2500)
  }

  const veld = { width: '100%', padding: '9px 12px', border: `1.5px solid ${T.border}`, borderRadius: 8, fontSize: 13, color: T.ink, background: T.card, fontFamily: "'Inter', system-ui, sans-serif", outline: 'none', boxSizing: 'border-box' }
  const kaart = (rand) => ({ padding: '12px 14px', borderRadius: 10, background: T.cardAlt, border: `1px solid ${rand}` })
  const kaartLabel = { fontSize: 11, fontWeight: 500, color: T.ink4, marginBottom: 6, textTransform: 'uppercase', letterSpacing: 0.4 }

  return (
    <div style={{ marginTop: 28 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, marginBottom: 8 }}>Saldo-controle</div>
        <div style={{ fontSize: 13.5, color: T.ink3, lineHeight: 1.6 }}>
          Vul je echte banksaldo op een datum in. De app vergelijkt dit met het berekende saldo, zodat je een afwijking meteen ziet in plaats van maanden later.
        </div>
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 22 }}>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 20 }}>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: T.ink2, marginBottom: 6 }}>Werkelijk banksaldo</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 13, fontWeight: 600, color: T.ink3, pointerEvents: 'none' }}>€</span>
              <input type="number" step="0.01" value={bedrag} onChange={e => { setBedrag(e.target.value); setGecorrigeerd(false) }} placeholder="0,00"
                style={{ ...veld, padding: '9px 12px 9px 26px', ...TAB }} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 150 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: T.ink2, marginBottom: 6 }}>Op datum</label>
            <DatePicker value={datum} onChange={d => { setDatum(d); setGecorrigeerd(false) }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
          <div style={kaart(T.border)}>
            <div style={kaartLabel}>Berekend</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, ...TAB }}>{fmt(berekend)}</div>
          </div>
          <div style={kaart(T.border)}>
            <div style={kaartLabel}>Bank</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: T.ink, ...TAB }}>{heeftInvoer ? fmt(werkelijk) : '—'}</div>
          </div>
          <div style={kaart(heeftInvoer ? verschilKleur : T.border)}>
            <div style={kaartLabel}>Verschil</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: heeftInvoer ? verschilKleur : T.ink4, ...TAB }}>
              {heeftInvoer ? `${verschil >= 0 ? '+' : '−'} ${fmt(Math.abs(verschil))}` : '—'}
            </div>
          </div>
        </div>

        {heeftInvoer && !klopt && (
          <div style={{ marginTop: 20, padding: '12px 16px', borderRadius: 10, background: T.blueSoft, border: `1px solid ${T.border}`, fontSize: 13, color: T.ink2, lineHeight: 1.6 }}>
            De app staat {verschil >= 0 ? 'te laag' : 'te hoog'} ten opzichte van je bank. Meestal komt dit door een ontbrekende of dubbele transactie. Je kunt het startsaldo hierop corrigeren — vanaf deze datum klopt het saldo dan weer.
            <div style={{ marginTop: 12 }}>
              <button onClick={corrigeer} style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: T.blue, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif" }}>
                Corrigeer startsaldo naar {fmt(werkelijk)}
              </button>
            </div>
          </div>
        )}

        {heeftInvoer && klopt && (
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: T.statGreen }}>Je saldo klopt met de bank.</div>
        )}
        {gecorrigeerd && (
          <div style={{ marginTop: 12, fontSize: 13, fontWeight: 500, color: T.green }}>Startsaldo bijgewerkt.</div>
        )}
      </div>
    </div>
  )
}
