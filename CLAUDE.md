# Webfinance — Projectdocumentatie voor Claude Code

---

## Wat is Webfinance?

Een persoonlijke financiële webapp (SaaS) gebouwd met React. Geïnspireerd door Stripe Dashboard, Linear en Notion. Desktop-first, later uitbreidbaar naar mobiel.

**Eigenaar:** Ronald Richter — bouwt dit samen met Claude. Ronald beslist, Claude voert uit.

**GitHub:** `https://github.com/rsrichter7/WebFinance`
React-code zit in de `webfinance/` submap binnen de repo.

**Ontwikkelomgeving:** GitHub Codespaces (primair). Claude Code geïnstalleerd met CLAUDE.md in de root.

---

## Tech stack

- React 18 + Vite + React Router
- Inline styles met design tokens (T-object uit `src/tokens.js`)
- Lettertype: Inter (Google Fonts) met tabular-nums voor bedragen
- Geen Tailwind, geen TypeScript, geen Redux
- **Backend: Supabase** (PostgreSQL database, authenticatie, RLS) — Central EU (Frankfurt)
- `.env` met `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` (staat in `.gitignore`)
- Hosting: nog niet live (later Vercel)

---

## Huidige status

### ✅ Afgerond — alle 7 pagina's + authenticatie + Supabase + CSV import

**Supabase backend volledig werkend:**
- Authenticatie via email/wachtwoord, `useAuth` hook, `LoginPage`, `ProtectedRoute`
- `useHousehold` hook — haalt household_id op van ingelogde user; gebruikt door alle data-hooks
- `useSettings` hook — centrale instellingen per user (Supabase `user_settings` tabel)
- Auto-setup trigger bij registratie: huishouden + GZ-profiel + user_settings aangemaakt via `handle_new_user()` met SECURITY DEFINER (enige uitzondering op de regel)
- RLS-policies op alle 8 tabellen — gebruikers zien alleen eigen huishouden-data
- `household_members` RLS: directe `user_id = auth.uid()` check (niet via `get_my_household_id()` wegens circulaire afhankelijkheid)
- GRANT op alle tabellen voor de `authenticated` rol (nodig omdat "Automatically expose new tables" uit staat)
- Check constraints hoofdlettergevoelig: `Inkomst`/`Uitgave`, `Noodzaak`/`Wens`/`Sparen`, `Maandelijks`/`Jaarlijks`/etc.
- localStorage opgeruimd — alleen backward-compat syncs + `admin_unlocked` blijven

**Alle pagina's werkend:**
- **Dashboard** — begroeting, maandselector, 3 StatCards, kostenverdeling, staafdiagram, spaardoelen, recente tx, donut, 50/30/20 score
- **Transacties** — zoeken, filteren, sorteren, toevoegen, bewerken, verwijderen, auto-badge, import
- **Vaste Lasten** — CRUD, auto-transacties, donut chart, gegroepeerde tabellen per categorie; tabelkolommen consistent met transactietabel: Volgende Afschrijving, Bedrag, Omschrijving, Winkel/Bron, Categorie (+ subcategorie), Soort, Wie
- **Budgetten** — 50/30/20 + handmatige modus, categorie-tabel, spaardoelen met storten
- **Analyse** — 4 grafieken in versleepbaar 2×2 grid, periode-filters, premium sectie; drag-and-drop volgorde-opslag gefixt (swap ipv splice)
- **Instellingen** — profiel (naam + email via Supabase Auth, wachtwoord via `supabase.auth.updateUser`), huishouden, saldo, voorkeuren, categorieën, data beheer (incl. importknop), admin
- **Kalender** — premium-only, maand/week view, verwacht vs. werkelijk, detailpaneel

**CSV Import volledig werkend:**
- Import-flow: CSV uploaden → bankdetectie → parsing → duplicaat-check → vaste lasten matching → preview-tabel → importeren
- Ondersteunde banken: Rabobank, ING, ABN AMRO, ASN Bank, SNS Bank, RegioBank, bunq, Knab, Triodos Bank, Revolut
- Van Lanschot: "binnenkort beschikbaar"
- Bankdetectie automatisch op basis van CSV-headers en scheidingsteken
- Rabobank parser volledig getest en werkend; overige banken op basis van gedocumenteerde formaten (feedback-driven)
- Duplicaat-detectie: datum + bedrag + winkel vergelijking — oranje markering, standaard uitgevinkt
- Vaste lasten matching: automatisch categorie/subcategorie/soort/wie invullen bij match
- Kleurcodering + legenda: groen (nieuw), oranje (duplicaat), blauw (vaste last match)
- AI-hulp voor categorisering: kopieer transacties → plak in ChatGPT/Claude → plak resultaat terug → automatisch toepassen
- Validatie: categorie, subcategorie en soort verplicht voor import
- Import-knop op twee plekken: TransactionTopBar + SettingsDataManagement
- Info-knop met downloadinstructies per bank (`BankInstructies` component)
- Geïmporteerde transacties krijgen `bron: 'import'`
- Admin instelling: `import_max_regels` (default 1000)

