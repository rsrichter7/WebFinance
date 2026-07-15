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
- **Hosting: Vercel** — live op https://webfinance-nl.vercel.app (`vercel.json` in repo-root)
- **SMTP:** Resend geconfigureerd als e-mailprovider in Supabase (sender: Webfinance via onboarding@resend.dev)

---

## Huidige status

### ✅ Afgerond — alle pagina's + authenticatie + Supabase + CSV import + security + dark mode + notificaties + uitnodigingen + feedback + Vercel deployment + meerdere rekeningen + landingspagina + Stripe-abonnementen + Enable Banking bankkoppeling + retentie-cron

**Supabase backend volledig werkend:**
- Authenticatie via email/wachtwoord én Google OAuth, `useAuth` hook, `LoginPage`, `ProtectedRoute`
- Email-verificatie verplicht bij registratie (via Resend SMTP); wachtwoord minimaal 8 tekens
- **Naamveld bij registratie** — "Volledige naam" veld bij email-registratie; Google OAuth haalt naam automatisch op
- `useHousehold` hook — haalt household_id op van ingelogde user; gebruikt door alle data-hooks
- `useSettings` hook — centrale instellingen per user (Supabase `user_settings` tabel)
- Auto-setup trigger bij registratie: huishouden + GZ-profiel + persoonlijk profiel + user_settings aangemaakt via `handle_new_user()` met SECURITY DEFINER
- **`handle_new_user()` trigger bijgewerkt** — maakt nu ook persoonlijk profiel aan met naam uit auth metadata (`user_id` ingevuld)
- RLS-policies op alle tabellen — gebruikers zien alleen eigen huishouden-data
- `household_members` RLS: directe `user_id = auth.uid()` check (niet via `get_my_household_id()` wegens circulaire afhankelijkheid)
- GRANT op alle tabellen voor de `authenticated` rol (nodig omdat "Automatically expose new tables" uit staat)
- Check constraints hoofdlettergevoelig: `Inkomst`/`Uitgave`, `Noodzaak`/`Wens`/`Sparen`, `Maandelijks`/`Jaarlijks`/etc.
- localStorage opgeruimd — alleen backward-compat syncs + `admin_unlocked` blijven
- **`user_id` kolom op `profiles`** — koppelt profiel aan auth user

**Alle pagina's werkend:**
- **Dashboard** — begroeting (voornaam uit auth metadata, refresht via `refreshUser()`), maandselector, 3 StatCards, kostenverdeling, staafdiagram, spaardoelen, recente tx, donut, 50/30/20 score
- **Transacties** — zoeken, filteren, sorteren, toevoegen, bewerken, verwijderen, auto-badge, import
- **Vaste Lasten** — twee tabs (Uitgaven / Inkomsten), CRUD voor beide types, puur overzicht/referentie (maakt geen automatische transacties meer aan), donut chart, gegroepeerde tabellen per categorie, suggestie-motor herkent terugkerende vaste lasten uit transacties, leningen-sectie met gekoppelde aflossing-vaste-last
- **Budgetten** — 50/30/20 + handmatige modus, categorie-tabel, spaardoelen met storten
- **Analyse** — 4 grafieken in versleepbaar 2×2 grid, periode-filters, premium sectie
- **Instellingen** — profiel, huishouden (met ledenlijst + uitnodigingen), saldo, voorkeuren (incl. thema), categorieën, data beheer, notificaties, admin (incl. feedback-overzicht)
- **Kalender** — premium-only, maand/week view, verwacht vs. werkelijk, inkomsten zichtbaar, hoge uitgaven gemarkeerd
- **Privacy policy** — statische pagina op `/privacy`, toegankelijk zonder login (AVG)
- **Uitnodigingspagina** — `/uitnodiging/:token`, buiten ProtectedRoute

**Vercel deployment live:**
- App draait op https://webfinance-nl.vercel.app
- Automatische deploy bij elke push naar `main`
- **Favicon** — SVG met €-teken in donker afgerond vierkant, consistent met sidebar-logo
- **Login-logo** — aangepast naar zelfde stijl als sidebar (€-teken in donker vierkant)

**Dark mode volledig werkend:**
- `ThemeProvider` context via `useTheme.jsx` — drie opties: Licht, Donker, Automatisch
- `lightTokens` en `darkTokens` in `tokens.js`; instant thema-wissel (lokale state eerst, Supabase async)

**Notificatiesysteem werkend:**
- `notifications` tabel in Supabase met RLS
- In-memory notificaties (budget, vaste lasten) persistent via `ref_key` (UNIQUE) — geen duplicaten tussen sessies
- Bel-icoon in sidebar + NotificationPanel dropdown + SettingsNotifications paginering
- Toggles: `notif_budget` en `notif_vaste_lasten` in `user_settings`

**Huishouden uitnodigingssysteem + Feedbacksysteem werkend:**
- Uitnodigingslink genereren, token in sessionStorage, eigenaar kan leden verwijderen
- Feedback-knop in sidebar → FeedbackForm → admin-overzicht in SettingsAdmin

**CSV Import volledig werkend:**
- Import-flow: CSV uploaden → bankdetectie → parsing → duplicaat-check → vaste lasten matching → preview-tabel → importeren
- Ondersteunde banken: Rabobank, ING, ABN AMRO, ASN Bank, SNS Bank, RegioBank, bunq, Knab, Triodos Bank, Revolut
- IBAN-stripping, AI-hulp kopieer/plak, Admin instelling `import_max_regels` (default 1000)

