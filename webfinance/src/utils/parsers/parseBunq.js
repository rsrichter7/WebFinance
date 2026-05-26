// ─── bunq CSV parser (NL en EN) ───
// Komma of puntkomma-gescheiden, bedrag met punt als decimaal

import { parseCsvText, parseBedragPunt, parseDateDMYSlash, makeTx } from './helpers'

export function isBunq(headers) {
  return (
    (headers.includes('Rentedatum') || headers.includes('Interest Date')) &&
    (headers.includes('Tegenpartij') || headers.includes('Counterparty'))
  )
}

export function parseBunq(csvText) {
  const firstLine = csvText.trim().split(/\r?\n/)[0]
  const semiCount  = (firstLine.match(/;/g) || []).length
  const commaCount = (firstLine.match(/,/g) || []).length
  const delimiter  = semiCount > commaCount ? ';' : ','

  const lines = parseCsvText(csvText, delimiter)
  if (lines.length < 2) return null
  const headers = lines[0].map(h => h.trim())
  if (!isBunq(headers)) return null

  const isEN       = headers.includes('Interest Date')
  const datumKey   = isEN ? 'Date' : 'Datum'
  const naamKey    = isEN ? 'Name' : 'Naam'
  const omschKey   = isEN ? 'Description' : 'Omschrijving'
  const bedragKey  = isEN ? 'Amount' : 'Bedrag'
  const idx = name => headers.indexOf(name)

  return lines.slice(1).map((row, i) => {
    const g = name => (row[idx(name)] ?? '').trim()
    const datumRaw = g(datumKey)
    const datum = datumRaw.includes('/') ? parseDateDMYSlash(datumRaw) : datumRaw.slice(0, 10)
    const { bedrag, type } = parseBedragPunt(g(bedragKey))
    return makeTx({
      datum,
      bedrag,
      type,
      winkel:       g(naamKey),
      beschrijving: g(omschKey),
    }, i)
  }).filter(tx => tx.bedrag > 0)
}
