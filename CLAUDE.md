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
│   ├── sidebar/Sidebar.jsx     → Navigatie sidebar (inklapbaar, premium-bewust)
│   ├── transactions/           → Transactie componenten
│   │   ├── TransactionTopBar.jsx
│   │   ├── TransactionFilters.jsx   (bevat CustomDropdown + CategoryDropdown; gebruikt useProfiles)
│   │   ├── TransactionTable.jsx     (WieAvatar + potlood/prullenbak acties per rij; gebruikt useProfiles)
│   │   └── TransactionForm.jsx      (wie-knoppen via useProfiles; ondersteunt toevoeg- én bewerk-modus)
│   ├── fixed/                  → Vaste lasten componenten
│   │   ├── FixedTopBar.jsx
│   │   ├── FixedStats.jsx           (StatCards + MiniDonut)
│   │   ├── FixedCategoryGroup.jsx   (gegroepeerde tabel per categorie)
│   │   ├── FixedForm.jsx            (slide-in formulier, createPortal; wie-knoppen via useProfiles)
│   │   └── FixedLoanSection.jsx     (placeholder)
│   ├── budgets/                → Budget componenten
│   │   ├── BudgetTopBar.jsx         (titel + maandselector)
│   │   ├── BudgetStats.jsx          (3 StatCards)
│   │   ├── BudgetRuleSection.jsx    (50/30/20 kaarten + modus-toggle)
│   │   ├── BudgetCategoryTable.jsx  (inline bewerken, overflow: 'visible')
│   │   ├── BudgetSavingsGoals.jsx   (spaardoelen met storten)
│   │   └── BudgetForm.jsx           (niet actief in gebruik)
│   ├── analytics/              → Analyse componenten
│   │   ├── AnalyticsTopBar.jsx      (titel "Analyse", geen subtitel)
│   │   ├── AnalyticsPeriodFilter.jsx (herbruikbare Maand/Kwartaal/Jaar pills + pijltjes)
│   │   ├── AnalyticsChartCard.jsx   (Card wrapper + periode-filter + drag handle)
│   │   ├── AnalyticsTopCategories.jsx   (horizontale bars per categorie)
│   │   ├── AnalyticsTopSubcategories.jsx (top 10 subcategorieën)
│   │   ├── AnalyticsSoortDonut.jsx  (donut Noodzaak/Wens/Sparen + 50/30/20 doellijnen)
│   │   ├── AnalyticsIncomeExpense.jsx   (twee-lijnen SVG: inkomsten vs uitgaven)
│   │   └── AnalyticsPremiumSection.jsx  (ghost widgets + blur/lock overlay)
│   ├── calendar/               → Kalender componenten (premium pagina)
│   │   ├── CalendarTopBar.jsx       (maand/week toggle + view-filter pills)
│   │   ├── CalendarMonthNav.jsx     (pijltjes + maandlabel, gecentreerd boven grid)
│   │   ├── CalendarGrid.jsx         (7-koloms maandgrid + buildDayMap export)
│   │   ├── CalendarDayCell.jsx      (dagcel met kleurcodering)
│   │   ├── CalendarWeekView.jsx     (weekweergave dag-voor-dag + getMondayOfWeek export)
│   │   ├── CalendarDayDetail.jsx    (detailpaneel 280px: verwacht + werkelijk per dag)
│   │   ├── CalendarStats.jsx        (3 StatCards: verwacht/werkelijk/verschil)
│   │   └── CalendarLegend.jsx       (legenda rechts)
│   ├── dashboard/              → Dashboard componenten (landingspagina)
│   │   ├── DashboardTopBar.jsx      (dynamische begroeting + maandselector + transactie-knop)
│   │   ├── DashboardStatCards.jsx   (3 kaarten: inkomsten/uitgaven/huidig saldo + trends)
│   │   ├── DashboardCategoryDonut.jsx (donut chart uitgaven per categorie + legenda)
│   │   ├── DashboardYearChart.jsx   (staafdiagram inkomsten vs uitgaven, filtert op jaar)
│   │   ├── DashboardSavingsGoals.jsx (spaardoelen met voortgangsbalken)
│   │   ├── DashboardRecentTx.jsx    (laatste 5 transacties; Avatar gebruikt useProfiles)
│   │   ├── DashboardCostSplit.jsx   (kostenverdeling: gemKosten, bijdrage, betaald, verschil + ratio/50-50 toggle)
│   │   ├── DashboardIncomeModal.jsx (pop-up modal voor netto inkomen per persoon; exporteert loadNettoInkomen)
│   │   └── DashboardRuleScore.jsx   (50/30/20 voortgangsbalken)
│   └── settings/               → Instellingen componenten
│       ├── SettingsTopBar.jsx       (paginatitel)
│       ├── SettingsSidebar.jsx      (eigen sidebar met 8 secties incl. Huishouden en Saldo)
│       ├── SettingsHousehold.jsx    (profielbeheer: toevoegen/bewerken/verwijderen; kleurpicker)
│       ├── SettingsProfile.jsx      (profielgegevens — lokaal opgeslagen)
│       ├── SettingsSaldo.jsx        (startsaldo instellen: bedrag + peildatum)
│       ├── SettingsPreferences.jsx  (datumformaat, thema — werkend opgeslagen)
│       ├── SettingsCategories.jsx   (categorieën toevoegen/verwijderen — werkend)
│       ├── SettingsDataManagement.jsx (export JSON/CSV, import JSON, wis alles — werkend)
│       ├── SettingsNotifications.jsx  (placeholder — vereist account)
│       ├── SettingsAbout.jsx        (over Webfinance + easter egg voor admin)
│       └── SettingsAdmin.jsx        (verborgen sectie: premium toggle, diagnostiek)
│
├── pages/                      → Eén bestand per pagina (max 100 regels)
│   ├── DashboardPage.jsx       (werkend — landingspagina)
│   ├── TransactionsPage.jsx    (werkend — incl. bewerk-modus)
│   ├── AnalyticsPage.jsx       (werkend)
│   ├── BudgetsPage.jsx         (werkend)
│   ├── FixedPage.jsx           (werkend)
│   ├── SettingsPage.jsx        (werkend)
│   └── CalendarPage.jsx        (werkend — premium only)
│
├── layouts/MainLayout.jsx      → Sidebar + content wrapper
├── hooks/
│   ├── useTransactions.js      → Alle transactie state & logica (incl. updateTransaction)
│   ├── useFixedExpenses.js     → Alle vaste lasten state & logica
│   ├── useBudgets.js           → Alle budget state & logica
│   ├── usePremium.js           → Centrale premium-status (leest/schrijft webfinance_premium)
│   └── useProfiles.js          → Centrale profielen hook (CRUD + helpers)
│
├── data/
│   ├── categories.js           → Categorieën + getMergedCategories() + SOORTEN (geen PERSONEN meer)
│   ├── categoryConfig.js       → Icoon- en kleurkoppeling per categorie (voor UI)
│   ├── transactions.js         → Sample transacties
│   ├── fixed.js                → Sample vaste lasten
│   └── budgets.js              → Sample budgetten en spaardoelen
│
├── styles/index.css            → Basis CSS
├── tokens.js                   → Design tokens + fmt() + fmtShort() + fmtDate()
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
11. **StatCards uniform** — op alle pagina's: groen links (inkomsten), rood midden (uitgaven), blauw rechts (saldo/balans).

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
- `useTransactions.js` — transacties (lees, filter, sorteer, toevoegen, bewerken, verwijderen)
- `useFixedExpenses.js` — vaste lasten (CRUD, auto-transacties aanmaken)
- `useBudgets.js` — budgetten en spaardoelen (berekeningen, CRUD, maand/jaar filter)
- `usePremium.js` — centrale premium-status app-breed (leest/schrijft `webfinance_premium`)
- `useProfiles.js` — centrale profielen app-breed (leest/schrijft `webfinance_profielen`)

