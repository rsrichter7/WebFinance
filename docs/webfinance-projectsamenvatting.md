# Webfinance — Projectsamenvatting v15

Bijgewerkt: 10 juli 2026. Plak dit samen met de stijlgids aan het begin van elke nieuwe chat.

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
- **Hosting: Vercel** — live op https://webfinance-nl.vercel.app (`vercel.json` in repo-root)
- **SMTP:** Resend geconfigureerd als e-mailprovider in Supabase (sender: Webfinance via onboarding@resend.dev)

---

## Huidige status

### ✅ Afgerond — alle pagina's + authenticatie + Supabase + CSV import + security + dark mode + notificaties + uitnodigingen + feedback + Vercel deployment + meerdere rekeningen

**Supabase backend volledig werkend:**
- Authenticatie via email/wachtwoord én Google OAuth, `useAuth` hook, `LoginPage`, `ProtectedRoute`
- Email-verificatie verplicht bij registratie (via Resend SMTP)
- Wachtwoord minimaal 8 tekens (client-side validatie + Supabase policy)
- **Naamveld bij registratie** — "Volledige naam" veld bij email-registratie; Google OAuth haalt naam automatisch op
- `useHousehold` hook — haalt household_id op van ingelogde user; gebruikt door alle data-hooks
- `useSettings` hook — centrale instellingen per user (Supabase `user_settings` tabel)
- Auto-setup trigger bij registratie: huishouden + GZ-profiel + persoonlijk profiel + user_settings aangemaakt via `handle_new_user()` met SECURITY DEFINER
- **`handle_new_user()` trigger bijgewerkt** — maakt nu ook een persoonlijk profiel aan met naam uit auth metadata
- RLS-policies op alle tabellen — gebruikers zien alleen eigen huishouden-data
- `household_members` RLS: directe `user_id = auth.uid()` check (niet via `get_my_household_id()` wegens circulaire afhankelijkheid)
- GRANT op alle tabellen voor de `authenticated` rol (nodig omdat "Automatically expose new tables" uit staat)
- Check constraints hoofdlettergevoelig: `Inkomst`/`Uitgave`, `Noodzaak`/`Wens`/`Sparen`, `Maandelijks`/`Jaarlijks`/etc.
- localStorage opgeruimd — alleen backward-compat syncs + `admin_unlocked` blijven
- **`user_id` kolom op `profiles`** — koppelt profiel aan auth user, aangemaakt bij registratie via `handle_new_user()` trigger

**Alle pagina's werkend:**
- **Dashboard** — begroeting, maandselector, 3 StatCards, kostenverdeling, staafdiagram, spaardoelen, recente tx, donut, 50/30/20 score
- **Transacties** — zoeken, filteren, sorteren, toevoegen, bewerken, verwijderen, auto-badge, import
- **Vaste Lasten** — twee tabs (Uitgaven / Inkomsten), CRUD voor beide types, puur overzicht/referentie (maakt geen automatische transacties meer aan), donut chart, gegroepeerde tabellen per categorie, suggestie-motor herkent terugkerende vaste lasten uit transacties, leningen-sectie met gekoppelde aflossing-vaste-last
- **Budgetten** — 50/30/20 + handmatige modus, categorie-tabel, spaardoelen met storten
- **Analyse** — 4 grafieken in versleepbaar 2×2 grid, periode-filters, premium sectie
- **Instellingen** — profiel, huishouden (met ledenlijst + uitnodigingen), saldo, voorkeuren (incl. thema), categorieën, data beheer, notificaties, admin (incl. feedback-overzicht)
- **Kalender** — premium-only, maand/week view, verwacht vs. werkelijk, inkomsten zichtbaar, hoge uitgaven gemarkeerd, auto-match verwachte uitgaven, default filter "Beide"
- **Privacy policy** — statische pagina op `/privacy`, toegankelijk zonder login (AVG)
- **Uitnodigingspagina** — `/uitnodiging/:token`, buiten ProtectedRoute, voor huishouden-uitnodigingen

**Vercel deployment live:**
- App draait op https://webfinance-nl.vercel.app
- Automatische deploy bij elke push naar `main`
- Environment variables geconfigureerd in Vercel dashboard
- Security headers (CSP, X-Frame-Options, X-Content-Type-Options, etc.) via `vercel.json`

**Favicon + Login-logo:**
- Favicon: SVG met €-teken in donker afgerond vierkant, consistent met sidebar-logo
- Login-logo: aangepast naar zelfde stijl als sidebar (€-teken in donker vierkant)

**Dashboard begroeting dynamisch:**
- Voornaam uit `auth.users` metadata (`user_metadata.full_name`)
- Refresht direct na profielwijziging via `refreshUser()` in `useAuth`

**Notificaties persistent:**
- In-memory notificaties (budget, vaste lasten) worden naar de database geschreven
- `ref_key` kolom (UNIQUE) voorkomt dubbele notificaties
- Gelezen-status blijft behouden tussen sessies

**Dark mode volledig werkend:**
- `ThemeProvider` context via `useTheme.jsx` — drie opties: Licht, Donker, Automatisch
- `lightTokens` en `darkTokens` in `tokens.js`
- Alle componenten gebruiken `useTheme()` voor T-tokens
- CSS-variabelen op `document.documentElement` via `data-theme` attribuut
- Instant thema-wissel (lokale state eerst, Supabase async)
- `LoginPage` en `InvitationPage` ook dark mode compatible
- Check constraint: `'light'`, `'dark'`, `'auto'`

**Notificatiesysteem werkend:**
- `notifications` tabel in Supabase met RLS
- `useNotifications.js` — combineert database- en in-memory notificaties
- Bel-icoon in sidebar met rode badge voor `unreadCount`
- `NotificationPanel` dropdown: laatste 3 notificaties + "Alle bekijken" link
- `SettingsNotifications`: notificatie-geschiedenis met paginering (3 per pagina)
- Database-notificaties: huishouden-events (uitnodiging geaccepteerd, lid verwijderd)
- In-memory notificaties: budget overschreden (≥80%), aankomende vaste lasten (3 dagen) — persistent via `ref_key`
- Toggles in instellingen: `notif_budget` en `notif_vaste_lasten` (opgeslagen in `user_settings`)
- `create_notification()` RPC functie (SECURITY DEFINER) voor database-notificaties

**Huishouden uitnodigingssysteem werkend:**
- `household_invitations` tabel in Supabase
- `useInvitations.js` — createInvitation, acceptInvitation, declineInvitation, cancelInvitation
- Uitnodigingslink genereren in Instellingen → Huishouden
- `InvitationPage` (/uitnodiging/:token) — buiten ProtectedRoute
- Token bewaard in sessionStorage tijdens login/registratie flow
- "Accounts met toegang" sectie in `SettingsHousehold` (apart van profielen)
- Eigenaar kan leden verwijderen; verwijderd lid krijgt notificatie + nieuw leeg huishouden
- `role` kolom op `household_members` (eigenaar/lid)