**Profielensysteem volledig werkend:**
- `useProfiles` hook — data uit Supabase, CRUD
- Dynamische wie-knoppen in alle formulieren
- WieAvatar dynamisch op kleur via `getByInitialen`
- GZ-profiel automatisch aangemaakt bij registratie (`is_deletable: false`)

**Supabase migratie volledig:**
- Alle data in PostgreSQL, localStorage alleen voor backward-compat caches

### 🔮 Volgende stap

- **Performance optimalisatie** — caching in hooks zodat data niet bij elke pagina-wissel opnieuw wordt opgehaald
- **Bugfixes na import-testing** — CSV parsers voor niet-Rabobank banken zijn ongetest; afhankelijk van gebruikersfeedback
- **Feedback-knop** — gebruikers kunnen feedback/bugs melden, admin kan inzien in de admin-sectie
- **Meerdere bankrekeningen** (premium feature) — extra tabel `accounts` + `account_id` op transactions

### 🔮 Later (niet nu)

- GoCardless bankkoppeling (premium) — directe import zonder CSV
- Automatische AI-categorisering via Anthropic API (premium) — vervangt kopieer/plak methode
- Leningen sectie werkend maken
- Paginering in tabellen
- Dark mode (toggle bestaat al, styling niet actief)
- Notificaties uitwerken
- Hosting op Vercel
- Privacy policy pagina
- Account verwijderen functie (AVG)
- Huishouden uitnodigingssysteem (Anne toevoegen via email-link)

---

## Mappenstructuur

```
src/
├── components/
│   ├── ui/Card.jsx             → Herbruikbare UI (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
│   ├── ui/Icons.jsx            → Alle iconen (Lucide-stijl, ICONS object)
│   ├── ui/DatePicker.jsx       → Custom datumkiezer (kalenderweergave)
│   ├── auth/
│   │   ├── LoginPage.jsx       → Login + registratie pagina (toggle)
│   │   └── ProtectedRoute.jsx  → Route-bescherming (redirect naar /login)
│   ├── sidebar/Sidebar.jsx     → Navigatie sidebar (inklapbaar, premium-bewust)
│   ├── transactions/           → TransactionTopBar, TransactionFilters, TransactionTable, TransactionForm,
│   │                             ImportFlow, ImportPreviewTable, ImportAiModal, BankInstructies
│   ├── fixed/                  → FixedTopBar, FixedStats, FixedCategoryGroup, FixedForm, FixedLoanSection
│   ├── budgets/                → BudgetTopBar, BudgetStats, BudgetRuleSection, BudgetCategoryTable, BudgetSavingsGoals, BudgetForm
│   ├── analytics/              → AnalyticsTopBar, AnalyticsPeriodFilter, AnalyticsChartCard, AnalyticsTopCategories,
│   │                             AnalyticsTopSubcategories, AnalyticsSoortDonut, AnalyticsIncomeExpense, AnalyticsPremiumSection
│   ├── calendar/               → CalendarTopBar, CalendarMonthNav, CalendarGrid, CalendarDayCell, CalendarWeekView,
│   │                             CalendarDayDetail, CalendarStats, CalendarLegend
│   ├── dashboard/              → DashboardTopBar, DashboardStatCards, DashboardCategoryDonut, DashboardYearChart,
│   │                             DashboardSavingsGoals, DashboardRecentTx, DashboardCostSplit, DashboardIncomeModal, DashboardRuleScore
│   └── settings/               → SettingsTopBar, SettingsSidebar, SettingsHousehold, SettingsProfile, SettingsSaldo,
│                                 SettingsPreferences, SettingsCategories, SettingsDataManagement, SettingsNotifications,
│                                 SettingsAbout, SettingsAdmin
│
├── pages/                      → Eén bestand per pagina (max 100 regels)
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── BudgetsPage.jsx
│   ├── FixedPage.jsx
│   ├── SettingsPage.jsx
│   └── CalendarPage.jsx        (premium only)
│
├── layouts/MainLayout.jsx      → Sidebar + content wrapper
├── hooks/
│   ├── useAuth.js              → Supabase authenticatie (login, logout, sessie, onAuthStateChange)
│   ├── useHousehold.js         → Household_id ophalen van ingelogde user
│   ├── useSettings.js          → Centrale user settings (Supabase user_settings tabel)
│   ├── useTransactions.js      → Alle transactie state & logica (Supabase)
│   ├── useFixedExpenses.js     → Alle vaste lasten state & logica (Supabase)
│   ├── useBudgets.js           → Alle budget state & logica (Supabase)
│   ├── usePremium.js           → Centrale premium-status app-breed (via useSettings)
│   └── useProfiles.js          → Centrale profielen app-breed (Supabase)
│
├── data/
│   ├── categories.js           → CATEGORIES + getMergedCategories(customCategories?) + SOORTEN
│   ├── categoryConfig.js       → Icoon- en kleurkoppeling per categorie (voor UI)
│   ├── transactions.js         → Sample data (niet geïmporteerd, alleen referentie)
│   ├── fixed.js                → Sample data (niet geïmporteerd, alleen referentie)
│   └── budgets.js              → Sample data (niet geïmporteerd, alleen referentie)
│
├── utils/
│   ├── csvParser.js            → Bankdetectie (detectBank) + parseCSV + markDuplicates + matchFixedExpenses
│   └── parsers/                → Per bank een eigen parser + helpers.js
│       ├── helpers.js          → parseCsvText, parseBedragKomma/Punt, parseDate*, makeTx
│       ├── parseRabobank.js
│       ├── parseING.js
│       ├── parseABNAmro.js
│       ├── parseVolksbank.js   → ASN Bank, SNS Bank, RegioBank (zelfde formaat)
│       ├── parseBunq.js        → NL en EN headers, komma of puntkomma
│       ├── parseKnab.js
│       ├── parseTriodos.js
│       └── parseRevolut.js
│
├── styles/index.css            → Basis CSS
├── supabaseClient.js           → Supabase client configuratie
├── tokens.js                   → Design tokens + fmt() + fmtShort() + fmtDate(dateStr, format?)
└── App.jsx                     → Routing (met ProtectedRoute)
```

