// ─── IncomeCategoryGroup ───
// Gegroepeerde tabel per hoofdcategorie voor vaste inkomsten.
// Identiek aan FixedCategoryGroup, maar kolomheader toont "VOLGENDE INKOMST".

import React from 'react'
import { useTheme } from '../../hooks/useTheme'
import { TAB, fmt, fmtDate } from '../../tokens'
import { Card } from '../ui/Card'
import { ICONS } from '../ui/Icons'
import useProfiles from '../../hooks/useProfiles'

const FREQ_LABEL = {
  Maandelijks: '/ maand',
  Wekelijks:   '/ week',
  Jaarlijks:   '/ jaar',
  Kwartaal:    '/ kwartaal',
}

function pad(n) { return String(n).padStart(2, '0') }

function volgendeDatum(afschrijfdag) {
  const now  = new Date()
  const dag  = afschrijfdag ?? 1
  let year   = now.getFullYear()
  let month  = now.getMonth()
  if (now.getDate() >= dag) {
    month += 1
    if (month > 11) { month = 0; year += 1 }
  }
  const maxDay = new Date(year, month + 1, 0).getDate()
  return `${year}-${pad(month + 1)}-${pad(Math.min(dag, maxDay))}`
}

function SoortBadge({ soort }) {
  const { T } = useTheme()
  const STIJLEN = {
    Noodzaak: { bg: T.rule,      color: T.ink3 },
    Wens:     { bg: T.blueSoft,  color: T.blueText },
    Sparen:   { bg: T.greenSoft, color: T.greenText },
  }
  const s = STIJLEN[soort] || STIJLEN.Noodzaak
  return (
    <span style={{ fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4, background: s.bg, color: s.color }}>
      {soort}
    </span>
  )
}

function WieAvatar({ initials }) {
  const { T } = useTheme()
  const { getByInitialen } = useProfiles()
  const p = getByInitialen(initials)
  const kleur = p ? p.kleur : { bg: T.rule, fg: T.ink3 }
  return (
    <div style={{ width: 26, height: 26, borderRadius: '50%', background: kleur.bg, color: kleur.fg, display: 'grid', placeItems: 'center', fontSize: 10, fontWeight: 600 }}>
      {initials}
    </div>
  )
}

export default function IncomeCategoryGroup({ icon, title, color, colorSoft, items, subtotal, onEdit, onRemove, hoofdinkomstId, setHoofdinkomst }) {
  const { T } = useTheme()
  const ico = ICONS[icon] || ICONS.grip

  const TH = {
    padding: '11px 16px', fontSize: 11, fontWeight: 600,
    color: T.ink4, background: T.cardAlt, textAlign: 'left',
    letterSpacing: 0.3, textTransform: 'uppercase',
    borderBottom: `1px solid ${T.border}`, whiteSpace: 'nowrap',
  }
  const TD = { padding: '12px 16px', fontSize: 13, borderBottom: `1px solid ${T.rule}` }

  return (
    <Card style={{ padding: 0, overflow: 'visible', minHeight: 'auto' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '14px 18px', borderBottom: `1px solid ${T.border}`,
        background: T.cardAlt,
      }}>
        <div style={{ width: 30, height: 30, borderRadius: 8, background: colorSoft, display: 'grid', placeItems: 'center', color }}>
          {ico}
        </div>
        <div style={{ flex: 1, fontSize: 14, fontWeight: 600, color: T.ink }}>{title}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>
          {fmt(subtotal)}
          <span style={{ fontSize: 11, fontWeight: 400, color: T.ink3 }}> / maand</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ ...TH, width: 36 }} />
              <th style={TH}>Volgende inkomst</th>
              <th style={TH}>Bedrag</th>
              <th style={TH}>Winkel / Bron</th>
              <th style={TH}>Omschrijving</th>
              <th style={TH}>Categorie</th>
              <th style={TH}>Soort</th>
              <th style={TH}>Wie</th>
              <th style={{ ...TH, width: 50 }} />
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => (
              <tr
                key={item.id}
                style={{ background: i % 2 === 1 ? T.cardAlt : T.card }}
                onMouseEnter={e => e.currentTarget.querySelectorAll('.row-action').forEach(b => b.style.opacity = 1)}
                onMouseLeave={e => e.currentTarget.querySelectorAll('.row-action').forEach(b => b.style.opacity = 0)}
              >
                <td style={{ ...TD, width: 36, padding: '12px 8px 12px 14px' }}>
                  <button
                    onClick={() => setHoofdinkomst?.(item.id)}
                    title={item.id === hoofdinkomstId ? 'Hoofdinkomst' : 'Instellen als hoofdinkomst'}
                    style={{
                      border: 'none', background: 'transparent', padding: 4, borderRadius: 6,
                      cursor: 'pointer', display: 'inline-flex', color: item.id === hoofdinkomstId ? T.amber : T.ink4,
                      transition: 'color 0.15s',
                    }}
                    onMouseEnter={e => { if (item.id !== hoofdinkomstId) e.currentTarget.style.color = T.amber }}
                    onMouseLeave={e => { if (item.id !== hoofdinkomstId) e.currentTarget.style.color = T.ink4 }}
                  >
                    {item.id === hoofdinkomstId ? ICONS.starFill : ICONS.starEmpty}
                  </button>
                </td>
                <td style={{ ...TD, color: T.ink3, whiteSpace: 'nowrap' }}>{fmtDate(volgendeDatum(item.afschrijfdag))}</td>
                <td style={{ ...TD, fontWeight: 600, color: T.ink, whiteSpace: 'nowrap', ...TAB }}>
                  <span style={{ color: T.green, marginRight: 4, fontSize: 11 }}>↑</span>
                  {fmt(item.bedrag)}
                  <span style={{ fontSize: 11, fontWeight: 400, color: T.ink3, marginLeft: 4 }}>
                    {FREQ_LABEL[item.herhaling] || ''}
                  </span>
                </td>
                <td style={{ ...TD, fontWeight: 600, color: T.ink }}>{item.winkel || '—'}</td>
                <td style={{ ...TD, fontWeight: 400, color: T.ink3 }}>{item.omschrijving}</td>
                <td style={TD}>
                  <div style={{ color: T.ink2 }}>{item.categorie}</div>
                  <div style={{ color: T.ink4, fontSize: 11.5 }}>{item.sub}</div>
                </td>
                <td style={TD}><SoortBadge soort={item.soort} /></td>
                <td style={TD}><WieAvatar initials={item.wie} /></td>
                <td style={TD}>
                  <div style={{ display: 'inline-flex', gap: 4 }}>
                    <button className="row-action" onClick={() => onEdit(item)}
                      style={{ border: 'none', background: 'transparent', padding: 5, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex', opacity: 0, transition: 'opacity 0.15s, color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = T.ink2}
                      onMouseLeave={e => e.currentTarget.style.color = T.ink4}>
                      {ICONS.edit}
                    </button>
                    <button className="row-action" onClick={() => onRemove(item.id)}
                      style={{ border: 'none', background: 'transparent', padding: 5, borderRadius: 6, cursor: 'pointer', color: T.ink4, display: 'inline-flex', opacity: 0, transition: 'opacity 0.15s, color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.color = T.red}
                      onMouseLeave={e => e.currentTarget.style.color = T.ink4}>
                      {ICONS.trash}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
