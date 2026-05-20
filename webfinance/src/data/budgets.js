// ─── Budget sample data ───
// Standaard budget-instellingen en spaardoelen voor de Budgetten pagina.

export const sampleBudgets = [
  {
    id: 'budget_1',
    categorie: 'Wonen',
    subcategorieBudgetten: {
      'Huur / Hypotheek': 2400,
      'Gas / Water / Licht': 350,
      'Verzekeringen (woning)': 100,
    },
    totaalBudget: 2850,
  },
  {
    id: 'budget_2',
    categorie: 'Dagelijks leven',
    subcategorieBudgetten: {
      'Boodschappen': 200,
      'Horeca & Afhaal': 60,
      'Verzorging & Huishouden': 40,
    },
    totaalBudget: 300,
  },
  {
    id: 'budget_3',
    categorie: 'Abonnementen & Telecom',
    subcategorieBudgetten: {
      'Streaming': 20,
      'Internet & TV': 40,
    },
    totaalBudget: 60,
  },
  {
    id: 'budget_4',
    categorie: 'Vrije tijd',
    subcategorieBudgetten: {},
    totaalBudget: 200,
  },
  {
    id: 'budget_5',
    categorie: 'Vervoer',
    subcategorieBudgetten: {},
    totaalBudget: 150,
  },
]

export const sampleSpaardoelen = [
  { id: 'doel_1', naam: 'Vakantie 2026', doelbedrag: 3000, huidigBedrag: 0, deadline: 'aug 2026' },
  { id: 'doel_2', naam: 'Keuken', doelbedrag: 15000, huidigBedrag: 0, deadline: null },
]