**Feedbacksysteem werkend:**
- Feedback-knop in sidebar (onder profiel, boven uitloggen)
- `FeedbackForm` slide-in panel: onderwerp, bericht, optioneel afbeelding
- `feedback` tabel in Supabase met RLS
- Admin feedback-overzicht (`SettingsFeedback`) in `SettingsAdmin` — drie tabs: Open, Behandeld, Afgewezen
- `useFeedback.js` hook voor CRUD op feedback

**CSV Import volledig werkend:**
- Import-flow: CSV uploaden → bankdetectie → parsing → duplicaat-check → vaste lasten matching → preview-tabel → importeren
- Ondersteunde banken: Rabobank, ING, ABN AMRO, ASN Bank, SNS Bank, RegioBank, bunq, Knab, Triodos Bank, Revolut
- Van Lanschot: "binnenkort beschikbaar"
- Bankdetectie automatisch op basis van CSV-headers en scheidingsteken
- Rabobank parser volledig getest en werkend; overige banken op basis van gedocumenteerde formaten
- Duplicaat-detectie: datum + bedrag + winkel — oranje markering, standaard uitgevinkt
- Vaste lasten matching: automatisch categorie/subcategorie/soort/wie invullen bij match
- IBAN-stripping bij import (`stripIBANs` in helpers.js)
- AI-hulp voor categorisering: kopieer/plak methode via ChatGPT/Claude
- Admin instelling: `import_max_regels` (default 1000)

**Profielensysteem volledig werkend:**
- `useProfiles` hook — data uit Supabase, CRUD
- Dynamische wie-knoppen in alle formulieren
- WieAvatar dynamisch op kleur via `getByInitialen`
- GZ-profiel automatisch aangemaakt bij registratie (`is_deletable: false`)
- Persoonlijk profiel aangemaakt bij registratie via `handle_new_user()` trigger (naam uit auth metadata)
- `user_id` kolom op `profiles` — koppelt profiel aan auth user
- Sidebar toont volledige naam + profielkleur + klikbaar naar instellingen

**Security-hardening afgerond:**
- Centrale invoervalidatie (`src/utils/validation.js`) — 7 functies
- Content Security Policy + security headers in `vercel.json`
- Privacy policy pagina (`/privacy`) toegankelijk zonder login
- Account verwijderen (AVG) via serverless functie `/api/delete-account.js` (zie "Account verwijderen + Stripe" hieronder)
- Data-export als Excel (.xlsx) via Instellingen → Data beheer (SheetJS, 6 tabbladen)
- "Alle transacties verwijderen" functie met bevestigingsmodal

**Geen automatische transacties meer (kernwijziging):**
- Vaste lasten én vaste inkomsten maken geen auto-transacties meer aan. `verwerkAutoTransacties` en `berekenVerwachteDatums` zijn uit `useFixedExpenses.js` verwijderd.
- De pagina's Vaste Lasten en Inkomsten zijn nu puur overzicht/referentie van vaste maandbedragen. Transacties komen uitsluitend uit CSV-import en handmatige invoer.
- Spaardoel-stortingen blijven `bron: 'auto'` (echte gebruikersactie) — het `'auto'`-label bestaat dus nog, maar wordt niet meer door vaste lasten/inkomsten gebruikt.
- Reden: dit loste een structurele saldo-afwijking op (twee bronnen registreerden dezelfde werkelijkheid → dubbelingen).

**Kalender — tolerante match verwacht vs. werkelijk:**
- Nieuwe util `src/utils/kalenderMatch.js` met `MATCH_CONFIG` (dagenGekoppeld 10, dagenHeuristiek 5, dagenWekelijks 3, bedragProcent 0.05, bedragMinimum 1), `maakActualsIndex` en `isVerwachtGedekt`
- `buildDayMap` matcht nu met speling op datum (± dagen) en bedrag (± %) i.p.v. exact; `getOccurrencesInMonth` projecteert ook Kwartaal-items

**Saldo-controle (Instellingen → Saldo):**
- Nieuw component `components/settings/SettingsSaldoCheck.jsx` + functie `berekendSaldoOpDatum(allTransactions, startsaldo, peildatum)` in `utils/dashboardCalculations.js`
- Vergelijkt echt banksaldo met berekend saldo op een datum; "Corrigeer startsaldo" verlegt het startsaldo (ankert op dag+1 om dubbeltellen te voorkomen) — geen nieuwe DB-kolom, hergebruikt het bestaande startsaldo

**Suggestie-motor — vaste lasten herkennen uit transacties:**
- Nieuwe util `src/utils/vasteLastenDetectie.js` (`detecteerVasteLasten`) + component `components/fixed/FixedSuggesties.jsx` bovenaan de Vaste Lasten-pagina
- Herkent terugkerende Uitgave-patronen (min. 3 transacties over 3 maanden, bedragstabiliteit 70% binnen ±15%, ritme wekelijks/maandelijks/kwartaal/jaarlijks). Suggestief: gebruiker voegt toe of negeert; genegeerde suggesties in localStorage-key `webfinance_genegeerde_suggesties`

**Account verwijderen + Stripe:**
- Nieuwe serverless functie `/api/delete-account.js`, aangeroepen vanuit `SettingsDeleteAccount.jsx` (Bearer-token) i.p.v. direct `delete_my_account()`
- Solo-huishouden: Stripe-abonnement direct opzeggen + heel huishouden wissen + auth-user verwijderen. Gedeeld huishouden: alleen de vertrekkende gebruiker verwijderen, eigenaarschap wordt overgedragen, gedeelde data + abonnement blijven behouden
- Nieuwe SQL-functies `delete_household_cascade(p_household_id)` en `depart_shared_household(p_user_id)` — SECURITY DEFINER, alleen `service_role`

**Design — winkel/bron vooraan:**
- Winkel/Bron staat nu vóór Omschrijving en is dikgedrukt; Omschrijving erachter en licht. Toegepast in `TransactionTable`, `IncomeCategoryGroup`, `FixedCategoryGroup`; `DashboardRecentTx` toont winkel als hoofdregel; `CalendarDayDetail`-label toont winkel (valt terug op naam)
- In de slide-in formulieren (`TransactionForm`, `FixedForm`) staat het Winkel-veld vóór het Omschrijving-veld

**Leningen — nu live (was "geparkeerd"):**
- Nieuwe Supabase-tabel `loans` (RLS via `get_my_household_id()` + grants). `loans.id` is een volgnummer (bigint), maar `loans.vaste_last_id` is een uuid (verwijst naar `fixed_expenses.id`)
- Hook `useLoans.js` (CRUD + berekeningen), util `loanCalculations.js`. Bij toevoegen wordt automatisch een gekoppelde vaste last "Aflossing [naam]" aangemaakt in `fixed_expenses` (categorie Financieel, subcategorie 'Aflossing lening', soort Noodzaak, type Uitgave, frequentie Maandelijks); bij verwijderen verdwijnt die vaste last mee
- Componenten: `FixedLoanSection`, `LoanCard`, `LoanForm`, `DashboardLeningen`. De vaste-lasten-lijst ververst live via `emit('fixed_expenses:changed')` (cacheManager pub/sub)

