// ─── Gedeelde UI componenten ───
// Kleine herbruikbare bouwblokken voor de hele app.

import React from 'react'
import { T, TAB, fmt } from '../../tokens'

// ─── Card ───
export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 12,
      boxShadow: T.shadow,
      padding: 22,
      ...style,
    }}>
      {children}
    </div>
  )
}

// ─── Card titel ───
export function CardTitle({ children, sub }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, letterSpacing: -0.1 }}>{children}</div>
      {sub && <div style={{ fontSize: 12, color: T.ink3, marginTop: 2 }}>{sub}</div>}
    </div>
  )
}

// ─── Statistiek card ───
export function StatCard({ label, value, color, accent, trend, trendGood }) {
  const trendPositive = trend > 0
  const trendColor = (trendGood === 'up' && trendPositive) || (trendGood === 'down' && !trendPositive) ? T.green : T.red
  const trendBg = trendColor === T.green ? T.greenSoft : T.redSoft

  return (
    <Card style={{ flex: 1, padding: '18px 20px', borderTop: accent ? `3px solid ${accent}` : undefined }}>
      <div style={{ fontSize: 12, color: T.ink3, fontWeight: 500, marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: color || T.ink, ...TAB, letterSpacing: -0.5 }}>{fmt(value)}</div>
      {trend !== undefined && (
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          marginTop: 8, padding: '3px 8px', borderRadius: 6,
          background: trendBg, fontSize: 12, fontWeight: 600, color: trendColor,
        }}>
          {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          <span style={{ fontWeight: 400, color: T.ink4, marginLeft: 4 }}>vs vorige mnd</span>
        </div>
      )}
    </Card>
  )
}

// ─── Voortgangsbalk ───
export function ProgressBar({ pct, size = 8, color }) {
  const autoColor = pct < 60 ? T.green : pct < 80 ? T.amber : T.red
  return (
    <div style={{ height: size, background: T.rule, borderRadius: size / 2, overflow: 'hidden', flex: 1 }}>
      <div style={{
        height: '100%',
        width: `${Math.min(pct, 100)}%`,
        background: color || autoColor,
        borderRadius: size / 2,
        transition: 'width 0.4s ease',
      }} />
    </div>
  )
}

// ─── Percentage badge ───
export function PctBadge({ pct }) {
  const color = pct < 60 ? T.greenText : pct < 80 ? T.amberText : T.redText
  const bg = pct < 60 ? T.greenSoft : pct < 80 ? T.amberSoft : T.redSoft
  return (
    <span style={{ fontSize: 11.5, fontWeight: 600, padding: '2px 8px', borderRadius: 6, background: bg, color, ...TAB }}>
      {pct.toFixed(0)}%
    </span>
  )
}

// ─── Badge ───
export function Badge({ children, color, bg }) {
  return (
    <span style={{
      fontSize: 11, fontWeight: 600, padding: '2px 8px',
      borderRadius: 4, background: bg, color,
      letterSpacing: 0.3,
    }}>
      {children}
    </span>
  )
}

// ─── Toggle ───
export function Toggle({ on, onChange }) {
  return (
    <div onClick={onChange} style={{
      width: 36, height: 20, borderRadius: 10,
      background: on ? T.blue : T.borderHi,
      padding: 2, cursor: 'pointer',
      display: 'flex', alignItems: 'center',
      justifyContent: on ? 'flex-end' : 'flex-start',
      transition: 'background 0.2s',
    }}>
      <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.15)' }} />
    </div>
  )
}

// ─── Select dropdown ───
export function Select({ value, width = 180, onChange, options = [] }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: '7px 12px', borderRadius: 8,
        border: `1px solid ${T.border}`, background: T.card,
        fontSize: 13, color: T.ink, fontWeight: 400,
        cursor: 'pointer', width, outline: 'none',
        fontFamily: 'inherit',
      }}
    >
      {options.map(o => (
        <option key={typeof o === 'string' ? o : o.value} value={typeof o === 'string' ? o : o.value}>
          {typeof o === 'string' ? o : o.label}
        </option>
      ))}
    </select>
  )
}
