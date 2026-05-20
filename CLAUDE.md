# Webfinance — Projectsamenvatting & Stijlgids

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
- Online: StackBlitz (gekoppeld aan GitHub)
- GitHub: `https://github.com/rsrichter7/WebFinance`
- React-code zit in de `webfinance/` submap binnen de repo

---

## Huidige status

### Afgerond
- Mappenstructuur opgezet
- Design tokens (src/tokens.js)
- Gedeelde componenten (Card, Icons)
- Sidebar met navigatie (inklapbaar, React Router)
- MainLayout (sidebar + content)
- Routing naar alle 7 pagina's
- **Transacties pagina volledig werkend:**
  - useTransactions hook (enige bron van transactie-logica)
  - Zoeken, filteren, sorteren
  - Toevoegen via slide-in formulier
  - Dynamische subcategorieën (op basis van hoofdcategorie)
  - Verwijderen (nog geen bewerken)
  - LocalStorage persistentie (key: "webfinance_transactions")
  - Totalen badges (uitgaven, inkomsten, saldo)

### Nog te bouwen (in deze volgorde)
1. Vaste Lasten pagina
2. Budgetten pagina (met 50/30/20 regel)
3. Analytics pagina
4. Instellingen pagina
5. Kalender pagina (premium)
6. Dashboard pagina (als laatste — samenvatting van alles)

### Later (niet nu)
- Bewerken van transacties (edit modal)
- Paginering in tabellen
- Dark mode
- Supabase database
- Authenticatie / login
- Bankimport (premium)
- AI-categorisering
- Hosting op Vercel

---

## Mappenstructuur

```
src/
├── components/
│   ├── ui/Card.jsx          → Herbruikbare UI (Card, StatCard, Badge, Toggle, etc.)
│   ├── ui/Icons.jsx         → Alle iconen (Lucide-stijl)
│   ├── sidebar/Sidebar.jsx  → Navigatie sidebar
│   └── transactions/        → Transactie componenten:
│       ├── TransactionTopBar.jsx
│       ├── TransactionFilters.jsx
│       ├── TransactionTable.jsx
│       └── TransactionForm.jsx
│
├── pages/                   → Eén bestand per pagina
│   ├── DashboardPage.jsx    (placeholder)
│   ├── TransactionsPage.jsx (werkend)
│   ├── AnalyticsPage.jsx    (placeholder)
│   ├── BudgetsPage.jsx      (placeholder)
│   ├── FixedPage.jsx        (placeholder)
│   ├── CalendarPage.jsx     (placeholder)
│   └── SettingsPage.jsx     (placeholder)
│
├── layouts/MainLayout.jsx   → Sidebar + content wrapper
├── hooks/useTransactions.js → Alle transactie state & logica
├── data/
│   ├── categories.js        → Categorieën, subcategorieën, soorten, personen
│   ├── transactions.js      → Sample transacties (uit Excel)
│   └── fixed.js             → Vaste lasten en spaardoelen
│
├── styles/index.css         → Basis CSS
├── tokens.js                → Design tokens (kleuren, formatting)
└── App.jsx                  → Routing
```

---

## Belangrijke beslissingen

- **Noodzaak / Wens / Sparen** vervangt "Vast / Variabel" (mapped op 50/30/20 regel)
- **Wie** veld bij transacties: Ronald (RR), Anne (AM), Gezamenlijk (GZ)
- **Subcategorieën** zijn dynamisch — resetten bij wijziging hoofdcategorie
- **useTransactions.js** is de ENIGE plek voor transactie-state en logica
- **LocalStorage key:** "webfinance_transactions"
- Elk data-bestand is de single source of truth voor dat type data
- Pagina-bestanden zijn dun (max 50-60 regels) — logica zit in hooks, UI in componenten
- Dashboard wordt als LAATSTE gebouwd

---

## Categorieën

