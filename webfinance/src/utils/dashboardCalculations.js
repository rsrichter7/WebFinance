// ─── Dashboard berekeningen ───
// Vrij besteedbaar, sparklines, saldo-verloop, komende afschrijvingen, verdeling.
// Periode-gebonden functies accepteren startDatum/eindDatum ('YYYY-MM-DD') i.p.v. maand/jaar.

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

/**
 * Saldo-verloop: cumulatief saldo per dag van startDatum t/m min(eindDatum, vandaag).
 * Zelfde uitkomst als voorheen bij start=1e en eind=laatste dag van de maand.
 */
export function saldoVerloopPeriode(transactions, startsaldo, startDatum, eindDatum) {
  const nu = new Date(); nu.setHours(0, 0, 0, 0)
  const saldoBedrag  = startsaldo?.bedrag ?? 0
  const saldoVanaf   = startsaldo?.datum  ?? null

  // Cumulatief saldo vóór de periode
  let saldoVoorStart = saldoBedrag
  for (const t of transactions) {
    if (saldoVanaf && t.datum < saldoVanaf) continue
    if (t.datum >= startDatum) continue
    saldoVoorStart += t.type === 'Inkomst' ? t.bedrag : -t.bedrag
  }

  const vandaagStr = `${nu.getFullYear()}-${String(nu.getMonth() + 1).padStart(2, '0')}-${String(nu.getDate()).padStart(2, '0')}`
  const maxDatum   = eindDatum < vandaagStr ? eindDatum : vandaagStr

  const result = []
  let saldo = saldoVoorStart
  const d   = new Date(startDatum + 'T00:00:00')
  const max = new Date(maxDatum   + 'T00:00:00')

  while (d <= max) {
    const ds = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    for (const t of transactions) {
      if (t.datum !== ds) continue
      if (saldoVanaf && t.datum < saldoVanaf) continue
      saldo += t.type === 'Inkomst' ? t.bedrag : -t.bedrag
    }
    result.push(saldo)
    d.setDate(d.getDate() + 1)
  }
  return result
}

/** Frequentie (frontend-veldnaam: herhaling) omrekenen naar maandbedrag. */
function naarMaandbedrag(bedrag, herhaling) {
  switch (herhaling) {
    case 'Maandelijks': return bedrag
    case 'Jaarlijks':   return bedrag / 12
    case 'Kwartaal':    return bedrag / 3
    case 'Wekelijks':   return bedrag * 4.33
    default:            return bedrag
  }
}

/**
 * Vrij te besteden in periode [startDatum, eindDatum].
 * Verwachte inkomsten/lasten = maandbedragen uit vaste lasten (één periode ≈ één maand).
 * Variabele uitgaven = handmatige/import uitgaven in het datumbereik excl. Sparen.
 */
export function berekenVrijBesteedbaar(allTransactions, fixedExpenses, startDatum, eindDatum) {
  const verwachteInkomsten = (fixedExpenses || [])
    .filter(f => f.type === 'Inkomst')
    .reduce((sum, f) => sum + naarMaandbedrag(f.bedrag, f.herhaling), 0)

  const verwachteVasteLasten = (fixedExpenses || [])
    .filter(f => f.type === 'Uitgave')
    .reduce((sum, f) => sum + naarMaandbedrag(f.bedrag, f.herhaling), 0)

  const variabeleUitgaven = (allTransactions || [])
    .filter(t =>
      t.type === 'Uitgave'
      && t.bron !== 'auto'
      && t.soort !== 'Sparen'
      && t.datum >= startDatum
      && t.datum <= eindDatum
    )
    .reduce((sum, t) => sum + t.bedrag, 0)

  return verwachteInkomsten - verwachteVasteLasten - variabeleUitgaven
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

/** Verdeling per persoon in periode [startDatum, eindDatum]: betaald vs eerlijk deel, GZ gelijk gesplitst. */
export function verdelingPerPersoon(transactions, persons, settings, startDatum, eindDatum) {
  if (!persons || persons.length < 2) return null
  const periodeTx = transactions.filter(t =>
    t.datum >= startDatum && t.datum <= eindDatum && t.type === 'Uitgave'
  )
  const totaal = periodeTx.reduce((s, t) => s + t.bedrag, 0)
  const perPersoon = {}
  for (const p of persons) perPersoon[p.initialen] = { naam: p.naam, kleur: p.kleur, betaald: 0, eerlijkDeel: 0 }

  for (const tx of periodeTx) {
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
