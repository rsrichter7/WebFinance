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
- **Backend: Supabase** (PostgreSQL database, authenticatie, RLS)
- **Regio: Central EU (Frankfurt)** — AVG/GDPR compliant
- `.env` met `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY` (staat in `.gitignore`)
- Hosting: nog niet live (later Vercel)

---

## Projectlocatie

- Online: GitHub Codespaces (primaire ontwikkelomgeving)
- GitHub: `https://github.com/rsrichter7/WebFinance`
- React-code zit in de `webfinance/` submap binnen de repo
- Claude Code is geïnstalleerd in Codespaces met CLAUDE.md in de root
- Documentatie in `docs/` map (stijlgids, projectsamenvatting, functielijst, security-checklist)
- Oude pre-React code in `_archief/` map

---

## Huidige status

### ✅ Afgerond — alle 7 pagina's + authenticatie + Supabase

**Supabase backend volledig werkend:**
- Authenticatie: email/wachtwoord via Supabase Auth
- `useAuth` hook — login, logout, sessie-check, onAuthStateChange
- `LoginPage` — registreren + inloggen met toggle, email-verificatie
- `ProtectedRoute` — alle routes beschermd behalve `/login`
- `useHousehold` hook — haalt household_id op van ingelogde user
- `useSettings` hook — centrale instellingen per user (Supabase `user_settings` tabel)
- Auto-setup trigger: bij registratie wordt automatisch huishouden, GZ-profiel en user_settings aangemaakt
- RLS-policies op alle 8 tabellen — gebruikers zien alleen eigen huishouden-data
- `get_my_household_id()` helper-functie in database

**Database-schema (8 tabellen):**
- `households` — huishouden (centrale tabel)
- `household_members` — koppeling user ↔ huishouden (eigenaar/lid)
- `profiles` — wie-profielen (RR, AR, GZ) per huishouden
- `transactions` — alle transacties met `household_id`
- `fixed_expenses` — vaste lasten met `household_id`
- `budgets` — categorie-budgetten met `household_id`
- `savings_goals` — spaardoelen met `household_id`
- `user_settings` — persoonlijke instellingen per user

**Transacties pagina volledig werkend:**
- `useTransactions` hook — data uit Supabase, async met loading/error states
- Zoeken, filteren (Type, Categorie, Soort, Wie, Maand, Jaar), sorteren
- Toevoegen via slide-in formulier met custom DatePicker
- Verwijderen, **bewerken** via potlood-icoon per rij — opent TransactionForm in bewerk-modus
- AUTO badge voor transacties vanuit vaste lasten
- Bron-veld: `'handmatig'` / `'auto'` / `'import'` — bewerken forceert altijd `'handmatig'`
- Kolommen: Datum, Bedrag, Omschrijving, Winkel/Bron, Categorie (+ subcategorie), Soort, Wie
- Sorteerlogica: bij gelijke datum nieuwste (created_at) eerst

**Vaste Lasten pagina volledig werkend:**
- `useFixedExpenses` hook — data uit Supabase, CRUD, auto-transacties
- Gegroepeerde tabellen per hoofdcategorie, donut chart, leningen placeholder
- Tabelkolommen consistent met transactietabel: Volgende Afschrijving, Bedrag, Omschrijving, Winkel/Bron, Categorie (+ subcategorie), Soort, Wie
- Slide-in formulier via `createPortal`
- Auto-transactie systeem: gemiste afschrijvingen worden automatisch aangemaakt (max 1 maand terug)

**Budgetten pagina volledig werkend:**
- `useBudgets` hook — data uit Supabase, budgetten en spaardoelen
- 50/30/20 modus + handmatige modus (eigen percentages)
- Maand/jaar selector, inline bewerken van categorie-budgetten
- Spaardoelen: `huidigBedrag` berekend uit transacties met `spaardoel_id` (niet opgeslagen)
- Stortingen zijn transacties (`bron: 'auto'`, `spaardoel_id`)

