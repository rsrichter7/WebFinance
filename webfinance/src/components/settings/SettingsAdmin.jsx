// ─── SettingsAdmin ───
// Verborgen admin-sectie — ontgrendeld via easter egg in 'Over Webfinance'.

import React, { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { ICONS } from '../ui/Icons'
import useSettings from '../../hooks/useSettings'
import SettingsFeedback from './SettingsFeedback'

const ADMIN_KEY = 'webfinance_admin_unlocked'

export default function SettingsAdmin({ onAdminLock }) {
  const { T } = useTheme()
  const { settings, updateSetting } = useSettings()
  const [maxRegels, setMaxRegels] = useState(String(settings.import_max_regels ?? 1000))

  function resetAdmin() { localStorage.removeItem(ADMIN_KEY); onAdminLock?.() }

  return (
    <div>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 18, fontWeight: 600, color: T.ink, letterSpacing: -0.2 }}>Admin</div>
        <div style={{ fontSize: 13, color: T.ink3, marginTop: 4 }}>Verborgen ontwikkelaars-instellingen</div>
      </div>

      <SettingsFeedback />

      <div style={{ padding: 14, borderRadius: 10, background: T.amberSoft, border: '1px solid #FDE68A', display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 24 }}>
        <span style={{ color: T.amber, display: 'inline-flex', marginTop: 1 }}>{ICONS.warn}</span>
        <div style={{ fontSize: 12.5, color: '#78350F', lineHeight: 1.5 }}>
          <strong>Wees voorzichtig.</strong> Deze instellingen zijn bedoeld voor ontwikkelaars en niet voor eindgebruikers.
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 12 }}>Import-instellingen</div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', border: `1px solid ${T.border}`, borderRadius: 10 }}>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: T.ink }}>Max. importregels</div>
            <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>Maximaal aantal CSV-regels per import (standaard 1000)</div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="number" min={10} max={10000} value={maxRegels} onChange={e => setMaxRegels(e.target.value)}
              style={{ width: 90, padding: '7px 10px', borderRadius: 8, border: `1.5px solid ${T.border}`, fontSize: 13, fontFamily: 'inherit', color: T.ink, background: T.card, outline: 'none', textAlign: 'right' }} />
            <button onClick={() => { const n = Math.max(10, Math.min(10000, parseInt(maxRegels) || 1000)); setMaxRegels(String(n)); updateSetting('import_max_regels', n) }}
              style={{ padding: '7px 14px', borderRadius: 8, border: `1px solid ${T.border}`, background: T.card, fontSize: 13, fontWeight: 500, color: T.ink2, cursor: 'pointer' }}>
              Opslaan
            </button>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 12 }}>Diagnostiek</div>
        <div style={{ padding: 14, borderRadius: 10, background: T.bg, border: `1px solid ${T.border}`, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', fontSize: 11.5, color: T.ink3, lineHeight: 1.7 }}>
          <div>build: <span style={{ color: T.ink }}>0.1.0-dev</span></div>
          <div>storage: <span style={{ color: T.ink }}>localStorage</span></div>
          <div>locale: <span style={{ color: T.ink }}>nl-NL · Europe/Amsterdam</span></div>
        </div>
      </div>

      <div style={{ paddingTop: 16, borderTop: `1px solid ${T.rule}` }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink2, marginBottom: 12 }}>Acties</div>
        <button onClick={resetAdmin} style={{ padding: '8px 14px', borderRadius: 8, background: T.card, color: T.ink2, border: `1px solid ${T.border}`, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>
          Admin vergrendelen
        </button>
      </div>
    </div>
  )
}
