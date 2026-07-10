# Webfinance — Definitief functielijst per pagina

Versie: 12 mei 2026 (v2 — definitief)
Status: Klaar voor design

---

## Algemene beslissingen

- Taal: Nederlands (eerste versie). Meertalig later (Engels, Duits, etc.)
- Bij eerste gebruik: taalkeuze
- Lettertype: Inter met tabular numbers (font-variant-numeric: tabular-nums)
- Sidebar: inklapbaar (iconen-only ~64px / volledig ~240px)
- Bedragen: gebruiker voert altijd positief getal in, kiest type (Uitgave/Inkomst)
- Uitgave is de standaard bij invoer
- Kleuren minimaal in tabellen — subtiele iconen/pijltjes, geen rood/groen bombardement
- Dashboard als laatste coderen (eerst ontwerpen, als laatste bouwen)

---

## Categorieën & subcategorieën (voorlopig)

### Wonen
- Huur / Hypotheek
- Gas / Water / Licht
- Gemeentelijke belastingen
- Verzekeringen (woning)
- Onderhoud / Verbouwing

### Vervoer
- Brandstof / Laden
- Auto-onderhoud
- Parkeren
- Openbaar vervoer

### Dagelijks leven
- Boodschappen
- Horeca & Afhaal
- Verzorging & Huishouden

### Abonnementen & Telecom
- Streaming (Netflix, Spotify, etc.)
- Internet & TV
- Telefoon
- Bankkosten
- Overige abonnementen

### Vrije tijd
- Vakantie
- Shoppen
- Sport & Hobby
- Cadeaus
- Uitgaan

### Financieel
- Salaris / Inkomsten
- Leningen (aflossing)
- Sparen
- Onvoorzien / Buffer
- Belastingteruggave

### Overig
- Overig (door gebruiker in te vullen)

Gebruiker kan zelf categorieën en subcategorieën toevoegen/verwijderen in Instellingen.

---

## Soort-indeling (vervangt Vast/Variabel)

| Soort      | Betekenis                                   | 50/30/20 mapping |
|------------|---------------------------------------------|-------------------|
| Noodzaak   | Vaste lasten, basisbehoeften, must-haves    | 50%               |
| Wens       | Leuke dingen, persoonlijke keuzes, nice-to-haves | 30%          |
| Sparen     | Spaargeld, beleggingen, aflossing schulden  | 20%               |

---

## Transactievelden (bij elke transactie)

| Veld              | Type        | Toelichting                                    |
|-------------------|-------------|------------------------------------------------|
| Datum             | Datumkiezer | Standaard: vandaag                             |
| Bedrag            | Getal (€)   | Altijd positief, systeem maakt +/-             |
| Omschrijving      | Tekst       | Vrij invullen                                  |
| Type              | Dropdown    | Uitgave (standaard) / Inkomst                  |
| Categorie         | Dropdown    | Hoofdcategorie                                 |
| Subcategorie      | Dropdown    | Verschijnt na keuze hoofdcategorie             |
| Winkel / Bron     | Tekst       | Waar gekocht/ontvangen (was: "Waar")           |
| Soort             | Keuze       | Noodzaak / Wens / Sparen                       |
| Wie               | Dropdown    | Ronald / Anne (personen uit huishouden)        |
| Notitie           | Tekst       | Optioneel, extra toelichting                   |
| Rekening          | Dropdown    | (Premium) Welke bankrekening                   |

---

## PAGINA 1: Dashboard

Ontwerpen: nu
Bouwen: als laatste

### Inhoud
- Welkomstbericht: "Goedemiddag, Ronald"
- Snelle actie-knop: "+ Transactie" (compact snelformulier)
- 4 statistiekkaarten: saldo, inkomsten, uitgaven, budget resterend
- Donut chart: uitgaven per hoofdcategorie
- Bar chart: inkomsten vs uitgaven per maand
- Spaardoelen met voortgangsbalken
- Recente transacties (laatste 5)
- Kostenverdeling Ronald / Anne
- 50/30/20 indicator: hoe scoor je deze maand vs de regel
- ✅ Rekeningkiezer (rekening-switcher in sidebar) — afgerond, meerdere rekeningen (persoonlijk/gedeeld) live
- (Later) Notificaties/meldingen

---

## PAGINA 2: Transacties

### Bovenste sectie
- Zoekbalk: live zoeken op omschrijving en winkel/bron
- Filters: type, hoofdcategorie, subcategorie, maand, soort (noodzaak/wens/sparen), wie
- Knop "+ Nieuwe transactie" → opent invoerformulier (slide-in paneel)
- Knop "Importeren" → gratis: uitleg + upgrade CTA / premium: CSV, Excel, bankimport
- Twee totaal-badges: totaal uitgaven, totaal inkomsten

