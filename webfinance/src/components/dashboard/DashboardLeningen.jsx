// ─── DashboardLeningen ───
// Leningen-widget: totale restschuld en voortgang per lening.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { useNavigate } from 'react-router-dom'
import { fmtShort } from '../../tokens'
import { ICONS } from '../ui/Icons'
import useLoans from '../../hooks/useLoans'

const TYPE_CFG = {
  'Hypotheek':           { iconKey: 'home',       grad: 'gradGreen'  },
  'Studieschuld':        { iconKey: 'school',      grad: 'gradPurple' },
  'Persoonlijke lening': { iconKey: 'creditCard',  grad: 'gradAmber'  },
  'Autolening':          { iconKey: 'car',         grad: 'gradTeal'   },
}

function LoanRow({ loan, T }) {
  const pct = loan.oorspronkelijk_bedrag > 0
    ? ((loan.oorspronkelijk_bedrag - loan.huidig_saldo) / loan.oorspronkelijk_bedrag) * 100
    : 0
  const cfg = TYPE_CFG[loan.type] || { iconKey: 'coin', grad: 'gradBlue' }

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 7, flexShrink: 0,
          background: T[cfg.grad], display: 'grid', placeItems: 'center', color: '#fff',
        }}>
          {ICONS[cfg.iconKey] || ICONS.coin}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {loan.naam}
          </div>
          <div style={{ fontSize: 11, color: T.ink4 }}>
            {loan.rekening ? `${loan.rekening} · ` : ''}{loan.aflossingsvorm} · {loan.rente_percentage}%
          </div>
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
          {pct.toFixed(0)}%
        </div>
      </div>
      <div style={{ height: 6, background: T.rule, borderRadius: 3, overflow: 'hidden', marginBottom: 4 }}>
        <div className="wf-anim-bar" style={{
          height: '100%', width: `${pct}%`, background: T[cfg.grad], borderRadius: 3,
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: T.ink4 }}>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>Afgelost {fmtShort(loan.oorspronkelijk_bedrag - loan.huidig_saldo)}</span>
        <span style={{ fontVariantNumeric: 'tabular-nums' }}>van {fmtShort(loan.oorspronkelijk_bedrag)}</span>
      </div>
    </div>
  )
}

export default function DashboardLeningen({ animDelay = 0 }) {
  const { T }   = useTheme()
  const navigate = useNavigate()
  const { loans, loading } = useLoans()

  const totaalSaldo = loans.reduce((s, l) => s + l.huidig_saldo, 0)

  return (
    <div className="wf-anim-card wf-card-hover" style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      boxShadow: T.shadow, padding: '18px 20px',
      animationDelay: `${animDelay}ms`,
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 2 }}>Jouw leningen</div>
      <div style={{ fontSize: 11.5, color: T.ink4, marginBottom: 16 }}>Voortgang van aflossingen</div>

      {/* Totaal */}
      <div style={{ paddingBottom: 14, marginBottom: 14, borderBottom: `1px dashed ${T.border}` }}>
        <div style={{ fontSize: 11, color: T.ink4, marginBottom: 3 }}>Totaal nog open</div>
        <div style={{ fontSize: 22, fontWeight: 700, color: T.ink, fontVariantNumeric: 'tabular-nums' }}>
          {fmtShort(totaalSaldo)}
        </div>
      </div>

      {loading ? (
        <div style={{ fontSize: 13, color: T.ink4 }}>Laden...</div>
      ) : loans.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '8px 0' }}>
          <div style={{ fontSize: 12.5, color: T.ink4, marginBottom: 10 }}>Nog geen leningen toegevoegd</div>
          <button onClick={() => navigate('/vaste-lasten')} style={{
            fontSize: 12, color: T.blue, background: 'none', border: 'none',
            cursor: 'pointer', fontFamily: 'inherit', textDecoration: 'underline',
          }}>
            Ga naar Vaste Lasten →
          </button>
        </div>
      ) : (
        loans.map(loan => <LoanRow key={loan.id} loan={loan} T={T} />)
      )}
    </div>
  )
}