Componenten en pagina's bevatten **geen** eigen dataloading of businesslogica.

### Pagina's zijn dun
Pagina-bestanden (max 50-100 regels) roepen alleen hooks aan en geven data door aan componenten. Alle logica zit in hooks, alle UI zit in componenten.

### Data apart
Sample data en constanten staan in `src/data/`. Elke datafile is de single source of truth voor dat type data.

### Bron-veld op transacties
Elke transactie heeft een `bron` veld:
- `'handmatig'` — door de gebruiker ingevoerd of bewerkt
- `'auto'` — automatisch aangemaakt (vaste lasten, spaardoel-stortingen)
- `'import'` — later, voor bankimport

**Bron-logica bij bewerken:** `updateTransaction()` zet de bron altijd naar `'handmatig'`, ook als de originele bron `'auto'` of `'import'` was. De `vasteLast` property (koppeling naar vaste last) blijft behouden — die link is nog steeds waardevol voor kalender-matching.

### Spaardoelen
`huidigBedrag` wordt **berekend** uit transacties met `spaardoelId` — niet opgeslagen op het spaardoel zelf. Stortingen zijn transacties (categorie: 'Financieel', sub: 'Sparen / Beleggen', soort: 'Sparen', bron: 'auto'). Bij gebruik in componenten altijd fallback naar `0` als `huidigBedrag` undefined is.

