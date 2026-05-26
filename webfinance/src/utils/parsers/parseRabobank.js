// ─── Rabobank CSV parser ───

import { parseCsvText, parseBedragKomma, makeTx } from './helpers'

export function isRabobank(headers) {
  return (
    headers.includes('Naam tegenpartij') &&
    headers.includes('Volgnr') &&
    headers.includes('Saldo na trn')
  )
}

export function parseRabobank(csvText) {
  const lines = parseCsvText(csvText, ',')
  if (lines.length < 2) return null
  const headers = lines[0]
  if (!isRabobank(headers)) return null
  const idx = name => headers.indexOf(name)

  return lines.slice(1).map((row, i) => {
    const g = name => (row[idx(name)] ?? '').trim()
    const { bedrag, type } = parseBedragKomma(g('Bedrag'))
    const beschrijving = [g('Omschrijving-1'), g('Omschrijving-2'), g('Omschrijving-3')]
      .filter(s => s.length > 0).join(' ')
    return makeTx({
      datum:        g('Datum'),
      bedrag,
      type,
      winkel:       g('Naam tegenpartij'),
      beschrijving,
    }, i)
  }).filter(tx => tx.bedrag > 0)
}
