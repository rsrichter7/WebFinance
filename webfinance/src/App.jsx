// ─── App ───
// Hoofdbestand: routing + layout.
// Elke pagina wordt geladen binnen MainLayout (sidebar + content).

import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { ThemeProvider } from './hooks/useTheme'
import { useAuth } from './hooks/useAuth'
import MainLayout from './layouts/MainLayout'
import DashboardPage from './pages/DashboardPage'
import TransactionsPage from './pages/TransactionsPage'
import AnalyticsPage from './pages/AnalyticsPage'
import BudgetsPage from './pages/BudgetsPage'
import FixedPage from './pages/FixedPage'
import IncomePage from './pages/IncomePage'
import CalendarPage from './pages/CalendarPage'
import SettingsPage from './pages/SettingsPage'
import LoginPage from './components/auth/LoginPage'
import ProtectedRoute from './components/auth/ProtectedRoute'
import PrivacyPage from './pages/PrivacyPage'
import InvitationPage from './pages/InvitationPage'
import LandingPage from './pages/LandingPage'
import RequireSubscription from './components/paywall/RequireSubscription'
import CheckoutSuccessPage from './pages/CheckoutSuccessPage'
import CheckoutCancelPage from './pages/CheckoutCancelPage'
import { T } from './tokens'

// Laat ingelogde gebruikers naar dashboard, bezoekers naar landingspagina
function SmartRoot() {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Inter', sans-serif", fontSize: 14, color: T.ink3,
    }}>Laden…</div>
  )
  if (user) return <Navigate to="/dashboard" replace />
  return <LandingPage />
}

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SmartRoot />} />
          <Route path="/welkom" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/uitnodiging/:token" element={<InvitationPage />} />
          <Route element={
            <ProtectedRoute>
              <RequireSubscription>
                <MainLayout />
              </RequireSubscription>
            </ProtectedRoute>
          }>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/transacties" element={<TransactionsPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/budgetten" element={<BudgetsPage />} />
            <Route path="/inkomsten" element={<IncomePage />} />
            <Route path="/vaste-lasten" element={<FixedPage />} />
            <Route path="/kalender" element={<CalendarPage />} />
            <Route path="/instellingen" element={<SettingsPage />} />
          </Route>
          {/* Ingelogd vereist, maar buiten de subscription-afscherming — betaalterugkeer-routes */}
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route path="/abonnement/geslaagd"    element={<CheckoutSuccessPage />} />
            <Route path="/abonnement/geannuleerd" element={<CheckoutCancelPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
