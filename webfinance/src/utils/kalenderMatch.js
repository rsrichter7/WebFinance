// ─── Kalender: match verwacht vs. werkelijk ───
// Bepaalt of een verwachte vaste last al gedekt is door een echte transactie,
// met speling op datum en bedrag (banken boeken op andere dagen / licht andere bedragen).

const DAG_MS = 86400000

// Tolerantie op één plek instelbaar
export const MATCH_CONFIG = {
  dagenGekoppeld:  10,    // directe koppeling via vaste_last_id: ruime speling
  dagenHeuristiek: 5,     // match op bedrag + naam: krappere speling
  dagenWekelijks:  3,     // wekelijkse items altijd krap
  bedragProcent:   0.05,  // 5% bedragsverschil toegestaan
  bedragMinimum:   1,     // of minimaal 1 euro absoluut (voor kleine bedragen)
}

// Zet transacties om naar een platte lijst met epoch-tijd voor snelle vergelijking
export function maakActualsIndex(allTransactions) {
  return (allTransactions || []).map(tx => ({
    vasteLast: tx.vasteLast ?? null,
    amount:    tx.bedrag,
    name:      (tx.beschrijving || '').toLowerCase(),
    winkel:    (tx.winkel || '').toLowerCase(),
    income:    tx.type === 'Inkomst',
    tijd:      new Date((tx.datum || '') + 'T00:00:00').getTime(),
  }))
}

// Is deze verwachte vaste last (exp) op datumStr al betaald?
export function isVerwachtGedekt(exp, datumStr, actuals) {
  const verwachtTijd = new Date(datumStr + 'T00:00:00').getTime()
  const wekelijks = exp.herhaling === 'Wekelijks'
  const vensterGekoppeld  = wekelijks ? MATCH_CONFIG.dagenWekelijks : MATCH_CONFIG.dagenGekoppeld
  const vensterHeuristiek = wekelijks ? MATCH_CONFIG.dagenWekelijks : MATCH_CONFIG.dagenHeuristiek
  const bedragMarge = Math.max(Math.abs(exp.amount) * MATCH_CONFIG.bedragProcent, MATCH_CONFIG.bedragMinimum)
  const expNaam   = (exp.name || '').toLowerCase()
  const expWinkel = (exp.winkel || '').toLowerCase()

  for (const a of actuals) {
    if (a.income !== exp.income) continue
    const dagen = Math.abs(a.tijd - verwachtTijd) / DAG_MS
    // 1. Directe koppeling via vaste_last_id — sterkste signaal, ruime speling
    if (a.vasteLast === exp.id && dagen <= vensterGekoppeld) return true
    // 2. Heuristiek: bedrag binnen marge + naam of winkel komt overeen
    if (dagen <= vensterHeuristiek && Math.abs(a.amount - exp.amount) <= bedragMarge) {
      const naamMatch   = expNaam   && a.name   && (a.name.includes(expNaam) || expNaam.includes(a.name))
      const winkelMatch = expWinkel && a.winkel && (a.winkel.includes(expWinkel) || expWinkel.includes(a.winkel))
      if (naamMatch || winkelMatch) return true
    }
  }
  return false
}
