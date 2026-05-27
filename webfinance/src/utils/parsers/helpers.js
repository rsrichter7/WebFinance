// ─── Gedeelde hulpfuncties voor alle CSV-parsers ───

// Verwijdert IBAN-nummers (NL + internationaal) uit een string
export function stripIBANs(text) {
  if (!text) return text
  return text.replace(/\b[A-Z]{2}\d{2}\s?[A-Z0-9]{4}\s?\d{4}\s?\d{4}\s?\d{0,4}\s?\d{0,2}\b/g, '***')
}

export function parseCsvText(text, delimiter = ',') {
  const lines = []
  let row = [], field = '', inQ = false
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1]
    if (inQ) {
      if (c === '"' && n === '"') { field += '"'; i++ }
      else if (c === '"') { inQ = false }
      else { field += c }
    } else {
      if (c === '"') { inQ = true }
      else if (c === delimiter) { row.push(field); field = '' }
      else if (c === '\r' || c === '\n') {
        if (c === '\r' && n === '\n') i++
        row.push(field); field = ''
        if (row.some(f => f.length > 0)) lines.push(row)
        row = []
      } else { field += c }
    }
  }
  if (row.length || field) {
    row.push(field)
    if (row.some(f => f.length > 0)) lines.push(row)
  }
  return lines
}

// Bedrag met komma als decimaalscheidingsteken — bepaalt type op basis van + of - teken
export function parseBedragKomma(s) {
  const t = s.trim()
  const neg = t.startsWith('-')
  const n = parseFloat(t.replace(',', '.').replace(/[^\d.]/g, ''))
  return { bedrag: isNaN(n) ? 0 : n, type: neg ? 'Uitgave' : 'Inkomst' }
}

// Bedrag met punt als decimaalscheidingsteken — bepaalt type op basis van + of - teken
export function parseBedragPunt(s) {
  const t = s.trim()
  const neg = t.startsWith('-')
  const n = parseFloat(t.replace(/[^\d.]/g, ''))
  return { bedrag: isNaN(n) ? 0 : n, type: neg ? 'Uitgave' : 'Inkomst' }
}

// YYYYMMDD → YYYY-MM-DD
export function parseDate8(s) {
  const t = s.trim()
  if (t.length === 8 && /^\d{8}$/.test(t))
    return `${t.slice(0, 4)}-${t.slice(4, 6)}-${t.slice(6, 8)}`
  return t
}

// DD-MM-YYYY → YYYY-MM-DD
export function parseDateDMY(s) {
  const parts = s.trim().split('-')
  if (parts.length === 3 && parts[2].length === 4)
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  return s.trim()
}

// DD/MM/YYYY → YYYY-MM-DD
export function parseDateDMYSlash(s) {
  const parts = s.trim().split('/')
  if (parts.length === 3 && parts[2].length === 4)
    return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
  return s.trim()
}

export function makeTx(overrides, i) {
  const tx = {
    _id:          i,
    datum:        '',
    bedrag:       0,
    type:         'Uitgave',
    winkel:       '',
    beschrijving: '',
    categorie:    '',
    subcategorie: '',
    soort:        '',
    wie:          'GZ',
    bron:         'import',
    selected:     true,
    status:       'nieuw',
    ...overrides,
  }
  tx.winkel       = stripIBANs(tx.winkel)
  tx.beschrijving = stripIBANs(tx.beschrijving)
  return tx
}
