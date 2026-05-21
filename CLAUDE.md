# Webfinance — Projectdocumentatie voor Claude Code

---

## 1. Project overzicht

Een persoonlijke financiële webapp (SaaS) gebouwd met React. Geïnspireerd door Stripe Dashboard, Linear en Notion. Desktop-first, later uitbreidbaar naar mobiel.

**Eigenaar:** Ronald Richter — bouwt dit samen met Claude. Ronald beslist, Claude voert uit.

**GitHub:** `https://github.com/rsrichter7/WebFinance`
React-code zit in de `webfinance/` submap binnen de repo.

---

## 2. Tech stack

- React 18 + Vite + React Router
- Inline styles met design tokens (T-object uit `src/tokens.js`)
- Lettertype: Inter (Google Fonts) met tabular-nums voor bedragen
- Geen Tailwind, geen TypeScript, geen Redux
- Data: LocalStorage (later Supabase)
- Hosting: nog niet live (later Vercel)

---

## 3. Mappenstructuur

```
src/
├── components/
│   ├── ui/Card.jsx             → Herbruikbare UI (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
│   ├── ui/Icons.jsx            → Alle iconen (Lucide-stijl, ICONS object)
│   ├── ui/DatePicker.jsx       → Custom datumkiezer (kalenderweergave)
│   ├── sidebar/Sidebar.jsx     → Navigatie sidebar (inklapbaar)
│   ├── transactions/           → Transactie componenten
│   │   ├── TransactionTopBar.jsx
│   │   ├── TransactionFilters.jsx   (bevat CustomDropdown + CategoryDropdown)
│   │   ├── TransactionTable.jsx
│   │   └── TransactionForm.jsx
│   ├── fixed/                  → Vaste lasten componenten
│   │   ├── FixedTopBar.jsx
│   │   ├── FixedStats.jsx           (StatCards + MiniDonut)
│   │   ├── FixedCategoryGroup.jsx   (gegroepeerde tabel per categorie)
│   │   ├── FixedForm.jsx            (slide-in formulier, gebruikt createPortal)
│   │   └── FixedLoanSection.jsx     (placeholder)
│   ├── budgets/                → Budget componenten
│   │   ├── BudgetTopBar.jsx         (titel + maandselector)
│   │   ├── BudgetStats.jsx          (3 StatCards)
│   │   ├── BudgetRuleSection.jsx    (50/30/20 kaarten + modus-toggle)
│   │   ├── BudgetCategoryTable.jsx  (inline bewerken, overflow: 'visible')
│   │   ├── BudgetSavingsGoals.jsx   (spaardoelen met storten)
│   │   └── BudgetForm.jsx           (niet actief in gebruik)
│   └── analytics/              → Analyse componenten
│       ├── AnalyticsTopBar.jsx      (titel "Analyse", geen subtitel)
│       ├── AnalyticsPeriodFilter.jsx (herbruikbare Maand/Kwartaal/Jaar pills + pijltjes)
│       ├── AnalyticsChartCard.jsx   (Card wrapper + periode-filter + drag handle)
│       ├── AnalyticsTopCategories.jsx   (horizontale bars per categorie)
│       ├── AnalyticsTopSubcategories.jsx (top 10 subcategorieën)
│       ├── AnalyticsSoortDonut.jsx  (donut Noodzaak/Wens/Sparen + 50/30/20 doellijnen)
│       ├── AnalyticsIncomeExpense.jsx   (twee-lijnen SVG: inkomsten vs uitgaven)
│       └── AnalyticsPremiumSection.jsx  (ghost widgets + blur/lock overlay)
│
├── pages/                      → Eén bestand per pagina (max 100 regels)
│   ├── DashboardPage.jsx       (placeholder)
│   ├── TransactionsPage.jsx    (werkend)
│   ├── AnalyticsPage.jsx       (werkend)
│   ├── BudgetsPage.jsx         (werkend)
│   ├── FixedPage.jsx           (werkend)
│   ├── CalendarPage.jsx        (placeholder)
│   └── SettingsPage.jsx        (placeholder)
│
├── layouts/MainLayout.jsx      → Sidebar + content wrapper
├── hooks/
│   ├── useTransactions.js      → Alle transactie state & logica
│   ├── useFixedExpenses.js     → Alle vaste lasten state & logica
│   └── useBudgets.js           → Alle budget state & logica
│
├── data/
│   ├── categories.js           → Categorieën, subcategorieën, soorten, personen
│   ├── categoryConfig.js       → Icoon- en kleurkoppeling per categorie (voor UI)
│   ├── transactions.js         → Sample transacties
│   ├── fixed.js                → Sample vaste lasten
│   └── budgets.js              → Sample budgetten en spaardoelen
│
├── styles/index.css            → Basis CSS
├── tokens.js                   → Design tokens (kleuren, formatting)
└── App.jsx                     → Routing
```

