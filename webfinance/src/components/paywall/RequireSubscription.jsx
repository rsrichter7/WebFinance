// ─── RequireSubscription ───
// Bewaker binnen de ingelogde app: controleert abonnementsstatus.
// Toont de paywall als toegang is verlopen, anders gewoon de app.

import React from 'react'
import useSubscription from '../../hooks/useSubscription'
import Paywall from './Paywall'
import { useTheme } from '../../hooks/useTheme'

export default function RequireSubscription({ children }) {
  const { T } = useTheme()
  const { loading, hasAccess, needsPayment } = useSubscription()

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: "'Inter', sans-serif", fontSize: 14, color: T.ink3, background: T.bg,
      }}>
        Laden…
      </div>
    )
  }

  if (needsPayment) return <Paywall />
  if (hasAccess)    return children

  return null
}
