// ─── StackedBarMockup ───
// Nagebootste kostenverdeling-staaf per persoon (huishouden-widget).

import React from 'react'
import { T, TAB } from '../../../tokens'

const PERSONEN = [
  {
    naam: 'Ronald', initialen: 'RR', kleur: T.blue,
    totaal: 1320, bijdrage: 48,
    segmenten: [
      { label: 'Huur', pct: 44, color: T.blue },
      { label: 'Auto', pct: 29, color: T.teal },
      { label: 'Boodschappen', pct: 27, color: T.amber },
    ],
  },
  {
    naam: 'Anne', initialen: 'AK', kleur: '#7C3AED',
    totaal: 1430, bijdrage: 52,
    segmenten: [
      { label: 'Huur', pct: 41, color: '#7C3AED' },
      { label: 'Energie', pct: 32, color: T.red },
      { label: 'Boodschappen', pct: 27, color: T.amber },
    ],
  },
]

function WieBar({ persoon }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 7 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 26, height: 26, borderRadius: '50%',
            background: persoon.kleur, color: '#fff',
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{persoon.initialen}</div>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.ink }}>{persoon.naam}</span>
          <span style={{ fontSize: 11, color: T.ink4, background: T.rule, borderRadius: 4, padding: '1px 5px' }}>
            {persoon.bijdrage}%
          </span>
        </div>
        <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, ...TAB }}>
          € {persoon.totaal.toLocaleString('nl-NL')}
        </span>
      </div>
      <div style={{ display: 'flex', height: 10, borderRadius: 5, overflow: 'hidden', gap: 1 }}>
        {persoon.segmenten.map(s => (
          <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
        {persoon.segmenten.map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{ width: 6, height: 6, borderRadius: 1, background: s.color }} />
            <span style={{ fontSize: 10, color: T.ink3 }}>{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function StackedBarMockup() {
  return (
    <div style={{
      background: T.card, border: `1px solid ${T.border}`,
      borderRadius: 12, padding: 22,
      boxShadow: '0 4px 24px rgba(17,24,39,0.07)',
      maxWidth: 300, width: '100%',
    }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: T.ink, marginBottom: 18 }}>
        Kostenverdeling dit huishouden
      </div>
      {PERSONEN.map(p => <WieBar key={p.naam} persoon={p} />)}
      <div style={{
        marginTop: 4, paddingTop: 12, borderTop: `1px solid ${T.rule}`,
        display: 'flex', justifyContent: 'space-between', fontSize: 12,
      }}>
        <span style={{ color: T.ink3 }}>Totaal huishouden</span>
        <span style={{ fontWeight: 700, color: T.ink, ...TAB }}>€ 2.750</span>
      </div>
    </div>
  )
}
