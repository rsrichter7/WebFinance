// ─── CSV Parser — bankdetectie + parsing + hulpfuncties ───
// detectBank, parseCSV, markDuplicates, matchFixedExpenses

import { parseRabobank, isRabobank }    from './parsers/parseRabobank'
import { parseING, isING }              from './parsers/parseING'
import { parseABNAmro, isABNAmro }      from './parsers/parseABNAmro'
import { parseVolksbank, isVolksbank }  from './parsers/parseVolksbank'
import { parseBunq, isBunq }            from './parsers/parseBunq'
import { parseKnab, isKnab }            from './parsers/parseKnab'
import { parseTriodos, isTriodos }      from './parsers/parseTriodos'
import { parseRevolut, isRevolut }      from './parsers/parseRevolut'

export const BANK_LABELS = {
  rabobank:  'Rabobank',
  ing:       'ING',
  abn_amro:  'ABN AMRO',
  volksbank: 'SNS / ASN / RegioBank',
  bunq:      'bunq',
  knab:      'Knab',
  triodos:   'Triodos Bank',
  revolut:   'Revolut',
}

function getHeaders(firstLine, delimiter) {
  return firstLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, ''))
}

export function detectBank(csvText) {
  const firstLine = csvText.trim().split(/\r?\n/)[0]

  // ABN AMRO: tab-gescheiden, geen headers, eerste kolom is IBAN
  if (isABNAmro(csvText)) return 'abn_amro'

  const semiCount  = (firstLine.match(/;/g) || []).length
  const commaCount = (firstLine.match(/,/g) || []).length
  const delimiter  = semiCount > commaCount ? ';' : ','
  const headers    = getHeaders(firstLine, delimiter)

  // ING: puntkomma-gescheiden, "Af Bij" + "Mutatiesoort"
  if (delimiter === ';' && isING(headers)) return 'ing'

  // bunq: komma of puntkomma, "Rentedatum"/"Interest Date" + "Tegenpartij"/"Counterparty"
  if (isBunq(headers)) return 'bunq'

  // Revolut: "Started Date", "Completed Date", "State"
  if (isRevolut(headers)) return 'revolut'

  // Volksbank (ASN/SNS/RegioBank): "Boekingsdatum", "Opdrachtgeversrekening", "Naam tegenrekening"
  if (isVolksbank(headers)) return 'volksbank'

  // Knab: "CreditDebit", "Tegenrekeninghouder", "Betaalwijze"
  if (isKnab(headers)) return 'knab'

  // Triodos: komma-gescheiden, zelfde kolommen als ING maar zonder "Saldo na mutatie"
  if (delimiter === ',' && isTriodos(headers)) return 'triodos'

  // Rabobank: "Naam tegenpartij", "Volgnr", "Saldo na trn"
  if (isRabobank(headers)) return 'rabobank'

  return null
}

export function parseCSV(csvText) {
  const clean = csvText.trim().replace(/^﻿/, '')
  const bank  = detectBank(clean)

  if (!bank) {
    return {
      bank: null, bankLabel: null, transactions: [],
      error: 'CSV-formaat niet herkend. Controleer of het bestand van een ondersteunde bank afkomstig is.',
    }
  }

  const parsers = {
    rabobank:  parseRabobank,
    ing:       parseING,
    abn_amro:  parseABNAmro,
    volksbank: parseVolksbank,
    bunq:      parseBunq,
    knab:      parseKnab,
    triodos:   parseTriodos,
    revolut:   parseRevolut,
  }

  const transactions = parsers[bank]?.(clean) ?? []
  const bankLabel    = BANK_LABELS[bank]

  if (!transactions || transactions.length === 0) {
    return { bank, bankLabel, transactions: [], error: `${bankLabel} bestand herkend maar geen transacties gevonden.` }
  }

  return { bank, bankLabel, transactions, error: null }
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

// fixedItems: rijen uit Supabase (kolom 'naam')
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
