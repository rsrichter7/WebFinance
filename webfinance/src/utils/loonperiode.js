// ─── Loonperiode helper ───
// Berekent periode-grenzen op basis van salarisdatums + loon_dag instelling.

const SALARIS_CAT = 'Financieel'
const SALARIS_SUB = 'Salaris / Inkomsten'
const MAANDEN_KORT = ['jan','feb','mrt','apr','mei','jun','jul','aug','sep','okt','nov','dec']

function toDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

// Weekend-gecorrigeerde projectie: als loon_dag op za/zo valt → vrijdag ervoor
function projeceerGrens(jaar, maand, loonDag) {
  const maxDag = new Date(jaar, maand, 0).getDate()
  const dag = Math.min(loonDag, maxDag)
  const d = new Date(jaar, maand - 1, dag)
  const dow = d.getDay()
  if (dow === 0) d.setDate(d.getDate() - 2) // zondag → vrijdag
  if (dow === 6) d.setDate(d.getDate() - 1) // zaterdag → vrijdag
  return toDateStr(d)
}

export function kortLabel(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getDate()} ${MAANDEN_KORT[d.getMonth()]}`
}

/**
 * Berekent geordende lijst van periodes { start, eind, label }.
 * Voor maanden met salaris: grens = datum dichtst bij loon_dag (bij gelijkspel → vroegste).
 * Voor maanden zonder salaris: projecteer op loon_dag (weekend → vrijdag ervoor).
 * Overrides uit localStorage overschrijven de detectie.
 */
export function getLoonPeriodes(allTransactions, loonDag, overrides = {}) {
  const salarisTransacties = (allTransactions || []).filter(t =>
    t.type === 'Inkomst' && t.categorie === SALARIS_CAT && t.subcategorie === SALARIS_SUB
  )

  const byMaand = {}
  for (const t of salarisTransacties) {
    const key = t.datum.slice(0, 7)
    if (!byMaand[key]) byMaand[key] = []
    byMaand[key].push(t.datum)
  }

  const nu = new Date()
  const salarisManths = Object.keys(byMaand).sort()

  // Start: vroegste salarisdatum of 12 maanden geleden
  let startYM
  if (salarisManths.length > 0) {
    startYM = salarisManths[0]
  } else {
    const d = new Date(nu.getFullYear(), nu.getMonth() - 11, 1)
    startYM = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  }

  // Eind: 2 maanden vooruit
  const eindD = new Date(nu.getFullYear(), nu.getMonth() + 2, 1)
  const eindYM = `${eindD.getFullYear()}-${String(eindD.getMonth() + 1).padStart(2, '0')}`

  // Bouw maandrange
  const maanden = []
  let [y, m] = startYM.split('-').map(Number)
  const [ey, em] = eindYM.split('-').map(Number)
  while (y < ey || (y === ey && m <= em)) {
    maanden.push({ jaar: y, maand: m, key: `${y}-${String(m).padStart(2, '0')}` })
    m++; if (m > 12) { m = 1; y++ }
  }

  // Bepaal grens per maand
  const grenzen = maanden.map(({ jaar, maand, key }) => {
    if (overrides[key]) return overrides[key]
    if (byMaand[key]) {
      // Dichtst bij loon_dag; bij gelijkspel → vroegste datum
      let best = null, minDist = Infinity
      for (const d of byMaand[key]) {
        const dag = parseInt(d.slice(8, 10))
        const dist = Math.abs(dag - loonDag)
        if (dist < minDist || (dist === minDist && d < best)) {
          minDist = dist; best = d
        }
      }
      return best
    }
    return projeceerGrens(jaar, maand, loonDag)
  })

  grenzen.sort()
  const unique = [...new Set(grenzen)]

  // Bouw periodes
  const periodes = []
  for (let i = 0; i < unique.length - 1; i++) {
    const start = unique[i]
    const eind  = addDays(unique[i + 1], -1)
    periodes.push({ start, eind, label: `${kortLabel(start)} – ${kortLabel(eind)}` })
  }
  return periodes
}

/**
 * Geeft de periode op basis van offset (0 = huidige, -1 = vorige, …).
 * Retourneert null als er geen periodes zijn.
 */
export function getLoonPeriodeByOffset(allTransactions, loonDag, offset = 0, overrides = {}) {
  const periodes = getLoonPeriodes(allTransactions, loonDag, overrides)
  if (periodes.length === 0) return null

  const vandaag = toDateStr(new Date())
  let idx = periodes.findIndex(p => p.start <= vandaag && p.eind >= vandaag)
  if (idx === -1) idx = periodes.length - 1

  const target = Math.max(0, Math.min(periodes.length - 1, idx + offset))
  return periodes[target]
}