### Sorteerlogica transacties
Bij gelijke datum worden nieuwste transacties (hoogste id) eerst getoond.

### Zichtbare namen vs. code-namen
- Sidebar label **"Analyse"** — route, mapnamen en bestandsnamen blijven `analytics`
- Subtitels zijn verwijderd op alle pagina's — TopBars tonen alleen de paginatitel
- Dashboard TopBar toont een dynamische begroeting in plaats van een paginatitel

### usePremium hook (centrale premium-status)
`usePremium()` is de enige plek voor premium-status in de hele app. Geëxporteerd vanuit `src/hooks/usePremium.js`. Inschakelen via de Admin-sectie in Instellingen.

### useProfiles hook (centrale profielen)
`useProfiles()` is de enige plek voor persoonprofielen in de hele app. Geëxporteerd vanuit `src/hooks/useProfiles.js`.

**Wat het exporteert:**
- `profiles` — alle profielen inclusief GZ (Gezamenlijk)
- `persons` — alleen niet-gezamenlijke profielen (voor kostenverdeling, wie-knoppen)
- `addProfile(naam, kleur)` — voegt profiel toe met automatisch gegenereerde initialen
- `updateProfile(id, wijzigingen)` — past bestaand profiel aan
- `removeProfile(id)` — verwijdert profiel (GZ kan niet verwijderd worden)
- `getByInitialen(initialen)` — zoekt profiel op initialen, geeft `undefined` terug als niet gevonden

**Standaard profielen (bij lege localStorage):**
```javascript
{ id: 'prof_1', naam: 'Ronald Richter', initialen: 'RR', kleur: { bg: '#E0E7FF', fg: '#3730A3' }, isGezamenlijk: false }
{ id: 'prof_gz', naam: 'Gezamenlijk',   initialen: 'GZ', kleur: { bg: '#F3F4F6', fg: '#6B7280' }, isGezamenlijk: true }
```

**`genInitialen(naam)`** — genereert initialen automatisch: eerste letter voornaam + eerste letter achternaam, tussenvoegsels (de/van/der/den/ten/ter) worden overgeslagen. Maximaal 2 tekens, altijd hoofdletters.

**`PROFIEL_KLEUREN`** — 8 preset kleurobjecten `{ bg, fg }` voor de kleurpicker in `SettingsHousehold`. Kleuren passen bij het T-token palet (indigo, blue, teal, green, amber, orange, red, pink).

**GZ-splitsing in kostenverdeling:** Transacties met `wie === 'GZ'` worden gelijk verdeeld over alle `persons`. Dit geldt zowel in `DashboardCostSplit` (betaaldMap) als in toekomstige berekeningen.

**Gebruik in componenten:**
- `TransactionForm` — wie-knoppen via `profiles.map(...)`, initiële wie = eerste `persons[0]`
- `TransactionFilters` — wie dropdown via `profiles.map(...)`
- `TransactionTable` (WieAvatar) — kleur opzoeken via `getByInitialen`, grijs als niet gevonden
- `FixedForm` — wie-knoppen via `profiles.map(...)`, standaard wie = `'GZ'`
- `DashboardRecentTx` (Avatar) — kleur opzoeken via `getByInitialen`
- `DashboardCostSplit` — persoonblokken via `persons`
- `DashboardIncomeModal` — inkomensvelden via `persons`
- `SettingsHousehold` — volledig CRUD-beheer van profielen

### useTransactions hook — updateTransaction
`updateTransaction(id, updatedFields)` is de enige plek voor het bewerken van transacties:
- Mergt `updatedFields` over de bestaande transactie
- Zet `bron` altijd naar `'handmatig'` (ook als origineel `'auto'` of `'import'`)
- Bewaart de `vasteLast` property als die aanwezig is
- Slaat op naar localStorage

### fmtDate — datum formatteren
`fmtDate(dateStr)` in `tokens.js` formatteert datums op basis van de instelling in `webfinance_datumformaat`:
- `'long'` → `8 mei 2026` (standaard)
- `'dmy'`  → `08-05-2026`
- `'iso'`  → `2026-05-08`

