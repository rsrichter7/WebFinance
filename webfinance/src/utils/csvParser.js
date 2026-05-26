// ─── CSV Parser — Rabobank importformaat ───
// parseRabobankCSV, markDuplicates, matchFixedExpenses.

function parseCsvText(text) {
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
      else if (c === ',') { row.push(field); field = '' }
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

function parseBedrag(s) {
  const trimmed = s.trim()
  const neg = trimmed.startsWith('-')
  const n = parseFloat(trimmed.replace(',', '.').replace(/[^\d.]/g, ''))
  return { bedrag: isNaN(n) ? 0 : n, type: neg ? 'Uitgave' : 'Inkomst' }
}

export function isRabobankCSV(headers) {
  return (
    headers.includes('Naam tegenpartij') &&
    headers.includes('Volgnr') &&
    headers.includes('Saldo na trn')
  )
}

export function parseRabobankCSV(csvText) {
  const lines = parseCsvText(csvText.trim())
  if (lines.length < 2) return null
  const headers = lines[0]
  if (!isRabobankCSV(headers)) return null
  const idx = name => headers.indexOf(name)

  return lines.slice(1).map((row, i) => {
    const g = name => (row[idx(name)] ?? '').trim()
    const { bedrag, type } = parseBedrag(g('Bedrag'))
    const beschrijving = [g('Omschrijving-1'), g('Omschrijving-2'), g('Omschrijving-3')]
      .filter(s => s.length > 0).join(' ')
    return {
      _id:          i,
      datum:        g('Datum'),
      bedrag,
      type,
      winkel:       g('Naam tegenpartij'),
      beschrijving,
      categorie:    '',
      subcategorie: '',
      soort:        '',
      wie:          'GZ',
      bron:         'import',
      selected:     true,
      status:       'nieuw',
    }
  }).filter(tx => tx.bedrag > 0)
}

export function markDuplicates(rows, existing) {
  return rows.map(row => {
    const isDup = existing.some(tx =>
      tx.datum === row.datum &&
      Math.abs(tx.bedrag - row.bedrag) < 0.005 &&
      (tx.winkel ?? '').toLowerCase() === (row.winkel ?? '').toLowerCase()
    )
    return isDup ? { ...row, status: 'duplicaat', selected: false } : row
  })
}

// fixedItems: rijen rechtstreeks uit Supabase (kolom 'naam', niet 'omschrijving')
export function matchFixedExpenses(rows, fixedItems) {
  return rows.map(row => {
    if (row.status === 'duplicaat') return row
    const wl = (row.winkel ?? '').toLowerCase()
    if (!wl) return row
    const match = fixedItems.find(fe => {
      const nl = (fe.naam ?? '').toLowerCase()
      return nl && (nl.includes(wl) || wl.includes(nl))
    })
    if (!match) return row
    return {
      ...row,
      status:        'vaste_last',
      vaste_last_id: match.id,
      categorie:     match.categorie ?? '',
      subcategorie:  match.subcategorie ?? '',
      soort:         match.soort ?? '',
      wie:           match.wie ?? 'GZ',
    }
  })
}
