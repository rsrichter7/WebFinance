// ─── App ───
// Hoofdbestand: routing + layout.
// Elke pagina wordt geladen binnen MainLayout (sidebar + content).

import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import BudgetsPage from './pages/BudgetsPage'
import FixedPage from './pages/FixedPage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/transacties" element={<TransactionsPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/budgetten" element={<BudgetsPage />} />
          <Route path="/vaste-lasten" element={<FixedPage />} />
          <Route path="/kalender" element={<CalendarPage />} />
          <Route path="/instellingen" element={<SettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