**Analyse pagina volledig werkend:**
- Vier grafieken in versleepbaar 2×2 grid (volgorde in user_settings)
- Elke grafiek heeft eigen Maand/Kwartaal/Jaar periode-filter met pijltjes
- Grafiek keys: `categories`, `subcategories`, `soort`, `inkexp`
- Premium sectie onderaan met ghost widgets + blur/lock overlay
- Slepen alleen voor Premium (via `usePremium()`)
- Sidebar label "Analyse" — bestandsnamen/route blijven `analytics`
- **Known issue:** drag-and-drop volgorde opslaan werkt niet correct (links-rechts ipv positie-swap)

**Instellingen pagina volledig werkend:**
- Eigen sidebar met 8 secties + verborgen Admin-sectie
- **Profiel** — naam en e-mail, opgeslagen in Supabase `user_settings`
- **Huishouden** — profielen toevoegen/bewerken/verwijderen via `useProfiles` (Supabase)
- **Saldo** — startsaldo instellen met peildatum, opgeslagen in `user_settings.startsaldo`
- **Voorkeuren** — datumformaat (3 opties), thema-toggle, opgeslagen in `user_settings`
- **Categorieën** — eigen sub- en hoofdcategorieën, opgeslagen in `user_settings.custom_categories`
- **Data beheer** — export JSON lokale instellingen, import JSON, wis lokale instellingen
- **Notificaties** — placeholder (vereist verdere uitwerking)
- **Over Webfinance** — easter egg: 5× klikken op versienummer → Admin-sectie
- **Admin** (verborgen) — Premium aan/uit (via `user_settings.premium`), diagnostiek

**Kalender pagina volledig werkend (premium-only):**
- Blur/lock overlay voor niet-premium gebruikers
- Maandweergave: 7-koloms grid (ma–zo), kleurcodering dagcellen
- Weekweergave: dag-voor-dag detailkaarten, toggle via pills
- View-filter pills: Verwacht / Werkelijk / Beide
- Detailpaneel rechts (280px): verwachte + werkelijke items + "+ Toevoegen"
- Verwachte items: vaste lasten geprojecteerd op juiste dag
- Werkelijke items: alle transacties (`allTransactions`)
- Matching: vinkje bij betaalde vaste lasten
- StatCards: Verwachte uitgaven, Werkelijke uitgaven, Verschil

**Dashboard pagina volledig werkend (landingspagina):**
- Dynamische begroeting op basis van tijdstip
- Maandselector in TopBar — alle widgets filteren mee
- "+ Transactie" knop opent TransactionForm via createPortal
- 3 StatCards: Inkomsten (groen), Uitgaven (rood), Huidig Saldo (blauw) + trends vs vorige maand
- Huidig saldo = startsaldo + inkomsten − uitgaven vanaf peildatum
- Kostenverdeling: gemKosten / bijdrage / betaald / verschil per persoon; inkomen via modal; ratio of 50/50
- Maandoverzicht: staafdiagram per maand
- Spaardoelen: voortgangsbalken
- Recente transacties: laatste 5, ongefilterd
- Donut chart uitgaven per categorie
- 50/30/20 score: Noodzaak/Wens/Sparen voortgangsbalken

**Profielensysteem volledig werkend:**
- `useProfiles` hook — data uit Supabase, CRUD
- Dynamische wie-knoppen in TransactionForm, TransactionFilters, FixedForm
- WieAvatar dynamisch op kleur
- GZ-profiel automatisch aangemaakt bij registratie (`is_deletable: false`)
- Nieuw huishouden start alleen met GZ — gebruiker voegt zelf profielen toe

**Premium sidebar logica volledig werkend:**
- PREMIUM badge bij Kalender verborgen voor premium gebruikers
- "Upgrade naar Premium" blok verborgen voor premium gebruikers
- Profiel-chip toont "PREMIUM" (blauw) of "GRATIS" (grijs)

### 🔮 Volgende stap

- **Analyse drag-and-drop fixen** — volgorde-opslag werkt niet correct
- **Meerdere bankrekeningen** (premium feature) — extra tabel `accounts` + `account_id` op transactions

### 🔮 Later (niet nu)

