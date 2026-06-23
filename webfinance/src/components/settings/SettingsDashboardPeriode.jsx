// ─── SettingsDashboardPeriode ───
// Sectie in Voorkeuren: kies Kalendermaand of Loonperiode (incl. loon_dag invoer).

import React, { useState, useEffect } from 'react'
import { useTheme } from '../../hooks/useTheme'
import useSettings from '../../hooks/useSettings'

const OPTIES = [
  { val: 'maand', label: 'Kalendermaand', desc: '1e t/m laatste dag van de maand' },
  { val: 'loon',  label: 'Loonperiode',   desc: 'Van salarisdatum tot dag vóór de volgende' },
]

export default function SettingsDashboardPeriode() {
  const { T } = useTheme()
  const { settings, loading, updateSettings } = useSettings()

  const [periode, setPeriode] = useState('maand')
  const [loonDag, setLoonDag] = useState(25)
  const [saved, setSaved]    = useState(false)

  useEffect(() => {
    if (!loading) {
      setPeriode(settings.dashboard_periode || 'maand')
      setLoonDag(settings.loon_dag || 25)
    }
  }, [loading, settings.dashboard_periode, settings.loon_dag])

  async function save(newPeriode, newLoonDag) {
    await updateSettings({ dashboard_periode: newPeriode, loon_dag: newLoonDag })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function handlePeriodeChange(val) {
    setPeriode(val)
    save(val, loonDag)
  }

  function handleLoonDagChange(e) {
    const val = Math.max(1, Math.min(28, parseInt(e.target.value) || 25))
    setLoonDag(val)
  }

  function handleLoonDagBlur() {
    save(periode, loonDag)
  }

  return (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 12 }}>Dashboard-periode</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 14 }}>
        {OPTIES.map(o => (
          <div
            key={o.val}
            onClick={() => handlePeriodeChange(o.val)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
              border: `1.5px solid ${periode === o.val ? T.blue : T.border}`,
              background: periode === o.val ? T.blueSoft : T.card,
            }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
              border: `2px solid ${periode === o.val ? T.blue : T.borderHi}`,
              display: 'grid', placeItems: 'center',
            }}>
              {periode === o.val && <div style={{ width: 6, height: 6, borderRadius: '50%', background: T.blue }} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.ink }}>{o.label}</div>
              <div style={{ fontSize: 11.5, color: T.ink3, marginTop: 1 }}>{o.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {periode === 'loon' && (
        <div style={{ paddingLeft: 4 }}>
          <label style={{ fontSize: 12.5, fontWeight: 500, color: T.ink2, display: 'block', marginBottom: 6 }}>
            Verwachte loondag (1–28)
          </label>
          <input
            type="number"
            min={1} max={28}
            value={loonDag}
            onChange={handleLoonDagChange}
            onBlur={handleLoonDagBlur}
            style={{
              width: 80, padding: '7px 10px', borderRadius: 8,
              border: `1.5px solid ${T.border}`, background: T.card,
              fontSize: 13, color: T.ink, fontFamily: 'inherit',
              outline: 'none',
            }}
          />
          <div style={{ fontSize: 11.5, color: T.ink4, marginTop: 6, maxWidth: 380 }}>
            Dit is de verwachte grens voor periodes zonder salaristransactie. Afgeronde periodes
            worden automatisch afgeleid uit je werkelijke salarisdatums.
          </div>
          {saved && (
            <div style={{ fontSize: 12, color: T.green, marginTop: 6 }}>Opgeslagen ✓</div>
          )}
        </div>
      )}
    </div>
  )
}
