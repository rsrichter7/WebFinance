// ─── Vaste Lasten ───
// Voorbeelddata voor terugkerende kosten en inkomsten.

export const SAMPLE_VASTE_LASTEN = [
  { id: 1, omschrijving: 'Hypotheek',            bedrag: 2318.83, herhaling: 'Maandelijks', categorie: 'Wonen',                  sub: 'Huur / Hypotheek',  type: 'Uitgave',  winkel: 'WH Holding',   startdatum: '2026-04-15' },
  { id: 2, omschrijving: 'Essent Gas/Energie',    bedrag: 331,     herhaling: 'Maandelijks', categorie: 'Wonen',                  sub: 'Gas / Water / Licht', type: 'Uitgave', winkel: 'Essent',       startdatum: '2026-04-07' },
  { id: 3, omschrijving: 'Water',                 bedrag: 20,      herhaling: 'Maandelijks', categorie: 'Wonen',                  sub: 'Gas / Water / Licht', type: 'Uitgave', winkel: 'Vitens NV',    startdatum: '2026-04-18' },
  { id: 4, omschrijving: 'TV en internet',         bedrag: 38.50,   herhaling: 'Maandelijks', categorie: 'Abonnementen & Telecom', sub: 'Internet & TV',     type: 'Uitgave',  winkel: 'Odido',        startdatum: '2026-04-15' },
  { id: 5, omschrijving: 'Netflix',               bedrag: 3.99,    herhaling: 'Maandelijks', categorie: 'Abonnementen & Telecom', sub: 'Streaming',         type: 'Uitgave',  winkel: 'Netflix',      startdatum: '2026-04-14' },
  { id: 6, omschrijving: 'Bankkosten',            bedrag: 3.45,    herhaling: 'Maandelijks', categorie: 'Abonnementen & Telecom', sub: 'Bankkosten',        type: 'Uitgave',  winkel: 'Rabobank',     startdatum: '2026-03-20' },
  { id: 7, omschrijving: 'Bankkosten extra pas',  bedrag: 1.20,    herhaling: 'Maandelijks', categorie: 'Abonnementen & Telecom', sub: 'Bankkosten',        type: 'Uitgave',  winkel: 'Rabobank',     startdatum: '2026-03-20' },
  { id: 8, omschrijving: 'Bijdrage Anne',         bedrag: 1600,    herhaling: 'Maandelijks', categorie: 'Financieel',             sub: 'Salaris / Inkomsten', type: 'Inkomst', winkel: '—',            startdatum: '2026-04-13' },
  { id: 9, omschrijving: 'Bijdrage Ronald',       bedrag: 1600,    herhaling: 'Maandelijks', categorie: 'Financieel',             sub: 'Salaris / Inkomsten', type: 'Inkomst', winkel: '—',            startdatum: '2026-04-13' },
]

export const SAMPLE_SPAARDOELEN = [
  { id: 1, doel: 'Vakantie 2026', streefbedrag: 3000,  huidig: 0, deadline: 'aug 2026' },
  { id: 2, doel: 'Keuken',        streefbedrag: 15000, huidig: 0, deadline: null },
]
