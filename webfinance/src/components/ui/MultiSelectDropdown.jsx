// ─── MultiSelectDropdown ───
// Herbruikbare multi-select met checkbox-lijst, geopend via createPortal (zelfde
// positioneringspatroon als DatePicker.jsx).

import React, { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useTheme } from '../../hooks/useTheme'

function normalize(opt) {
  return typeof opt === 'string' ? { value: opt, label: opt } : opt
}

export default function MultiSelectDropdown({ label, options, selected, onChange }) {
  const { T } = useTheme()
  const [open, setOpen] = useState(false)
  const [pos, setPos]   = useState({ top: 0, left: 0, width: 0 })
  const containerRef = useRef(null)
  const buttonRef     = useRef(null)

  const genormaliseerd = options.map(normalize)

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleToggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect()
      setPos({ top: rect.bottom + 4, left: rect.left, width: rect.width })
    }
    setOpen(v => !v)
  }

  function toggleValue(value) {
    onChange(selected.includes(value) ? selected.filter(v => v !== value) : [...selected, value])
  }

  function triggerLabel() {
    if (selected.length === 0) return 'Alle'
    if (selected.length === 1) {
      const match = genormaliseerd.find(o => o.value === selected[0])
      return match ? match.label : selected[0]
    }
    return `${selected.length} geselecteerd`
  }

  const L = { display: 'block', fontSize: 13, fontWeight: 500, color: T.ink2, marginBottom: 6 }

  const paneel = (
    <div
      onMouseDown={e => e.stopPropagation()}
      style={{
        position: 'fixed', top: pos.top, left: pos.left, width: pos.width, minWidth: 200,
        zIndex: 9999, background: T.card, border: `1px solid ${T.border}`,
        borderRadius: 10, boxShadow: '0 8px 24px rgba(17,24,39,0.13)',
        overflow: 'hidden', padding: '8px 0',
      }}
    >
      <button type="button" onClick={() => onChange([])} style={{
        display: 'block', width: '100%', textAlign: 'left', padding: '6px 14px',
        border: 'none', background: 'transparent', fontSize: 12, fontWeight: 500,
        color: T.blue, cursor: 'pointer', fontFamily: 'inherit',
      }}>
        Alles wissen
      </button>
      <div style={{ maxHeight: 220, overflow: 'auto' }}>
        {genormaliseerd.map(opt => {
          const checked = selected.includes(opt.value)
          return (
            <div key={opt.value} onClick={() => toggleValue(opt.value)}
              onMouseEnter={e => e.currentTarget.style.background = T.rule}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '7px 14px', cursor: 'pointer', fontSize: 13, color: T.ink2 }}
            >
              <input type="checkbox" checked={checked} readOnly style={{ pointerEvents: 'none' }} />
              <span>{opt.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )

  return (
    <div ref={containerRef}>
      <label style={L}>{label}</label>
      <button ref={buttonRef} type="button" onClick={handleToggle} style={{
        width: '100%', padding: '9px 12px', borderRadius: 8,
        border: `1.5px solid ${open ? T.blue : T.border}`,
        background: T.card, fontSize: 13, color: T.ink,
        cursor: 'pointer', fontFamily: "'Inter', system-ui, sans-serif",
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', textAlign: 'left',
      }}>
        <span>{triggerLabel()}</span>
        <span style={{ fontSize: 11, color: T.ink4 }}>▾</span>
      </button>

      {open && createPortal(paneel, document.body)}
    </div>
  )
}