**Profielensysteem volledig werkend:**
- `useProfiles` hook — data uit Supabase, CRUD
- Dynamische wie-knoppen, WieAvatar op kleur, GZ-profiel (`is_deletable: false`)
- Persoonlijk profiel aangemaakt bij registratie via trigger; `user_id` kolom aanwezig

**Security-hardening afgerond:**
- Centrale invoervalidatie (`src/utils/validation.js`) — 7 functies
- Content Security Policy + security headers in `vercel.json`
- Account verwijderen (AVG) via serverless functie `/api/delete-account.js` (Stripe opzeggen + huishouden/gebruiker correct verwijderen — zie hieronder), data-export als Excel (.xlsx)

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
- Vergelijkt echt banksaldo met berekend saldo op een datum; "Corrigeer startsaldo" verlegt het startsaldo van de actieve rekening (ankert op dag+1 om dubbeltellen te voorkomen) via `updateAccount(activeAccountId, { startsaldoBedrag, startsaldoDatum })`

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
- Nieuwe tabel `rekeningen` (persoonlijk of gedeeld, eigenaar via `user_id`, eigen startsaldo, velden voor latere Enable Banking-koppeling alvast gereserveerd). `account_id` toegevoegd aan `transactions`, `fixed_expenses`, `budgets`, `savings_goals`, `loans` (ON DELETE CASCADE)
- Precies één ACTIEVE rekening tegelijk — transacties, vaste lasten/inkomsten, budgetten, spaardoelen, leningen en saldo tonen alleen data van die rekening; wisselen via `AccountSwitcher` in de sidebar
- Nieuwe hooks `useAccounts.js` (CRUD) en `useActiveAccount.jsx` (context: `activeAccount`, `activeAccountId`, `activeStartsaldo`, `setActiveAccount`)
- Instellingen → Rekeningen (`SettingsAccounts.jsx`): rekeningen aanmaken/hernoemen/verwijderen, persoonlijk/gedeeld kiezen; laatste rekening niet verwijderbaar
- Startsaldo staat nu per rekening (`rekeningen.startsaldo_bedrag`/`startsaldo_datum`), niet meer huishouden-breed in `user_settings`
- Op een persoonlijke rekening ligt `wie` vast op de eigenaar (keuzerij verborgen in `TransactionForm`/`FixedForm`, veiligheidsklep bij onherleidbaar profiel); dashboard verbergt "Jullie verdeling" op persoonlijke rekeningen
- Budget-uniekheid nu per `(household_id, account_id, categorie)` i.p.v. `(household_id, categorie)`
- RLS: nieuwe helper `can_access_account()` ("persoonlijk-van-mij OF gedeeld-in-mijn-huishouden"), vervangt de oude household-brede policies op alle vijf rekening-gebonden tabellen

**Supabase overzicht-views (alleen dashboard):**
- `household_overview` en `user_overview` koppelen ID's aan naam/e-mail voor handmatig beheer in het Supabase-dashboard. Rechten ingetrokken voor `anon`/`authenticated` (nooit via de app-API bereikbaar)

**Publieke landingspagina:**
- `LandingPage.jsx` — gemonteerd op `/` (via `SmartRoot`: toont de landingspagina aan uitgelogde bezoekers, stuurt ingelogde gebruikers door naar `/dashboard`) en expliciet op `/welkom`. Volledig buiten `ProtectedRoute`
- Opbouw: `LandingNav` → `LandingHero` → `LandingPainSection` → vier `LandingQuestionSection`-blokken (elk met een mockup: `DonutMockup`, `StackedBarMockup`, `ProgressMockup`, `UpcomingMockup`) → `LandingUSP` → `LandingPricing` → `LandingCTA` → `LandingFooter`
- `LandingPricing`: drie statische planskaarten (Maandelijks €3,99 / Per kwartaal €9,99 / Per jaar €29,99), roept zelf geen Stripe-checkout aan — elke CTA linkt naar `/login?modus=registreren`; checkout start pas na inloggen vanuit `Paywall.jsx`

**Stripe-abonnementen en checkout:**
- Nieuwe Supabase-tabel `subscriptions` (per huishouden): `household_id`, `stripe_customer_id`, `stripe_subscription_id`, `status` (`trialing`/`active`/`past_due`/`canceled`), `plan`, `trial_ends_at`, `current_period_end`
- `api/create-checkout.js` maakt de Stripe Checkout Session aan (iDEAL + kaart, NL-locale, prijzen uit env vars `STRIPE_PRICE_MONTHLY`/`QUARTERLY`/`YEARLY`); `webfinance/src/utils/checkout.js` (`startCheckout(plan)`) roept dit aan vanuit `Paywall.jsx` en `SettingsAccounts.jsx`
- Terugkeerpagina's: `CheckoutSuccessPage.jsx` (`/abonnement/geslaagd`, pollt `subscriptions.status` tot `active`) en `CheckoutCancelPage.jsx` (`/abonnement/geannuleerd`)
- `api/stripe-webhook.js` verwerkt `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted` en `invoice.payment_failed` en is de enige plek die `subscriptions` bijwerkt
- `RequireSubscription.jsx` (wrapt `MainLayout`) toont `Paywall.jsx` zodra `useSubscription().hasAccess` false is; server-side gebeurt dezelfde check via `api/_lib/toegang.js` (`heeftToegang()`, fail-open zonder bestaande `subscriptions`-rij)
- **Openstaand:** geen code in frontend of `api/` zet `trial_ends_at`/`status: 'trialing'` bij het aanmaken van een huishouden — vermoedelijk een Supabase-default/trigger die nog niet gedocumenteerd is; navragen/controleren

