// ─── Vaste lasten detectie ───
// Pure analysefuncties: herkent terugkerende uitgaven in transactiegeschiedenis
// en zet ze om naar suggesties voor vaste lasten. Geen React, geen side-effects.

const RITMES = [
  { naam: 'Wekelijks', min: 6, max: 8 },
  { naam: 'Maandelijks', min: 26, max: 35 },
  { naam: 'Kwartaal', min: 85, max: 95 },
  { naam: 'Jaarlijks', min: 350, max: 380 },
]

function normaliseerSleutel(tekst) {
  return (tekst || '')
    .toLowerCase()
    .replace(/[0-9]/g, '')
    .replace(/[^\p{L}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function mediaan(getallen) {
  const sorted = [...getallen].sort((a, b) => a - b)
  const mid = Math.floor(sorted.length / 2)
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid]
}

function meestVoorkomend(waarden) {
  const telling = {}
  let beste = null, besteAantal = 0
  for (const w of waarden) {
    if (w === undefined || w === null || w === '') continue
    telling[w] = (telling[w] || 0) + 1
    if (telling[w] > besteAantal) { beste = w; besteAantal = telling[w] }
  }
  return beste
}

function bepaalRitme(datums) {
  const gesorteerd = [...datums].sort()
  const intervallen = []
  for (let i = 1; i < gesorteerd.length; i++) {
    const dagen = (new Date(gesorteerd[i]) - new Date(gesorteerd[i - 1])) / 86400000
    intervallen.push(dagen)
  }
  if (intervallen.length === 0) return null
  const midden = mediaan(intervallen)
  const match = RITMES.find(r => midden >= r.min && midden <= r.max)
  return match ? match.naam : null
}

function bedragStabiel(bedragen) {
  const midden = mediaan(bedragen)
  if (midden === 0) return null
  const binnenMarge = bedragen.filter(b => Math.abs(b - midden) / Math.abs(midden) <= 0.15)
  if (binnenMarge.length / bedragen.length < 0.7) return null
  return midden
}

function bestaandeMatch(sleutel, bestaandeItems) {
  return (bestaandeItems || []).some(item => {
    const itemSleutel = normaliseerSleutel(item.winkel) || normaliseerSleutel(item.omschrijving)
    if (!itemSleutel) return false
    return itemSleutel.includes(sleutel) || sleutel.includes(itemSleutel)
  })
}

/** Herkent terugkerende uitgaven en geeft maximaal 6 suggesties terug. */
export function detecteerVasteLasten(allTransactions, bestaandeItems, genegeerdeKeys) {
  const nu = new Date()
  const grens = new Date(nu.getFullYear(), nu.getMonth() - 12, nu.getDate())
  const grensStr = grens.toISOString().split('T')[0]

  const kandidaten = (allTransactions || []).filter(t =>
    t.type === 'Uitgave' && t.vasteLast === null && t.datum >= grensStr
  )

  const groepen = {}
  for (const t of kandidaten) {
    const sleutel = normaliseerSleutel(t.winkel) || normaliseerSleutel(t.beschrijving)
    if (!sleutel) continue
    if (!groepen[sleutel]) groepen[sleutel] = []
    groepen[sleutel].push(t)
  }

  const suggesties = []

  for (const [sleutel, txs] of Object.entries(groepen)) {
    if ((genegeerdeKeys || []).includes(sleutel)) continue

    const maanden = new Set(txs.map(t => t.datum.slice(0, 7)))
    if (txs.length < 3 || maanden.size < 3) continue

    const herhaling = bepaalRitme(txs.map(t => t.datum))
    if (!herhaling) continue

    const bedrag = bedragStabiel(txs.map(t => t.bedrag))
    if (bedrag === null) continue

    if (bestaandeMatch(sleutel, bestaandeItems)) continue

    const afschrijfdag = meestVoorkomend(txs.map(t => new Date(t.datum + 'T00:00:00').getDate()))
    const categorie = meestVoorkomend(txs.map(t => t.categorie)) || 'Overig'
    const sub = meestVoorkomend(txs.map(t => t.subcategorie)) || ''
    const soort = meestVoorkomend(txs.map(t => t.soort)) || 'Noodzaak'
    const wie = meestVoorkomend(txs.map(t => t.wie)) || 'GZ'
    const omschrijving = meestVoorkomend(txs.map(t => t.winkel)) || meestVoorkomend(txs.map(t => t.beschrijving)) || sleutel

    const gesorteerdOpDatum = [...txs].sort((a, b) => b.datum.localeCompare(a.datum))

    suggesties.push({
      key: sleutel,
      omschrijving,
      bedrag,
      herhaling,
      afschrijfdag,
      categorie,
      sub,
      soort,
      wie,
      type: 'Uitgave',
      aantal: txs.length,
      laatsteDatum: gesorteerdOpDatum[0].datum,
    })
  }

  return suggesties.sort((a, b) => b.aantal - a.aantal).slice(0, 6)
}