Gebruik `fmtDate` overal waar een datum getoond wordt aan de gebruiker. Nooit zelf formatteren.

### getMergedCategories — gecombineerde categorieën
`getMergedCategories()` in `src/data/categories.js` geeft de standaard categorieën + eigen categorieën en subcategorieën uit localStorage (`webfinance_custom_categories`) samengevoegd terug. Gebruik dit overal waar categorieën getoond of gekozen worden (`TransactionForm`, `TransactionFilters`, `FixedForm`).

**Let op:** `PERSONEN` is volledig verwijderd uit `categories.js`. Dit bestand exporteert nu alleen `CATEGORIES`, `getMergedCategories` en `SOORTEN`.

### Dashboard architectuur
Dashboard is de landingspagina (`/`). `DashboardPage.jsx` roept hooks aan en berekent maand-gefilterde data als `useMemo`. De widgets staan in twee kolommen, drie rijen:
- Rij 1: `DashboardCostSplit` | `DashboardYearChart`
- Rij 2: `DashboardSavingsGoals` | `DashboardRecentTx`
- Rij 3: `DashboardCategoryDonut` | `DashboardRuleScore`

De maandselector in de TopBar stuurt alle widgets tegelijk bij. Het staafdiagram filtert op het geselecteerde **jaar** (niet maand). Recente transacties zijn altijd ongefilterd op maand.

**Huidig saldo berekening:** `DashboardPage` leest `webfinance_startsaldo` uit localStorage (`{ bedrag, datum }`). Het huidig saldo = startsaldo + alle inkomsten − alle uitgaven vanaf de peildatum. Dit is maand-onafhankelijk. Als geen startsaldo is ingesteld, wordt saldo berekend over alle transacties.

### Dashboard StatCards
`DashboardStatCards` toont altijd **3 kaarten** in vaste volgorde en kleuren:
- **Groen links** — Inkomsten (geselecteerde maand)
- **Rood midden** — Uitgaven (geselecteerde maand)
- **Blauw rechts** — Huidig saldo (maand-onafhankelijk, op basis van startsaldo)

Elke kaart toont een trend-badge (% vs vorige maand). Dit patroon — groen/rood/blauw — is uniform op alle pagina's (Transacties, Budgetten, Kalender, Vaste Lasten).

### Startsaldo (SettingsSaldo)
`SettingsSaldo.jsx` in Instellingen → Saldo stelt het startsaldo in:
- Slaat `{ bedrag: number, datum: 'YYYY-MM-DD' }` op in `webfinance_startsaldo`
- `DashboardPage` leest dit en berekent huidig saldo relatief aan de peildatum
- Instelling is optioneel: zonder startsaldo telt het dashboard alle transacties mee

### Kostenverdeling widget
`DashboardCostSplit` is volledig zelfvoorzienend: het leest eigen localStorage-state en accepteert alleen `allTransactions` als prop. De inkomen-modal en methode-toggle zijn intern beheerd.

`DashboardCostSplit` berekent per persoon:
- **Gemiddelde maandkosten** — totale uitgaven / unieke maanden met minstens 1 uitgave
- **Bijdrage** — aandeel op basis van inkomenratio (methode=`ratio`) of gelijke verdeling (methode=`50/50`)
- **Betaald** — gemiddeld per maand betaald, GZ-transacties gelijk gesplitst over `persons`
- **Verschil** — betaald − bijdrage; badge toont `▲ te veel` (rood) of `▼ te weinig` (groen)

Inkomen per persoon wordt opgeslagen in `webfinance_kostenverdeeld_inkomen` via `DashboardIncomeModal`. Als er geen inkomen ingesteld is, toont de widget een lege state met "Inkomen instellen" knop.

### TransactionForm — bewerk-modus
`TransactionForm` ondersteunt twee modi via de `editingTransaction` prop:

| Prop | Modus | Gedrag |
|------|-------|--------|
| `editingTransaction = null` | Nieuw | Leeg formulier, "Nieuwe transactie", "Opslaan en volgende" zichtbaar |
| `editingTransaction = { ...tx }` | Bewerken | Velden ingevuld, "Transactie bewerken", "Opslaan en volgende" verborgen |

Bij opslaan in bewerk-modus: roept `onUpdate(id, velden)` aan. Bij nieuw: roept `onSave(velden)` aan. Het `bron` veld wordt niet getoond — de hook regelt de bron automatisch.