---

## 4. Conventies

### Designregels

1. **Kleuren en tokens** — gebruik ALTIJD de T-tokens uit `src/tokens.js`. Schrijf nooit hardcoded kleuren zoals `'#2563EB'`. Schrijf `T.blue`.
2. **Styling** — inline styles met het T-object. Geen CSS-modules, geen Tailwind, geen styled-components.
3. **Lettertype** — Inter voor alles. Bedragen altijd met `...TAB` (tabular-nums) style.
4. **Formattering** — gebruik `fmt()` en `fmtShort()` uit `tokens.js` voor alle bedragen. Nooit zelf formatteren.
5. **Iconen** — gebruik alleen iconen uit `src/components/ui/Icons.jsx`. Voeg nieuwe iconen daar toe.
6. **Componenten** — herbruikbare UI-elementen staan in `src/components/ui/Card.jsx`. Gebruik deze, maak geen duplicaten.
7. **Schaduwen** — alleen `T.shadow`. Geen eigen schaduwen.
8. **Border radius** — 12px voor kaarten, 8px voor knoppen en inputs, 4-6px voor badges.
9. **Spacing** — padding 22px in kaarten, 28px voor pagina-content, 16-20px gaps in grids.
10. **Geen felle kleuren in tabellen** — subtiele iconen (↑/↓) voor bedragen, geen rood/groen bombardement.

### Coderegels

1. **Kleine bestanden** — elk bestand maximaal 150-200 regels. Langer? Splits op.
2. **Eén component per bestand** — tenzij het een heel klein hulpcomponent is.
3. **Duidelijke namen** — `TransactionTable.jsx`, niet `Table2.jsx` of `TxTblFinal.jsx`.
4. **Mappenstructuur** — pagina-specifieke componenten in hun eigen map. Gedeelde componenten in `src/components/ui/`.
5. **Data apart** — alle data en constanten in `src/data/`. Nooit hardcoded data in componenten.
6. **Comments in het Nederlands** — korte beschrijving bovenaan elk bestand. WAT, niet HOE.
7. **Imports** — altijd React eerst, dan libraries, dan eigen componenten, dan data/tokens.
8. **Export** — `export default` voor hoofdcomponenten, named exports voor hulpcomponenten.
9. **State** — `useState` voor lokale state, Context API als meerdere componenten dezelfde data nodig hebben. Geen Redux.
10. **Geen console.log** — verwijder debug-code voordat je code presenteert.

---

## 5. Architectuur

### Hooks als single source of truth
Elke domein heeft zijn eigen hook die de **enige** plek is voor state en logica:
- `useTransactions.js` — transacties (lees, filter, sorteer, toevoegen, verwijderen)
- `useFixedExpenses.js` — vaste lasten (CRUD, auto-transacties aanmaken)
- `useBudgets.js` — budgetten en spaardoelen (berekeningen, CRUD, maand/jaar filter)

Componenten en pagina's bevatten **geen** eigen dataloading of businesslogica.

### Pagina's zijn dun
Pagina-bestanden (max 50-100 regels) roepen alleen hooks aan en geven data door aan componenten. Alle logica zit in hooks, alle UI zit in componenten.

### Data apart
Sample data en constanten staan in `src/data/`. Elke datafile is de single source of truth voor dat type data.

### Bron-veld op transacties
Elke transactie heeft een `bron` veld:
- `'handmatig'` — door de gebruiker ingevoerd
- `'auto'` — automatisch aangemaakt (vaste lasten, spaardoel-stortingen)
- `'import'` — later, voor bankimport

### Spaardoelen
`huidigBedrag` wordt **berekend** uit transacties met `spaardoelId` — niet opgeslagen op het spaardoel zelf. Stortingen zijn transacties (categorie: 'Financieel', sub: 'Sparen / Beleggen', soort: 'Sparen', bron: 'auto').

### Sorteerlogica transacties
Bij gelijke datum worden nieuwste transacties (hoogste id) eerst getoond.

### Zichtbare namen vs. code-namen
- Sidebar label **"Analyse"** — route, mapnamen en bestandsnamen blijven `analytics`
- Subtitels zijn verwijderd op alle pagina's — TopBars tonen alleen de paginatitel

### IS_PREMIUM vlag (tijdelijk)
`IS_PREMIUM = false` bovenaan `AnalyticsPage.jsx` regelt drag-and-drop van grafieken. Bij het bouwen van de **Instellingen pagina** wordt dit vervangen door een centrale `usePremium` hook die app-breed werkt.

---

## 6. LocalStorage keys