**Bevestigingsmodal:**
- Nieuw herbruikbaar component `components/ui/ConfirmDialog.jsx` (`createPortal`, huisstijl)
- Vervangt de browser-confirm bij het verwijderen van transacties, vaste inkomsten, vaste lasten (uitgaven) en leningen (bedraad in `TransactionsPage`, `IncomePage`, `FixedPage`, `FixedLoanSection`)

**Meerdere rekeningen per account:**
- Nieuwe Supabase-tabel `rekeningen` (`id` uuid, `household_id`, `user_id` (eigenaar, nullable), `naam`, `gedeeld` boolean, `iban`, `volgorde`, `bron` (`'handmatig'`/`'gocardless'`), `gocardless_id`, `koppeling_vervalt` timestamptz, `startsaldo_bedrag` numeric, `startsaldo_datum` date, `created_at`). `gocardless_id` en `koppeling_vervalt` zijn alvast gereserveerd voor de latere GoCardless-koppeling (`koppeling_vervalt` voor de 90-dagen-vervalmelding)
- Kolom `account_id` toegevoegd aan `transactions`, `fixed_expenses`, `budgets`, `savings_goals`, `loans` (ON DELETE CASCADE naar `rekeningen`). Bestaande data is bij invoering gekoppeld aan een automatisch aangemaakte gedeelde "Hoofdrekening" per huishouden
- Model: er is altijd precies één ACTIEVE rekening; de hele app (transacties, vaste lasten, inkomsten, budgetten, spaardoelen, leningen, saldo) toont alleen data van de actieve rekening. Wisselen gebeurt via een switcher in de sidebar
- Rekeningen zijn PERSOONLIJK (alleen van de eigenaar) of GEDEELD (hele huishouden). Bij aanmaken van een persoonlijke rekening wordt de ingelogde gebruiker als eigenaar (`user_id`) vastgelegd; gedeelde rekeningen hebben `user_id: null`. `addAccount` in `useAccounts.js` bepaalt dit expliciet — niet overschrijfbaar via de meegegeven data
- Nieuwe hook `useAccounts.js` (CRUD op rekeningen) en context `useActiveAccount.jsx` (`AccountProvider` + `useActiveAccount()`: `accounts`, `activeAccount`, `activeAccountId`, `setActiveAccount`, `activeStartsaldo`, `loading`). Actieve rekening onthouden in localStorage-key `'webfinance_actieve_rekening'`
- Component `components/sidebar/AccountSwitcher.jsx` (compacte dropdown onder het logo, via `createPortal`; groepeert Persoonlijk/Gedeeld; "Rekeningen beheren" deeplinkt naar `/instellingen?sectie=rekeningen`)
- Component `components/settings/SettingsAccounts.jsx` + nieuwe Instellingen-sectie "Rekeningen" (icoon wallet): rekeningen aanmaken/hernoemen/verwijderen, persoonlijk/gedeeld kiezen. Laatste rekening niet verwijderbaar; verwijderen waarschuwt dat alle gekoppelde data via cascade meeverdwijnt; bij verwijderen van de actieve rekening springt de app naar een andere
- Startsaldo is nu PER REKENING (kolommen `startsaldo_bedrag`/`startsaldo_datum` op `rekeningen`), niet meer huishouden-breed in `user_settings`. `useActiveAccount` levert `activeStartsaldo` als `{ bedrag, datum }`; `DashboardHero`, `DashboardPage`, `TransactionsPage`, `SettingsSaldo` en `SettingsSaldoCheck` lezen/schrijven dit op de actieve rekening. De `user_settings.startsaldo` kolom bestaat nog maar wordt niet meer gebruikt
- Op een PERSOONLIJKE rekening is elke transactie/vaste last/inkomst altijd van de eigenaar: de wie-keuzerij is in `TransactionForm` en `FixedForm` verborgen en `wie` wordt geforceerd op het profiel van de eigenaar (profiel gekoppeld via `profiles.user_id = rekening.user_id`). Veiligheidsklep: als de eigenaar niet naar een profiel te herleiden is, valt het terug op de normale keuzerij. Op het dashboard is het "Jullie verdeling"-blok (`DashboardVerdeling`) verborgen op persoonlijke rekeningen (grid valt terug naar 2 kolommen)
- Budget-uniekheid gewijzigd van `(household_id, categorie)` naar `(household_id, account_id, categorie)` zodat elke rekening een eigen budget per categorie kan hebben (constraint `budgets_household_account_categorie_key`)
- BEVEILIGING (RLS): de policies op `rekeningen` dwingen "persoonlijk-van-mij OF gedeeld-in-mijn-huishouden" af. Nieuwe SECURITY-helper `can_access_account(p_account_id)` (STABLE) bevat die regel; de policies op `transactions`, `fixed_expenses`, `budgets`, `savings_goals` en `loans` zijn vervangen door `can_access_account(account_id)` voor SELECT/INSERT/UPDATE/DELETE. Dubbele oude loans-policies zijn opgeruimd. Getest met twee accounts: gedeelde data blijft zichtbaar voor beide huishoudleden, persoonlijke rekeningen zijn privé

**Supabase overzicht-views (alleen dashboard):**
- `household_overview` en `user_overview` koppelen ID's aan naam/e-mail voor handmatig beheer in het Supabase-dashboard. Rechten ingetrokken voor `anon`/`authenticated` (nooit via de app-API bereikbaar)

### 🔮 Roadmap

**Afgerond:** Meerdere rekeningen per account (zie hierboven).

**Nog te doen, in deze volgorde:**
1. GoCardless bankkoppeling (premium) — directe import zonder CSV. Bouwt voort op de rekeningen-architectuur: na koppelen geeft GoCardless een lijst rekeningen terug die de gebruiker selecteert; per geselecteerde rekening wordt automatisch een rij in `rekeningen` (bron `'gocardless'`, `gocardless_id` gevuld) aangemaakt en worden transacties opgehaald. Let op: banken staan vaak ~4 verzoeken/dag/rekening toe (geen realtime sync), en toegang verloopt na max 90 dagen — dan moet de gebruiker een melding krijgen (via `koppeling_vervalt`) en opnieuw koppelen.
2. Zelf analyses opzetten: eigen analyses samenstellen, filteren en opslaan op de Analyse-pagina.
3. Meertaligheid (vlak vóór live): automatische vertaling via i18next/react-i18next (Nederlands standaard; taalkeuze uit selectielijst bij eerste aanmelding/account aanmaken). NB: nieuwe npm-package, eerst overleggen; vertaalsysteem trekt teksten uit de UI, vertalingen zelf moeten worden aangeleverd/nagekeken (financiële termen).
4. Uitleg per pagina (vlak vóór live, als allerlaatste): per pagina een volledige uitleg van de functies + eenvoudig uitgelegde formules, zichtbaar bij eerste aanmelding en met een knop opnieuw op te roepen. Pas bouwen als de rest af is en na meertaligheid (zodat de uitlegteksten mee vertaald kunnen worden).