---

## Conventies

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
9. **State** — `useState` voor lokale state. Geen Redux.
10. **Geen console.log** — verwijder debug-code voordat je code presenteert.

---

## Architectuur

### Hooks als single source of truth

Elke domein heeft zijn eigen hook — de **enige** plek voor state en logica:
- `useAuth.js` — authenticatie (login, logout, sessie)
- `useHousehold.js` — household_id van ingelogde user; gebruikt door alle data-hooks
- `useSettings.js` — centrale user settings per user (Supabase `user_settings`)
- `useTransactions.js` — transacties (lees, filter, sorteer, toevoegen, bewerken, verwijderen)
- `useFixedExpenses.js` — vaste lasten (CRUD, auto-transacties aanmaken)
- `useBudgets.js` — budgetten en spaardoelen (berekeningen, CRUD, maand/jaar filter)
- `usePremium.js` — centrale premium-status app-breed (leest van `useSettings`)
- `useProfiles.js` — centrale profielen app-breed (Supabase `profiles` tabel)

Componenten en pagina's bevatten **geen** eigen dataloading of businesslogica.

### Pagina's zijn dun

Pagina-bestanden (max 50–100 regels) roepen alleen hooks aan en geven data door aan componenten.

### Data-hooks patroon

Alle data-hooks gebruiken hetzelfde patroon:
- Beginnen met `useHousehold()` → `householdId`
- Wachten op `!householdLoading` voor de eerste fetch
- Exporteren altijd `loading` en `error` states
- `fetchX` via `useCallback` met householdId als dependency
- DB-mapping: `dbNaarFrontend(row)` + `frontendNaarDb(data)` functies

### Bron-veld op transacties

Elke transactie heeft een `bron` veld:
- `'handmatig'` — door de gebruiker ingevoerd of bewerkt
- `'auto'` — automatisch aangemaakt (vaste lasten, spaardoel-stortingen)
- `'import'` — geïmporteerd via CSV-import

`updateTransaction()` zet `bron` altijd naar `'handmatig'`, ook als origineel `'auto'` of `'import'` was.

### Spaardoelen

`huidigBedrag` wordt **berekend** uit transacties met `spaardoel_id` — niet opgeslagen op het spaardoel zelf. Stortingen zijn transacties: categorie `'Financieel'`, sub `'Sparen / Beleggen'`, soort `'Sparen'`, bron `'auto'`.

### fmtDate — datum formatteren

`fmtDate(dateStr, format?)` in `tokens.js`:
- Met `format` param: gebruik die waarde
- Zonder param: fallback naar localStorage `webfinance_datumformaat` → `'long'`
- `'long'` → `8 mei 2026` | `'dmy'` → `08-05-2026` | `'iso'` → `2026-05-08`

