// ─── features.js ───
// Feature-vlaggen voor functies die (tijdelijk) volledig uit beeld zijn.

// Enable Banking-bankkoppeling staat uit beeld: productiegebruik vereist een betaald
// contract met Enable Banking met een maandelijks minimumbedrag, en dat is pas rendabel
// bij voldoende betalende gebruikers. Alle code, endpoints en database-kolommen blijven
// intact en werkend — zet deze op true om de UI-ingangen weer terug te zetten.
export const BANK_KOPPELING_ACTIEF = false

const ADMIN_KEY = 'webfinance_admin_unlocked'

// Bankkoppeling blijft zichtbaar met admin ontgrendeld (zelfde localStorage-check als
// SettingsAdmin/SettingsAbout/useFeedback), zodat Ronald kan blijven testen zonder
// BANK_KOPPELING_ACTIEF om te zetten.
export function bankKoppelingZichtbaar() {
  return BANK_KOPPELING_ACTIEF || localStorage.getItem(ADMIN_KEY) === 'true'
}
