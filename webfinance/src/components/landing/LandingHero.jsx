// ─── LandingHero ───
// Hero-sectie met gradient, H1 en animerend "Vrij te besteden" widget.

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { T, TAB, fmt } from '../../tokens'

const DOEL = 847

function VrijWidget() {
  const [bedrag, setBedrag] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) { setBedrag(DOEL); return }
    const ms = 1600
    let t0
    const delay = setTimeout(() => {
      t0 = performance.now()
      function step(now) {
        const p = Math.min((now - t0) / ms, 1)
        const eased = 1 - (1 - p) ** 3
        setBedrag(Math.round(DOEL * eased))
        if (p < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, 350)
    return () => clearTimeout(delay)
  }, [])

  const pct = Math.round((bedrag / 2750) * 100)

  return (
    <div style={{
      background: 'rgba(255,255,255,0.10)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.18)',
      borderRadius: 16, padding: '28px 28px 24px',
      maxWidth: 360, width: '100%',
    }}>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: 0.8, textTransform: 'uppercase', marginBottom: 10 }}>
        Vrij te besteden deze maand
      </div>
      <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: -1.5, lineHeight: 1, marginBottom: 20, ...TAB }}>
        {fmt(bedrag)}
      </div>
      <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: 6, height: 7, overflow: 'hidden', marginBottom: 22 }}>
        <div style={{
          height: '100%', borderRadius: 6,
          background: 'linear-gradient(90deg, #34D399 0%, #10B981 100%)',
          width: `${pct}%`, transition: 'width 80ms linear',
        }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.52)', marginBottom: 4 }}>Inkomsten</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#6EE7B7', ...TAB }}>€ 2.750</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.52)', marginBottom: 4 }}>Uitgaven</div>
          <div style={{ fontSize: 15, fontWeight: 600, color: '#FCA5A5', ...TAB }}>€ 1.903</div>
        </div>
      </div>
    </div>
  )
}

export default function LandingHero() {
  return (
    <section style={{
      background: T.gradHero,
      minHeight: '100svh',
      display: 'flex',
      alignItems: 'center',
      padding: '100px clamp(20px, 5vw, 48px) 80px',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>
        <div className="landing-hero-grid">
          {/* Tekst-kolom */}
          <div>
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.18)',
              borderRadius: 100, padding: '5px 14px',
              fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: 500, marginBottom: 24,
            }}>
              Voor iedereen die z'n geld eindelijk wil snappen
            </div>
            <h1 style={{
              fontSize: 'clamp(30px, 5vw, 52px)',
              fontWeight: 800, color: '#fff',
              letterSpacing: -1.5, lineHeight: 1.1, marginBottom: 20,
            }}>
              Hoeveel kan ik deze maand nog uitgeven?
            </h1>
            <p style={{
              fontSize: 17, color: 'rgba(255,255,255,0.76)',
              lineHeight: 1.65, maxWidth: 460, marginBottom: 36,
            }}>
              Daar geeft Webfinance antwoord op. Geen muur aan transacties om zelf uit te pluizen. Gewoon het ene bedrag dat telt, bijgewerkt tot vandaag.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/login?modus=registreren" style={{
                padding: '13px 24px', borderRadius: 10,
                background: '#fff', color: T.blue,
                fontSize: 15, fontWeight: 700, textDecoration: 'none',
                letterSpacing: -0.2, whiteSpace: 'nowrap',
              }}>
                Probeer 1 maand gratis
              </Link>
              <a href="#functies" style={{
                padding: '13px 20px', borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.28)',
                color: 'rgba(255,255,255,0.88)',
                fontSize: 15, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap',
              }}>
                Bekijk hoe het werkt ↓
              </a>
            </div>
          </div>
          {/* Widget-kolom */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <VrijWidget />
          </div>
        </div>
      </div>
    </section>
  )
}
