// Invoervalidatie voor transactieformulieren en CSV-import

export function validateBedrag(value) {
  const n = parseFloat(value)
  if (value === '' || value === null || value === undefined)
    return { valid: false, error: 'Bedrag is verplicht' }
  if (isNaN(n))
    return { valid: false, error: 'Bedrag moet een geldig getal zijn' }
  if (n < 0)
    return { valid: false, error: 'Bedrag mag niet negatief zijn' }
  return { valid: true, error: null }
}

export function validateDatum(value) {
  if (!value)
    return { valid: false, error: 'Datum is verplicht' }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value))
    return { valid: false, error: 'Datum moet het formaat JJJJ-MM-DD hebben' }
  const d = new Date(value)
  if (isNaN(d.getTime()))
    return { valid: false, error: 'Datum is ongeldig' }
  const maxVooruit = new Date()
  maxVooruit.setFullYear(maxVooruit.getFullYear() + 1)
  if (d > maxVooruit)
    return { valid: false, error: 'Datum mag niet meer dan 1 jaar in de toekomst liggen' }
  return { valid: true, error: null }
}

export function validateTekst(value, maxLength = 500) {
  const t = (value ?? '').trim()
  if (t.length > maxLength)
    return { valid: false, error: `Tekst mag maximaal ${maxLength} tekens bevatten` }
  return { valid: true, error: null }
}

export function validateCategorie(value, allowedList) {
  if (!value)
    return { valid: false, error: 'Categorie is verplicht' }
  if (!allowedList || !allowedList.includes(value))
    return { valid: false, error: `'${value}' is geen geldige categorie` }
  return { valid: true, error: null }
}

export function validateSoort(value) {
  const toegestaan = ['Noodzaak', 'Wens', 'Sparen']
  if (!value)
    return { valid: false, error: 'Soort is verplicht' }
  if (!toegestaan.includes(value))
    return { valid: false, error: `Soort moet 'Noodzaak', 'Wens' of 'Sparen' zijn` }
  return { valid: true, error: null }
}

export function validateType(value) {
  const toegestaan = ['Inkomst', 'Uitgave']
  if (!value)
    return { valid: false, error: 'Type is verplicht' }
  if (!toegestaan.includes(value))
    return { valid: false, error: `Type moet 'Inkomst' of 'Uitgave' zijn` }
  return { valid: true, error: null }
}

export function validateWie(value, profiles) {
  if (!value)
    return { valid: false, error: 'Wie is verplicht' }
  if (!profiles || profiles.length === 0)
    return { valid: true, error: null }
  const bekende = profiles.map(p => p.initialen)
  if (!bekende.includes(value))
    return { valid: false, error: `'${value}' is geen bekende initialen` }
  return { valid: true, error: null }
}
