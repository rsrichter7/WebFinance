// ─── ProtectedRoute ───
// Beschermt routes: redirect naar /login als niet ingelogd.

import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useTheme } from '../../hooks/useTheme'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const { T } = useTheme()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', background: T.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif", fontSize: 14, color: T.ink3,
      }}>
        Laden…
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return children
}
