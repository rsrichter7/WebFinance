# Webfinance — Projectsamenvatting

Plak dit samen met de stijlgids aan het begin van elke nieuwe chat.

---

## Wat is Webfinance?

Een persoonlijke financiële webapp (SaaS) gebouwd met React. Geïnspireerd door Stripe Dashboard, Linear en Notion. Desktop-first, later uitbreidbaar naar mobiel.

---

## Eigenaar

Ronald Richter — bouwt dit samen met Claude. Ronald beslist, Claude voert uit.

---

## Tech stack

- React 18 + Vite + React Router
- Inline styles met design tokens (T-object uit `src/tokens.js`)
- Lettertype: Inter (Google Fonts) met tabular-nums voor bedragen
- Geen Tailwind, geen TypeScript, geen Redux
- Data: LocalStorage (later Supabase)
- Hosting: nog niet live (later Vercel)

---

## Projectlocatie

- Online: GitHub Codespaces (primaire ontwikkelomgeving)
- GitHub: `https://github.com/rsrichter7/WebFinance`
- React-code zit in de `webfinance/` submap binnen de repo
- Claude Code is geïnstalleerd in Codespaces met CLAUDE.md in de root

---

## Huidige status

### ✅ Afgerond — alle 7 pagina's zijn werkend

**Fundament:**
- Mappenstructuur, design tokens (`src/tokens.js`)
- Gedeelde componenten (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
- Sidebar met navigatie (inklapbaar, React Router, premium-bewust)
- MainLayout (sidebar + content), routing naar alle 7 pagina's

**Transacties pagina volledig werkend:**
- `useTransactions` hook — enige bron van transactie-logica
- Zoeken, filteren (Type, Categorie, Soort, Wie, Maand, Jaar), sorteren
- Toevoegen via slide-in formulier met custom DatePicker
- Verwijderen, **bewerken** via potlood-icoon per rij — opent TransactionForm in bewerk-modus
- AUTO badge voor transacties vanuit vaste lasten
- Bron-veld: `'handmatig'` / `'auto'` / `'import'` — bewerken forceert altijd `'handmatig'`
- Sorteerlogica: bij gelijke datum nieuwste (hoogste id) eerst

**Vaste Lasten pagina volledig werkend:**
- `useFixedExpenses` hook — CRUD, auto-transacties aanmaken
- Gegroepeerde tabellen per hoofdcategorie, donut chart, leningen placeholder
- Slide-in formulier via `createPortal`
- Auto-transactie systeem: gemiste afschrijvingen worden automatisch aangemaakt

**Budgetten pagina volledig werkend:**
- `useBudgets` hook — budgetten en spaardoelen
- 50/30/20 modus + handmatige modus (eigen percentages)
- Maand/jaar selector, inline bewerken van categorie-budgetten
- Spaardoelen: `huidigBedrag` berekend uit transacties (niet opgeslagen)
- Stortingen zijn transacties (`bron: 'auto'`, `spaardoelId`)

**Analyse pagina volledig werkend:**
- Vier grafieken in versleepbaar 2×2 grid (volgorde in localStorage)
- Elke grafiek heeft eigen Maand/Kwartaal/Jaar periode-filter met pijltjes
- Grafiek 1: Top categorieën (horizontale bars)
- Grafiek 2: Top subcategorieën (top 10)
- Grafiek 3: Noodzaak/Wens/Sparen donut + 50/30/20 doellijnen
- Grafiek 4: Inkomsten vs Uitgaven twee-lijnen SVG
- Premium sectie onderaan met ghost widgets + blur/lock overlay
- Slepen alleen voor Premium (via `usePremium()`)
- Sidebar label "Analyse" — bestandsnamen/route blijven `analytics`

**Instellingen pagina volledig werkend:**
- Eigen sidebar met 8 secties + verborgen Admin-sectie
- **Profiel** — naam en e-mail, lokaal opgeslagen
- **Huishouden** — profielen toevoegen/bewerken/verwijderen, kleurpicker (8 presets), `genInitialen` auto-initialen, GZ kan niet verwijderd worden
- **Saldo** — startsaldo instellen met peildatum; `webfinance_startsaldo`; Dashboard berekent huidig saldo relatief aan de peildatum
- **Voorkeuren** — datumformaat (3 opties), thema-toggle; `fmtDate()` past dit app-breed toe
- **Categorieën** — eigen sub- en hoofdcategorieën; `getMergedCategories()` app-breed beschikbaar
- **Data beheer** — export JSON, export CSV (transacties), import JSON, wis alles (bevestiging vereist) — volledig werkend
- **Notificaties** — placeholder (vereist account)
- **Over Webfinance** — easter egg: 5× klikken op versienummer → Admin-sectie
- **Admin** (verborgen) — Premium aan/uit, diagnostiek, Admin vergrendelen

**Kalender pagina volledig werkend (premium-only):**
- Blur/lock overlay voor niet-premium gebruikers
- Maandweergave: 7-koloms grid (ma–zo), kleurcodering dagcellen
- Weekweergave: dag-voor-dag detailkaarten, toggle via pills
- View-filter pills: Verwacht / Werkelijk / Beide
- Detailpaneel rechts (280px): verwachte + werkelijke items + "+ Toevoegen" (opent TransactionForm via createPortal)
- Verwachte items: vaste lasten geprojecteerd op juiste dag
- Werkelijke items: alle transacties (`allTransactions`)
- Matching: vinkje bij betaalde vaste lasten
- StatCards: Verwachte uitgaven, Werkelijke uitgaven, Verschil
- Maandnavigatie gecentreerd boven grid

**Dashboard pagina volledig werkend (landingspagina):**
- Dynamische begroeting op basis van tijdstip (Goedemorgen/middag/avond, Ronald)
- Maandselector in TopBar — alle widgets filteren mee
- "+ Transactie" knop opent TransactionForm via createPortal
- 3 StatCards: Inkomsten (groen), Uitgaven (rood), Huidig Saldo (blauw) + trends vs vorige maand
- Huidig saldo = startsaldo + inkomsten − uitgaven vanaf peildatum (maand-onafhankelijk)
- Kostenverdeling: gemKosten / bijdrage / betaald / verschil per persoon; inkomen via modal; ratio of 50/50
- Maandoverzicht: staafdiagram per maand filtert op geselecteerd jaar
- Spaardoelen: voortgangsbalken
- Recente transacties: laatste 5, altijd ongefilterd
- Donut chart uitgaven per categorie
- 50/30/20 score: Noodzaak/Wens/Sparen voortgangsbalken

**Profielensysteem volledig werkend:**
- `useProfiles` hook — centrale single source of truth voor alle profielen
- `PERSONEN` hardcoded array volledig verwijderd
- Dynamische wie-knoppen in TransactionForm, TransactionFilters, FixedForm
- WieAvatar in TransactionTable en DashboardRecentTx dynamisch op kleur
- GZ-transacties gelijk gesplitst over alle `persons` in kostenverdeling

**Premium sidebar logica volledig werkend:**
- PREMIUM badge bij Kalender verborgen voor premium gebruikers
- "Upgrade naar Premium" blok verborgen voor premium gebruikers
- Profiel-chip toont "PREMIUM" (blauw) of "GRATIS" (grijs)

### 🔮 Volgende stap

- **Supabase migratie** — database (PostgreSQL), authenticatie (email/wachtwoord), multi-user ondersteuning; vervangt LocalStorage als persistence laag

### 🔮 Later (niet nu)

- Leningen sectie werkend maken
- Paginering in tabellen
- Dark mode (toggle bestaat al, styling niet actief)
- Notificaties (vereist account)
- Bankimport, AI-categorisering
- Hosting op Vercel

---

## Mappenstructuur

```
src/
├── components/
│   ├── ui/Card.jsx             → Herbruikbare UI (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
│   ├── ui/Icons.jsx            → Alle iconen (Lucide-stijl, ICONS object)
│   ├── ui/DatePicker.jsx       → Custom datumkiezer
│   ├── sidebar/Sidebar.jsx     → Navigatie sidebar (inklapbaar, premium-bewust)
│   ├── transactions/           → TransactionTopBar, TransactionFilters, TransactionTable, TransactionForm
│   ├── fixed/                  → FixedTopBar, FixedStats, FixedCategoryGroup, FixedForm, FixedLoanSection
│   ├── budgets/                → BudgetTopBar, BudgetStats, BudgetRuleSection, BudgetCategoryTable, BudgetSavingsGoals, BudgetForm
│   ├── analytics/              → AnalyticsTopBar, AnalyticsPeriodFilter, AnalyticsChartCard, AnalyticsTopCategories, AnalyticsTopSubcategories, AnalyticsSoortDonut, AnalyticsIncomeExpense, AnalyticsPremiumSection
│   ├── calendar/               → CalendarTopBar, CalendarMonthNav, CalendarGrid, CalendarDayCell, CalendarWeekView, CalendarDayDetail, CalendarStats, CalendarLegend
│   ├── dashboard/              → DashboardTopBar, DashboardStatCards, DashboardCategoryDonut, DashboardYearChart, DashboardSavingsGoals, DashboardRecentTx, DashboardCostSplit, DashboardIncomeModal, DashboardRuleScore
│   └── settings/               → SettingsTopBar, SettingsSidebar, SettingsHousehold, SettingsProfile, SettingsSaldo, SettingsPreferences, SettingsCategories, SettingsDataManagement, SettingsNotifications, SettingsAbout, SettingsAdmin
│
├── pages/                      → Eén bestand per pagina (max 100 regels)
│   ├── DashboardPage.jsx       (werkend — landingspagina)
│   ├── TransactionsPage.jsx    (werkend)
│   ├── AnalyticsPage.jsx       (werkend)
│   ├── BudgetsPage.jsx         (werkend)
│   ├── FixedPage.jsx           (werkend)
│   ├── SettingsPage.jsx        (werkend)
│   └── CalendarPage.jsx        (werkend — premium only)
│
├── layouts/MainLayout.jsx      → Sidebar + content wrapper
├── hooks/
│   ├── useTransactions.js      → Alle transactie state & logica
│   ├── useFixedExpenses.js     → Alle vaste lasten state & logica
│   ├── useBudgets.js           → Alle budget state & logica
│   ├── usePremium.js           → Centrale premium-status app-breed
│   └── useProfiles.js          → Centrale profielen app-breed (CRUD + helpers)
│
├── data/
│   ├── categories.js           → CATEGORIES + getMergedCategories() + SOORTEN
│   ├── categoryConfig.js       → Icoon- en kleurkoppeling per categorie
│   ├── transactions.js         → Sample transacties
│   ├── fixed.js                → Sample vaste lasten
│   └── budgets.js              → Sample budgetten en spaardoelen
│
├── styles/index.css            → Basis CSS
├── tokens.js                   → Design tokens + fmt() + fmtShort() + fmtDate()
└── App.jsx                     → Routing
```

---

## Architectuurprincipes

- **Hooks zijn de single source of truth** — logica zit altijd in de hook, nooit in componenten of pagina's
- **Pagina-bestanden zijn dun** (max 50–100 regels) — roepen hooks aan, geven data door
- **`usePremium()`** — enige plek voor premium-status app-breed
- **`useProfiles()`** — enige plek voor profielen app-breed; exporteert `profiles`, `persons`, `addProfile`, `updateProfile`, `removeProfile`, `getByInitialen`
- **`fmtDate(dateStr)`** — altijd gebruiken voor datumweergave, nooit zelf formatteren
- **`getMergedCategories()`** — altijd gebruiken waar categorieën gekozen worden
- **`fmt()` / `fmtShort()`** — altijd gebruiken voor bedragen
- **createPortal** voor slide-in formulieren (overflow-fix)
- **overflow: 'visible'** op Cards met tabellen of dropdowns

---

## LocalStorage keys

| Key | Inhoud |
|-----|--------|
| `"webfinance_transactions"` | Alle transacties (handmatig + auto + stortingen) |
| `"webfinance_fixed"` | Vaste lasten items |
| `"webfinance_budgets"` | Categorie-budgetten |
| `"webfinance_spaardoelen"` | Spaardoelen (zonder huidigBedrag) |
| `"webfinance_budget_modus"` | `'50/30/20'` of `'handmatig'` |
| `"webfinance_budget_verdeling"` | Aangepaste percentages `{ noodzaak, wens, sparen }` |
| `"webfinance_analytics_order"` | Volgorde van de vier grafiek-cards op de Analyse pagina |
| `"webfinance_premium"` | Boolean — premium-status (via `usePremium`) |
| `"webfinance_datumformaat"` | `'long'` / `'dmy'` / `'iso'` |
| `"webfinance_custom_categories"` | `{ customSubs: {}, customCats: [] }` |
| `"webfinance_taal"` | Taalvoorkeur (`'nl'`) |
| `"webfinance_theme"` | `'light'` / `'dark'` (dark styling nog niet actief) |
| `"webfinance_admin_unlocked"` | Boolean — admin-sectie ontgrendeld |
| `"webfinance_profielen"` | Array van profielobjecten (via `useProfiles`) |
| `"webfinance_kostenverdeeld_inkomen"` | `{ [initialen]: number }` — netto maandinkomen per persoon |
| `"webfinance_verdeel_methode"` | `'ratio'` / `'50/50'` — kostenverdeling methode |
| `"webfinance_startsaldo"` | `{ bedrag: number, datum: 'YYYY-MM-DD' }` — peildatum + beginsaldo voor saldo-berekening |
| `"webfinance_profiel"` | `{ naam, email }` — profielgegevens (SettingsProfile) |

---

## Belangrijke beslissingen

- **Noodzaak / Wens / Sparen** vervangt "Vast / Variabel" (mapped op 50/30/20 regel)
- **Wie-veld** is dynamisch via `useProfiles` — niet hardcoded; standaard: RR (Ronald Richter) en GZ (Gezamenlijk)
- **GZ-transacties** worden gelijk verdeeld over alle `persons` in kostenverdeling
- **Spaardoel `huidigBedrag`** berekend uit transacties met `spaardoelId`, niet opgeslagen op het spaardoel
- **Stortingen op spaardoelen** zijn transacties: `bron: 'auto'`, `spaardoelId`, categorie 'Financieel', sub 'Sparen / Beleggen', soort 'Sparen'
- **Auto-transacties** vanuit vaste lasten: `vasteLast: item.id`, `bron: 'auto'`
- **Sidebar label "Analyse"** — route/mapnamen blijven `analytics`
- **Subtitels verwijderd** op alle pagina's — TopBars tonen alleen paginatitel
- **Dashboard TopBar** toont dynamische begroeting ipv paginatitel
- **Eerst hele app met LocalStorage**, daarna migreren naar Supabase
- **Grote toevoegingen** via Claude Code; finetuning via claude.ai chat

---

## Known issue: overflow hidden

Cards en containers met `overflow: 'hidden'` veroorzaken:
1. **Slide-in formulieren niet zichtbaar** → fix: `createPortal(..., document.body)`
2. **Dropdowns of tabelinhoud afgeknipt** → fix: `overflow: 'visible'` op de Card

---

## Categorieën

Wonen, Vervoer, Dagelijks leven, Abonnementen & Telecom, Vrije tijd, Financieel, Overig

Subcategorie onder Financieel: **'Sparen / Beleggen'**

Kleuren per categorie:
- Wonen: blue/blueSoft, icoon: home
- Vervoer: teal/tealSoft, icoon: car
- Dagelijks leven: amber/amberSoft, icoon: coffee
- Abonnementen & Telecom: violet/violetSoft, icoon: wifi
- Vrije tijd: red/redSoft, icoon: target
- Financieel: green/greenSoft, icoon: coin
- Overig: ink3/rule, icoon: grip

---

## Verdienmodel (voor later, niet nu)

- Gratis: basisfuncties, max 100 transacties/maand
- Premium (€3–5/mnd): ongelimiteerd, kalender, bankimport, data-export, aanpasbare analytics, geen advertenties

---

## Werkwijze

- **Altijd eerst akkoord vragen** voordat er code geschreven wordt
- **Stap voor stap bouwen** — niet alles tegelijk
- **Projectsamenvatting bijwerken** na elke grote bouwfase
- **CLAUDE.md updaten** in Codespaces na elke projectsamenvatting-update
