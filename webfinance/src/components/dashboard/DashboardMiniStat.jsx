// ─── DashboardMiniStat ───
// Compacte stat-kaart met icoon, glow, mini sparkline en metaText.

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmtShort } from '../../tokens'
import { ICONS } from '../ui/Icons'

function MiniBarChart({ data, color }) {
  if (!data || data.length === 0) return null
  const max = Math.max(...data, 1)
  const W = 56, H = 20, n = data.length
  const barW = (W - (n - 1) * 2) / n

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      {data.map((v, i) => {
        const h = Math.max(2, (v / max) * H)
        return (
          <rect key={i}
            x={i * (barW + 2)} y={H - h} width={barW} height={h}
            rx="1.5" fill={color}
            opacity={0.45 + (i / n) * 0.55}
          />
        )
      })}
    </svg>
  )
}

function MiniAreaChart({ data, color }) {
  if (!data || data.length < 2) return null
  const min = Math.min(...data)
  const max = Math.max(...data, min + 1)
  const range = max - min
  const W = 56, H = 20

  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * H * 0.8 - H * 0.1,
  ])
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ')
  const area = `${line} L${W},${H} L0,${H} Z`
  const cid  = color.replace(/[^a-zA-Z0-9]/g, '')

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`wf-ms-${cid}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.45" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#wf-ms-${cid})`} />
      <path d={line} stroke={color} strokeWidth="1.5" fill="none" strokeLinejoin="round" />
    </svg>
  )
}

export default function DashboardMiniStat({
  label, value, color, glow, iconKey, metaText,
  sparklineData, sparklineType = 'bar', sparklineColor,
  animDelay = 0,
}) {
  const { T } = useTheme()
  const sc = sparklineColor || color

  return (
    <div className="wf-anim-card wf-card-hover" style={{
      background: T.card, border: `1px solid ${T.border}`, borderRadius: 12,
      boxShadow: T.shadow, padding: '13px 16px',
      position: 'relative', overflow: 'hidden',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 80,
      animationDelay: `${animDelay}ms`,
    }}>
      {/* Glow rechts-onder */}
      {glow && (
        <div style={{
          position: 'absolute', bottom: -40, right: -40, width: 140, height: 140,
          background: glow, pointerEvents: 'none', zIndex: 0,
        }} />
      )}

      {/* Icoon rechtsboven */}
      <div style={{
        position: 'absolute', top: 12, right: 14,
        width: 28, height: 28, borderRadius: 8,
        background: `${color}18`, color, zIndex: 1,
        display: 'grid', placeItems: 'center',
      }}>
        {ICONS[iconKey] || ICONS.coin}
      </div>

      {/* Label + waarde */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: 11.5, color: T.ink4, fontWeight: 500, marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 700, color: T.ink, ...TAB, letterSpacing: -0.3 }}>
          {fmtShort(value)}
        </div>
        {metaText && (
          <div style={{ fontSize: 10.5, color: T.ink4, marginTop: 2 }}>{metaText}</div>
        )}
      </div>

      {/* Sparkline rechts-onder */}
      {sparklineData && (
        <div style={{ position: 'absolute', bottom: 10, right: 14, zIndex: 1, opacity: 0.65 }}>
          {sparklineType === 'bar'
            ? <MiniBarChart data={sparklineData} color={sc} />
            : <MiniAreaChart data={sparklineData} color={sc} />
          }
        </div>
      )}
    </div>
  )
}
