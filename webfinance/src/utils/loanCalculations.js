// ─── Leningen berekeningen ───
// Annuitair en lineair, maandlast en aflossingsschema.

// Annuitaire maandlast: M = P * (r * (1+r)^n) / ((1+r)^n - 1)
export function annuitaireMaandlast(hoofdsom, jaarrentePct, looptijdMaanden) {
  if (jaarrentePct === 0) return hoofdsom / looptijdMaanden
  const r = jaarrentePct / 100 / 12
  const n = looptijdMaanden
  return hoofdsom * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
}

// Lineaire maandlast eerste maand: vaste aflossing + rente over volledige hoofdsom
export function lineaireMaandlastEerste(hoofdsom, jaarrentePct, looptijdMaanden) {
  const aflossing = hoofdsom / looptijdMaanden
  const renteEersteMaand = hoofdsom * (jaarrentePct / 100 / 12)
  return aflossing + renteEersteMaand
}

// Huidige maandlast op basis van huidig saldo en aflossingsvorm
export function huidigeMaandlast(lening) {
  const { aflossingsvorm, huidig_saldo, oorspronkelijk_bedrag, rente_percentage, looptijd_maanden } = lening
  if (aflossingsvorm === 'Annuitair') {
    return annuitaireMaandlast(oorspronkelijk_bedrag, rente_percentage, looptijd_maanden)
  }
  const aflossing = oorspronkelijk_bedrag / looptijd_maanden
  const rente = huidig_saldo * (rente_percentage / 100 / 12)
  return aflossing + rente
}

// Percentage al afgelost ten opzichte van het oorspronkelijk bedrag
export function percentageAfgelost(lening) {
  if (!lening.oorspronkelijk_bedrag) return 0
  const afgelost = lening.oorspronkelijk_bedrag - lening.huidig_saldo
  return (afgelost / lening.oorspronkelijk_bedrag) * 100
}

// Einddatum berekenen op basis van startdatum en looptijd in maanden
export function berekenEinddatum(startdatum, looptijdMaanden) {
  const d = new Date(startdatum)
  d.setMonth(d.getMonth() + looptijdMaanden)
  return d.toISOString().split('T')[0]
}

// Resterende maanden berekenen vanaf vandaag tot einddatum
export function resterendeMaanden(einddatum) {
  const nu = new Date()
  const eind = new Date(einddatum)
  const jaren = eind.getFullYear() - nu.getFullYear()
  const maanden = eind.getMonth() - nu.getMonth()
  return Math.max(0, jaren * 12 + maanden)
}