### Kalender architectuur
`CalendarPage.jsx` is premium-only: niet-premium gebruikers zien een blur/lock overlay. De pagina combineert `useTransactions` (`allTransactions`) en `useFixedExpenses` voor verwachte vs. werkelijke items. `buildDayMap` en `getMondayOfWeek` zijn named exports uit hun respectieve componenten en worden hergebruikt in `CalendarPage`. Maandnavigatie staat gecentreerd boven het kalender grid.

### Sidebar premium-logica
De sidebar reageert op `usePremium()`:
- PREMIUM badge bij Kalender verborgen als `isPremium === true`
- "Upgrade naar Premium" blok verborgen als `isPremium === true`
- Profiel-chip toont "PREMIUM" (blauw) of "GRATIS" (grijs) op basis van `isPremium`

---

## 6. LocalStorage keys

| Key | Inhoud |
|-----|--------|
| `"webfinance_transactions"` | Alle transacties (handmatig + auto + stortingen) |
| `"webfinance_startsaldo"` | `{ bedrag: number, datum: 'YYYY-MM-DD' }` — peildatum + beginsaldo voor saldo-berekening |
| `"webfinance_fixed"` | Vaste lasten items |
| `"webfinance_budgets"` | Categorie-budgetten |
| `"webfinance_spaardoelen"` | Spaardoelen (zonder huidigBedrag) |
| `"webfinance_budget_modus"` | `'50/30/20'` of `'handmatig'` |
| `"webfinance_budget_verdeling"` | Aangepaste percentages `{ noodzaak, wens, sparen }` |
| `"webfinance_analytics_order"` | Volgorde van de vier grafiek-cards op de Analyse pagina |
| `"webfinance_premium"` | Boolean — premium-status (beheerd via `usePremium` hook) |
| `"webfinance_datumformaat"` | `'long'` \| `'dmy'` \| `'iso'` — datumweergave app-breed |
| `"webfinance_custom_categories"` | `{ customSubs: {}, customCats: [] }` — eigen categorieën |
| `"webfinance_taal"` | Taalvoorkeur (nu alleen `'nl'`) |
| `"webfinance_theme"` | `'light'` \| `'dark'` (dark mode styling nog niet actief) |
| `"webfinance_admin_unlocked"` | Boolean — admin-sectie ontgrendeld via easter egg |
| `"webfinance_profielen"` | Array van profielobjecten — beheerd via `useProfiles` hook |
| `"webfinance_kostenverdeeld_inkomen"` | `{ [initialen]: number }` — netto maandinkomen per persoon (kostenverdeling) |
| `"webfinance_verdeel_methode"` | `'ratio'` \| `'50/50'` — methode voor kostenverdeling |
| `"webfinance_profiel"` | `{ naam, email }` — profielgegevens (SettingsProfile) |

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
- **Transacties pagina** — volledig werkend:
  - Zoeken, filteren, sorteren, toevoegen, verwijderen, auto-badge
  - **Bewerken** — potlood-icoon per rij opent TransactionForm in bewerk-modus; alle velden bewerkbaar; bron wordt automatisch `'handmatig'`
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
  - Drag handle zichtbaar voor alle gebruikers; alleen Premium kan daadwerkelijk slepen (via `usePremium`)
  - Sidebar label is "Analyse" (bestandsnamen en route blijven `analytics`)
  - Subtitels verwijderd op alle pagina's (ook BudgetTopBar)
- **Instellingen pagina** — volledig werkend:
  - Eigen sidebar met 8 secties + verborgen Admin-sectie
  - **Profiel** — naam en e-mail, lokaal opgeslagen
  - **Huishouden** — profielen toevoegen/bewerken/verwijderen; kleurpicker (8 presets); `genInitialen` voor auto-initialen; GZ-profiel kan niet verwijderd worden
  - **Saldo** — startsaldo instellen met peildatum; `webfinance_startsaldo`; Dashboard gebruikt dit voor huidig saldo berekening
  - **Voorkeuren** — datumformaat (3 opties), thema-toggle; opgeslagen in localStorage; `fmtDate()` in `tokens.js` past dit app-breed toe
  - **Categorieën** — eigen subcategorieën toevoegen aan standaard categorieën; eigen hoofdcategorieën aanmaken en verwijderen; opgeslagen in `webfinance_custom_categories`; `getMergedCategories()` maakt custom categorieën beschikbaar app-breed
  - **Data beheer** — export JSON, export CSV (transacties), import JSON, wis alles (TYPE 'DELETE' bevestiging) — volledig werkend
  - **Notificaties** — placeholder (vereist account)
  - **Over Webfinance** — credits + easter egg: 5x klikken op versienummer ontgrendelt Admin-sectie
  - **Admin** (verborgen) — Premium aan/uit via `usePremium()` hook, diagnostiek, admin vergrendelen