### 🔮 Later (niet nu)

- Automatische AI-categorisering via Anthropic API (premium)
- Paginering in tabellen (bij 2000+ transacties)
- Stripe integratie voor premium-betalingen
- Cookie-banner (bij analytics)

---

## Premium vs. Gratis features

### Gratis

- Dashboard, Transacties, Vaste Lasten, Budgetten (50/30/20 modus)
- Hoofdcategorieën
- Dark mode
- Notificaties (budget-alerts + vaste lasten-herinneringen)
- Analyse — 2 grafieken
- Max 2 spaardoelen
- Max 2 profielen + GZ
- CSV import max 50 regels

### Premium (€3–5/mnd)

- Subcategorieën
- Analyse — alle 4 grafieken + versleepbaar grid
- Aangepaste categorieën
- CSV import — onbeperkt
- Spaardoelen — onbeperkt
- Budgetmodus — handmatig
- Meerdere profielen — onbeperkt
- Data export (Excel)
- Kalender
- Meerdere bankrekeningen
- GoCardless bankkoppeling
- AI-categorisering

**Premium toekennen:** admin zet `premium: true` in `user_settings` via Supabase dashboard.

---

## Mappenstructuur

```
webfinance/          ← React-app submap (zit in root van de repo)
├── src/
│   ├── components/
│   │   ├── ui/Card.jsx             → Herbruikbare UI (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
│   │   ├── ui/Icons.jsx            → Alle iconen (Lucide-stijl, ICONS object)
│   │   ├── ui/DatePicker.jsx       → Custom datumkiezer (kalenderweergave)
│   │   ├── ui/NotificationPanel.jsx → Dropdown met laatste 3 notificaties + bel-icoon badge
│   │   ├── ui/ConfirmDialog.jsx    → Herbruikbare bevestigingsmodal (createPortal, huisstijl)
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx       → Login + registratie + Google OAuth + email-verificatie flow (dark mode)
│   │   │   └── ProtectedRoute.jsx  → Route-bescherming (redirect naar /login)
│   │   ├── feedback/
│   │   │   └── FeedbackForm.jsx    → Slide-in panel: onderwerp, bericht, optioneel afbeelding
│   │   ├── sidebar/                → Sidebar.jsx (navigatie, inklapbaar, premium-bewust, feedback-knop, bel-icoon),
│   │   │                             AccountSwitcher.jsx (rekening-switcher dropdown onder logo, createPortal)
│   │   ├── transactions/           → TransactionTopBar, TransactionFilters, TransactionTable, TransactionForm,
│   │   │                             ImportFlow, ImportPreviewTable, ImportAiModal, BankInstructies
│   │   ├── fixed/                  → FixedTopBar, FixedStats, FixedCategoryGroup, FixedForm,
│   │   │                             FixedInkomstSection, FixedSuggesties, FixedLoanSection,
│   │   │                             LoanCard, LoanForm
│   │   ├── budgets/                → BudgetTopBar, BudgetStats, BudgetRuleSection, BudgetCategoryTable,
│   │   │                             BudgetSavingsGoals, BudgetForm
│   │   ├── analytics/              → AnalyticsTopBar, AnalyticsPeriodFilter, AnalyticsChartCard,
│   │   │                             AnalyticsTopCategories, AnalyticsTopSubcategories, AnalyticsSoortDonut,
│   │   │                             AnalyticsIncomeExpense, AnalyticsPremiumSection
│   │   ├── calendar/               → CalendarTopBar, CalendarMonthNav, CalendarGrid, CalendarDayCell,
│   │   │                             CalendarWeekView, CalendarDayDetail, CalendarStats, CalendarLegend
│   │   ├── dashboard/              → DashboardTopBar, DashboardStatCards, DashboardCategoryDonut,
│   │   │                             DashboardYearChart, DashboardSavingsGoals, DashboardRecentTx,
│   │   │                             DashboardCostSplit, DashboardIncomeModal, DashboardRuleScore,
│   │   │                             DashboardLeningen
│   │   └── settings/               → SettingsTopBar, SettingsSidebar, SettingsHousehold,
│   │                                 SettingsHouseholdInvitations, SettingsProfile, SettingsAccounts,
│   │                                 SettingsSaldo, SettingsSaldoCheck, SettingsPreferences, SettingsCategories,
│   │                                 SettingsDataManagement, SettingsDeleteAccount,
│   │                                 SettingsNotifications, SettingsAbout, SettingsAdmin,
│   │                                 SettingsFeedback, VerwijderLidModal
│   │
│   ├── pages/                      → Eén bestand per pagina (max 100 regels)
│   │   ├── DashboardPage.jsx
│   │   ├── TransactionsPage.jsx
│   │   ├── AnalyticsPage.jsx
│   │   ├── BudgetsPage.jsx
│   │   ├── FixedPage.jsx
│   │   ├── SettingsPage.jsx
│   │   ├── PrivacyPage.jsx         → Statische privacy policy pagina (/privacy, geen login vereist)
│   │   ├── CalendarPage.jsx        (premium only)
│   │   └── InvitationPage.jsx      → Uitnodigingspagina (/uitnodiging/:token, buiten ProtectedRoute)
│   │
│   ├── layouts/MainLayout.jsx      → Sidebar + content wrapper
│   ├── hooks/
│   │   ├── cacheManager.js         → In-memory cache utilities voor alle data-hooks + pub/sub (subscribe/emit)
│   │   ├── useAuth.js              → Supabase authenticatie (login, logout, sessie, Google OAuth, refreshUser)
│   │   ├── useHousehold.js         → Household_id ophalen van ingelogde user
│   │   ├── useAccounts.js          → CRUD op rekeningen (Supabase rekeningen tabel)
│   │   ├── useActiveAccount.jsx    → AccountProvider + useActiveAccount(): actieve rekening, activeStartsaldo
│   │   ├── useSettings.js          → Centrale user settings (Supabase user_settings tabel)
│   │   ├── useTransactions.js      → Alle transactie state & logica (Supabase)
│   │   ├── useFixedExpenses.js     → Alle vaste lasten state & logica (Supabase, incl. type Inkomst/Uitgave, geen auto-transacties)
│   │   ├── useLoans.js             → Leningen CRUD + gekoppelde aflossing-vaste-last (Supabase loans tabel)
│   │   ├── useBudgets.js           → Alle budget state & logica (Supabase)
│   │   ├── usePremium.js           → Centrale premium-status app-breed (via useSettings)
│   │   ├── useProfiles.js          → Centrale profielen app-breed (Supabase profiles tabel)
│   │   ├── useTheme.jsx            → ThemeProvider + useTheme hook (licht/donker/auto)
│   │   ├── useFeedback.js          → Feedback CRUD (Supabase feedback tabel)
│   │   ├── useInvitations.js       → Huishouden uitnodigingen (aanmaken, accepteren, afwijzen, annuleren)
│   │   └── useNotifications.js     → Combineert database- en in-memory notificaties (persistent via ref_key)
│   │
│   ├── data/
│   │   ├── categories.js           → CATEGORIES + getMergedCategories(customCategories?) + SOORTEN
│   │   ├── categoryConfig.js       → Icoon- en kleurkoppeling per categorie (voor UI)
│   │   ├── transactions.js         → Sample data (niet geïmporteerd, alleen referentie)
│   │   ├── fixed.js                → Sample data (niet geïmporteerd, alleen referentie)
│   │   └── budgets.js              → Sample data (niet geïmporteerd, alleen referentie)
│   │
│   ├── utils/
│   │   ├── csvParser.js            → Bankdetectie (detectBank) + parseCSV + markDuplicates + matchFixedExpenses
│   │   ├── validation.js           → Centrale invoervalidatie: validateBedrag/Datum/Tekst/Categorie/Soort/Type/Wie
│   │   ├── kalenderMatch.js        → MATCH_CONFIG + maakActualsIndex + isVerwachtGedekt (tolerante kalender-match)
│   │   ├── vasteLastenDetectie.js  → detecteerVasteLasten (suggestie-motor vaste lasten uit transacties)
│   │   ├── dashboardCalculations.js → o.a. berekendSaldoOpDatum(allTransactions, startsaldo, peildatum)
│   │   ├── loanCalculations.js     → huidigeMaandlast, berekenEinddatum, resterendeMaanden
│   │   └── parsers/                → Per bank een eigen parser + helpers.js
│   │       ├── helpers.js          → parseCsvText, parseBedragKomma/Punt, parseDate*, makeTx, stripIBANs
│   │       ├── parseRabobank.js
│   │       ├── parseING.js
│   │       ├── parseABNAmro.js
│   │       ├── parseVolksbank.js   → ASN Bank, SNS Bank, RegioBank (zelfde formaat)
│   │       ├── parseBunq.js        → NL en EN headers, komma of puntkomma
│   │       ├── parseKnab.js
│   │       ├── parseTriodos.js
│   │       └── parseRevolut.js
│   │
│   ├── styles/index.css            → Basis CSS
│   ├── supabaseClient.js           → Supabase client configuratie
│   ├── tokens.js                   → Design tokens (lightTokens/darkTokens) + fmt() + fmtShort() + fmtDate()
│   └── App.jsx                     → Routing (ProtectedRoute; /privacy en /uitnodiging/:token buiten ProtectedRoute)

vercel.json          ← In de root van de repo (naast webfinance/)
api/delete-account.js ← Serverless functie (root van de repo), Stripe opzeggen + huishouden/gebruiker verwijderen
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
12. **Dark mode** — gebruik altijd `useTheme()` voor T-tokens. Schrijf nooit hardcoded kleuren buiten tokens.

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
- `useAuth.js` — authenticatie (login, logout, sessie, Google OAuth via `signInWithGoogle`, `refreshUser()`)
- `useHousehold.js` — household_id van ingelogde user; gebruikt door alle data-hooks
- `useAccounts.js` — CRUD op rekeningen (Supabase `rekeningen` tabel); persoonlijke rekening krijgt automatisch de ingelogde user als eigenaar
- `useActiveAccount.jsx` — `AccountProvider` + `useActiveAccount()`: `accounts`, `activeAccount`, `activeAccountId`, `activeStartsaldo`, `setActiveAccount`; actieve rekening onthouden in localStorage
- `useSettings.js` — centrale user settings per user (Supabase `user_settings`)
- `useTransactions.js` — transacties (lees, filter, sorteer, toevoegen, bewerken, verwijderen)
- `useFixedExpenses.js` — vaste lasten en vaste inkomsten (CRUD, puur overzicht — maakt geen auto-transacties meer aan)
- `useLoans.js` — leningen (CRUD + berekeningen, aflossing-vaste-last aanmaken/bijwerken/verwijderen in `fixed_expenses`)
- `useBudgets.js` — budgetten en spaardoelen (berekeningen, CRUD, maand/jaar filter)
- `usePremium.js` — centrale premium-status app-breed (leest van `useSettings`)
- `useProfiles.js` — centrale profielen app-breed (Supabase `profiles` tabel)
- `useTheme.jsx` — ThemeProvider + `useTheme()` hook (licht/donker/auto, T-tokens per thema)
- `useFeedback.js` — feedback aanmaken + admin-overzicht (Supabase `feedback` tabel)
- `useInvitations.js` — huishouden uitnodigingen aanmaken, accepteren, afwijzen en annuleren
- `useNotifications.js` — combineert database-notificaties en in-memory notificaties (persistent via `ref_key`)

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
- In-memory caching via `cacheManager.js` — data blijft beschikbaar bij pagina-wisselingen
- Rekening-gebonden hooks (`useTransactions`, `useFixedExpenses`, `useLoans`, `useBudgets`) filteren daarnaast op `activeAccountId` uit `useActiveAccount()` — cache-sleutel is household + account samen

### Bron-veld op transacties

Elke transactie heeft een `bron` veld:
- `'handmatig'` — door de gebruiker ingevoerd of bewerkt
- `'auto'` — automatisch aangemaakt (alleen nog spaardoel-stortingen; vaste lasten/inkomsten maken géén auto-transacties meer aan)
- `'import'` — geïmporteerd via CSV-import

`updateTransaction()` zet `bron` altijd naar `'handmatig'`, ook als origineel `'auto'` of `'import'` was.

### Cachemanager — pub/sub

`cacheManager.js` heeft naast `registerCache`/`clearAllCaches` ook `subscribe(event, fn)` en `emit(event)`. Event `'fixed_expenses:changed'`: `useFixedExpenses` abonneert zich en ververst zichzelf; `useLoans` emit't dit na wijzigingen aan de gekoppelde aflossing-vaste-last (add/update/delete) zodat de Vaste Lasten-lijst live meeverandert.

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

### useTheme — thema-systeem

`useTheme()` exporteert: `T` (tokens-object voor huidig thema), `theme` (instelling: `'light'`/`'dark'`/`'auto'`), `resolvedTheme` (effectief thema: `'light'`/`'dark'`), `setTheme(value)`.

`ThemeProvider` wraps de hele app in `App.jsx`. Thema-wissel: lokale state direct, Supabase async.

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

### Rekeningen architectuur

Er is altijd precies één ACTIEVE rekening. `useActiveAccount()` levert `activeAccount`/`activeAccountId`/`activeStartsaldo`; alle rekening-gebonden hooks (`useTransactions`, `useFixedExpenses`, `useLoans`, `useBudgets`) filteren en stempelen daarop. Rekeningen zijn PERSOONLIJK (`gedeeld: false`, `user_id` = eigenaar) of GEDEELD (`gedeeld: true`, `user_id: null`). `addAccount` in `useAccounts.js` bepaalt de eigenaar expliciet op basis van `gedeeld` — niet overschrijfbaar via de meegegeven data.

Op een persoonlijke rekening is `wie` altijd de eigenaar: `TransactionForm` en `FixedForm` zoeken het profiel met `profiles.userId === activeAccount.userId`, forceren `wie` daarop (bij openen, bij bewerken, en via een `useEffect` die ook bij wisselen van rekening triggert) en verbergen de wie-keuzerij (gedeeld hulpcomponent `components/ui/WieKeuze.jsx`). Zonder herleidbaar profiel valt het terug op de normale keuzerij (veiligheidsklep). Dashboard verbergt `DashboardVerdeling` ("Jullie verdeling") op persoonlijke rekeningen — rij 2 valt dan terug van 3 naar 2 kolommen.

`AccountSwitcher.jsx` (sidebar, onder het logo, via `createPortal`) wisselt de actieve rekening en groepeert Persoonlijk/Gedeeld. `SettingsAccounts.jsx` (Instellingen → Rekeningen) beheert CRUD: aanmaken, hernoemen, verwijderen, persoonlijk/gedeeld kiezen. Laatste rekening is niet verwijderbaar; verwijderen cascadeert naar alle gekoppelde data (transacties, vaste lasten, budgetten, spaardoelen, leningen) en waarschuwt daarvoor; bij verwijderen van de actieve rekening springt de app naar een andere.

### Sidebar

- PREMIUM badge bij Kalender verborgen als `isPremium === true`
- "Upgrade naar Premium" blok verborgen als `isPremium === true`
- Profiel-chip toont "PREMIUM" (blauw) of "GRATIS" (grijs), volledige naam, profielkleur
- Profiel-chip klikbaar → navigeert naar `/instellingen`
- Feedback-knop onder profiel (slide-in FeedbackForm)
- Bel-icoon met rode badge voor ongelezen notificaties → NotificationPanel dropdown

### Sorteerlogica transacties

Bij gelijke datum worden nieuwste transacties (hoogste `created_at`) eerst getoond.

### Zichtbare namen vs. code-namen

- Sidebar label **"Analyse"** — route, mapnamen en bestandsnamen blijven `analytics`
- Subtitels verwijderd op alle pagina's — TopBars tonen alleen paginatitel
- Dashboard TopBar toont dynamische begroeting (Goedemorgen/middag/avond) + voornaam uit auth metadata

### Dashboard architectuur

`DashboardPage.jsx` widgets in twee kolommen, drie rijen:
- Rij 1: `DashboardCostSplit` | `DashboardYearChart`
- Rij 2: `DashboardSavingsGoals` | `DashboardRecentTx`
- Rij 3: `DashboardCategoryDonut` | `DashboardRuleScore`

**Huidig saldo:** `activeStartsaldo` uit `useActiveAccount()` (`{ bedrag, datum }`, per actieve rekening) → saldo = startsaldo + inkomsten − uitgaven vanaf peildatum. Maand-onafhankelijk.

**DashboardCostSplit** leest `settings.kosten_inkomen` en `settings.verdeel_methode` via `useSettings`.

**Verdeling verborgen op persoonlijke rekening:** `DashboardVerdeling` ("Jullie verdeling") wordt alleen getoond als er meerdere profielen zijn ÉN de actieve rekening gedeeld is (`activeAccount.gedeeld === true`); rij 2 valt dan terug van 3 naar 2 kolommen.

### Vaste Lasten — twee tabs

`FixedPage.jsx` heeft twee tabs: **Uitgaven** en **Inkomsten**.
- Uitgaven: bestaande werking (FixedCategoryGroup, FixedStats), plus `FixedSuggesties` (suggestie-motor) en `FixedLoanSection` (leningen) bovenaan
- Inkomsten: `FixedInkomstSection` — donut per persoon + categoriegroepen
- `FixedForm` ondersteunt `initialType` prop (`'Inkomst'`/`'Uitgave'`)
- `fixed_expenses.type` kolom: `'Inkomst'` of `'Uitgave'` (default `'Uitgave'`)
- StatCards: groen = inkomsten, rood = uitgaven, blauw = restant
- **Geen auto-transacties meer** — beide tabs zijn puur overzicht/referentie; transacties komen uitsluitend uit CSV-import en handmatige invoer

### Suggestie-motor vaste lasten

`utils/vasteLastenDetectie.js` (`detecteerVasteLasten`) herkent terugkerende Uitgave-patronen in transacties (minimaal 3 transacties over 3 maanden, bedragstabiliteit 70% binnen ±15%, ritme wekelijks/maandelijks/kwartaal/jaarlijks). `components/fixed/FixedSuggesties.jsx` toont dit bovenaan de Vaste Lasten-pagina; gebruiker voegt toe of negeert. Genegeerde suggesties staan in localStorage-key `webfinance_genegeerde_suggesties`.

### Leningen architectuur

`useLoans.js` beheert de Supabase-tabel `loans`. `loans.id` is een bigint-volgnummer, `loans.vaste_last_id` is een uuid die verwijst naar `fixed_expenses.id`. Bij `addLoan` wordt automatisch een gekoppelde vaste last "Aflossing [naam]" aangemaakt (categorie Financieel, subcategorie 'Aflossing lening', soort Noodzaak, type Uitgave, frequentie Maandelijks); `updateLoan` werkt die vaste last bij, `deleteLoan` verwijdert hem mee. Elke van deze drie functies emit't `'fixed_expenses:changed'` zodat de Vaste Lasten-lijst live ververst. Componenten: `FixedLoanSection`, `LoanCard`, `LoanForm`, `DashboardLeningen`.

### Bevestigingsmodal

`components/ui/ConfirmDialog.jsx` is de herbruikbare bevestigingsmodal (via `createPortal`, huisstijl — donkere overlay + gecentreerde kaart, rode primaire knop). Vervangt `window.confirm` bij het verwijderen van transacties, vaste inkomsten, vaste lasten (uitgaven) en leningen.

### Saldo-controle (Instellingen → Saldo)

`SettingsSaldoCheck.jsx` vergelijkt het echte banksaldo met het berekende saldo op een gekozen peildatum via `berekendSaldoOpDatum(allTransactions, activeStartsaldo, peildatum)` in `utils/dashboardCalculations.js`. Bij een verschil kan de gebruiker het startsaldo corrigeren via `updateAccount(activeAccountId, { startsaldoBedrag, startsaldoDatum })` (verlegt naar peildatum + 1 dag, om dubbeltellen te voorkomen). Startsaldo staat per rekening (`rekeningen.startsaldo_bedrag`/`startsaldo_datum`), niet meer in `user_settings`.

### Account verwijderen + Stripe

`SettingsDeleteAccount.jsx` roept de serverless functie `/api/delete-account.js` aan (Bearer-token) i.p.v. rechtstreeks de RPC `delete_my_account()`. Solo-huishouden: Stripe-abonnement opzeggen + heel huishouden wissen + auth-user verwijderen (via SQL-functie `delete_household_cascade(p_household_id)`). Gedeeld huishouden: alleen de vertrekkende gebruiker verwijderen, eigenaarschap wordt overgedragen, gedeelde data + abonnement blijven behouden (via SQL-functie `depart_shared_household(p_user_id)`). Beide SQL-functies zijn SECURITY DEFINER en alleen aanroepbaar door `service_role`.

### Design — winkel/bron vooraan

Winkel/Bron staat vóór Omschrijving en is dikgedrukt; Omschrijving erachter en licht. Toegepast in `TransactionTable`, `IncomeCategoryGroup`, `FixedCategoryGroup`; `DashboardRecentTx` toont winkel als hoofdregel; `CalendarDayDetail`-label toont winkel (valt terug op naam). In de slide-in formulieren (`TransactionForm`, `FixedForm`) staat het Winkel-veld vóór het Omschrijving-veld.

### TransactionForm — bewerk-modus

| Prop | Modus | Gedrag |
|------|-------|--------|
| `editingTransaction = null` | Nieuw | Leeg formulier, "Opslaan en volgende" zichtbaar |
| `editingTransaction = { ...tx }` | Bewerken | Velden ingevuld, "Opslaan en volgende" verborgen |

### Kalender architectuur

Premium-only. Combineert `useTransactions` en `useFixedExpenses` voor verwacht vs. werkelijk.
- `buildDayMap` en `getMondayOfWeek` zijn named exports die in `CalendarPage` hergebruikt worden
- Matching is tolerant (niet exact): `src/utils/kalenderMatch.js` met `MATCH_CONFIG` (dagenGekoppeld 10, dagenHeuristiek 5, dagenWekelijks 3, bedragProcent 0.05, bedragMinimum 1) bepaalt via `isVerwachtGedekt` of een verwachte post al gedekt is door een echte transactie
- `getOccurrencesInMonth` projecteert ook Kwartaal-items
- Handmatig verwijderen via kruisje — opgeslagen in `localStorage` (`webfinance_dismissed_expected`)
- Inkomsten zichtbaar in kalendercellen (groene pijl omhoog)
- Verwachte inkomsten (vaste inkomsten) getoond in kalender
- Hoge uitgaven (>€500) gemarkeerd met rode achtergrond
- StatCards: Inkomsten deze maand, Uitgaven deze maand, Verschil
- Default filter: `'Beide'`

### Huishouden uitnodigingssysteem

- Uitnodigingslink genereren in Instellingen → Huishouden
- `InvitationPage` (/uitnodiging/:token) — volledig buiten ProtectedRoute
- Token bewaard in `sessionStorage` tijdens login/registratie flow
- Eigenaar kan leden verwijderen via `remove_household_member()` RPC
- `role` kolom op `household_members`: `'eigenaar'` of `'lid'`
- Beide partijen ontvangen notificatie bij accepteren

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
| `household_members` | `user_id = auth.uid()` | User ↔ huishouden koppeling (role: eigenaar/lid) |
| `household_invitations` | `household_id = get_my_household_id()` | Uitnodigingslinks met tokens |
| `profiles` | `get_my_household_id()` | Wie-profielen per huishouden (`user_id` kolom koppelt aan auth user) |
| `rekeningen` | persoonlijk-van-mij OF gedeeld-in-mijn-huishouden | Bankrekeningen (persoonlijk/gedeeld), eigen startsaldo |
| `transactions` | `can_access_account(account_id)` | Alle transacties |
| `fixed_expenses` | `can_access_account(account_id)` | Vaste lasten én vaste inkomsten |
| `loans` | `can_access_account(account_id)` | Leningen (id bigint; `vaste_last_id` uuid → `fixed_expenses.id`) |
| `budgets` | `can_access_account(account_id)` | Categorie-budgetten (uniek per household_id + account_id + categorie) |
| `savings_goals` | `can_access_account(account_id)` | Spaardoelen |
| `user_settings` | `user_id = auth.uid()` | Persoonlijke instellingen |
| `feedback` | `household_id = get_my_household_id()` | Gebruikersfeedback + bug-meldingen |
| `notifications` | `user_id = auth.uid()` | Notificaties per gebruiker (`ref_key` UNIQUE voor deduplicatie) |

`can_access_account(p_account_id)` (STABLE) is de RLS-helper voor rekening-gebonden tabellen: toegestaan als de rekening persoonlijk van de aanroeper is, óf gedeeld binnen het eigen huishouden. Vervangt de oude household-brede policies op `transactions`, `fixed_expenses`, `budgets`, `savings_goals` en `loans` voor SELECT/INSERT/UPDATE/DELETE.

### Check constraints (hoofdlettergevoelig!)

| Tabel | Kolom | Toegestane waarden |
|-------|-------|-------------------|
| `transactions` | `type` | `'Inkomst'`, `'Uitgave'` |
| `transactions` | `soort` | `'Noodzaak'`, `'Wens'`, `'Sparen'` |
| `transactions` | `bron` | `'handmatig'`, `'auto'`, `'import'` |
| `fixed_expenses` | `type` | `'Inkomst'`, `'Uitgave'` (default `'Uitgave'`) |
| `fixed_expenses` | `subcategorie` | o.a. `'Aflossing lening'` onder Financieel (voor gekoppelde leningen) |
| `fixed_expenses` | `soort` | `'Noodzaak'`, `'Wens'`, `'Sparen'` |
| `fixed_expenses` | `frequentie` | `'Maandelijks'`, `'Jaarlijks'`, `'Kwartaal'`, `'Wekelijks'` |
| `user_settings` | `datumformaat` | `'long'`, `'dmy'`, `'iso'` |
| `user_settings` | `thema` | `'light'`, `'dark'`, `'auto'` |
| `user_settings` | `verdeel_methode` | `'ratio'`, `'50/50'` |
| `budgets` | `modus` | `'50/30/20'`, `'handmatig'` |

### Kolomnotities

- `transactions.winkel` — kolom toegevoegd (was niet in origineel schema)
- `transactions.beschrijving` (niet `omschrijving`), `transactions.subcategorie` (niet `sub`)
- `user_settings.analytics_order` — default `["categories","subcategories","soort","inkexp"]`
- `user_settings.import_max_regels` — INTEGER, default 1000 (admin-instelling)
- `user_settings.notif_budget` — BOOLEAN, default true
- `user_settings.notif_vaste_lasten` — BOOLEAN, default true
- `household_members.role` — TEXT: `'eigenaar'` of `'lid'`, default `'eigenaar'`
- `feedback.status` — TEXT: `'open'`, `'behandeld'`, `'afgewezen'`
- `profiles.user_id` — UUID, koppelt profiel aan auth user (aangemaakt via `handle_new_user()`)
- `notifications.ref_key` — TEXT UNIQUE, voorkomt dubbele in-memory notificaties in database
- `rekeningen.user_id` — UUID, nullable; eigenaar bij persoonlijke rekening, `null` bij gedeelde rekening
- `rekeningen.gocardless_id` / `rekeningen.koppeling_vervalt` — gereserveerd voor de latere GoCardless-koppeling (`koppeling_vervalt` voor de 90-dagen-vervalmelding)
- `transactions.account_id`, `fixed_expenses.account_id`, `budgets.account_id`, `savings_goals.account_id`, `loans.account_id` — FK naar `rekeningen.id`, ON DELETE CASCADE

### Database-functies met SECURITY DEFINER

**Trigger: on_auth_user_created → `handle_new_user()`**
AFTER INSERT op `auth.users`:
1. Maakt een `households` rij aan
2. Koppelt de user als eigenaar in `household_members`
3. Maakt GZ-profiel aan (`is_deletable: false`)
4. Maakt persoonlijk profiel aan met naam uit auth metadata (`user_id` ingevuld)
5. Maakt `user_settings` rij aan met defaults

**RPC: `delete_my_account()` — vervangen, niet meer gebruikt vanuit de frontend**
Verwijderde alle gebruikersdata in volgorde van foreign key-afhankelijkheden:
transactions → fixed_expenses → budgets → savings_goals → profiles → user_settings → household_members → households → auth.users
`SettingsDeleteAccount.jsx` roept nu de serverless functie `/api/delete-account.js` aan, die via `service_role` de onderstaande twee functies gebruikt.

**RPC: `delete_household_cascade(p_household_id)`**
Verwijdert een heel huishouden inclusief alle data (solo-huishouden bij account verwijderen). SECURITY DEFINER, alleen `service_role`.

**RPC: `depart_shared_household(p_user_id)`**
Verwijdert alleen de vertrekkende gebruiker uit een gedeeld huishouden (household_members + user_settings + auth-user); eigenaarschap wordt overgedragen, gedeelde data + abonnement blijven behouden. SECURITY DEFINER, alleen `service_role`.

**RPC: `accept_household_invitation(invite_token)`**
Voegt accepterende user toe aan huishouden, verstuurt notificaties naar beide partijen.

**RPC: `decline_household_invitation(invite_token)`**
Zet uitnodigingsstatus op afgewezen.

**RPC: `remove_household_member(target_user_id)`**
Verwijdert lid uit huishouden; verwijderd lid krijgt nieuw leeg huishouden + notificatie.

**RPC: `get_household_members()`**
Retourneert ledenlijst van huishouden van de aanroeper (inclusief naam en email).

**RPC: `create_notification(target_user_id, notif_type, notif_titel, notif_bericht, notif_link)`**
Maakt een database-notificatie aan voor een specifieke user.

**RPC: `get_all_feedback()`**
Admin-only: retourneert alle feedback van alle huishoudens.

**RPC: `update_feedback_status(feedback_id, new_status, notitie)`**
Admin-only: wijzigt status en admin-notitie van een feedback-item.

### Overzicht-views (alleen Supabase-dashboard)

`household_overview` en `user_overview` koppelen ID's aan naam/e-mail voor handmatig beheer. Rechten ingetrokken voor `anon`/`authenticated` — nooit bereikbaar via de app-API.

---

## Vercel deployment

- **URL:** https://webfinance-nl.vercel.app
- **Configuratie:** `vercel.json` in repo-root (buildCommand, outputDirectory, rewrites, security headers)
- **Build:** `cd webfinance && npm install && npm run build`
- **Output:** `webfinance/dist`
- **Environment variables:** `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (in Vercel dashboard)
- **Security headers:** CSP, X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy, Permissions-Policy
- **Auto-deploy:** elke push naar `main` triggert automatische deployment
- **SPA routing:** rewrites regel stuurt alle routes naar `index.html`