### Invoerformulier
- Alle velden uit transactievelden-tabel hierboven
- Subcategorie verschijnt dynamisch na keuze hoofdcategorie
- "Wie" veld met personen uit huishouden
- Opslaan-knop + "Opslaan en nog één toevoegen"
- Slimme suggesties: na 3x dezelfde winkel invullen, stelt systeem categorie en winkel voor

### Tabel
- Kolommen: datum, bedrag, omschrijving, type, categorie, winkel/bron, soort, wie
- Sorteerbaar per kolom
- Bedragen: subtiel icoon (↓ uitgave / ↑ inkomst), geen felle kleuren
- Type en soort als kleine badges
- Bewerken-knop en verwijderen-knop per rij
- Footer: aantal transacties
- Paginering of "meer laden" bij veel transacties

### Premium indicators
- Import-knop met lock-icoon voor gratis gebruikers
- Bankimport badge "Premium"

---

## PAGINA 3: Analytics

### Bovenste sectie
- Periode-selector: maand / kwartaal / jaar (pill-knoppen)
- Maandselector of datumrange-picker

### Vaste grafieken (gratis)
- Balans-lijndiagram: saldo verloop over tijd
- Lijndiagram: uitgaven-trend over de geselecteerde periode
- Staafdiagram: top 5 categorieën (horizontale balken)
- Vergelijkingskaarten: deze maand vs vorige maand
  - Uitgaven, inkomsten, saldo
  - Met percentage stijging/daling en pijltje

### Aanpasbare widgets (premium)
- Sectie "Mijn overzichten" met uitleg
- Drag-and-drop grid
- Beschikbare widgets:
  1. Uitgaven per categorie (donut)
  2. Inkomsten vs uitgaven per maand (staaf)
  3. Kostenverdeling Ronald / Anne
  4. Spaardoelen voortgang
  5. Noodzaak vs Wens vs Sparen verdeling
  6. 50/30/20 score per maand
  7. Weekdag-analyse (wanneer geef je het meeste uit)
  8. Gemiddelde daguitgave
  9. Jaaroverzicht vergelijking (dit jaar vs vorig jaar)
  10. Uitgaven per persoon (wie geeft wat uit)
  11. Categorie-trend over meerdere maanden
- Knop "+ Widget toevoegen" → keuzemenu
- Gratis gebruikers: lock-icoon + "Upgrade naar Premium"

---

## PAGINA 4: Budgetten

### Overzichtskaarten (bovenaan)
- Totaal budget ingesteld
- Totaal besteed
- Totaal resterend

### 50/30/20 Budget methode
- Toggle of keuzemenu: "Handmatig" of "50/30/20 regel"
- Bij 50/30/20: systeem berekent automatisch budgetten op basis van netto inkomen:
  - Noodzaak (50%): €3.069,49 (50% van €6.138,98 gezamenlijk)
  - Wens (30%): €1.841,69
  - Sparen (20%): €1.227,80
- Per soort een grote voortgangsbalk met besteed vs budget
- Indicatie of je op schema zit (groen/oranje/rood)
- Toelichting: "Gebaseerd op jullie gezamenlijk netto inkomen van €6.138,98"

### Budget per categorie
- Per HOOFDCATEGORIE een budgetregel:
  - Categorienaam met icoon
  - Ingesteld budget (aanpasbaar, of automatisch bij 50/30/20)
  - Besteed bedrag
  - Voortgangsbalk (groen <60%, oranje 60-80%, rood >80%)
  - Resterend
- Uitklapbaar: subcategorieën met eigen sub-budgetten
- Knop "+ Budget instellen" voor nieuwe categorie

### Spaardoelen
- Per doel: naam, streefbedrag, huidig bedrag, voortgangsbalk
- Optioneel: deadline
- Knop "Storten" → bedrag toevoegen aan spaardoel
- Knop "+ Spaardoel toevoegen"

---

## PAGINA 5: Vaste Lasten

### Overzichtskaarten (bovenaan)
- Totaal vaste lasten / maand
- Vaste inkomsten / maand
- Restant / maand

### Gegroepeerde tabellen per hoofdcategorie
- Elke hoofdcategorie (Wonen, Abonnementen, etc.) als eigen sectie
- Per sectie een tabel met:
  - Omschrijving
  - Bedrag
  - Herhaling (maandelijks/wekelijks/jaarlijks)
  - Subcategorie
  - Winkel / Bron
  - Type (uitgave/inkomst)
  - Bewerken / verwijderen
- Subtotaal per groep

