// ─── Design Tokens ───
// Alle kleuren, schaduwen en formatting op één plek.
// Importeer dit in elk component: import { T, TAB, fmt, fmtDate } from '../../tokens'

export const T = {
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

  shadow:    '0 1px 3px rgba(17,24,39,0.04), 0 1px 2px rgba(17,24,39,0.03)',
}

// Tabular numbers — gebruik als: style={{ ...TAB }}
export const TAB = { fontVariantNumeric: 'tabular-nums' }

// Bedrag formatteren: fmt(1234.56) → "€1.234,56"
export const fmt = (n) =>
  '€' + n.toLocaleString('nl-NL', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const fmtShort = (n) =>
  '€' + Math.round(n).toLocaleString('nl-NL')

// Datumformattering — leest voorkeur uit localStorage (key: webfinance_datumformaat)
const MONTHS_NL = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']

export function fmtDate(dateStr) {
  const d = new Date(dateStr)
  const format = localStorage.getItem('webfinance_datumformaat') || 'long'
  const dd = String(d.getDate()).padStart(2, '0')
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  if (format === 'dmy') return `${dd}-${mm}-${d.getFullYear()}`
  if (format === 'iso') return `${d.getFullYear()}-${mm}-${dd}`
  return `${d.getDate()} ${MONTHS_NL[d.getMonth()]} ${d.getFullYear()}`
}
