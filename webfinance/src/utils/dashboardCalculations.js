// ─── Dashboard berekeningen ───
// Vrij besteedbaar, sparklines, saldo-verloop, komende afschrijvingen, verdeling.

/** Sparkline: laatste N maanden totaal voor 'Inkomst' of 'Uitgave'. */
export function sparklineData(transactions, type, maanden = 6) {
  const nu = new Date()
  return Array.from({ length: maanden }, (_, i) => {
    const d = new Date(nu.getFullYear(), nu.getMonth() - (maanden - 1 - i), 1)
    const m = d.getMonth() + 1
    const j = d.getFullYear()
    return transactions
      .filter(t => { const td = new Date(t.datum); return td.getMonth() + 1 === m && td.getFullYear() === j && t.type === type })
      .reduce((s, t) => s + t.bedrag, 0)
  })
}

/** Saldo-verloop: cumulatief saldo per dag in geselecteerde maand tot vandaag. */
export function saldoVerloopMaand(transactions, startsaldo, maand, jaar) {
  const nu = new Date()
  const startBedrag = startsaldo?.bedrag ?? 0
  const startDatum  = startsaldo?.datum  ?? null

  let saldoVoorMaand = startBedrag
  for (const t of transactions) {
    if (startDatum && t.datum < startDatum) continue
    const d = new Date(t.datum)
    if (d < new Date(jaar, maand - 1, 1)) {
      saldoVoorMaand += t.type === 'Inkomst' ? t.bedrag : -t.bedrag
    }
  }

  const isHuidig = maand === nu.getMonth() + 1 && jaar === nu.getFullYear()
  const maxDag   = isHuidig ? nu.getDate() : new Date(jaar, maand, 0).getDate()
  const result   = []
  let saldo      = saldoVoorMaand

  for (let dag = 1; dag <= maxDag; dag++) {
    const datumStr = `${jaar}-${String(maand).padStart(2,'0')}-${String(dag).padStart(2,'0')}`
    for (const t of transactions) {
      if (t.datum !== datumStr) continue
      if (startDatum && t.datum < startDatum) continue
      saldo += t.type === 'Inkomst' ? t.bedrag : -t.bedrag
    }
    result.push(saldo)
  }
  return result
}

/** Vrij besteedbaar = inkomsten – vaste lasten – gem. variabele uitgaven (6M). */
export function berekenVrijBesteedbaar(transactions, fixedExpenses, maand, jaar) {
  const nu = new Date()
  const inkomsten = transactions
    .filter(t => { const d = new Date(t.datum); return d.getMonth() + 1 === maand && d.getFullYear() === jaar && t.type === 'Inkomst' })
    .reduce((s, t) => s + t.bedrag, 0)

  const vasteLasten = (fixedExpenses || [])
    .filter(fe => fe.type === 'Uitgave' && fe.actief)
    .reduce((s, fe) => {
      if (fe.herhaling === 'Wekelijks')  return s + fe.bedrag * 52 / 12
      if (fe.herhaling === 'Jaarlijks')  return s + fe.bedrag / 12
      if (fe.herhaling === 'Kwartaal')   return s + fe.bedrag / 3
      return s + fe.bedrag
    }, 0)

  const maandTotalen = []
  for (let i = 1; i <= 6; i++) {
    const d = new Date(nu.getFullYear(), nu.getMonth() - i, 1)
    const m = d.getMonth() + 1
    const j = d.getFullYear()
    const som = transactions
      .filter(t => { const td = new Date(t.datum); return td.getMonth() + 1 === m && td.getFullYear() === j && t.type === 'Uitgave' && t.bron !== 'auto' && t.soort !== 'Sparen' })
      .reduce((s, t) => s + t.bedrag, 0)
    if (som > 0) maandTotalen.push(som)
  }
  const gemVariabel = maandTotalen.length > 0 ? maandTotalen.reduce((s, v) => s + v, 0) / maandTotalen.length : 0
  return inkomsten - vasteLasten - gemVariabel
}