| Key | Inhoud |
|-----|--------|
| `"webfinance_transactions"` | Alle transacties (handmatig + auto + stortingen) |
| `"webfinance_fixed"` | Vaste lasten items |
| `"webfinance_budgets"` | Categorie-budgetten |
| `"webfinance_spaardoelen"` | Spaardoelen (zonder huidigBedrag) |
| `"webfinance_budget_modus"` | `'50/30/20'` of `'handmatig'` |
| `"webfinance_budget_verdeling"` | Aangepaste percentages `{ noodzaak, wens, sparen }` |
| `"webfinance_analytics_order"` | Volgorde van de vier grafiek-cards op de Analyse pagina |

---

## 7. Known issues

### Overflow hidden
Cards en containers met `overflow: 'hidden'` veroorzaken twee soorten problemen:

1. **Slide-in formulieren niet zichtbaar** — fix: gebruik `createPortal(... , document.body)` uit `react-dom`
2. **Tabelinhoud of dropdowns afgeknipt** — fix: `overflow: 'visible'` op de Card

Dit probleem is opgetreden bij Vaste Lasten én Budgetten. Bij nieuwe componenten altijd controleren:
- Slide-in formulieren → `createPortal`
- Cards met tabellen of dropdowns → `overflow: 'visible'`

---

## 8. Huidige status

### ✅ Afgerond
- Fundament: tokens, componenten, sidebar, routing, MainLayout
- **Transacties pagina** — volledig werkend (zoeken, filteren, sorteren, toevoegen, verwijderen, auto-badge)
- **Vaste Lasten pagina** — volledig werkend (CRUD, auto-transacties, donut chart, leningen placeholder)
- **Budgetten pagina** — volledig werkend (50/30/20, handmatige modus, categorie-tabel, spaardoelen)
- **Analyse pagina** — volledig werkend:
  - Vier grafieken in versleepbaar 2×2 grid (volgorde opgeslagen in localStorage)
  - Elke grafiek heeft eigen Maand/Kwartaal/Jaar periode-filter met navigatie-pijltjes
  - Grafiek 1: Top categorieën (horizontale bars, alle 7, kleur+icoon via categoryConfig)
  - Grafiek 2: Top subcategorieën (top 10, kleur erft van hoofdcategorie)
  - Grafiek 3: Noodzaak/Wens/Sparen donut met 50/30/20 doellijnen en afwijkingspercentage
  - Grafiek 4: Inkomsten vs Uitgaven twee-lijnen SVG grafiek
  - Premium sectie onderaan met ghost widgets en blur/lock overlay
  - Drag handle zichtbaar voor alle gebruikers; alleen Premium kan slepen (IS_PREMIUM vlag in AnalyticsPage)
  - Sidebar label is "Analyse" (bestandsnamen en route blijven `analytics`)
  - Subtitels verwijderd op alle pagina's (ook BudgetTopBar)

### 🔲 Nog te bouwen (in volgorde)
1. Instellingen pagina
2. Kalender pagina (premium)
3. Dashboard pagina (als laatste — samenvatting van alles)

### 🔮 Later
Bewerken transacties, leningen, paginering, dark mode, Supabase, login, bankimport, AI-categorisering, Vercel hosting.

---

## 9. Werkwijze

1. **Vraag eerst** — beschrijf wat je gaat bouwen en welke bestanden je aanmaakt/wijzigt. Wacht op akkoord.
2. **Eén onderdeel tegelijk** — bouw niet meerdere pagina's tegelijk.
3. **Bestaande code respecteren** — wijzig geen bestanden die niet relevant zijn voor de opdracht.
4. **Toon de structuur** — na elke wijziging, laat zien welke bestanden zijn aangemaakt of gewijzigd.
5. **Test-instructies** — geef aan wat Ronald moet doen om het resultaat te zien.

### Wat NIET doen
- Geen nieuwe npm packages installeren zonder overleg
- Geen mappenstructuur wijzigen zonder overleg
- Geen bestanden hernoemen zonder overleg
- Geen Tailwind, geen CSS-modules, geen styled-components
- Geen complexe state management (Redux, Zustand, etc.)
- Geen TypeScript
- Geen code schrijven zonder eerst akkoord te vragen

---

## Categorieën

Wonen, Vervoer, Dagelijks leven, Abonnementen & Telecom, Vrije tijd, Financieel, Overig
(zie `src/data/categories.js` voor subcategorieën)

**Subcategorie onder Financieel: 'Sparen / Beleggen'** (hernoemd van 'Sparen')

Kleuren per categorie (zie `src/data/categoryConfig.js`):
- Wonen: blue/blueSoft, icoon: home
- Vervoer: teal/tealSoft, icoon: car
- Dagelijks leven: amber/amberSoft, icoon: coffee
- Abonnementen & Telecom: violet/violetSoft, icoon: wifi
- Vrije tijd: red/redSoft, icoon: target
- Financieel: green/greenSoft, icoon: coin
- Overig: ink3/rule, icoon: grip
