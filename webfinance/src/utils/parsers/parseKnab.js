// ─── Knab CSV parser ───
// Komma-gescheiden, type bepaald door CreditDebit kolom

import { parseCsvText, makeTx } from './helpers'

export function isKnab(headers) {
  return (
    headers.includes('CreditDebit') &&
    headers.includes('Tegenrekeninghouder') &&
    headers.includes('Betaalwijze')
  )
}

export function parseKnab(csvText) {
  const lines = parseCsvText(csvText, ',')
  if (lines.length < 2) return null
  const headers = lines[0]
  if (!isKnab(headers)) return null
  const idx = name => headers.indexOf(name)

  return lines.slice(1).map((row, i) => {
    const g = name => (row[idx(name)] ?? '').trim()
    const creditDebit = g('CreditDebit')
    const type   = creditDebit === 'Credit' ? 'Inkomst' : 'Uitgave'
    const bedrag = parseFloat(g('Bedrag').replace(/[^\d.]/g, '')) || 0
    return makeTx({
      datum:        g('Transactiedatum'),
      bedrag,
      type,
      winkel:       g('Tegenrekeninghouder'),
      beschrijving: g('Omschrijving'),
    }, i)
  }).filter(tx => tx.bedrag > 0)
}
