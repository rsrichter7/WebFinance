// ─── SettingsPage ───
// Instellingen pagina: eigen sidebar links, sectie-content rechts.

import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'
import SettingsTopBar         from '../components/settings/SettingsTopBar'
import SettingsSidebar        from '../components/settings/SettingsSidebar'
import SettingsProfile        from '../components/settings/SettingsProfile'
import SettingsHousehold      from '../components/settings/SettingsHousehold'
import SettingsAccounts       from '../components/settings/SettingsAccounts'
import SettingsSaldo          from '../components/settings/SettingsSaldo'
import SettingsPreferences    from '../components/settings/SettingsPreferences'
import SettingsCategories     from '../components/settings/SettingsCategories'
import SettingsDataManagement from '../components/settings/SettingsDataManagement'
import SettingsNotifications  from '../components/settings/SettingsNotifications'
import SettingsAbout          from '../components/settings/SettingsAbout'
import SettingsAdmin          from '../components/settings/SettingsAdmin'

function isAdminUnlocked() {
  return localStorage.getItem('webfinance_admin_unlocked') === 'true'
}

const VALID_SECTIONS = ['profiel', 'huishouden', 'rekeningen', 'saldo', 'voorkeuren', 'categorieen', 'data', 'notificaties', 'over', 'admin']

export default function SettingsPage() {
  const { T } = useTheme()
  const [searchParams] = useSearchParams()
  const gewensteSectie = searchParams.get('sectie')
  const [section,       setSection]       = useState(VALID_SECTIONS.includes(gewensteSectie) ? gewensteSectie : 'profiel')
  const [adminUnlocked, setAdminUnlocked] = useState(isAdminUnlocked)

  function handleAdminUnlock() { setAdminUnlocked(true) }
  function handleAdminLock()   { setAdminUnlocked(false); setSection('over') }

  const CONTENT = {
    profiel:      <SettingsProfile />,
    huishouden:   <SettingsHousehold />,
    rekeningen:   <SettingsAccounts />,
    saldo:        <SettingsSaldo />,
    voorkeuren:   <SettingsPreferences />,
    categorieen:  <SettingsCategories />,
    data:         <SettingsDataManagement />,
    notificaties: <SettingsNotifications />,
    over:         <SettingsAbout onAdminUnlock={handleAdminUnlock} />,
    admin:        <SettingsAdmin onAdminLock={handleAdminLock} />,
  }

  return (
    <>
      <SettingsTopBar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <SettingsSidebar active={section} onSelect={setSection} adminUnlocked={adminUnlocked} />
        <div style={{ flex: 1, overflow: 'auto', padding: 32, background: T.bg }}>
          <div style={{ maxWidth: 660 }}>
            {CONTENT[section] ?? null}
          </div>
        </div>
      </div>
    </>
  )
}