### getMergedCategories — gecombineerde categorieën

`getMergedCategories(customCategories?)` in `src/data/categories.js`:
- Met param: gebruik die waarde direct
- Zonder param: fallback naar localStorage `webfinance_custom_categories`

Gebruik dit overal waar categorieën getoond of gekozen worden.

### useSettings — centrale instellingen

`useSettings()` exporteert: `settings`, `loading`, `error`, `updateSetting(key, value)`, `updateSettings(updates)`.

Schrijft `datumformaat`, `custom_categories` en `premium` ook naar localStorage (backward-compat voor `fmtDate` en `getMergedCategories`).

### useProfiles hook

**Exporteert:**
- `profiles` — alle profielen inclusief GZ (Gezamenlijk)
- `persons` — alleen niet-gezamenlijke profielen
- `addProfile(data)`, `updateProfile(id, data)`, `removeProfile(id)`
- `getByInitialen(initialen)` — zoekt profiel op initialen, `null` als niet gevonden

**GZ-profiel:** `is_deletable: false` in DB → `isGezamenlijk: true` in frontend.

**`genInitialen(naam)`** — voornaam[0] + achternaam[0], tussenvoegsels overgeslagen, altijd hoofdletters.

**`PROFIEL_KLEUREN`** — 8 preset `{ bg, fg }` objecten voor kleurpicker.

**GZ-splitsing:** Transacties met `wie === 'GZ'` worden gelijk verdeeld over alle `persons`.

### Sidebar premium-logica

- PREMIUM badge bij Kalender verborgen als `isPremium === true`
- "Upgrade naar Premium" blok verborgen als `isPremium === true`
- Profiel-chip toont "PREMIUM" (blauw) of "GRATIS" (grijs)

### Sorteerlogica transacties

Bij gelijke datum worden nieuwste transacties (hoogste `created_at`) eerst getoond.

### Zichtbare namen vs. code-namen

- Sidebar label **"Analyse"** — route, mapnamen en bestandsnamen blijven `analytics`
- Subtitels verwijderd op alle pagina's — TopBars tonen alleen paginatitel
- Dashboard TopBar toont dynamische begroeting (Goedemorgen/middag/avond) ipv paginatitel

### Dashboard architectuur

`DashboardPage.jsx` widgets in twee kolommen, drie rijen:
- Rij 1: `DashboardCostSplit` | `DashboardYearChart`
- Rij 2: `DashboardSavingsGoals` | `DashboardRecentTx`
- Rij 3: `DashboardCategoryDonut` | `DashboardRuleScore`

**Huidig saldo:** `settings.startsaldo` (`{ bedrag, datum }`) → saldo = startsaldo + inkomsten − uitgaven vanaf peildatum. Maand-onafhankelijk.

**DashboardCostSplit** leest `settings.kosten_inkomen` en `settings.verdeel_methode` via `useSettings`.

### TransactionForm — bewerk-modus

| Prop | Modus | Gedrag |
|------|-------|--------|
| `editingTransaction = null` | Nieuw | Leeg formulier, "Opslaan en volgende" zichtbaar |
| `editingTransaction = { ...tx }` | Bewerken | Velden ingevuld, "Opslaan en volgende" verborgen |

### Kalender architectuur

Premium-only. Combineert `useTransactions` en `useFixedExpenses` voor verwacht vs. werkelijk. `buildDayMap` en `getMondayOfWeek` zijn named exports die in `CalendarPage` hergebruikt worden.

### CSV Parser architectuur

`src/utils/csvParser.js` is de orchestrator:
- `detectBank(csvText)` → `'rabobank' | 'ing' | 'abn_amro' | 'volksbank' | 'bunq' | 'knab' | 'triodos' | 'revolut' | null`
- `parseCSV(csvText)` → `{ bank, bankLabel, transactions, error }`
- `markDuplicates(rows, existing)` — datum + bedrag + winkel vergelijking
- `matchFixedExpenses(rows, fixedItems)` — automatisch categoriseren op basis van naam

ABN AMRO: tab-gescheiden, geen headers, detectie op IBAN in eerste kolom (`/^NL\d/`).
ING: puntkomma-gescheiden. Triodos: komma-gescheiden, zelfde headers als ING (geen "Saldo na mutatie").
Volksbank-formaat (ASN/SNS/RegioBank): identiek, één parser voor alle drie.

---

## Supabase database

### Tabellen en RLS