- Leningen sectie werkend maken
- Paginering in tabellen
- Dark mode (toggle bestaat al, styling niet actief)
- Notificaties uitwerken
- Bankimport, AI-categorisering
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
│   ├── ui/DatePicker.jsx       → Custom datumkiezer
│   ├── auth/LoginPage.jsx      → Login + registratie pagina
│   ├── auth/ProtectedRoute.jsx → Route-bescherming (redirect naar /login)
│   ├── sidebar/Sidebar.jsx     → Navigatie sidebar (inklapbaar, premium-bewust)
│   ├── transactions/           → TransactionTopBar, TransactionFilters, TransactionTable, TransactionForm
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
│   ├── useAuth.js              → Supabase authenticatie (login, logout, sessie)
│   ├── useHousehold.js         → Household_id ophalen van ingelogde user
│   ├── useSettings.js          → Centrale user settings (Supabase user_settings tabel)
│   ├── useTransactions.js      → Alle transactie state & logica (Supabase)
│   ├── useFixedExpenses.js     → Alle vaste lasten state & logica (Supabase)
│   ├── useBudgets.js           → Alle budget state & logica (Supabase)
│   ├── usePremium.js           → Centrale premium-status app-breed
│   └── useProfiles.js          → Centrale profielen app-breed (Supabase)
│
├── data/
│   ├── categories.js           → CATEGORIES + getMergedCategories(customCategories?) + SOORTEN
│   ├── categoryConfig.js       → Icoon- en kleurkoppeling per categorie
│   ├── transactions.js         → Sample data (niet geïmporteerd, alleen referentie)
│   ├── fixed.js                → Sample data (niet geïmporteerd, alleen referentie)
│   └── budgets.js              → Sample data (niet geïmporteerd, alleen referentie)
│
├── styles/index.css            → Basis CSS
├── supabaseClient.js           → Supabase client configuratie
├── tokens.js                   → Design tokens + fmt() + fmtShort() + fmtDate(dateStr, format?)
└── App.jsx                     → Routing (met ProtectedRoute)
```

---

## Architectuurprincipes

- **Hooks zijn de single source of truth** — logica zit altijd in de hook, nooit in componenten of pagina's
- **Alle data-hooks zijn async** — elke hook exporteert `loading` en `error` states
- **Pagina-bestanden zijn dun** (max 50–100 regels) — roepen hooks aan, geven data door
- **`useAuth()`** — enige plek voor authenticatie app-breed
- **`useHousehold()`** — enige plek voor household_id; wordt gebruikt door alle data-hooks
- **`useSettings()`** — enige plek voor user settings; vervangt alle localStorage-instellingen
- **`usePremium()`** — enige plek voor premium-status app-breed
- **`useProfiles()`** — enige plek voor profielen app-breed
- **`fmtDate(dateStr, format?)`** — altijd gebruiken voor datumweergave; format parameter vanuit useSettings
- **`getMergedCategories(customCategories?)`** — altijd gebruiken; custom_categories parameter vanuit useSettings
- **`fmt()` / `fmtShort()`** — altijd gebruiken voor bedragen
- **createPortal** voor slide-in formulieren (overflow-fix)
- **overflow: 'visible'** op Cards met tabellen of dropdowns

---

## Supabase database

### Tabellen en RLS

| Tabel | RLS filter | Beschrijving |
|-------|-----------|-------------|
| `households` | `get_my_household_id()` | Huishouden |
| `household_members` | `user_id = auth.uid()` | User ↔ huishouden koppeling |
| `profiles` | `get_my_household_id()` | Wie-profielen (RR, AR, GZ) |
| `transactions` | `get_my_household_id()` | Alle transacties |
| `fixed_expenses` | `get_my_household_id()` | Vaste lasten |
| `budgets` | `get_my_household_id()` | Categorie-budgetten |
| `savings_goals` | `get_my_household_id()` | Spaardoelen |
| `user_settings` | `user_id = auth.uid()` | Persoonlijke instellingen |

### Check constraints (hoofdlettergevoelig!)

| Tabel | Kolom | Waarden |
|-------|-------|---------|
| `transactions` | `type` | `'Inkomst'`, `'Uitgave'` |
| `transactions` | `soort` | `'Noodzaak'`, `'Wens'`, `'Sparen'` |
| `transactions` | `bron` | `'handmatig'`, `'auto'`, `'import'` |
| `fixed_expenses` | `soort` | `'Noodzaak'`, `'Wens'`, `'Sparen'` |
| `fixed_expenses` | `frequentie` | `'Maandelijks'`, `'Jaarlijks'`, `'Kwartaal'`, `'Wekelijks'` |
| `user_settings` | `datumformaat` | `'long'`, `'dmy'`, `'iso'` |
| `user_settings` | `thema` | `'light'`, `'dark'` |
| `user_settings` | `verdeel_methode` | `'ratio'`, `'50/50'` |
| `budgets` | `modus` | `'50/30/20'`, `'handmatig'` |

### Trigger

`on_auth_user_created` — AFTER INSERT op `auth.users`:
1. Maakt een `households` rij aan
2. Koppelt de user als eigenaar in `household_members`
3. Maakt GZ-profiel aan (`is_deletable: false`)
4. Maakt `user_settings` aan met defaults

Functie `handle_new_user()` gebruikt `SECURITY DEFINER` — noodzakelijk voor trigger op `auth.users`. Dit is de enige uitzondering op de "geen SECURITY DEFINER" regel.

---

## LocalStorage (minimaal na migratie)

| Key | Inhoud | Reden |
|-----|--------|-------|
| `"webfinance_admin_unlocked"` | Boolean — admin-sectie ontgrendeld | Development only, niet gemigreerd |
| `"webfinance_datumformaat"` | Backward-compat cache | Voor `fmtDate()` zonder format param |
| `"webfinance_custom_categories"` | Backward-compat cache | Voor `getMergedCategories()` zonder param |
| `"webfinance_premium"` | Backward-compat cache | Voor `usePremium()` |

---

## Belangrijke beslissingen

- **Noodzaak / Wens / Sparen** vervangt "Vast / Variabel" (mapped op 50/30/20 regel)
- **Wie-veld** is dynamisch via `useProfiles` — niet hardcoded; standaard alleen GZ bij nieuw account
- **GZ-transacties** worden gelijk verdeeld over alle `persons` in kostenverdeling
- **Spaardoel `huidigBedrag`** berekend uit transacties met `spaardoel_id`, niet opgeslagen
- **Stortingen op spaardoelen** zijn transacties: `bron: 'auto'`, `spaardoel_id`, categorie 'Financieel', subcategorie 'Sparen / Beleggen', soort 'Sparen'
- **Auto-transacties** vanuit vaste lasten: `vaste_last_id: item.id`, `bron: 'auto'`, max 1 maand terug
- **Sidebar label "Analyse"** — route/mapnamen blijven `analytics`
- **Subtitels verwijderd** op alle pagina's — TopBars tonen alleen paginatitel
- **Dashboard TopBar** toont dynamische begroeting ipv paginatitel
- **Supabase migratie voltooid** — alle data in PostgreSQL, localStorage alleen voor backward-compat
- **SECURITY DEFINER** alleen voor `handle_new_user()` trigger — alle andere functies zijn SECURITY INVOKER
- **household_id op alle data-tabellen** — klaar voor multi-user (Anne toevoegen)
- **Meerdere bankrekeningen** gepland als premium feature (extra tabel `accounts` + `account_id`)
- **Grote toevoegingen** via Claude Code; finetuning via claude.ai chat

---

## Known issues

1. **Overflow hidden** — Cards met `overflow: 'hidden'` knippen dropdowns/formulieren af → fix: `createPortal` of `overflow: 'visible'`
2. **Analyse drag-and-drop** — volgorde-opslag werkt niet correct (links-rechts ipv positie-swap)

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
- Premium (€3–5/mnd): ongelimiteerd, kalender, bankimport, data-export, aanpasbare analytics, meerdere bankrekeningen, geen advertenties

---

## Werkwijze

- **Altijd eerst akkoord vragen** voordat er code geschreven wordt
- **Stap voor stap bouwen** — niet alles tegelijk
- **Projectsamenvatting bijwerken** na elke grote bouwfase
- **CLAUDE.md updaten** in Codespaces na elke projectsamenvatting-update
