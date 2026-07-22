// ─── Analyse-engine filterhulpfuncties ───
// Periode- en configfilters gedeeld door GroupChartEngine en TrendChartEngine.

export function filterPeriode(transactions, period) {
  return transactions.filter(t => {
    const d = new Date(t.datum)
    if (period.modus === 'maand')
      return d.getFullYear() === period.jaar && d.getMonth() === period.maand
    if (period.modus === 'kwartaal')
      return d.getFullYear() === period.jaar && Math.floor(d.getMonth() / 3) === period.kwartaal
    return d.getFullYear() === period.jaar
  })
}

export function filterByConfig(transactions, filters = {}) {
  const { type, soort = [], categorie = [], wie = [] } = filters
  return transactions.filter(t => {
    if (type && type !== 'Beide' && t.type !== type) return false
    if (soort.length > 0 && !soort.includes(t.soort)) return false
    if (categorie.length > 0 && !categorie.includes(t.categorie)) return false
    if (wie.length > 0 && !wie.includes(t.wie)) return false
    return true
  })
}

// Kleurenreeks los van CATEGORY_CONFIG, voor dimensies zonder vaste iconconfig
export const NEUTRAL_KEYS = ['blue', 'teal', 'violet', 'amber', 'red', 'green', 'ink3', 'blueHi']

export function neutralColor(T, index) {
  return T[NEUTRAL_KEYS[index % NEUTRAL_KEYS.length]]
}
