// ─── ING CSV parser ───
// Puntkomma-gescheiden, velden tussen dubbele quotes, datum YYYYMMDD

import { parseCsvText, parseDate8, makeTx } from './helpers'

export function isING(headers) {
  return (
    headers.includes('Naam / Omschrijving') &&
    headers.includes('Af Bij') &&
    headers.includes('Mutatiesoort')
  )
}

export function parseING(csvText) {
  const lines = parseCsvText(csvText, ';')
  if (lines.length < 2) return null
  const headers = lines[0]
  if (!isING(headers)) return null
  const idx = name => headers.indexOf(name)

  return lines.slice(1).map((row, i) => {
    const g = name => (row[idx(name)] ?? '').trim()
    const afBij = g('Af Bij')
    const type  = afBij === 'Af' ? 'Uitgave' : 'Inkomst'
    const bedragStr = g('Bedrag (EUR)').replace(',', '.')
    const bedrag = parseFloat(bedragStr.replace(/[^\d.]/g, '')) || 0
    return makeTx({
      datum:        parseDate8(g('Datum')),
      bedrag,
      type,
      winkel:       g('Naam / Omschrijving'),
      beschrijving: g('Mededelingen'),
    }, i)
  }).filter(tx => tx.bedrag > 0)
}
