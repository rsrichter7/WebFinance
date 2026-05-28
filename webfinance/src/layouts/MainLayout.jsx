// ─── MainLayout ───
// De basis layout: sidebar links + content rechts.
// Elke pagina wordt als child gerenderd via React Router's Outlet.

import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/sidebar/Sidebar'
import { useTheme } from '../hooks/useTheme'

export default function MainLayout() {
  const { T } = useTheme()
  return (
    <div style={{
      width: '100vw', height: '100vh', display: 'flex',
      fontFamily: "'Inter', system-ui, sans-serif",
      background: T.bg, color: T.ink, fontWeight: 400,
      letterSpacing: -0.05, WebkitFontSmoothing: 'antialiased',
      overflow: 'hidden',
    }}>
      <Sidebar />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Outlet />
      </div>
    </div>
  )
}