| Tabel | RLS filter | Beschrijving |
|-------|-----------|-------------|
| `households` | `get_my_household_id()` | Huishouden |
| `household_members` | `user_id = auth.uid()` | User ↔ huishouden koppeling |
| `profiles` | `get_my_household_id()` | Wie-profielen per huishouden |
| `transactions` | `get_my_household_id()` | Alle transacties |
| `fixed_expenses` | `get_my_household_id()` | Vaste lasten |
| `budgets` | `get_my_household_id()` | Categorie-budgetten |
| `savings_goals` | `get_my_household_id()` | Spaardoelen |
| `user_settings` | `user_id = auth.uid()` | Persoonlijke instellingen |

### Check constraints (hoofdlettergevoelig!)

| Tabel | Kolom | Toegestane waarden |
|-------|-------|-------------------|
| `transactions` | `type` | `'Inkomst'`, `'Uitgave'` |
| `transactions` | `soort` | `'Noodzaak'`, `'Wens'`, `'Sparen'` |
| `transactions` | `bron` | `'handmatig'`, `'auto'`, `'import'` |
| `fixed_expenses` | `soort` | `'Noodzaak'`, `'Wens'`, `'Sparen'` |
| `fixed_expenses` | `frequentie` | `'Maandelijks'`, `'Jaarlijks'`, `'Kwartaal'`, `'Wekelijks'` |
| `user_settings` | `datumformaat` | `'long'`, `'dmy'`, `'iso'` |
| `user_settings` | `thema` | `'light'`, `'dark'` |
| `user_settings` | `verdeel_methode` | `'ratio'`, `'50/50'` |
| `budgets` | `modus` | `'50/30/20'`, `'handmatig'` |

### Kolomnotities

- `transactions.winkel` — kolom toegevoegd (was niet in origineel schema)
- `transactions.beschrijving` (niet `omschrijving`), `transactions.subcategorie` (niet `sub`)
- `user_settings.analytics_order` — default `["categories","subcategories","soort","inkexp"]` (niet `[0,1,2,3]`)
- `user_settings.import_max_regels` — INTEGER, default 1000 (admin-instelling)

### Trigger: on_auth_user_created

AFTER INSERT op `auth.users` — functie `handle_new_user()` met SECURITY DEFINER:
1. Maakt een `households` rij aan
2. Koppelt de user als eigenaar in `household_members`
3. Maakt GZ-profiel aan (`is_deletable: false`)
4. Maakt `user_settings` rij aan met defaults

Dit is de **enige** uitzondering op de "geen SECURITY DEFINER" regel.

---

## LocalStorage (minimaal na Supabase-migratie)

| Key | Inhoud | Reden |
|-----|--------|-------|
| `"webfinance_admin_unlocked"` | Boolean | Development only, niet gemigreerd |
| `"webfinance_datumformaat"` | Backward-compat cache | Voor `fmtDate()` zonder format param |
| `"webfinance_custom_categories"` | Backward-compat cache | Voor `getMergedCategories()` zonder param |
| `"webfinance_premium"` | Backward-compat cache | Voor `usePremium()` |

---

## Known issues

1. **Overflow hidden** — Cards met `overflow: 'hidden'` knippen slide-in formulieren of dropdowns af → fix: `createPortal` of `overflow: 'visible'`
2. **CSV parsers ongetest** — parsers voor ING, ABN AMRO, bunq, Knab, Triodos, Revolut, Volksbank zijn geschreven op basis van gedocumenteerde formaten; correctie op basis van gebruikersfeedback
3. **Performance** — bij 250+ transacties is laden merkbaar trager dan localStorage — caching in hooks nodig

---

## Categorieën

Wonen, Vervoer, Dagelijks leven, Abonnementen & Telecom, Vrije tijd, Financieel, Overig
(zie `src/data/categories.js` voor subcategorieën)

**Subcategorie onder Financieel: 'Sparen / Beleggen'**

Kleuren per categorie (zie `src/data/categoryConfig.js`):
- Wonen: blue/blueSoft, icoon: home
- Vervoer: teal/tealSoft, icoon: car
- Dagelijks leven: amber/amberSoft, icoon: coffee
- Abonnementen & Telecom: violet/violetSoft, icoon: wifi
- Vrije tijd: red/redSoft, icoon: target
- Financieel: green/greenSoft, icoon: coin
- Overig: ink3/rule, icoon: grip

---

## Verdienmodel (voor later, niet nu)

- Gratis: basisfuncties
- Premium (€3–5/mnd): ongelimiteerd, kalender, bankimport, GoCardless koppeling, AI-categorisering, meerdere bankrekeningen, aanpasbare analytics

---

## Werkwijze

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