### Leningen (speciaal type binnen Vaste Lasten)
- Type "Lening" met extra velden:
  - Totaalbedrag lening
  - Rentepercentage
  - Maandelijkse aflossing
  - Looptijd
  - Restschuld
- Aflossingsoverzicht: tabel of grafiek met verloop restschuld

### Invoerformulier
- Knop "+ Vaste last toevoegen"
- Velden: omschrijving, bedrag, herhaling, categorie, subcategorie, type, winkel/bron, startdatum
- Extra velden als type "Lening" gekozen wordt

### Kleine grafiek
- Donut of staafdiagram: verdeling vaste lasten per hoofdcategorie

---

## PAGINA 6: Kalender (Premium)

### Maandweergave
- Kalender met dagen
- Per dag: verwachte uitgaven (op basis van vaste lasten)
- Per dag: werkelijke uitgaven (op basis van transacties)
- Kleurcodering: groen (onder budget), oranje (bijna budget), rood (over budget)

### Functies
- Klikken op een dag → overzicht van transacties die dag
- Verwachte komende uitgaven op basis van vaste lasten
- Maand-totaal balk onderaan
- Navigatie: vorige/volgende maand

### Premium indicator
- Hele pagina met lock-overlay voor gratis gebruikers
- "Upgrade naar Premium voor de financiële kalender"

---

## PAGINA 7: Instellingen

### Categorieën beheren
- Lijst van hoofdcategorieën, elk uitklapbaar naar subcategorieën
- Toevoegen en verwijderen van hoofd- en subcategorieën
- Drag-and-drop voor volgorde
- Icoon kiezen per categorie (optioneel)

### Huishouden / Personen
- Per persoon: naam + netto salaris
- Verdeelmethode: naar ratio / 50-50 / handmatig
- Knop "+ Persoon toevoegen"
- Knop "Persoon verwijderen"

### Budget methode
- Keuze: Handmatig / 50-30-20 regel
- Bij 50/30/20: automatische berekening op basis van netto inkomen huishouden
- Aanpasbare percentages (bijv. 60/25/15 als je dat wilt)

### Weergave
- Thema: licht / donker / systeem
- Taal: Nederlands (later: Engels, Duits, Frans, Spaans)
- Valuta: EUR (later uitbreidbaar)
- Startpagina: Dashboard (standaard) / Transacties / Analytics
- Compacte modus aan/uit

### Meldingen
- Budgetwaarschuwing aan/uit (met drempel: 80% standaard)
- Maandelijks overzicht e-mail aan/uit
- Herinnering vaste lasten aan/uit

### Rekeningen (Premium)
- Bankrekeningen koppelen
- Handmatig rekening toevoegen (naam + saldo)
- Per rekening: saldo, laatste sync, transacties

### Account (placeholder)
- Profielgegevens (naam, e-mail)
- Wachtwoord wijzigen
- Abonnement: Gratis / Premium
- Upgrade-knop
- Data exporteren (CSV/Excel/PDF)
- Account verwijderen

---

## Navigatie sidebar (definitief)

Icoon + label (ingeklapt: alleen icoon):

1. 📊 Dashboard
2. 💳 Transacties
3. 📈 Analytics
4. 💰 Budgetten
5. 📅 Vaste Lasten
6. 🗓️ Kalender (Premium badge)
7. ⚙️ Instellingen

Onderaan sidebar:
- Profielsectie: initialen + naam + "Gratis" of "Premium" badge
- Inklap-knop (chevron)

---

## Slimme functies (later toe te voegen)

- Terugkerende transactie-herkenning: na 3x dezelfde winkel → automatische suggestie
- Maandafsluiting: samenvatting met score vs budget
- Snelle invoer op Dashboard: compact formulier zonder pagina-switch
- AI-categorisering bij bankimport (premium)
- n8n workflow voor automatisering

---

## Verdienmodel samenvatting

### Gratis
- Transacties invoeren (max 100/maand)
- Basis dashboard
- Vaste grafieken in Analytics
- Budgetten instellen (handmatig + 50/30/20)
- Vaste lasten beheren
- Advertenties (subtiel, niet opdringerig)

### Premium (€3-5/maand)
- Ongelimiteerde transacties
- Aanpasbare Analytics widgets
- Kalender
- Bankimport / CSV-Excel import
- ✅ Meerdere rekeningen — afgerond, live
- Leningen-tracker
- Data export
- Geen advertenties
- (Later) AI-inzichten
- (Later) Automatische categorisering

---

## Volgende stappen

1. ✅ Functielijst vastgesteld (dit document)
2. → Dashboard design afronden (grafieken fixen)
3. → Design per pagina maken in Claude Design
4. → Alle designs goedkeuren
5. → Coderen (transacties eerst, dashboard als laatste)