Wonen, Vervoer, Dagelijks leven, Abonnementen & Telecom, Vrije tijd, Financieel, Overig
(elk met subcategorieën — zie src/data/categories.js)

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

## Designregels

1. **Kleuren en tokens** — gebruik ALTIJD de T-tokens uit `src/tokens.js`. Schrijf nooit hardcoded kleuren zoals `'#2563EB'` in componenten. Schrijf `T.blue`.
2. **Styling** — inline styles met het T-object. Geen CSS-modules, geen Tailwind, geen styled-components.
3. **Lettertype** — Inter voor alles. Bedragen altijd met `...TAB` (tabular-nums) style.
4. **Formattering** — gebruik `fmt()` en `fmtShort()` uit tokens.js voor alle bedragen. Nooit zelf formatteren.
5. **Iconen** — gebruik alleen iconen uit `src/components/ui/Icons.jsx`. Voeg nieuwe iconen daar toe, niet in losse bestanden.
6. **Componenten** — herbruikbare UI-elementen (Card, StatCard, Badge, Toggle, etc.) staan in `src/components/ui/Card.jsx`. Gebruik deze, maak geen duplicaten.
7. **Schaduwen** — alleen `T.shadow`. Geen eigen schaduwen verzinnen.
8. **Border radius** — 12px voor kaarten, 8px voor knoppen en inputs, 4-6px voor badges.
9. **Spacing** — padding 22px in kaarten, 28px voor pagina-content, 16-20px gaps in grids.
10. **Geen felle kleuren in tabellen** — subtiele iconen (↑/↓) voor bedragen, geen rood/groen bombardement.

---

## Coderegels

1. **Kleine bestanden** — elk bestand maximaal 150-200 regels. Is het langer? Splits het op in kleinere componenten.
2. **Eén component per bestand** — tenzij het een heel klein hulpcomponent is (bijv. een tabelrij binnen dezelfde tabel).
3. **Duidelijke namen** — `TransactionTable.jsx`, niet `Table2.jsx` of `TxTblFinal.jsx`.
4. **Mappenstructuur** — pagina-specifieke componenten in hun eigen map onder `src/components/`. Gedeelde componenten in `src/components/ui/`.
5. **Data apart** — alle data, sample data en constanten in `src/data/`. Nooit hardcoded data in componenten.
6. **Comments in het Nederlands** — korte beschrijving bovenaan elk bestand. Beschrijf WAT het bestand doet, niet HOE.
7. **Imports bovenaan** — altijd React eerst, dan libraries, dan eigen componenten, dan data/tokens.
8. **Export** — gebruik `export default` voor hoofdcomponenten, named exports voor hulpcomponenten.
9. **State** — useState voor lokale state, Context API als meerdere componenten dezelfde data nodig hebben. Geen Redux.
10. **Geen console.log** — verwijder debug-code voordat je het als klaar presenteert.

---

## Werkwijze

1. **Vraag eerst** — beschrijf wat je gaat bouwen en welke bestanden je aanmaakt/wijzigt. Wacht op akkoord.
2. **Eén onderdeel tegelijk** — bouw niet meerdere pagina's tegelijk.
3. **Bestaande code respecteren** — wijzig geen bestanden die niet relevant zijn voor de huidige opdracht.
4. **Toon de structuur** — na elke wijziging, laat zien welke bestanden zijn aangemaakt of gewijzigd.
5. **Test-instructies** — geef altijd aan wat Ronald moet doen om het resultaat te zien.

---

## Wat NIET doen

- Geen nieuwe npm packages installeren zonder overleg
- Geen mappenstructuur wijzigen zonder overleg
- Geen bestanden hernoemen zonder overleg
- Geen Tailwind, geen CSS-modules, geen styled-components
- Geen complexe state management (Redux, Zustand, etc.)
- Geen TypeScript (we werken met JavaScript)
- Geen code schrijven zonder eerst akkoord te vragen
