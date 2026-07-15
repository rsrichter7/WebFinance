// ─── TransactionTopBar ───
// Bovenste balk van de transactiepagina met titel en actieknoppen.

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import { fmtDate } from '../../tokens'
import { ICONS } from '../ui/Icons'
import useSubscription from '../../hooks/useSubscription'
import { startCheckout } from '../../utils/checkout'

import PageInfoPopover from '../ui/PageInfoPopover'

export default function TransactionTopBar({ onNewClick, onImportClick, activeAccount, onBankSyncClick }) {
  const { T } = useTheme()
  const { hasAccess } = useSubscription()
  const gekoppeld = !!activeAccount?.externAccountId
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '18px 28px 32px',
      borderBottom: `1px solid ${T.border}`,
      background: T.card,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ fontSize: 21, fontWeight: 600, color: T.ink, letterSpacing: -0.3 }}>Transacties</div>
        <PageInfoPopover
          titel="Hoe werkt deze pagina?"
          intro="Alle inkomsten en uitgaven op één plek."
          bullets={[
            'Voeg transacties handmatig toe via de knop rechtsboven.',
            'Importeer transacties via CSV vanuit je bank.',
            'Filter op categorie, persoon, type of periode via de filterbalk.',
            'Transacties met een AUTO label zijn automatisch aangemaakt vanuit je vaste lasten.',
          ]}
        />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {gekoppeld ? (
          <div style={{ position: 'relative' }}>
            <button
              onClick={hasAccess ? onBankSyncClick : undefined}
              disabled={!hasAccess}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '8px 14px', borderRadius: 8,
                border: `1px solid ${T.border}`, background: T.card,
                fontSize: 13, fontWeight: 500, color: T.ink2, cursor: hasAccess ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', opacity: hasAccess ? 1 : 0.5,
              }}>
              <span style={{ display: 'inline-flex' }}>{ICONS.refresh}</span>
              Uit bank ophalen
            </button>
            <span style={{
              position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
              marginTop: 4, fontSize: 11, color: T.ink3, whiteSpace: 'nowrap',
            }}>
              {hasAccess
                ? (activeAccount.laatstGesynct ? `Laatst gesynct: ${fmtDate(activeAccount.laatstGesynct)}` : 'Nog niet gesynct')
                : (
                  <>
                    Vereist een abonnement —{' '}
                    <button
                      onClick={() => startCheckout('monthly').catch(() => {})}
                      style={{ background: 'none', border: 'none', padding: 0, color: T.blue, textDecoration: 'underline', cursor: 'pointer', fontSize: 11, fontFamily: 'inherit' }}
                    >
                      bekijk abonnementen
                    </button>
                  </>
                )}
            </span>
          </div>
        ) : (
          <span style={{ fontSize: 12, color: T.ink3 }}>
            Automatisch transacties uit je bank halen?{' '}
            <Link to="/instellingen?sectie=rekeningen" style={{ color: T.blue, textDecoration: 'underline' }}>
              Koppel deze rekening
            </Link>
          </span>
        )}
        <button onClick={onImportClick} style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '8px 14px', borderRadius: 8,
          border: `1px solid ${T.border}`, background: T.card,
          fontSize: 13, fontWeight: 500, color: T.ink2, cursor: 'pointer',
          fontFamily: 'inherit',
        }}>
          <span style={{ display: 'inline-flex' }}>{ICONS.upload}</span>
          Importeren
        </button>
        <button
          onClick={onNewClick}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 8,
            border: 'none', background: T.blue, color: '#fff',
            fontSize: 13, fontWeight: 500, cursor: 'pointer',
            boxShadow: '0 1px 2px rgba(37,99,235,0.18)',
          }}
        >
          <span style={{ display: 'inline-flex' }}>{ICONS.plus}</span>
          Nieuwe transactie
        </button>
      </div>
    </div>
  )
}
