// ─── Revolut CSV parser ───
// Komma-gescheiden, alleen COMPLETED EUR transacties

import { parseCsvText, parseBedragPunt, makeTx } from './helpers'

export function isRevolut(headers) {
  return (
    headers.includes('Started Date') &&
    headers.includes('Completed Date') &&
    headers.includes('State')
  )
}

export function parseRevolut(csvText) {
  const lines = parseCsvText(csvText, ',')
  if (lines.length < 2) return null
  const headers = lines[0]
  if (!isRevolut(headers)) return null
  const idx = name => headers.indexOf(name)

  return lines.slice(1)
    .filter(row => {
      const g = name => (row[idx(name)] ?? '').trim()
      return g('State') === 'COMPLETED' && g('Currency') === 'EUR'
    })
    .map((row, i) => {
      const g = name => (row[idx(name)] ?? '').trim()
      const datumRaw = g('Started Date')
      const datum    = datumRaw.slice(0, 10)
      const { bedrag, type } = parseBedragPunt(g('Amount'))
      return makeTx({
        datum,
        bedrag,
        type,
        winkel:       g('Description'),
        beschrijving: g('Description'),
      }, i)
    })
    .filter(tx => tx.bedrag > 0)
}