/** Komende afschrijvingen binnen N dagen. */
export function komendeAfschrijvingen(fixedExpenses, dagen = 30) {
  const nu = new Date(); nu.setHours(0, 0, 0, 0)
  const eind = new Date(nu); eind.setDate(eind.getDate() + dagen)
  const result = []

  for (const item of (fixedExpenses || [])) {
    if (!item.actief || item.type !== 'Uitgave') continue
    const dag  = item.afschrijfdag || 1
    const base = item.startdatum ? new Date(item.startdatum) : new Date()
    const kandidaten = []

    if (item.herhaling === 'Maandelijks') {
      for (let o = 0; o <= 1; o++) {
        const d = new Date(nu.getFullYear(), nu.getMonth() + o, 1)
        kandidaten.push(new Date(d.getFullYear(), d.getMonth(), Math.min(dag, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())))
      }
    } else if (item.herhaling === 'Wekelijks') {
      let d = new Date(nu)
      while (d <= eind) { kandidaten.push(new Date(d)); d = new Date(d); d.setDate(d.getDate() + 7) }
    } else if (item.herhaling === 'Kwartaal') {
      for (let i = -4; i <= 4; i++) {
        const d = new Date(base.getFullYear(), base.getMonth() + i * 3, 1)
        kandidaten.push(new Date(d.getFullYear(), d.getMonth(), Math.min(dag, new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate())))
      }
    } else if (item.herhaling === 'Jaarlijks') {
      for (let y = nu.getFullYear() - 1; y <= nu.getFullYear() + 1; y++) {
        kandidaten.push(new Date(y, base.getMonth(), Math.min(dag, new Date(y, base.getMonth() + 1, 0).getDate())))
      }
    }

    for (const d of kandidaten) {
      if (d >= nu && d <= eind) {
        result.push({ naam: item.omschrijving, bedrag: item.bedrag, datum: d.toISOString().split('T')[0], categorie: item.categorie })
        break
      }
    }
  }
  return result.sort((a, b) => a.datum.localeCompare(b.datum))
}

/** Verdeling per persoon: betaald vs eerlijk deel, GZ gelijk gesplitst. */
export function verdelingPerPersoon(transactions, persons, settings, maand, jaar) {
  if (!persons || persons.length < 2) return null
  const maandTx = transactions.filter(t => { const d = new Date(t.datum); return d.getMonth() + 1 === maand && d.getFullYear() === jaar && t.type === 'Uitgave' })
  const totaal = maandTx.reduce((s, t) => s + t.bedrag, 0)
  const perPersoon = {}
  for (const p of persons) perPersoon[p.initialen] = { naam: p.naam, kleur: p.kleur, betaald: 0, eerlijkDeel: 0 }

  for (const tx of maandTx) {
    if (tx.wie === 'GZ') {
      const deel = tx.bedrag / persons.length
      for (const p of persons) perPersoon[p.initialen].betaald += deel
    } else if (perPersoon[tx.wie]) {
      perPersoon[tx.wie].betaald += tx.bedrag
    }
  }

  const inkRatio = settings.kosten_inkomen || {}
  const inkTotaal = Object.values(inkRatio).reduce((s, v) => s + (v || 0), 0)
  for (const p of persons) {
    if (settings.verdeel_methode === 'ratio' && inkTotaal > 0) {
      perPersoon[p.initialen].eerlijkDeel = totaal * ((inkRatio[p.initialen] || 0) / inkTotaal)
    } else {
      perPersoon[p.initialen].eerlijkDeel = totaal / persons.length
    }
  }

  const maxVerschil = Math.max(...Object.values(perPersoon).map(p => Math.abs(p.betaald - p.eerlijkDeel)))
  return { perPersoon, totaal, maxVerschil, gelijkVerdeeld: maxVerschil < 10 }
}

/** Relatief tijdstip vanuit created_at timestamp. */
export function relatiefTijdstip(createdAt) {
  const diff = Math.floor((Date.now() - new Date(createdAt || Date.now())) / 1000)
  if (diff < 120) return 'Zojuist'
  if (diff < 3600) return `${Math.floor(diff / 60)} min geleden`
  if (diff < 7200) return '1 uur geleden'
  if (diff < 86400) return `${Math.floor(diff / 3600)} uur geleden`
  if (diff < 172800) return 'Gisteren'
  return `${Math.floor(diff / 86400)} dagen geleden`
}
