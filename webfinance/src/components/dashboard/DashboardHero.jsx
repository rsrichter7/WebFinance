// ─── DashboardHero ───
// Gradient hero card: vrij besteedbaar deze maand + saldo-sparkline + voortgangsbalk.

import React, { useMemo } from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmtShort } from '../../tokens'
import { berekenVrijBesteedbaar, verschilVorigeMaand, saldoVerloopMaand } from '../../utils/dashboardCalculations'

const MAANDEN = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']

function SparkArea({ data }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data, min + 1)
  const range = max - min
  const W = 500, H = 52

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H * 0.82 - H * 0.09,
  ])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }} preserveAspectRatio="none">
      <defs>
        <linearGradient id="wf-hero-spark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#34D399" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#34D399" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#wf-hero-spark)" />
      <path d={line} stroke="#34D399" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

export default function DashboardHero({ allTransactions, fixedExpenses, settings, maand, jaar }) {
  const { T } = useTheme()

  const nu          = new Date()
  const isHuidig    = maand === nu.getMonth() + 1 && jaar === nu.getFullYear()
  const dagVan      = isHuidig ? nu.getDate() : new Date(jaar, maand, 0).getDate()
  const dagenTotaal = new Date(jaar, maand, 0).getDate()
  const dagPct      = (dagVan / dagenTotaal) * 100

  const vrijBesteedbaar = useMemo(
    () => berekenVrijBesteedbaar(allTransactions, fixedExpenses, maand, jaar),
    [allTransactions, fixedExpenses, maand, jaar]
  )
  const verschil = useMemo(
    () => verschilVorigeMaand(allTransactions, fixedExpenses, maand, jaar),
    [allTransactions, fixedExpenses, maand, jaar]
  )
  const saldoData = useMemo(
    () => saldoVerloopMaand(allTransactions, settings.startsaldo, maand, jaar),
    [allTransactions, settings.startsaldo, maand, jaar]
  )

  const isNegatief = vrijBesteedbaar < 0
  const absVrij    = Math.abs(vrijBesteedbaar)
  const geheel     = Math.floor(absVrij).toLocaleString('nl-NL')
  const dec        = (absVrij % 1).toFixed(2).slice(1)

  return (
    <div className="wf-anim-card" style={{
      background: T.gradHero, borderRadius: 16,
      padding: '26px 26px 22px', minHeight: 260,
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Orbs */}
      <div style={{ position: 'absolute', top: -70, left: -50, width: 240, height: 240, background: 'radial-gradient(circle, rgba(59,130,246,0.28) 0%, transparent 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: -20, right: -40, width: 200, height: 200, background: 'radial-gradient(circle, rgba(14,165,233,0.18) 0%, transparent 70%)', pointerEvents: 'none' }} />

      {/* Label */}
      <div style={{ fontSize: 11.5, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.6, textTransform: 'uppercase', marginBottom: 10, position: 'relative' }}>
        Vrij te besteden {MAANDEN[maand - 1]}
      </div>

      {/* Bedrag */}
      <div style={{ position: 'relative', marginBottom: 6, lineHeight: 1 }}>
        <span style={{ fontSize: 46, fontWeight: 500, color: isNegatief ? '#FCA5A5' : '#fff', ...TAB }}>
          {isNegatief ? '−' : ''}€{geheel}
          <span style={{ opacity: 0.62, fontSize: 30 }}>{dec}</span>
        </span>
      </div>

      {/* Context */}
      <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.5)', position: 'relative', marginBottom: 'auto' }}>
        Na vaste lasten en variabele uitgaven
        {Math.abs(verschil) > 5 && (
          <span style={{
            marginLeft: 8, padding: '2px 8px', borderRadius: 20,
            background: verschil >= 0 ? 'rgba(52,211,153,0.22)' : 'rgba(252,165,165,0.18)',
            color: verschil >= 0 ? '#34D399' : '#FCA5A5',
            fontSize: 11.5, fontWeight: 600, ...TAB,
          }}>
            {verschil >= 0 ? '↑' : '↓'} {fmtShort(Math.abs(verschil))} vs vorige maand
          </span>
        )}
      </div>

      {/* Sparkline */}
      {saldoData.length > 3 && (
        <div style={{ position: 'relative', marginTop: 16, marginBottom: 14, opacity: 0.75 }}>
          <SparkArea data={saldoData} />
        </div>
      )}

      {/* Dag-voortgang */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 5 }}>
          <span>{isHuidig ? `Dag ${dagVan} van ${dagenTotaal}` : MAANDEN[maand - 1]}</span>
          <span>{isHuidig ? `Nog ${dagenTotaal - dagVan} dagen` : 'Volledige maand'}</span>
        </div>
        <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
          <div className="wf-anim-bar" style={{
            height: '100%', width: `${dagPct}%`,
            background: 'linear-gradient(90deg, #34D399 0%, #FBBF24 100%)',
            borderRadius: 2,
          }} />
        </div>
      </div>
    </div>
  )
}
