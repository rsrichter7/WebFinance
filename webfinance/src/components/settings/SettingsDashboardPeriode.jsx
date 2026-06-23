// ─── SettingsDashboardPeriode ───
// Sectie in Voorkeuren: kies Kalendermaand of Loonperiode.

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
  const [saved, setSaved]    = useState(false)

  useEffect(() => {
    if (!loading) setPeriode(settings.dashboard_periode || 'maand')
  }, [loading, settings.dashboard_periode])

  async function handlePeriodeChange(val) {
    setPeriode(val)
    await updateSettings({ dashboard_periode: val })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
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
          <div style={{ fontSize: 11.5, color: T.ink4, maxWidth: 380 }}>
            De loonperiode volgt je hoofdinkomst. Kies je hoofdinkomst op de Inkomsten-pagina (sterretje).
          </div>
          {saved && (
            <div style={{ fontSize: 12, color: T.green, marginTop: 6 }}>Opgeslagen ✓</div>
          )}
        </div>
      )}
    </div>
  )
}
