// ─── SettingsPage ───
// Instellingen pagina: eigen sidebar links, sectie-content rechts.

import React, { useState } from 'react'
import { T } from '../tokens'
import SettingsTopBar         from '../components/settings/SettingsTopBar'
import SettingsSidebar        from '../components/settings/SettingsSidebar'
import SettingsProfile        from '../components/settings/SettingsProfile'
import SettingsHousehold      from '../components/settings/SettingsHousehold'
import SettingsPreferences    from '../components/settings/SettingsPreferences'
import SettingsCategories     from '../components/settings/SettingsCategories'
import SettingsDataManagement from '../components/settings/SettingsDataManagement'
import SettingsNotifications  from '../components/settings/SettingsNotifications'
import SettingsAbout          from '../components/settings/SettingsAbout'
import SettingsAdmin          from '../components/settings/SettingsAdmin'

function isAdminUnlocked() {
  return localStorage.getItem('webfinance_admin_unlocked') === 'true'
}

export default function SettingsPage() {
  const [section,       setSection]       = useState('profiel')
  const [adminUnlocked, setAdminUnlocked] = useState(isAdminUnlocked)

  function handleAdminUnlock() {
    setAdminUnlocked(true)
    // Gebruiker navigeert zelf via de sidebar naar de admin-sectie
  }

  function handleAdminLock() {
    setAdminUnlocked(false)
    setSection('over')
  }

  const CONTENT = {
    profiel:      <SettingsProfile />,
    huishouden:   <SettingsHousehold />,
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
        <SettingsSidebar
          active={section}
          onSelect={setSection}
          adminUnlocked={adminUnlocked}
        />
        <div style={{
          flex: 1, overflow: 'auto',
          padding: 32,
          background: T.bg,
        }}>
          <div style={{ maxWidth: 660 }}>
            {CONTENT[section] ?? null}
          </div>
        </div>
      </div>
    </>
  )
}
