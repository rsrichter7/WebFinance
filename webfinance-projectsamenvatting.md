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
- Online: StackBlitz (gekoppeld aan GitHub)
- GitHub: `https://github.com/rsrichter7/WebFinance`
- React-code zit in de `webfinance/` submap binnen de repo

---

## Huidige status

### ✅ Afgerond
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

### 🔲 Nog te bouwen (in deze volgorde)
1. Vaste Lasten pagina
2. Budgetten pagina (met 50/30/20 regel)
3. Analytics pagina
4. Instellingen pagina
5. Kalender pagina (premium)
6. Dashboard pagina (als laatste — samenvatting van alles)

### 🔮 Later (niet nu)
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
