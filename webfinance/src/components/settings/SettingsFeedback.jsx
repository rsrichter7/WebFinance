// ─── SettingsFeedback ───
// Admin-overzicht van alle ontvangen feedback.
// Drie tabs: Open, Behandeld, Afgewezen. Statuswijziging via RPC.

import React, { useState } from 'react'
import { T, fmtDate } from '../../tokens'
import { ICONS } from '../ui/Icons'
import { Badge } from '../ui/Card'
import useFeedback from '../../hooks/useFeedback'

const STATUS_CFG = {
  open:      { label: 'Open',      color: T.amber,   bg: T.amberSoft },
  behandeld: { label: 'Behandeld', color: T.green,   bg: T.greenSoft },
  afgewezen: { label: 'Afgewezen', color: T.ink3,    bg: T.rule },
}

export default function SettingsFeedback() {
  const { allFeedback, updateStatus, fetchAllFeedback, loading } = useFeedback()
  const [activeTab, setActiveTab] = useState('open')
  const [notities, setNotities]   = useState({})
  const [expanded, setExpanded]   = useState({})

  const counts = {
    open:      allFeedback.filter(f => f.status === 'open').length,
    behandeld: allFeedback.filter(f => f.status === 'behandeld').length,
    afgewezen: allFeedback.filter(f => f.status === 'afgewezen').length,
  }

  const filtered = allFeedback.filter(f => f.status === activeTab)

  async function handleWijzig(feedbackId, status) {
    await updateStatus(feedbackId, status, notities[feedbackId] ?? '')
    setNotities(prev => { const n = { ...prev }; delete n[feedbackId]; return n })
  }

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: T.ink2, marginBottom: 14 }}>Gebruikersfeedback</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 16, border: `1px solid ${T.border}`, borderRadius: 8, overflow: 'hidden' }}>
        {['open', 'behandeld', 'afgewezen'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1, padding: '8px 0', border: 'none', fontSize: 13, fontWeight: 500,
              cursor: 'pointer', fontFamily: 'inherit',
              background: activeTab === tab ? T.ink : T.card,
              color: activeTab === tab ? '#fff' : T.ink3,
            }}
          >
            {STATUS_CFG[tab].label} ({counts[tab]})
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={fetchAllFeedback} style={{ fontSize: 12, color: T.blue, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px' }}>
          ↻ Vernieuwen
        </button>
      </div>

      {loading && <div style={{ fontSize: 13, color: T.ink3, textAlign: 'center', padding: 24 }}>Laden...</div>}

      {!loading && filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '32px 0', color: T.ink4 }}>
          <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'center' }}>{ICONS.messageSquare}</div>
          <div style={{ fontSize: 13 }}>Geen {STATUS_CFG[activeTab].label.toLowerCase()} feedback</div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map(item => (
          <FeedbackCard
            key={item.id}
            item={item}
            expanded={!!expanded[item.id]}
            onExpand={() => setExpanded(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
            notitie={notities[item.id] ?? ''}
            onNotitie={v => setNotities(prev => ({ ...prev, [item.id]: v }))}
            onBehandeld={() => handleWijzig(item.id, 'behandeld')}
            onAfwijzen={() => handleWijzig(item.id, 'afgewezen')}
          />
        ))}
      </div>
    </div>
  )
}

function FeedbackCard({ item, expanded, onExpand, notitie, onNotitie, onBehandeld, onAfwijzen }) {
  const [imgOpen, setImgOpen] = useState(false)
  const cfg = STATUS_CFG[item.status]
  const lang = item.bericht.length > 200

  return (
    <div style={{ padding: 16, border: `1px solid ${T.border}`, borderRadius: 10, background: T.card }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 8 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.ink, flex: 1 }}>{item.onderwerp}</div>
        <Badge color={cfg.color} bg={cfg.bg}>{cfg.label}</Badge>
      </div>

      {/* Bericht */}
      <div style={{ fontSize: 13, color: T.ink2, lineHeight: 1.5, marginBottom: 8 }}>
        {lang && !expanded ? item.bericht.slice(0, 200) + '…' : item.bericht}
        {lang && (
          <button onClick={onExpand} style={{ marginLeft: 6, fontSize: 12, color: T.blue, background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            {expanded ? 'minder lezen' : 'meer lezen'}
          </button>
        )}
      </div>

      {/* Afbeelding thumbnail */}
      {item.afbeeldingUrl && (
        <div style={{ marginBottom: 10 }}>
          <img
            src={item.afbeeldingUrl}
            alt="feedback"
            onClick={() => setImgOpen(true)}
            style={{ maxHeight: 80, borderRadius: 6, border: `1px solid ${T.border}`, cursor: 'pointer', objectFit: 'cover' }}
          />
          {imgOpen && (
            <div
              onClick={() => setImgOpen(false)}
              style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <img src={item.afbeeldingUrl} alt="groot" style={{ maxWidth: '90vw', maxHeight: '90vh', borderRadius: 10 }} />
            </div>
          )}
        </div>
      )}

      {/* Meta */}
      <div style={{ fontSize: 11.5, color: T.ink4, marginBottom: item.status === 'open' ? 12 : 0 }}>
        {fmtDate(item.createdAt)}
        {item.adminNotitie && (
          <span style={{ marginLeft: 12, color: T.ink3, fontStyle: 'italic' }}>Notitie: {item.adminNotitie}</span>
        )}
      </div>

      {/* Actieknoppen — alleen bij open items */}
      {item.status === 'open' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <textarea
            placeholder="Admin-notitie (optioneel)"
            rows={2}
            value={notitie}
            onChange={e => onNotitie(e.target.value)}
            style={{ width: '100%', padding: '7px 10px', borderRadius: 8, border: `1px solid ${T.border}`, fontSize: 12, color: T.ink, fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onBehandeld} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', background: T.greenSoft, color: T.greenText, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              ✓ Behandeld
            </button>
            <button onClick={onAfwijzen} style={{ flex: 1, padding: '7px 0', borderRadius: 8, border: 'none', background: T.redSoft, color: T.redText, fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
              × Afwijzen
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
