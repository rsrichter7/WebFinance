// ─── Vaste lasten: verwachte transactiedatums ───
// Bepaalt welke datums een vaste last hoort te hebben t/m vandaag (nooit toekomst),
// met backfill vanaf aanmaak. Gebruikt door useFixedExpenses voor auto-transacties.

const MAX_TERUGKIJK_MAANDEN = 24

function pad(n) { return String(n).padStart(2, '0') }

// Lokale datum → 'YYYY-MM-DD' (geen UTC-verschuiving)
export function localISO(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

function dagInMaand(jaar, maandIndex, gewensteDag) {
  const maxDag = new Date(jaar, maandIndex + 1, 0).getDate()
  return Math.min(gewensteDag || 1, maxDag)
}

// Periode-sleutel: transacties in dezelfde periode gelden als 'al aanwezig'
export function periodeKey(datumStr, herhaling) {
  const [j, m] = datumStr.split('-').map(Number)
  if (herhaling === 'Jaarlijks') return `${j}`
  if (herhaling === 'Kwartaal')  return `${j}-K${Math.floor((m - 1) / 3)}`
  if (herhaling === 'Wekelijks') return datumStr
  return `${j}-${pad(m)}`
}

// Alle verwachte datums vanaf aanmaak t/m vandaag (nooit in de toekomst)
export function berekenVerwachteDatums(item, todayStr) {
  const dag = item.afschrijfdag ?? 1
  const startBron = new Date(item.createdAt || item.startdatum || todayStr)
  const horizon = new Date()
  horizon.setMonth(horizon.getMonth() - MAX_TERUGKIJK_MAANDEN)
  const start = startBron > horizon ? startBron : horizon
  const dates = []
  let safety = 0

  if (item.herhaling === 'Wekelijks') {
    const cur = new Date(item.startdatum || item.createdAt || todayStr)
    const startStr = localISO(start)
    while (safety++ < 400) {
      const ds = localISO(cur)
      if (ds > todayStr) break
      if (ds >= startStr) dates.push(ds)
      cur.setDate(cur.getDate() + 7)
    }
    return dates
  }

  const stap = item.herhaling === 'Kwartaal' ? 3 : item.herhaling === 'Jaarlijks' ? 12 : 1
  let jaar = start.getFullYear()
  let maand = start.getMonth()
  while (safety++ < 400) {
    const d = dagInMaand(jaar, maand, dag)
    const ds = `${jaar}-${pad(maand + 1)}-${pad(d)}`
    if (ds > todayStr) break
    dates.push(ds)
    maand += stap
    while (maand > 11) { maand -= 12; jaar++ }
  }
  return dates
}
