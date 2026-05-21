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
    subs: ['Salaris / Inkomsten', 'Leningen', 'Sparen / Beleggen', 'Onvoorzien / Buffer', 'Belastingteruggave'],
  },
  {
    name: 'Overig',
    subs: ['Overig'],
  },
]

// Gecombineerde categorieën: standaard + eigen uit instellingen
export function getMergedCategories() {
  let custom = { customSubs: {}, customCats: [] }
  try { custom = { ...custom, ...JSON.parse(localStorage.getItem('webfinance_custom_categories')) } } catch {}

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

// Personen in het huishouden
export const PERSONEN = [
  { name: 'Ronald Richter', initials: 'RR', salary: 3138.98, color: { bg: '#E0E7FF', fg: '#3730A3' } },
  { name: 'Anne de Reus', initials: 'AM', salary: 3000, color: { bg: '#FCE7F3', fg: '#9D174D' } },
  { name: 'Gezamenlijk', initials: 'GZ', salary: 0, color: { bg: '#F0FDFA', fg: '#0D9488' } },
]
