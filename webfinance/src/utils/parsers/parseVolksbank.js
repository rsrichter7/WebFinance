// ─── Volksbank CSV parser (ASN Bank, SNS Bank, RegioBank) ───
// Komma-gescheiden, datum DD-MM-YYYY, bedrag met + of - teken

import { parseCsvText, parseBedragKomma, parseDateDMY, makeTx } from './helpers'

export function isVolksbank(headers) {
  return (
    headers.includes('Boekingsdatum') &&
    headers.includes('Opdrachtgeversrekening') &&
    headers.includes('Naam tegenrekening')
  )
}

export function parseVolksbank(csvText) {
  const lines = parseCsvText(csvText, ',')
  if (lines.length < 2) return null
  const headers = lines[0]
  if (!isVolksbank(headers)) return null
  const idx = name => headers.indexOf(name)

  return lines.slice(1).map((row, i) => {
    const g = name => (row[idx(name)] ?? '').trim()
    const { bedrag, type } = parseBedragKomma(g('Mutatie'))
    return makeTx({
      datum:        parseDateDMY(g('Boekingsdatum')),
      bedrag,
      type,
      winkel:       g('Naam tegenrekening'),
      beschrijving: g('Mededelingen'),
    }, i)
  }).filter(tx => tx.bedrag > 0)
}
