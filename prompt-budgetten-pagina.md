# Opdracht: Bouw de Budgetten pagina

Lees eerst CLAUDE.md voor de volledige projectcontext, stijlgids en coderegels.

---

## Wat we bouwen

De Budgetten pagina — de volgende pagina op de roadmap. Het design staat hieronder beschreven. De pagina volgt het 50/30/20 budgetteringsprincipe en toont budgetvoortgang per categorie plus spaardoelen.

---

## Benodigde bestanden

### Nieuw aan te maken:

```
src/hooks/useBudgets.js              → Alle budget state & logica
src/components/budgets/BudgetTopBar.jsx       → Paginatitel + "Budget instellen" knop
src/components/budgets/BudgetStats.jsx        → 3 StatCards bovenaan
src/components/budgets/BudgetRuleSection.jsx  → 50/30/20 regel sectie
src/components/budgets/BudgetCategoryTable.jsx → Tabel met budget per categorie
src/components/budgets/BudgetSavingsGoals.jsx → Spaardoelen sectie
```

### Te wijzigen:

```
src/pages/BudgetsPage.jsx  → Van placeholder naar werkende pagina (roept bovenstaande componenten aan)
```

### NIET wijzigen:
Alle andere bestanden. Geen wijzigingen aan tokens.js, Card.jsx, Icons.jsx, App.jsx, sidebar, of andere pagina's.

---

## Hook: useBudgets.js

Dit is de ENIGE plek voor budget state en logica. LocalStorage key: `"webfinance_budgets"`.

### Data die de hook beheert:

**Budget-instellingen per categorie:**
```js
{
  id: 'budget_1',
  categorie: 'Wonen',               // Hoofdcategorie uit categories.js
  subcategorieBudgetten: {           // Optioneel: budget per subcategorie
    'Huur / Hypotheek': 2400,
    'Gas / Water / Licht': 350,
    'Verzekeringen': 100,
  },
  totaalBudget: 2850,               // Som van subcategorie-budgetten
}
```

**Spaardoelen:**
```js
{
  id: 'doel_1',
  naam: 'Vakantie 2026',
  doelbedrag: 3000,
  huidigBedrag: 0,
  deadline: 'aug 2026',             // Optioneel
}
```

**Budget-modus:** `'50/30/20'` of `'handmatig'` (opgeslagen in localStorage)

### Logica in de hook:

1. **Berekening "besteed"** — haalt transacties op uit `useTransactions` en berekent per categorie/subcategorie hoeveel er besteed is in de geselecteerde maand
2. **50/30/20 berekening** — berekent budgetten op basis van totaal netto inkomen:
   - Inkomen = som van alle transacties met type 'Inkomst' in de huidige maand
   - Noodzaak = 50% van inkomen
   - Wens = 30% van inkomen
   - Sparen = 20% van inkomen
3. **CRUD spaardoelen** — toevoegen, verwijderen, bedrag storten
4. **CRUD categorie-budgetten** — toevoegen, verwijderen, aanpassen (voor handmatige modus)
5. **Maand/jaar filter** — standaard huidige maand, aanpasbaar

### Wat de hook returnt:
```js
{
  // State
  budgetModus,            // '50/30/20' of 'handmatig'
  categorieBudgetten,     // Array van budget-objecten
  spaardoelen,            // Array van spaardoel-objecten
  geselecteerdeMaand,     // { maand: 5, jaar: 2026 }

  // Berekende waarden
  totaalBudget,           // Totaal beschikbaar budget
  totaalBesteed,          // Totaal besteed deze maand
  totaalResterend,        // Budget - besteed
  regelVerdeling,         // { noodzaak: { budget, besteed }, wens: {...}, sparen: {...} }
  categorieOverzicht,     // Per categorie: { budget, besteed, pct, subs: [...] }

  // Acties
  setBudgetModus,
  voegBudgetToe,
  verwijderBudget,
  wijzigBudget,
  voegSpaardoelToe,
  verwijderSpaardoel,
  stortOpSpaardoel,
  setGeselecteerdeMaand,
}
```

**Belangrijk:** De hook importeert `useTransactions` om de werkelijke uitgaven per categorie te berekenen. Het `soort`-veld op transacties en vaste lasten ('Noodzaak', 'Wens', 'Sparen') bepaalt in welke 50/30/20 categorie een uitgave valt.

---

## Componenten

### 1. BudgetTopBar.jsx (~30 regels)
- Titel: "Budgetten"
- Subtitel: "Beheer je budgetten en spaardoelen · [maand] [jaar]"
- Rechts: blauwe knop "Budget instellen" met plus-icoon
- Zelfde stijl als FixedTopBar en TransactionTopBar

### 2. BudgetStats.jsx (~30 regels)
- 3 StatCards in een grid (1fr 1fr 1fr, gap 16)
- "Totaal budget" → kleur T.ink (met accent='blue' op de bovenborder)
- "Totaal besteed" → kleur T.red (accent='red')
- "Totaal resterend" → kleur T.green (accent='green')
- Gebruik de bestaande `StatCard` component uit `Card.jsx`

### 3. BudgetRuleSection.jsx (~120 regels)
Toont de 50/30/20 regel met drie kaarten:

- **Header:** Titel "50 / 30 / 20 regel" + subtitel met netto inkomen + toggle 50/30/20 vs Handmatig
- **Drie kaarten** (Noodzaak, Wens, Sparen), elk met:
  - Icoon in gekleurde cirkel (Noodzaak=blauw/home, Wens=violet/coffee, Sparen=teal/piggy)
  - Naam + percentage + PctBadge rechts
  - Korte beschrijving
  - ProgressBar (kleur op basis van percentage: <60% groen, <80% amber, ≥80% rood)
  - Onderaan: Besteed / Budget / Resterend

**ProgressBar en PctBadge** → maak deze als kleine hulpcomponenten IN dit bestand (ze zijn specifiek voor budgetten en worden nergens anders gebruikt). Of, als ze al bestaan in Card.jsx, gebruik die.

**Let op:** Check of ProgressBar en PctBadge al in Card.jsx staan. Zo niet, voeg ze toe aan Card.jsx als gedeelde componenten zodat BudgetCategoryTable ze ook kan gebruiken.

### 4. BudgetCategoryTable.jsx (~150 regels)
Tabel met budget per categorie:

- **Card** zonder padding (padding: 0, overflow: 'hidden')
- **Header:** "Budget per categorie" + subtitel
- **Tabelkop:** Categorie | Budget | Besteed | Voortgang | Status | (edit)
- **Rijen per categorie:**
  - Icoon + naam uit categoryConfig.js
  - Budget en besteed bedragen
  - ProgressBar
  - PctBadge
  - Edit-icoontje
  - Klikbaar: expanded/collapsed state voor subcategorieën
- **Subcategorie-rijen:** ingesprongen, lichtere achtergrond (T.cardAlt)
- **Onderaan:** "Budget toevoegen" link met plus-icoon

Grid layout: `gridTemplateColumns: '1fr 120px 120px 200px 100px 40px'`

### 5. BudgetSavingsGoals.jsx (~80 regels)
Spaardoelen sectie:

- **Card** met header: piggy-icoon + "Spaardoelen" + knop "Spaardoel toevoegen"
- **Per spaardoel:**
  - Target-icoon + naam + optionele deadline badge
  - Bedragen: huidig / doel + "Storten" knop
  - Blauwe progress bar + percentage

---

## Design details uit het meegestuurde ontwerp

### Kleuren en stijlen (gebruik T-tokens):
- Progress bar kleuren: <60% = groen, 60-80% = amber, ≥80% = rood
- PctBadge: zelfde kleurlogica, als kleine badge met percentage
- Spaardoelen progress bar: altijd T.blue
- Categorie-iconen en kleuren: uit `src/data/categoryConfig.js`

### Spacing:
- Content padding: 28px
- Gap tussen secties: 24px
- Card padding: 22px (standaard), 18px voor compactere secties
- StatCards grid gap: 16px

---

## Sample data

Voeg sample budget-data toe aan `src/data/budgets.js`:

```js
// Standaard budget-instellingen (sample data)
export const sampleBudgets = [
  {
    id: 'budget_1',
    categorie: 'Wonen',
    subcategorieBudgetten: {
      'Huur / Hypotheek': 2400,
      'Gas / Water / Licht': 350,
      'Verzekeringen': 100,
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
];

export const sampleSpaardoelen = [
  { id: 'doel_1', naam: 'Vakantie 2026', doelbedrag: 3000, huidigBedrag: 0, deadline: 'aug 2026' },
  { id: 'doel_2', naam: 'Keuken', doelbedrag: 15000, huidigBedrag: 0, deadline: null },
];
```

---

## Wat NIET doen

- Geen nieuwe npm packages installeren
- Geen wijzigingen aan bestaande pagina's (Transacties, Vaste Lasten)
- Geen wijzigingen aan tokens.js, App.jsx, Sidebar, MainLayout
- Geen hardcoded kleuren — gebruik T-tokens
- Geen hardcoded bedragen in componenten — alle data via de hook
- Geen CSS-modules, Tailwind of styled-components
- Geen TypeScript
- Geen console.log in de uiteindelijke code

---

## Checklist voor oplevering

- [ ] `useBudgets.js` hook werkt met localStorage
- [ ] Hook berekent besteed-bedragen uit transacties via `useTransactions`
- [ ] 50/30/20 verdeling werkt op basis van `soort`-veld ('Noodzaak', 'Wens', 'Sparen')
- [ ] Alle 5 componenten aangemaakt in `src/components/budgets/`
- [ ] `BudgetsPage.jsx` bijgewerkt (dun, max 50-60 regels)
- [ ] Sample data in `src/data/budgets.js`
- [ ] Categorie-iconen en kleuren komen uit `categoryConfig.js`
- [ ] Alle bedragen geformatteerd met `fmt()` uit tokens.js
- [ ] Alle bedragen hebben `...TAB` style
- [ ] Progress bars en badges werken met kleurlogica
- [ ] Subcategorieën zijn in/uitklapbaar
- [ ] Geen enkel bestand langer dan 200 regels
- [ ] Geen console.log in de code
- [ ] Pagina rendert zonder errors