**Enable Banking bankkoppeling (nu live, was roadmap-item):**
- Flow: "Koppel bank" in `SettingsAccounts.jsx` → `BankKoppelModal.jsx` → `api/bank/start.js` (checkt `heeftToegang`, redirect naar eigen bank via Enable Banking `/auth`) → `/bank/callback` → `BankCallbackPage.jsx`/`api/bank/callback.js` (matcht rekeningen op `identificatie_hash`/IBAN) → gebruiker kiest per rekening "nieuw" of koppelen → `api/bank/koppel.js` verwerkt in `rekeningen`
- **Automatisch herkoppelen:** al gekoppelde rekeningen die terugkomen (matched op `identificatie_hash`) worden stil bijgewerkt, geen keuzescherm nodig
- Nieuwe kolommen op `rekeningen`: `extern_account_id`, `provider` (`'enablebanking'`), `identificatie_hash`, `sessie_id`, `koppeling_vervalt` (max 180 dagen), `aspsp_naam`, `laatst_gesynct`
- **Sync is een preview:** `api/bank/sync.js` haalt en dedupliceert transacties (op `transactions.extern_transactie_id`); `BankImportFlow.jsx` (Transacties-pagina) doet de daadwerkelijke insert ná gebruikersreview, net als bij CSV-import
- **Ontkoppelen** (`api/bank/ontkoppel.js`): wist alleen de bank-kolommen, sluit de EB-sessie als geen andere rekening ernaar verwijst
- **Vervalmelding:** 14 dagen vóór `koppeling_vervalt` via `useNotifications.js`; `AccountRow.jsx` toont badge + "Opnieuw koppelen"-knop, ook bij syncfout
- **Achter abonnement/proefperiode:** `start`, `callback`, `koppel` en `sync` checken allemaal `heeftToegang()` server-side (402 zonder geldig abonnement)
- **Voorwaardenpagina:** `TermsPage.jsx` (`/voorwaarden`) — 9 secties, bevat nog `[Placeholder: ...]`-tekst die juridisch nagekeken moet worden vóór live

**Retentie-cron voor verlopen abonnementen:**
- `vercel.json` → dagelijkse cron `0 3 * * *` op `/api/cron/retentie`, beveiligd met `Authorization: Bearer ${CRON_SECRET}`
- Nieuwe tabel `household_retentie` (`household_id`, `verlopen_sinds`, `koppelingen_opgezegd`, `waarschuwing_30d_verzonden`, `waarschuwing_7d_verzonden`, `data_gewist_op`)
- `api/cron/retentie.js`: geen toegang + nog geen retentie-rij → koppelingen opzeggen + retentie-rij aanmaken + `mailVerlopen`. Bestaande rij: bij 335/358 dagen waarschuwingsmail (30/7 dagen), bij 365 dagen `wis_household_data(household_id)` (RPC) + `mailDataGewist`. Weer toegang vóór het wissen → retentie-rij wordt verwijderd
- `api/_lib/mail.js` (nodemailer, Resend-SMTP, eigen `RESEND_API_KEY`) + `api/_lib/retentieMails.js` (vier e-mailteksten)
- SQL-migratie (`sql/retentie_migration.sql`) is uitgevoerd en na afloop weer uit de repo verwijderd

### 🔮 Roadmap

**Afgerond:** Meerdere rekeningen per account, publieke landingspagina, Stripe-abonnementen, Enable Banking bankkoppeling, retentie-cron (zie hierboven).

**Nog te doen, in deze volgorde:**
1. Zelf analyses opzetten — eigen analyses samenstellen, filteren en opslaan op de Analyse-pagina.
2. Meertaligheid (vlak vóór live) — automatische vertaling via i18next/react-i18next (Nederlands standaard; taalkeuze uit selectielijst bij eerste aanmelding). Nieuwe npm-package, eerst overleggen. Vertaalsysteem trekt teksten uit de UI; vertalingen zelf moeten worden aangeleverd/nagekeken (financiële termen).
3. Uitleg per pagina (vlak vóór live, als allerlaatste) — per pagina een volledige uitleg van de functies + eenvoudig uitgelegde formules, zichtbaar bij eerste aanmelding en opnieuw op te roepen via een knop. Pas bouwen na meertaligheid, zodat de uitlegteksten mee vertaald kunnen worden.

**Nog te controleren:** waar/hoe `subscriptions.trial_ends_at`/`status: 'trialing'` precies gezet worden bij huishouden-aanmaak (geen treffer in applicatiecode). De `[Placeholder: ...]`-teksten in `TermsPage.jsx` moeten juridisch nagekeken worden vóór live.

### 🔮 Later (niet nu)

- Automatische AI-categorisering via Anthropic API (premium)
- Paginering in tabellen (bij 2000+ transacties)
- Cookie-banner (bij analytics)

---

## Mappenstructuur