---

## LocalStorage (minimaal na Supabase-migratie)

| Key | Inhoud | Reden |
|-----|--------|-------|
| `"webfinance_admin_unlocked"` | Boolean | Development only, niet gemigreerd |
| `"webfinance_datumformaat"` | Backward-compat cache | Voor `fmtDate()` zonder format param |
| `"webfinance_custom_categories"` | Backward-compat cache | Voor `getMergedCategories()` zonder param |
| `"webfinance_premium"` | Backward-compat cache | Voor `usePremium()` |
| `"webfinance_dismissed_expected"` | Array van `{ vastelastId, datum }` | Handmatig verwijderde verwachte uitgaven in kalender |

---

## Known issues

1. **Overflow hidden** — Cards met `overflow: 'hidden'` knippen slide-in formulieren of dropdowns af → fix: `createPortal` of `overflow: 'visible'`
2. **CSV parsers ongetest** — parsers voor ING, ABN AMRO, bunq, Knab, Triodos, Revolut, Volksbank zijn geschreven op basis van gedocumenteerde formaten; correctie op basis van gebruikersfeedback
3. ~~**Account verwijderen bij gedeeld huishouden**~~ — **OPGELOST**: `/api/delete-account.js` + `depart_shared_household()` handelen gedeelde huishoudens nu correct af (alleen de vertrekkende gebruiker wordt verwijderd, eigenaarschap overgedragen)

**Noot (bewuste keuze):** het verweesde lege huishouden is opgeruimd; het account `rs.richter7@gmail.com` blijft voorlopig bewust als lid in het huishouden staan — geen actie vereist.

---

## Categorieën

Wonen, Vervoer, Dagelijks leven, Abonnementen & Telecom, Vrije tijd, Financieel, Overig
(zie `src/data/categories.js` voor subcategorieën)

**Subcategorieën onder Financieel: 'Sparen / Beleggen', 'Aflossing lening'**

Kleuren per categorie (zie `src/data/categoryConfig.js`):
- Wonen: blue/blueSoft, icoon: home
- Vervoer: teal/tealSoft, icoon: car
- Dagelijks leven: amber/amberSoft, icoon: coffee
- Abonnementen & Telecom: violet/violetSoft, icoon: wifi
- Vrije tijd: red/redSoft, icoon: target
- Financieel: green/greenSoft, icoon: coin
- Overig: ink3/rule, icoon: grip

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
