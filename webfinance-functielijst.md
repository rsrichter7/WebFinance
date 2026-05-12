# Webfinance — Definitief functielijst per pagina

Versie: 12 mei 2026
Status: Klaar voor design

---

## Algemene beslissingen

- Taal: Nederlands (eerste versie). Meertalig later (Engels, Duits, etc.)
- Bij eerste gebruik: taalkeuze
- Lettertype: Inter met tabular numbers
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
| Soort             | Keuze       | Noodzaak / Wens / Sparen (was: Vast/Variabel)  |
| Wie               | Dropdown    | Ronald / Anne (of wie er in huishouden zit)    |
| Notitie           | Tekst       | Optioneel, extra toelichting                   |
| Rekening          | Dropdown    | (Premium) Welke bankrekening                   |

---

## PAGINA 1: Dashboard

Ontwerpen: nu
Bouwen: als laatste

### Inhoud
- Welkomstbericht: "Goedemiddag, Ronald"
- Snelle actie-knop: "+ Transactie"
- 4 statistiekkaarten: saldo, inkomsten, uitgaven, budget resterend
- Donut chart: uitgaven per hoofdcategorie
- Bar chart: inkomsten vs uitgaven per maand
- Spaardoelen met voortgangsbalken
- Recente transacties (laatste 5)
- Kostenverdeling Ronald / Anne
- (Later) Rekeningkiezer als meerdere rekeningen gekoppeld zijn
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
- Balans-lijndiagram: saldo verloop over tijd (NIEUW)
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
  6. Weekdag-analyse (wanneer geef je het meeste uit)
  7. Gemiddelde daguitgave
  8. Jaaroverzicht vergelijking (dit jaar vs vorig jaar)
  9. Uitgaven per persoon (wie geeft wat uit)
  10. Categorie-trend over meerdere maanden
- Knop "+ Widget toevoegen" → keuzemenu
- Gratis gebruikers: lock-icoon + "Upgrade naar Premium"

---

## PAGINA 4: Budgetten

### Overzichtskaarten (bovenaan)
- Totaal budget ingesteld
- Totaal besteed
- Totaal resterend

### Budget per categorie
- Per HOOFDCATEGORIE een budgetregel:
  - Categorienaam met icoon
  - Ingesteld budget (aanpasbaar)
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
  - Winkel/Bron
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

## PAGINA 6: Kalender (NIEUW — Premium)

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

### Weergave
- Thema: licht / donker / systeem
- Taal: Nederlands (later: Engels, Duits, Frans, Spaans)
- Valuta: EUR (later uitbreidbaar)
- Startpagina: Dashboard (standaard) / Transacties / Analytics
- Compacte modus aan/uit (kleinere kaarten, meer data op scherm)

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

## Verdienmodel samenvatting

### Gratis
- Transacties invoeren (max 100/maand?)
- Basis dashboard
- Vaste grafieken in Analytics
- Budgetten instellen
- Vaste lasten beheren
- Advertenties (subtiel, niet opdringerig)

### Premium (€3-5/maand)
- Ongelimiteerde transacties
- Aanpasbare Analytics widgets
- Kalender
- Bankimport / CSV-Excel import
- Meerdere rekeningen
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
