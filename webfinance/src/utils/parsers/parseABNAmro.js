// ─── ABN AMRO TXT/CSV parser ───
// Tab-gescheiden, geen headers — vaste kolomvolgorde

import { parseCsvText, parseBedragPunt, parseDate8, makeTx } from './helpers'

function extractWinkel(omschrijving) {
  const s = omschrijving.trim()
  const beaGea = s.match(/(?:BEA|GEA)[^\s]*\s+(.*?)(?:\s{2,}|\s*,|$)/)
  if (beaGea) return beaGea[1].trim()
  const slashIdx = s.indexOf('/')
  if (slashIdx > 1) return s.slice(0, slashIdx).trim()
  return s.slice(0, 50).trim()
}

export function isABNAmro(csvText) {
  const firstLine = csvText.trim().split(/\r?\n/)[0]
  const cols = firstLine.split('\t')
  return cols.length >= 7 && /^NL\d/.test(cols[0].trim())
}

export function parseABNAmro(csvText) {
  // Kolommen: [0] Rekeningnummer, [1] Munt, [2] Transactiedatum,
  //           [3] Beginsaldo, [4] Eindsaldo, [5] Rentedatum, [6] Bedrag, [7] Omschrijving
  const lines = parseCsvText(csvText, '\t')
  if (lines.length < 1) return null

  return lines.map((row, i) => {
    const g = pos => (row[pos] ?? '').trim()
    const omschrijving = g(7)
    const { bedrag, type } = parseBedragPunt(g(6))
    return makeTx({
      datum:        parseDate8(g(2)),
      bedrag,
      type,
      winkel:       extractWinkel(omschrijving),
      beschrijving: omschrijving,
    }, i)
  }).filter(tx => tx.bedrag > 0)
}
