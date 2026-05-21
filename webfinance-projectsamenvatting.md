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
- Inline styles met design tokens (T-object)
- Lettertype: Inter (Google Fonts) met tabular-nums
- Geen Tailwind, geen TypeScript, geen Redux
- Data: LocalStorage (later Supabase)
- Hosting: nog niet live (later Vercel)

---

## Projectlocatie

- Mac thuis: `~/Projects/Webfinance/Webfinance/`
- Windows werk: ook werkend (sync via GitHub)
- Online: GitHub Codespaces (primaire ontwikkelomgeving)
- GitHub: `https://github.com/rsrichter7/WebFinance`
- React-code zit in de `webfinance/` submap binnen de repo
- Claude Code is geïnstalleerd in Codespaces met CLAUDE.md in de root

---

## Huidige status

### ✅ Afgerond

- Mappenstructuur opgezet
- Design tokens (`src/tokens.js`)
- Gedeelde componenten (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
- Sidebar met navigatie (inklapbaar, React Router)
- MainLayout (sidebar + content)
- Routing naar alle 7 pagina's

**Transacties pagina volledig werkend:**
- `useTransactions` hook (enige bron van transactie-logica)
- Zoeken, filteren, sorteren
- Alle filters als custom dropdowns (Type, Categorie, Soort, Wie, Maand, Jaar)
- Categorie-filter met twee-staps dropdown (hoofdcategorie → subcategorie)
- Jaar-filter dynamisch op basis van oudste transactie in database
- Jaar-filter staat standaard op het huidige jaar
- Toevoegen via slide-in formulier met custom DatePicker
- Dynamische subcategorieën (op basis van hoofdcategorie)
- Verwijderen (nog geen bewerken)
- LocalStorage persistentie (key: `"webfinance_transactions"`)
- StatCards bovenaan met gekleurde bovenborder (uitgaven=rood, inkomsten=groen, balans=blauw)
- Bron-veld: handmatig toegevoegde transacties krijgen `bron: 'handmatig'`
- AUTO badge: transacties vanuit vaste lasten tonen een paars "AUTO" label bij de datum
- Datum in tabel toont nu ook het jaartal
- Sortering: bij gelijke datum worden nieuwste (hoogste id) eerst getoond

**Vaste Lasten pagina volledig werkend:**
- `useFixedExpenses` hook (enige bron van vaste lasten logica)
- LocalStorage persistentie (key: `"webfinance_fixed"`)
- CRUD operaties (toevoegen, verwijderen, bewerken)
- Slide-in formulier (FixedForm) met alle velden — gebruikt `createPortal`
- Velden per vaste last: omschrijving, bedrag, herhaling (Wekelijks/Maandelijks/Jaarlijks), categorie, subcategorie, type (Uitgave/Inkomst), winkel/bron, startdatum, soort (Noodzaak/Wens/Sparen), wie (RR/AM/GZ), bron
- Gegroepeerde tabellen per hoofdcategorie (FixedCategoryGroup)
- Categorie-iconen en kleuren via `categoryConfig.js`
- StatCards bovenaan met gekleurde bovenborder (lasten=rood, inkomsten=groen, restant=blauw)
- Donut chart met verdeling vaste lasten per categorie
- Lege state als er geen vaste lasten zijn
- Info-vraagteken met uitleg hoe de pagina werkt
- Leningen sectie als placeholder (nog niet werkend)
- **Auto-transactie systeem:**
  - Bij laden van de pagina worden gemiste afschrijvingen automatisch als transactie aangemaakt
  - Bij toevoegen van een nieuwe vaste last worden direct transacties aangemaakt (max 1 maand terug)
  - Elke auto-transactie krijgt `bron: 'auto'` en `vasteLast: item.id`
  - Duplicatie-check voorkomt dubbele transacties
  - Voorbereiding op bankimport: matching mogelijk via vasteLast ID, bedrag (±5%) en datum (±5 dagen)

**Budgetten pagina volledig werkend:**
- `useBudgets` hook (enige bron van budget-logica)
- Leest transacties uit localStorage om besteed-bedragen te berekenen
- 50/30/20 verdeling op basis van `soort`-veld op transacties ('Noodzaak', 'Wens', 'Sparen')
- Handmatige modus: eigen percentages instelbaar, opgeslagen in localStorage
- Maand/jaar selector via pijltjes links/rechts in de TopBar
- Totaal budget = maandelijks inkomen (inkomsttransacties), NIET som van categoriebedragen
- Alle 7 categorieën altijd zichtbaar in de tabel
- Inline bewerken van subcategorie-budgetten via edit-icoontje (geen slide-in formulier)
- "Nog te verdelen" indicator in de categorie-tabel
- Spaardoelen: inline formulier voor toevoegen, storten en verwijderen
- `huidigBedrag` van spaardoelen wordt berekend uit transacties (via `spaardoelId`), niet opgeslagen
- Stortingen worden als transactie aangemaakt (`bron: 'auto'`, `spaardoelId`, categorie 'Financieel', sub 'Sparen / Beleggen', soort 'Sparen')
- LocalStorage keys: `"webfinance_budgets"`, `"webfinance_spaardoelen"`, `"webfinance_budget_modus"`, `"webfinance_budget_verdeling"`

### 🔲 Nog te bouwen (in deze volgorde)

1. Analytics pagina
2. Instellingen pagina
3. Kalender pagina (premium)
4. Dashboard pagina (als laatste — samenvatting van alles)

### 🔮 Later (niet nu)

- Bewerken van transacties (edit modal)
- Leningen sectie werkend maken
- Paginering in tabellen
- Dark mode
- Supabase database
- Authenticatie / login
- Bankimport (premium) — met matching tegen auto-transacties
- AI-categorisering
- Hosting op Vercel

---

## Mappenstructuur

```
src/
├── components/
│   ├── ui/Card.jsx             → Herbruikbare UI (Card, StatCard, Badge, Toggle, ProgressBar, PctBadge, etc.)
│   ├── ui/Icons.jsx            → Alle iconen (Lucide-stijl)
│   ├── ui/DatePicker.jsx       → Custom datumkiezer (kalenderweergave)
│   ├── sidebar/Sidebar.jsx     → Navigatie sidebar
│   ├── transactions/           → Transactie componenten:
│   │   ├── TransactionTopBar.jsx
│   │   ├── TransactionFilters.jsx   (bevat ook CustomDropdown + CategoryDropdown)
│   │   ├── TransactionTable.jsx
│   │   └── TransactionForm.jsx
│   ├── fixed/                  → Vaste lasten componenten:
│   │   ├── FixedTopBar.jsx
│   │   ├── FixedStats.jsx           (StatCards + MiniDonut)
│   │   ├── FixedCategoryGroup.jsx   (gegroepeerde tabel per categorie)
│   │   ├── FixedForm.jsx            (slide-in formulier, gebruikt createPortal)
│   │   └── FixedLoanSection.jsx     (placeholder)
│   └── budgets/                → Budget componenten:
│       ├── BudgetTopBar.jsx         (titel + maandselector)
│       ├── BudgetStats.jsx          (3 StatCards)
│       ├── BudgetRuleSection.jsx    (50/30/20 kaarten + toggle)
│       ├── BudgetCategoryTable.jsx  (inline bewerken, overflow: 'visible')
│       ├── BudgetSavingsGoals.jsx   (spaardoelen met storten)
│       └── BudgetForm.jsx           (niet actief in gebruik)
│
├── pages/                      → Eén bestand per pagina (max 100 regels)
│   ├── DashboardPage.jsx       (placeholder)
│   ├── TransactionsPage.jsx    (werkend)
│   ├── AnalyticsPage.jsx       (placeholder)
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
│   ├── categoryConfig.js       → Icoon- en kleurkoppeling per categorie
│   ├── transactions.js         → Sample transacties
│   ├── fixed.js                → Sample vaste lasten
│   └── budgets.js              → Sample budgetten en spaardoelen
│
├── styles/index.css            → Basis CSS
├── tokens.js                   → Design tokens (kleuren, formatting)
└── App.jsx                     → Routing
```

---

## Belangrijke beslissingen

- **Noodzaak / Wens / Sparen** vervangt "Vast / Variabel" (mapped op 50/30/20 regel)
- **Wie** veld bij transacties en vaste lasten: Ronald (RR), Anne (AM), Gezamenlijk (GZ)
- **Subcategorieën** zijn dynamisch — resetten bij wijziging hoofdcategorie
- **Elke hook is de ENIGE plek** voor zijn eigen state en logica
- **Pagina-bestanden zijn dun** (max 50-100 regels) — logica zit in hooks, UI in componenten
- **Dashboard wordt als LAATSTE gebouwd**
- **Elk data-bestand is de single source of truth** voor dat type data
- **Totalen** heten uitgaven, inkomsten en balans (transacties) / restant (vaste lasten)
- **Filters** gebruiken een herbruikbare `CustomDropdown` component (geen native `<select>`)
- **DatePicker** is een eigen component in `src/components/ui/` — geen native `<input type="date">`
- **StatCards** hebben een gekleurde bovenborder via de `accent` prop
- **Bron-veld** op transacties: `'handmatig'`, `'auto'`, later `'import'`
- **Auto-transacties** vanuit vaste lasten: gemarkeerd via `vasteLast: item.id` en `bron: 'auto'`
- **Nieuwe vaste lasten** genereren max 1 maand terug aan auto-transacties
- **Categorie config** (iconen + kleuren) staat in `src/data/categoryConfig.js`
- **Totaal budget** = maandelijks inkomen (inkomsttransacties), NIET som van categorie-budgetten
- **50/30/20 verdeling** berekend via `soort`-veld op transacties ('Noodzaak', 'Wens', 'Sparen')
- **Handmatige verdeling** percentages opgeslagen in key `"webfinance_budget_verdeling"`
- **Spaardoel `huidigBedrag`** wordt berekend uit transacties met `spaardoelId`, niet opgeslagen op het spaardoel zelf
- **Stortingen op spaardoelen** zijn transacties met `bron: 'auto'`, `spaardoelId`, categorie 'Financieel', sub 'Sparen / Beleggen', soort 'Sparen'
- **Alle 7 categorieën** staan altijd in de budget-tabel (geen filter op besteed/budget > 0)
- **Sorteerlogica transacties**: bij gelijke datum worden nieuwste (hoogste id) eerst getoond
- **Grote toevoegingen** (nieuwe pagina's) via Claude Code, daarna finetuning via claude.ai chat
- **Eerst hele app bouwen met LocalStorage**, daarna in één keer migreren naar Supabase

---

## LocalStorage keys

| Key | Inhoud |
|-----|--------|
| `"webfinance_transactions"` | Alle transacties (handmatig + auto-transacties + stortingen) |
| `"webfinance_fixed"` | Vaste lasten items |
| `"webfinance_budgets"` | Categorie-budgetten |
| `"webfinance_spaardoelen"` | Spaardoelen (zonder huidigBedrag) |
| `"webfinance_budget_modus"` | `'50/30/20'` of `'handmatig'` |
| `"webfinance_budget_verdeling"` | Aangepaste percentages `{ noodzaak, wens, sparen }` |

---

## Known issue: overflow hidden

**BELANGRIJK voor alle nieuwe componenten:**

Cards en containers met `overflow: 'hidden'` kunnen ervoor zorgen dat:
1. **Slide-in formulieren niet zichtbaar zijn** — fix: gebruik `createPortal(... , document.body)` uit `react-dom`
2. **Tabelinhoud of dropdowns worden afgekapt** — fix: gebruik `overflow: 'visible'` op de Card

Dit is een terugkerend probleem geweest bij Vaste Lasten én Budgetten pagina. Bij nieuwe componenten altijd checken:
- Slide-in formulieren → gebruik `createPortal`
- Cards met tabelinhoud of dropdowns → `overflow: 'visible'` (niet `'hidden'`)

---

## Categorieën

Wonen, Vervoer, Dagelijks leven, Abonnementen & Telecom, Vrije tijd, Financieel, Overig
(elk met subcategorieën — zie `src/data/categories.js`)

Subcategorie onder Financieel: **'Sparen / Beleggen'** (hernoemd van 'Sparen')

Kleuren per categorie (zie `src/data/categoryConfig.js`):
- Wonen: blue/blueSoft, icoon: home
- Vervoer: teal/tealSoft, icoon: car
- Dagelijks leven: amber/amberSoft, icoon: coffee
- Abonnementen & Telecom: violet/violetSoft, icoon: wifi
- Vrije tijd: red/redSoft, icoon: target
- Financieel: green/greenSoft, icoon: coin
- Overig: ink3/rule, icoon: grip

---

## Verdienmodel (voor later, niet nu bouwen)

- Gratis: basisfuncties + advertenties, max 100 transacties/maand
- Premium (€3-5/mnd): ongelimiteerd, kalender, bankimport, data-export, aanpasbare analytics, geen advertenties

---

## Design referenties

De design .jsx bestanden staan in de `Design/` map op GitHub. Deze zijn visuele referenties, geen werkende code:
- dashboard.jsx, transacties.jsx, analytics.jsx, budgetten.jsx
- vaste-lasten.jsx, kalender.jsx, instellingen.jsx

---

## Werkwijze

- **Grote toevoegingen** (nieuwe pagina's, nieuwe hooks): via Claude Code in Codespaces
- **Finetuning en aanpassingen**: via claude.ai chat — Claude schrijft code, Ronald kopieert naar Codespaces
- **Altijd eerst akkoord vragen** voordat er code geschreven wordt
- **Stap voor stap bouwen** — niet alles tegelijk
- **Projectsamenvatting bijwerken** na elke grote bouwfase
- **CLAUDE.md updaten** in Codespaces na elke projectsamenvatting-update
