// ─── LandingQuestionSection ───
// Herbruikbare vraag-sectie: tekst + widget-mockup, wisselend links/rechts.

import React from 'react'
import { T } from '../../tokens'

export default function LandingQuestionSection({ vraag, uitleg, kant = 'left', bg, children }) {
  return (
    <section style={{
      background: bg || T.card,
      padding: '80px clamp(20px, 5vw, 48px)',
      borderBottom: `1px solid ${T.border}`,
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div className={`landing-section-grid wf-reveal${kant === 'right' ? ' reverse' : ''}`}>
          {/* Tekst */}
          <div style={{ flex: '1 1 300px' }}>
            <h2 style={{
              fontSize: 'clamp(22px, 3.5vw, 34px)',
              fontWeight: 800, color: T.ink,
              letterSpacing: -0.8, lineHeight: 1.2, marginBottom: 16,
            }}>
              {vraag}
            </h2>
            <p style={{ fontSize: 16, color: T.ink3, lineHeight: 1.65, maxWidth: 400 }}>
              {uitleg}
            </p>
          </div>
          {/* Mockup */}
          <div style={{ flex: '1 1 300px', display: 'flex', justifyContent: 'center' }}>
            {children}
          </div>
        </div>
      </div>
    </section>
  )
}