- **Kalender pagina** — volledig werkend (premium-only):
  - Blur/lock overlay voor niet-premium gebruikers (via `usePremium()`)
  - Maandweergave: 7-koloms grid (ma-zo), kleurcodering dagcellen (rood bij hoge uitgaven, groen bij inkomsten)
  - Weekweergave: dag-voor-dag detailkaarten, toggle via pills in TopBar
  - View-filter pills: Verwacht / Werkelijk / Beide
  - Detailpaneel rechts (280px): verwachte + werkelijke items per dag + "+ Toevoegen" knop
  - "+ Toevoegen" opent bestaand `TransactionForm` met datum vooringevuld (via `createPortal`)
  - Verwachte items: vaste lasten uit `useFixedExpenses`, geprojecteerd op de juiste dag
  - Werkelijke items: alle transacties uit `useTransactions` (`allTransactions`)
  - Matching: vinkje bij verwachte items die betaald zijn (vasteLast ID match)
  - StatCards onderaan: Verwachte uitgaven, Werkelijke uitgaven, Verschil
  - Legenda-paneel rechts; maandnavigatie gecentreerd boven grid
  - Componenten in `src/components/calendar/` (8 bestanden)
- **Dashboard pagina** — volledig werkend (landingspagina):
  - Dynamische begroeting in TopBar op basis van tijdstip (Goedemorgen/Goedemiddag/Goedenavond, Ronald)
  - Maandselector met pijltjes in TopBar — alle widgets filteren mee op geselecteerde maand
  - "+ Transactie" knop opent `TransactionForm` slide-in via `createPortal`
  - 3 StatCards: Inkomsten (groen), Uitgaven (rood), Huidig Saldo (blauw) — met trend vs vorige maand
  - Huidig saldo = startsaldo + inkomsten − uitgaven vanaf peildatum (maand-onafhankelijk)
  - Kostenverdeling: gemKosten, bijdrage per persoon op basis van inkomenratio of 50/50, verschil; inkomen instellen via modal
  - Maandoverzicht: staafdiagram inkomsten (teal) vs uitgaven (rood) per maand — filtert op **jaar**
  - Spaardoelen: voortgangsbalken, `huidigBedrag` berekend uit transacties, "+ Doel" navigeert naar `/budgetten`
  - Recente transacties: laatste 5, altijd ongefilterd op geselecteerde maand
  - Uitgaven per categorie: donut chart (SVG) + legenda rechts
  - 50/30/20 score: Noodzaak/Wens/Sparen voortgangsbalken, respecteert handmatige modus via `actieveVerdeling`
  - Componenten in `src/components/dashboard/` (9 bestanden incl. DashboardIncomeModal)
- **Profielensysteem** — volledig werkend:
  - `useProfiles` hook als centrale single source of truth voor alle profielen
  - `PERSONEN` hardcoded array volledig verwijderd uit het systeem (was in `categories.js`)
  - Dynamische wie-knoppen in `TransactionForm`, `TransactionFilters`, `FixedForm`
  - WieAvatar in `TransactionTable` en `DashboardRecentTx` dynamisch op kleur
  - Profielbeheer in `SettingsHousehold` (secties in `SettingsSidebar`)
- **Premium sidebar logica** — volledig werkend:
  - PREMIUM badge bij Kalender verborgen voor premium gebruikers
  - "Upgrade naar Premium" blok verborgen voor premium gebruikers
  - Profiel-chip toont "PREMIUM" (blauw) of "GRATIS" (grijs) op basis van `isPremium`

### 🔮 Volgende stap
- **Supabase migratie** — database (PostgreSQL), authenticatie (email/wachtwoord), multi-user ondersteuning; vervangt LocalStorage als persistence laag

### 🔮 Later (niet nu)
- Leningen (placeholder bestaat al in FixedLoanSection)
- Paginering in transactietabel
- Dark mode (thema-toggle bestaat al, styling nog niet actief)
- Notificaties (vereist account)
- Bankimport, AI-categorisering
- Vercel hosting

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
