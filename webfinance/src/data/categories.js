// ─── Categorieën & Subcategorieën ───
// Eén bron voor alle categorieën in de hele app.

export const CATEGORIES = [
  {
    name: 'Wonen',
    subs: ['Huur / Hypotheek', 'Gas / Water / Licht', 'Gemeentelijke belastingen', 'Verzekeringen (woning)', 'Onderhoud / Verbouwing'],
  },
  {
    name: 'Vervoer',
    subs: ['Brandstof / Laden', 'Auto-onderhoud', 'Parkeren', 'Openbaar vervoer'],
  },
  {
    name: 'Dagelijks leven',
    subs: ['Boodschappen', 'Horeca & Afhaal', 'Verzorging & Huishouden'],
  },
  {
    name: 'Abonnementen & Telecom',
    subs: ['Streaming', 'Internet & TV', 'Telefoon', 'Bankkosten', 'Overige abonnementen'],
  },
  {
    name: 'Vrije tijd',
    subs: ['Vakantie', 'Shoppen', 'Sport & Hobby', 'Cadeaus', 'Uitgaan'],
  },
  {
    name: 'Financieel',
    subs: ['Salaris / Inkomsten', 'Leningen', 'Aflossing lening', 'Sparen / Beleggen', 'Onvoorzien / Buffer', 'Belastingteruggave'],
  },
  {
    name: 'Overig',
    subs: ['Overig'],
  },
]

// Gecombineerde categorieën: standaard + eigen (via param of localStorage fallback)
export function getMergedCategories(customCategories) {
  let custom = customCategories || { customSubs: {}, customCats: [] }
  if (!customCategories) {
    try { custom = { ...custom, ...JSON.parse(localStorage.getItem('webfinance_custom_categories')) } } catch {}
  }

  const merged = CATEGORIES.map(cat => ({
    ...cat,
    subs: [...cat.subs, ...(custom.customSubs[cat.name] || [])],
  }))

  const customCats = (custom.customCats || []).map(c => ({
    name: c.name,
    subs: custom.customSubs[c.name] || [],
  }))

  return [...merged, ...customCats]
}

// Soort-indeling (vervangt Vast/Variabel)
export const SOORTEN = ['Noodzaak', 'Wens', 'Sparen']
