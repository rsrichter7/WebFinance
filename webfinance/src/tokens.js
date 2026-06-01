// ─── Design Tokens ───
// Alle kleuren, schaduwen en formatting op één plek.
// Importeer dit in elk component: import { T, TAB, fmt, fmtDate } from '../../tokens'

export const lightTokens = {
  bg:        '#F8F9FA',
  card:      '#FFFFFF',
  cardAlt:   '#FAFBFC',
  border:    '#E5E7EB',
  borderHi:  '#D1D5DB',
  ink:       '#111827',
  ink2:      '#374151',
  ink3:      '#6B7280',
  ink4:      '#9CA3AF',
  rule:      '#F3F4F6',

  blue:      '#2563EB',
  blueHi:    '#1D4ED8',
  blueSoft:  '#EFF6FF',
  blueText:  '#1D4ED8',
  green:     '#059669',
  greenSoft: '#ECFDF5',
  greenText: '#047857',
  red:       '#DC2626',
  redSoft:   '#FEF2F2',
  redText:   '#B91C1C',
  amber:     '#B45309',
  amberSoft: '#FFFBEB',
  amberText: '#92400E',
  violet:    '#7C3AED',
  violetSoft:'#F5F3FF',
  teal:      '#0D9488',
  tealSoft:  '#F0FDFA',

  uitgaveBtnBg:   '#111827',
  uitgaveBtnText: '#ffffff',
  inkomstBtnBg:   '#059669',
  inkomstBtnText: '#ffffff',
  statGreen:      '#059669',
  statRed:        '#DC2626',
  statBlue:       '#2563EB',

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
}

export const darkTokens = {
  bg:        '#0F1117',
  card:      '#1E2130',
  cardAlt:   '#252838',
  border:    '#2A2D3A',
  borderHi:  '#363A4A',
  ink:       '#F1F3F5',
  ink2:      '#A0A4B0',
  ink3:      '#6B7080',
  ink4:      '#484C5E',
  rule:      '#252838',

  blue:      '#2563EB',
  blueHi:    '#1D4ED8',
  blueSoft:  'rgba(59,130,246,0.15)',
  blueText:  '#93C5FD',
  green:     '#059669',
  greenSoft: 'rgba(5,150,105,0.15)',
  greenText: '#6EE7B7',
  red:       '#DC2626',
  redSoft:   'rgba(220,38,38,0.15)',
  redText:   '#FCA5A5',
  amber:     '#B45309',
  amberSoft: 'rgba(180,83,9,0.18)',
  amberText: '#FCD34D',
  violet:    '#7C3AED',
  violetSoft:'rgba(124,58,237,0.15)',
  teal:      '#0D9488',
  tealSoft:  'rgba(13,148,136,0.15)',

  uitgaveBtnBg:   'rgba(220,38,38,0.42)',
  uitgaveBtnText: '#FCA5A5',
  inkomstBtnBg:   'rgba(5,150,105,0.42)',
  inkomstBtnText: '#6EE7B7',
  statGreen:      '#6EE7B7',
  statRed:        '#FCA5A5',
  statBlue:       '#93C5FD',

  shadow:    '0 1px 3px rgba(0,0,0,0.5), 0 1px 2px rgba(0,0,0,0.4)',
}

export function getTokens(theme) {
  return theme === 'dark' ? darkTokens : lightTokens
}

// Backward compat: statische light tokens voor niet-component code (fmt, fmtDate, etc.)
export const T = lightTokens

// Tabular numbers — gebruik als: style={{ ...TAB }}
export const TAB = { fontVariantNumeric: 'tabular-nums' }

// Bedrag formatteren: fmt(1234.56) → "€1.234,56"
export const fmt = (n) =>
  '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtShort = (n) =>
  '€' + Math.round(n).toLocaleString('nl-NL')

// Datumformattering — leest voorkeur uit localStorage (key: webfinance_datumformaat)
const MONTHS_NL = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']

export function fmtDate(dateStr, format) {
  const d = new Date(dateStr)
  const fmt = format || localStorage.getItem('webfinance_datumformaat') || 'long'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  if (fmt === 'dmy') return `${dd}-${mm}-${d.getFullYear()}`
  if (fmt === 'iso') return `${d.getFullYear()}-${mm}-${dd}`
  return `${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`
}