```
src/
├── components/
│   ├── ui/Card.jsx             → Herbruikbare UI (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
│   ├── ui/Icons.jsx            → Alle iconen (Lucide-stijl, ICONS object)
│   ├── ui/DatePicker.jsx       → Custom datumkiezer (kalenderweergave)
│   ├── ui/NotificationPanel.jsx → Dropdown met laatste 3 notificaties + bel-icoon badge
│   ├── ui/ConfirmDialog.jsx    → Herbruikbare bevestigingsmodal (createPortal, huisstijl)
│   ├── auth/
│   │   ├── LoginPage.jsx       → Login + registratie + Google OAuth + email-verificatie flow (dark mode)
│   │   └── ProtectedRoute.jsx  → Route-bescherming (redirect naar /login)
│   ├── feedback/
│   │   └── FeedbackForm.jsx    → Slide-in panel: onderwerp, bericht, optioneel afbeelding
│   ├── landing/                → LandingNav, LandingHero, LandingPainSection, LandingQuestionSection,
│   │                             LandingUSP, LandingPricing, LandingCTA, LandingFooter,
│   │                             mockups/ (ProgressMockup, DonutMockup, UpcomingMockup, StackedBarMockup)
│   ├── paywall/                → Paywall.jsx (planskaarten + upgrade-CTA), RequireSubscription.jsx (wrapt MainLayout)
│   ├── sidebar/                → Sidebar.jsx (navigatie, inklapbaar, premium-bewust, feedback-knop, bel-icoon),
│   │                             AccountSwitcher.jsx (rekening-switcher dropdown onder logo, createPortal)
│   ├── transactions/           → TransactionTopBar (incl. bank-ingang), TransactionFilters, TransactionTable,
│   │                             TransactionForm, ImportFlow, ImportPreviewTable, ImportAiModal,
│   │                             BankInstructies, BankImportFlow (Enable Banking preview-flow)
│   ├── fixed/                  → FixedTopBar, FixedStats, FixedCategoryGroup, FixedForm,
│   │                             FixedInkomstSection, FixedSuggesties, FixedLoanSection,
│   │                             LoanCard, LoanForm
│   ├── budgets/                → BudgetTopBar, BudgetStats, BudgetRuleSection, BudgetCategoryTable,
│   │                             BudgetSavingsGoals, BudgetForm
│   ├── analytics/              → AnalyticsTopBar, AnalyticsPeriodFilter, AnalyticsChartCard,
│   │                             AnalyticsTopCategories, AnalyticsTopSubcategories, AnalyticsSoortDonut,
│   │                             AnalyticsIncomeExpense, AnalyticsPremiumSection
│   ├── calendar/               → CalendarTopBar, CalendarMonthNav, CalendarGrid, CalendarDayCell,
│   │                             CalendarWeekView, CalendarDayDetail, CalendarStats, CalendarLegend
│   ├── dashboard/              → DashboardTopBar, DashboardStatCards, DashboardCategoryDonut,
│   │                             DashboardYearChart, DashboardSavingsGoals, DashboardRecentTx,
│   │                             DashboardCostSplit, DashboardIncomeModal, DashboardRuleScore,
│   │                             DashboardLeningen
│   └── settings/               → SettingsTopBar, SettingsSidebar, SettingsHousehold,
│                                 SettingsHouseholdInvitations, SettingsProfile, SettingsAccounts,
│                                 BankKoppelModal (Enable Banking koppelflow), AccountRow (per rekening,
│                                 incl. vervalbadge + herkoppel-knop),
│                                 SettingsSaldo, SettingsSaldoCheck, SettingsPreferences, SettingsCategories,
│                                 SettingsDataManagement, SettingsDeleteAccount,
│                                 SettingsNotifications, SettingsAbout, SettingsAdmin,
│                                 SettingsFeedback, VerwijderLidModal
│
├── pages/                      → Eén bestand per pagina (max 100 regels)
│   ├── LandingPage.jsx         → Publieke landingspagina (/, /welkom, buiten ProtectedRoute)
│   ├── DashboardPage.jsx
│   ├── TransactionsPage.jsx
│   ├── AnalyticsPage.jsx
│   ├── BudgetsPage.jsx
│   ├── FixedPage.jsx
│   ├── SettingsPage.jsx
│   ├── PrivacyPage.jsx         → Statische privacy policy pagina (/privacy, geen login vereist)
│   ├── TermsPage.jsx           → Voorwaardenpagina (/voorwaarden, geen login vereist, bevat placeholders)
│   ├── CalendarPage.jsx        (premium only)
│   ├── InvitationPage.jsx      → Uitnodigingspagina (/uitnodiging/:token, buiten ProtectedRoute)
│   ├── BankCallbackPage.jsx    → Enable Banking terugkeerpagina (/bank/callback), rekening kiezen/koppelen
│   ├── CheckoutSuccessPage.jsx → Stripe terugkeerpagina (/abonnement/geslaagd), pollt subscriptions.status
│   └── CheckoutCancelPage.jsx  → Stripe terugkeerpagina (/abonnement/geannuleerd)
│
├── layouts/MainLayout.jsx      → Sidebar + content wrapper
├── hooks/
│   ├── cacheManager.js         → In-memory cache utilities voor alle data-hooks + pub/sub (subscribe/emit)
│   ├── useAuth.js              → Supabase authenticatie (login, logout, sessie, Google OAuth, refreshUser)
│   ├── useHousehold.js         → Household_id ophalen van ingelogde user
│   ├── useAccounts.js          → CRUD op rekeningen (Supabase rekeningen tabel)
│   ├── useActiveAccount.jsx    → AccountProvider + useActiveAccount(): actieve rekening, activeStartsaldo
│   ├── useSubscription.js      → isTrialing/isActive/hasAccess/trialDaysLeft uit subscriptions tabel
│   ├── useSettings.js          → Centrale user settings (Supabase user_settings tabel)
│   ├── useTransactions.js      → Alle transactie state & logica (Supabase)
│   ├── useFixedExpenses.js     → Alle vaste lasten state & logica (Supabase, incl. type Inkomst/Uitgave, geen auto-transacties)
│   ├── useLoans.js             → Leningen CRUD + gekoppelde aflossing-vaste-last (Supabase loans tabel)
│   ├── useBudgets.js           → Alle budget state & logica (Supabase)
│   ├── usePremium.js           → Centrale premium-status app-breed (via useSettings)
│   ├── useProfiles.js          → Centrale profielen app-breed (Supabase profiles tabel)
│   ├── useTheme.jsx            → ThemeProvider + useTheme hook (licht/donker/auto)
│   ├── useFeedback.js          → Feedback CRUD (Supabase feedback tabel)
│   ├── useInvitations.js       → Huishouden uitnodigingen (aanmaken, accepteren, afwijzen, annuleren)
│   └── useNotifications.js     → Combineert database- en in-memory notificaties (persistent via ref_key)
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
│   ├── validation.js           → Centrale invoervalidatie: validateBedrag/Datum/Tekst/Categorie/Soort/Type/Wie
│   ├── kalenderMatch.js        → MATCH_CONFIG + maakActualsIndex + isVerwachtGedekt (tolerante kalender-match)
│   ├── vasteLastenDetectie.js  → detecteerVasteLasten (suggestie-motor vaste lasten uit transacties)
│   ├── dashboardCalculations.js → o.a. berekendSaldoOpDatum(allTransactions, startsaldo, peildatum)
│   ├── loanCalculations.js     → huidigeMaandlast, berekenEinddatum, resterendeMaanden
│   ├── checkout.js             → startCheckout(plan) — roept api/create-checkout aan, redirect naar Stripe
│   └── parsers/                → Per bank een eigen parser + helpers.js
│       ├── helpers.js          → parseCsvText, parseBedragKomma/Punt, parseDate*, makeTx, stripIBANs
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
├── tokens.js                   → Design tokens (lightTokens/darkTokens) + fmt() + fmtShort() + fmtDate()
└── App.jsx                     → Routing (ProtectedRoute; /, /welkom, /privacy, /voorwaarden,
                                  /uitnodiging/:token, /bank/callback buiten ProtectedRoute;
                                  RequireSubscription wrapt MainLayout binnen ProtectedRoute)

vercel.json                 ← In de root van de repo (naast webfinance/), incl. crons-config
api/delete-account.js       ← Serverless functie, Stripe opzeggen + huishouden/gebruiker verwijderen
api/create-checkout.js      ← Serverless functie, maakt Stripe Checkout Session aan
api/stripe-webhook.js       ← Serverless functie, verwerkt Stripe-webhookevents (subscriptions tabel)
api/cron/retentie.js        ← Dagelijkse cron (03:00 UTC), verwerkt verlopen abonnementen/koppelingen
api/bank/                   → start.js, callback.js, koppel.js, sync.js, ontkoppel.js, aspsps.js
                               (Enable Banking koppelflow — serverside)
api/_lib/                   → enableBanking.js (ebFetch helper), toegang.js (heeftToegang),
                               mail.js (sendMail via Resend-SMTP), retentieMails.js (e-mailteksten)
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
- `useSubscription.js` — leidt `isTrialing`/`isActive`/`hasAccess`/`trialDaysLeft` af van de Supabase `subscriptions` tabel; drijft `RequireSubscription`/`Paywall` aan
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

Er is altijd precies één ACTIEVE rekening. `useActiveAccount()` levert `activeAccount`/`activeAccountId`/`activeStartsaldo`; alle rekening-gebonden hooks filteren en stempelen daarop. Rekeningen zijn PERSOONLIJK (`gedeeld: false`, `user_id` = eigenaar) of GEDEELD (`gedeeld: true`, `user_id: null`). `addAccount` in `useAccounts.js` bepaalt de eigenaar expliciet op basis van `gedeeld` — niet overschrijfbaar via de meegegeven data.

Op een persoonlijke rekening is `wie` altijd de eigenaar: `TransactionForm` en `FixedForm` zoeken het profiel met `profiles.userId === activeAccount.userId`, forceren `wie` daarop en verbergen de wie-keuzerij. Zonder herleidbaar profiel valt het terug op de normale keuzerij (veiligheidsklep). Dashboard verbergt `DashboardVerdeling` ("Jullie verdeling") op persoonlijke rekeningen — rij 2 valt dan terug van 3 naar 2 kolommen.

`AccountSwitcher.jsx` (sidebar, onder het logo) wisselt de actieve rekening; `SettingsAccounts.jsx` (Instellingen → Rekeningen) beheert CRUD. Verwijderen van een rekening cascadeert naar alle gekoppelde data; bij verwijderen van de actieve rekening springt de app naar een andere.

### Sidebar premium-logica

- PREMIUM badge bij Kalender verborgen als `isPremium === true`
- "Upgrade naar Premium" blok verborgen als `isPremium === true`
- Profiel-chip toont "PREMIUM" (blauw) of "GRATIS" (grijs)

### Sorteerlogica transacties

Bij gelijke datum worden nieuwste transacties (hoogste `created_at`) eerst getoond.

### Zichtbare namen vs. code-namen

- Sidebar label **"Analyse"** — route, mapnamen en bestandsnamen blijven `analytics`
- Subtitels verwijderd op alle pagina's — TopBars tonen alleen paginatitel
- Dashboard TopBar toont dynamische begroeting (Goedemorgen/middag/avond) + voornaam uit auth metadata (`user_metadata.full_name`), refresht via `refreshUser()`

### Dashboard architectuur

`DashboardPage.jsx` widgets in twee kolommen, drie rijen:
- Rij 1: `DashboardCostSplit` | `DashboardYearChart`
- Rij 2: `DashboardSavingsGoals` | `DashboardRecentTx`
- Rij 3: `DashboardCategoryDonut` | `DashboardRuleScore`

**Huidig saldo:** `activeStartsaldo` uit `useActiveAccount()` (`{ bedrag, datum }`, per actieve rekening) → saldo = startsaldo + inkomsten − uitgaven vanaf peildatum. Maand-onafhankelijk.

**DashboardCostSplit** leest `settings.kosten_inkomen` en `settings.verdeel_methode` via `useSettings`.

### TransactionForm — bewerk-modus

| Prop | Modus | Gedrag |
|------|-------|--------|
| `editingTransaction = null` | Nieuw | Leeg formulier, "Opslaan en volgende" zichtbaar |
| `editingTransaction = { ...tx }` | Bewerken | Velden ingevuld, "Opslaan en volgende" verborgen |

### Kalender architectuur

Premium-only. Combineert `useTransactions` en `useFixedExpenses` voor verwacht vs. werkelijk. `buildDayMap` en `getMondayOfWeek` zijn named exports die in `CalendarPage` hergebruikt worden. Matching is tolerant (niet exact): `src/utils/kalenderMatch.js` met `MATCH_CONFIG` (speling op dagen en op bedrag-%) bepaalt via `isVerwachtGedekt` of een verwachte post al gedekt is door een echte transactie. `getOccurrencesInMonth` projecteert ook Kwartaal-items.

### Saldo-controle (Instellingen → Saldo)

`SettingsSaldoCheck.jsx` vergelijkt het echte banksaldo met het berekende saldo op een gekozen peildatum via `berekendSaldoOpDatum(allTransactions, activeStartsaldo, peildatum)` in `utils/dashboardCalculations.js`. Bij een verschil kan de gebruiker het startsaldo corrigeren via `updateAccount(activeAccountId, { startsaldoBedrag, startsaldoDatum })` (verlegt naar peildatum + 1 dag, om dubbeltellen te voorkomen). Startsaldo staat per rekening (`rekeningen.startsaldo_bedrag`/`startsaldo_datum`), niet meer in `user_settings`.

### Suggestie-motor vaste lasten

`utils/vasteLastenDetectie.js` (`detecteerVasteLasten`) herkent terugkerende Uitgave-patronen in transacties (minimaal 3 transacties over 3 maanden, bedragstabiliteit 70% binnen ±15%, ritme wekelijks/maandelijks/kwartaal/jaarlijks). `components/fixed/FixedSuggesties.jsx` toont dit bovenaan de Vaste Lasten-pagina; gebruiker voegt toe of negeert. Genegeerde suggesties staan in localStorage-key `webfinance_genegeerde_suggesties`.

### Leningen architectuur

`useLoans.js` beheert de Supabase-tabel `loans`. `loans.id` is een bigint-volgnummer, `loans.vaste_last_id` is een uuid die verwijst naar `fixed_expenses.id`. Bij `addLoan` wordt automatisch een gekoppelde vaste last "Aflossing [naam]" aangemaakt (categorie Financieel, subcategorie 'Aflossing lening', soort Noodzaak, type Uitgave, frequentie Maandelijks); `updateLoan` werkt die vaste last bij, `deleteLoan` verwijdert hem mee. Elke van deze drie functies emit't `'fixed_expenses:changed'` zodat de Vaste Lasten-lijst live ververst. Componenten: `FixedLoanSection`, `LoanCard`, `LoanForm`, `DashboardLeningen`.

### Bevestigingsmodal

`components/ui/ConfirmDialog.jsx` is de herbruikbare bevestigingsmodal (via `createPortal`, huisstijl — donkere overlay + gecentreerde kaart, rode primaire knop). Vervangt `window.confirm` bij het verwijderen van transacties, vaste inkomsten, vaste lasten (uitgaven) en leningen.

### Account verwijderen + Stripe

`SettingsDeleteAccount.jsx` roept de serverless functie `/api/delete-account.js` aan (Bearer-token) i.p.v. rechtstreeks de RPC `delete_my_account()`. Solo-huishouden: Stripe-abonnement opzeggen + heel huishouden wissen + auth-user verwijderen (via SQL-functie `delete_household_cascade(p_household_id)`). Gedeeld huishouden: alleen de vertrekkende gebruiker verwijderen, eigenaarschap wordt overgedragen, gedeelde data + abonnement blijven behouden (via SQL-functie `depart_shared_household(p_user_id)`). Beide SQL-functies zijn SECURITY DEFINER en alleen aanroepbaar door `service_role`.

### Stripe-abonnementen — toegangscontrole

`subscriptions` (per `household_id`) is de bron van waarheid voor betaalde toegang: `status` (`trialing`/`active`/`past_due`/`canceled`), `plan`, `trial_ends_at`, `current_period_end`, `stripe_customer_id`, `stripe_subscription_id`.

- **Client-side:** `useSubscription.js` berekent `isTrialing`/`isActive`/`hasAccess`/`trialDaysLeft`; `RequireSubscription.jsx` wrapt `MainLayout` in `App.jsx` en toont `Paywall.jsx` (roept `startCheckout(plan)` uit `utils/checkout.js` aan) zodra `hasAccess` false is.
- **Server-side:** elk endpoint dat Enable Banking ontsluit checkt zelf nogmaals via `api/_lib/toegang.js` → `heeftToegang(supabase, householdId)` — fail-open (`true`) zonder bestaande `subscriptions`-rij, anders `true` bij niet-verlopen `trialing` of bij `active`.
- **Checkout:** `api/create-checkout.js` maakt de Stripe Checkout Session aan. `api/stripe-webhook.js` is de enige plek die `subscriptions.status`/`plan`/`current_period_end` bijwerkt, op basis van vier Stripe-events.
- **Openstaand:** niets in de repo zet `trial_ends_at`/`status: 'trialing'` bij het aanmaken van een huishouden — vermoedelijk een Supabase-default/trigger die nog niet in de codebase-documentatie zit.

### Enable Banking bankkoppeling

Volledige serverside flow onder `api/bank/` (`start.js`, `callback.js`, `koppel.js`, `sync.js`, `ontkoppel.js`, `aspsps.js`) plus de gedeelde helper `api/_lib/enableBanking.js` (`ebFetch`). Frontend: `BankKoppelModal.jsx` (starten), `BankCallbackPage.jsx` (`/bank/callback`, rekening kiezen/koppelen), `AccountRow.jsx` + `SettingsAccounts.jsx` (beheer, vervalbadges, herkoppelen), `BankImportFlow.jsx` (preview + import op de Transacties-pagina).

- **Koppelen:** `start.js` → Enable Banking `/auth` (redirect naar eigen bank) → `bank_koppeling_sessies`-rij bijhoudt `state`/status. Na bank-login: `callback.js` wisselt de `code` om, matcht binnenkomende rekeningen op `identificatie_hash` (al gekoppeld → **stil herkoppelen**, geen keuzescherm nodig) of IBAN (suggestie) of biedt "nieuw" aan; `koppel.js` verwerkt de definitieve keuze in `rekeningen`.
- **Rekeningen-kolommen:** `extern_account_id`, `provider` (`'enablebanking'`), `identificatie_hash`, `sessie_id`, `koppeling_vervalt`, `aspsp_naam`, `laatst_gesynct`.
- **Sync is een preview, geen directe insert:** `sync.js` haalt en dedupliceert transacties (op `transactions.extern_transactie_id`) en geeft ze terug aan `BankImportFlow.jsx`, die ná gebruikersreview pas echt invoert (zelfde `markDuplicates`/`matchFixedExpenses` als bij CSV-import).
- **Ontkoppelen:** `ontkoppel.js` wist alleen de bank-kolommen (rekening + transacties blijven bestaan) en sluit de EB-sessie als er geen andere rekening meer naar verwijst.
- **Vervalmelding:** `koppeling_vervalt` (max 180 dagen) triggert een notificatie 14 dagen van tevoren via `useNotifications.js`; `AccountRow.jsx` toont een badge + herkoppel-knop, ook bij een syncfout in `BankImportFlow.jsx`.
- **Achter abonnement:** elk van deze vier endpoints (`start`, `callback`, `koppel`, `sync`) checkt `heeftToegang()` en geeft `402` terug zonder geldig abonnement/proefperiode.

### Retentie-cron

`api/cron/retentie.js` draait dagelijks (`vercel.json` cron, 03:00 UTC, beveiligd met `CRON_SECRET`) en loopt over alle huishoudens. Zonder toegang (abonnement/proefperiode verlopen) en zonder bestaande `household_retentie`-rij: koppelingen opzeggen (EB-sessies sluiten + bank-kolommen op `rekeningen` wissen) + retentie-rij aanmaken + `mailVerlopen`. Met een bestaande rij: bij 335/358/365 dagen sinds `verlopen_sinds` respectievelijk een waarschuwingsmail op 30/7 dagen en, bij 365 dagen, `wis_household_data(household_id)` (RPC) + `mailDataGewist`. Krijgt het huishouden weer toegang vóór het wissen, dan wordt de retentie-rij verwijderd. E-mails via `api/_lib/mail.js` (nodemailer, Resend-SMTP, eigen `RESEND_API_KEY` los van de Supabase-auth-SMTP) en `api/_lib/retentieMails.js`.

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
| `rekeningen` | persoonlijk-van-mij OF gedeeld-in-mijn-huishouden | Bankrekeningen (persoonlijk/gedeeld), eigen startsaldo |
| `transactions` | `can_access_account(account_id)` | Alle transacties |
| `fixed_expenses` | `can_access_account(account_id)` | Vaste lasten (én vaste inkomsten) |
| `loans` | `can_access_account(account_id)` | Leningen (id bigint; `vaste_last_id` uuid → `fixed_expenses.id`) |
| `budgets` | `can_access_account(account_id)` | Categorie-budgetten (uniek per household_id + account_id + categorie) |
| `savings_goals` | `can_access_account(account_id)` | Spaardoelen |
| `user_settings` | `user_id = auth.uid()` | Persoonlijke instellingen |
| `subscriptions` | `household_id = get_my_household_id()` | Eén rij per huishouden: Stripe-abonnement/proefperiode-status |
| `bank_koppeling_sessies` | `household_id = get_my_household_id()` | Enable Banking auth-state tijdens het koppelen (`state`, `status`) |
| `household_retentie` | service_role only (geen directe app-toegang) | Voortgang van de retentie-cron per huishouden na verlopen abonnement |

`can_access_account(p_account_id)` (STABLE) is de RLS-helper voor rekening-gebonden tabellen: toegestaan als de rekening persoonlijk van de aanroeper is, óf gedeeld binnen het eigen huishouden. Vervangt de oude household-brede policies op `transactions`, `fixed_expenses`, `budgets`, `savings_goals` en `loans`.

### Check constraints (hoofdlettergevoelig!)

| Tabel | Kolom | Toegestane waarden |
|-------|-------|-------------------|
| `transactions` | `type` | `'Inkomst'`, `'Uitgave'` |
| `transactions` | `soort` | `'Noodzaak'`, `'Wens'`, `'Sparen'` |
| `transactions` | `bron` | `'handmatig'`, `'auto'`, `'import'`, `'bank'` |
| `rekeningen` | `bron` | `'handmatig'`, `'bank'` |
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
- `user_settings.notif_budget` — BOOLEAN, default true
- `user_settings.notif_vaste_lasten` — BOOLEAN, default true
- `household_members.role` — TEXT: `'eigenaar'` of `'lid'`, default `'eigenaar'`
- `feedback.status` — TEXT: `'open'`, `'behandeld'`, `'afgewezen'`
- `profiles.user_id` — UUID, koppelt profiel aan auth user (aangemaakt via `handle_new_user()`)
- `rekeningen.user_id` — UUID, nullable; eigenaar bij persoonlijke rekening, `null` bij gedeelde rekening
- `rekeningen.extern_account_id` / `rekeningen.provider` / `rekeningen.identificatie_hash` / `rekeningen.sessie_id` / `rekeningen.laatst_gesynct` / `rekeningen.koppeling_vervalt` / `rekeningen.aspsp_naam` — gevuld door de Enable Banking-koppeling (`provider` waarde `'enablebanking'`, `koppeling_vervalt` voor de 180-dagen-vervalmelding, `identificatie_hash` voor automatisch herkoppelen); `transactions.extern_transactie_id` voor ontdubbeling; tabel `bank_koppeling_sessies` koppelt de auth-state aan huishouden+gebruiker
- `transactions.account_id`, `fixed_expenses.account_id`, `budgets.account_id`, `savings_goals.account_id`, `loans.account_id` — FK naar `rekeningen.id`, ON DELETE CASCADE
- `notifications.ref_key` — TEXT UNIQUE, voorkomt dubbele in-memory notificaties in database
- `subscriptions.status` — TEXT: `'trialing'`, `'active'`, `'past_due'`, `'canceled'`; `subscriptions.plan` — TEXT: `'monthly'`/`'quarterly'`/`'yearly'`
- `household_retentie.verlopen_sinds` — TIMESTAMPTZ, start van de aftelperiode na verlopen abonnement; `data_gewist_op` — NULL tot de 365-dagen-wis heeft plaatsgevonden

### Trigger: on_auth_user_created

AFTER INSERT op `auth.users` — functie `handle_new_user()` met SECURITY DEFINER:
1. Maakt een `households` rij aan
2. Koppelt de user als eigenaar in `household_members`
3. Maakt GZ-profiel aan (`is_deletable: false`)
4. Maakt persoonlijk profiel aan met naam uit auth metadata (`user_id` ingevuld)
5. Maakt `user_settings` rij aan met defaults

Dit is de **eerste** uitzondering op de "geen SECURITY DEFINER" regel.

### RPC: delete_my_account() — vervangen, niet meer gebruikt

Verwijderde alle gebruikersdata + auth-account in volgorde van foreign key-afhankelijkheden:
transactions → fixed_expenses → budgets → savings_goals → profiles → user_settings → household_members → households → auth.users

Deze RPC wordt niet meer aangeroepen vanuit de frontend (mag later opgeruimd worden). `SettingsDeleteAccount.jsx` roept nu de serverless functie `/api/delete-account.js` aan, die via `service_role` de onderstaande twee functies gebruikt.

### RPC: delete_household_cascade(p_household_id) en depart_shared_household(p_user_id)

- `delete_household_cascade(p_household_id)` — verwijdert een heel huishouden inclusief alle data (solo-huishouden bij account verwijderen)
- `depart_shared_household(p_user_id)` — verwijdert alleen de vertrekkende gebruiker uit een gedeeld huishouden (household_members + user_settings + auth-user); eigenaarschap wordt overgedragen, gedeelde data + abonnement blijven behouden

Beide zijn SECURITY DEFINER en alleen aanroepbaar met `service_role` (vanuit `/api/delete-account.js`). Dit zijn de **derde en vierde** uitzondering op de "geen SECURITY DEFINER" regel.

### RPC: wis_household_data(p_household_id)

Wist alle data van een huishouden na 365 dagen zonder abonnement (retentie-cron). SECURITY DEFINER, alleen `service_role`, aangeroepen vanuit `api/cron/retentie.js`. Dit is de **vijfde** uitzondering op de "geen SECURITY DEFINER" regel.

### Overzicht-views (alleen Supabase-dashboard)

`household_overview` en `user_overview` koppelen ID's aan naam/e-mail voor handmatig beheer. Rechten ingetrokken voor `anon`/`authenticated` — nooit bereikbaar via de app-API.

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
3. ~~**Account verwijderen bij gedeeld huishouden**~~ — **OPGELOST**: `/api/delete-account.js` + `depart_shared_household()` handelen gedeelde huishoudens nu correct af (alleen de vertrekkende gebruiker wordt verwijderd, eigenaarschap overgedragen)
4. **Proefperiode-toekenning onduidelijk** — geen frontend- of `api/`-code zet `subscriptions.trial_ends_at`/`status: 'trialing'` bij het aanmaken van een huishouden; vermoedelijk een Supabase-default/trigger die nog niet gedocumenteerd is. Controleren voordat hierop wordt vertrouwd
5. **Voorwaardenpagina bevat placeholders** — `TermsPage.jsx` (`/voorwaarden`) heeft nog `[Placeholder: ...]`-teksten in alle 9 secties; juridisch laten nakijken vóór live

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

## Verdienmodel (live via Stripe)

- Gratis: basisfuncties
- Premium (€3,99/mnd, €9,99/kwartaal of €29,99/jaar, incl. proefperiode): ongelimiteerd, kalender, bankimport, Enable Banking bankkoppeling, meerdere bankrekeningen, aanpasbare analytics; AI-categorisering staat nog op de "later"-roadmap

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
