# Webfinance — Security Overzicht

**Versie:** 1.0
**Datum:** mei 2026
**Doel:** overzicht van alle beveiligingsmaatregelen voor interne review en externe audit

---

## 1. Architectuur

Webfinance is een single-page application (SPA) zonder eigen server-side code. De architectuur bestaat uit twee lagen:

- **Frontend:** React 18, draait volledig in de browser van de gebruiker. Geen server-side rendering.
- **Backend:** Supabase (PostgreSQL database), gehost in de Europese Unie (Frankfurt, Duitsland).

Alle communicatie tussen frontend en backend verloopt via HTTPS/TLS. Er zijn geen interne API-servers of microservices.

---

## 2. Authenticatie

### Methoden
- **Email/wachtwoord** via Supabase Auth. Wachtwoorden worden opgeslagen als bcrypt-hash door Supabase; de applicatie heeft nooit toegang tot platte wachtwoorden.
- **Google OAuth** als alternatieve inlogmethode. Webfinance ontvangt uitsluitend naam en e-mailadres van Google na succesvolle OAuth-flow.

### Sessie-beheer
- Sessies worden beheerd via JWT-tokens, uitgedeeld door Supabase Auth.
- De React-hook `useAuth` luistert via `onAuthStateChange` — bij verlopen sessie wordt de gebruiker automatisch uitgelogd.
- Alle applicatieroutes zijn beschermd via de `ProtectedRoute` component. Uitzondering: `/login` en `/privacy` zijn publiek toegankelijk.

### Wachtwoordeisen
- Minimaal 8 tekens (client-side validatie vóór Supabase-aanroep).
- Email-verificatie is verplicht bij registratie via email/wachtwoord. Zonder verificatie kan niet worden ingelogd.

---

## 3. Autorisatie — Row Level Security

Supabase Row Level Security (RLS) is ingeschakeld op alle 8 databasetabellen. Elke query wordt automatisch gefilterd op basis van de identiteit van de ingelogde gebruiker:

| Tabel | Filter |
|-------|--------|
| `households` | `get_my_household_id()` |
| `household_members` | `user_id = auth.uid()` |
| `profiles` | `get_my_household_id()` |
| `transactions` | `get_my_household_id()` |
| `fixed_expenses` | `get_my_household_id()` |
| `budgets` | `get_my_household_id()` |
| `savings_goals` | `get_my_household_id()` |
| `user_settings` | `user_id = auth.uid()` |

De RLS-filtering is getest met twee aparte accounts: data-isolatie is bevestigd. Gebruiker A kan nooit data van gebruiker B opvragen of muteren, ook niet via directe API-aanroepen.

---

## 4. Data-bescherming

### Opslaglocatie
Alle gebruikersdata wordt opgeslagen in een PostgreSQL-database via Supabase, gehost in Frankfurt, Duitsland (Europese Unie). Dit valt binnen de AVG/GDPR-vereisten voor dataopslag.

### Gevoelige gegevens
- **IBAN-nummers** worden automatisch gestript bij het verwerken van CSV-bankafschriften, vóór opslag in de database. De `stripIBANs`-functie in `src/utils/parsers/helpers.js` verwijdert patronen die overeenkomen met Europese IBAN-notatie.
- **Wachtwoorden** worden nooit opgeslagen of gelogd in de applicatie.
- **CSV-bestanden** worden volledig client-side verwerkt en worden nooit naar een server gestuurd.

### Lokale opslag
localStorage wordt minimaal gebruikt. Er worden uitsluitend backward-compatibele caches opgeslagen (datumformaat, categorieën, premium-status). Geen financiële data, geen tokens, geen wachtwoorden in localStorage.

### URL-parameters
Geen gevoelige data wordt via URL-parameters doorgegeven. De enige URL-parameter in gebruik is `?deleted=true` na accountverwijdering — een neutrale statusvlag.

---

## 5. Invoervalidatie

Alle gebruikersinvoer wordt gevalideerd via de centrale utility `src/utils/validation.js`. Deze bevat zeven named exports:

| Functie | Valideert |
|---------|-----------|
| `validateBedrag` | Getal, niet negatief, verplicht |
| `validateDatum` | ISO-formaat JJJJ-MM-DD, max. 1 jaar vooruit |
| `validateTekst` | Maximale lengte (standaard 500 tekens) |
| `validateCategorie` | Waarde aanwezig in toegestane lijst |
| `validateSoort` | `Noodzaak`, `Wens` of `Sparen` |
| `validateType` | `Inkomst` of `Uitgave` |
| `validateWie` | Initialen aanwezig in bekende profielen |

Als tweede verdedigingslinie hanteert de database check constraints die dezelfde waarden afdwingen. Een kwaadaardige aanroep die de client-side validatie omzeilt, wordt dus geblokkeerd op databaseniveau.

---

## 6. Frontend security

### Geen gevaarlijke patronen
De codebase bevat geen gebruik van:
- `dangerouslySetInnerHTML`
- `eval()`
- `new Function()`
- `innerHTML` met gebruikersinvoer

React's ingebouwde rendering biedt automatische HTML-escaping, waardoor XSS via de normale renderflow niet mogelijk is.

### Content Security Policy
Voor de Vercel-productieomgeving zijn de volgende HTTP-responseheaders geconfigureerd via `vercel.json`:

**Content-Security-Policy:**
```
default-src 'self';
script-src 'self' 'unsafe-inline';
style-src 'self' 'unsafe-inline';
img-src 'self' data: https:;
font-src 'self' https://fonts.gstatic.com;
connect-src 'self' https://*.supabase.co https://accounts.google.com https://oauth2.googleapis.com;
frame-src https://accounts.google.com;
object-src 'none';
base-uri 'self';
form-action 'self'
```

Toelichting: `'unsafe-inline'` is noodzakelijk vanwege het gebruik van inline styles (bewuste architectuurkeuze in het project) en Vite/React injectie. Er wordt geen externe JavaScript geladen.

**Overige security headers:**

| Header | Waarde |
|--------|--------|
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `1; mode=block` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### Debugcode
De codebase bevat geen `console.log`-statements in productiecode. Dit is een vaste conventie die gehandhaafd wordt via codereviews.

---

## 7. Secrets en sleutelbeheer

- Het `.env`-bestand staat in `.gitignore` en is nooit gecommit naar de git-repository (geverifieerd via git-history scan).
- De Supabase `anon key` (de publieke sleutel voor clientzijdige aanroepen) is de enige sleutel in de frontend. Deze sleutel is ontworpen om publiek te zijn — de werkelijke beveiliging wordt afgedwongen door RLS.
- De Supabase `service_role key` (de beheerderssleutel) is nergens aanwezig in de codebase (geverifieerd via grep-scan).
- Er zijn geen `.csv`-, `.xlsx`- of andere datumbestanden ooit gecommit naar de repository (geverifieerd).

---

## 8. AVG/GDPR compliance

Webfinance biedt gebruikers de volgende AVG-rechten, toegankelijk via de applicatie:

| Recht | Implementatie |
|-------|---------------|
| Recht op inzage | Alle eigen data is zichtbaar in de applicatie |
| Recht op correctie | Alle gegevens zijn bewerkbaar via de UI |
| Recht op verwijdering | Instellingen → Data beheer → Account verwijderen |
| Recht op data-export | Instellingen → Data beheer → Download Excel |

**Account verwijderen** roept de databasefunctie `delete_my_account()` aan. Deze verwijdert in volgorde: transacties, vaste lasten, budgetten, spaardoelen, profielen, instellingen, huishoudenkoppeling, huishouden en tot slot de authenticatiegegevens (`auth.users`). Na verwijdering wordt de sessie beëindigd.

**Privacy policy** is beschikbaar op `/privacy` zonder dat inloggen vereist is. De pagina beschrijft welke gegevens worden verzameld, waarom, en hoe ze worden beschermd.

---

## 9. Deployment security

De Vercel-deploymentconfiguratie (`vercel.json` in de repositoryroot) bevat:

- **`buildCommand`**: bouwt de app vanuit de `webfinance/` submap
- **`outputDirectory`**: wijst naar `webfinance/dist`
- **`rewrites`**: stuurt alle routes door naar `index.html` (noodzakelijk voor client-side routing, geen beveiligingsrisico)
- **Security headers**: zoals beschreven in sectie 6

HTTPS wordt afgedwongen door Vercel voor alle productieverkeer.

---

## 10. Database-functies met verhoogde rechten

Er zijn precies twee PostgreSQL-functies met `SECURITY DEFINER` — bewuste uitzonderingen op de algemene regel dat geen SECURITY DEFINER wordt gebruikt:

**`handle_new_user()`** — trigger die bij registratie automatisch een huishouden, profiel en instellingenrij aanmaakt. Vereist SECURITY DEFINER omdat de trigger schrijft naar tabellen namens een gebruiker die nog geen RLS-toegang heeft.

**`delete_my_account()`** — RPC die alle gebruikersdata verwijdert, inclusief de rij in `auth.users`. Vereist SECURITY DEFINER voor toegang tot het `auth`-schema.

Beide functies zijn doelbewust beperkt in scope en voeren uitsluitend de bedoelde bewerkingen uit.

---

## 11. Openstaande punten

De volgende punten zijn bekend en staan gepland voor de productierelease:

1. **SMTP-provider** — De Supabase-standaard bevestigingsmail heeft een limiet van 2 berichten per uur. Voor productie is een externe SMTP-provider nodig (bijvoorbeeld Resend of Postmark).
2. **Productie-URL's** — De Supabase Site URL en OAuth redirect URLs moeten worden bijgewerkt naar het productiedomein na Vercel-deployment.
3. **npm audit** — Periodiek uitvoeren om afhankelijkheden met bekende kwetsbaarheden te identificeren. SheetJS (`xlsx`) heeft bekende auditbevindingen; beoordeel of deze van toepassing zijn op het gebruik.
4. **Cookie-banner** — Bij toekomstige implementatie van analytics moeten cookies gemeld worden conform de AVG.
5. **Gedeeld huishouden bij accountverwijdering** — De huidige `delete_my_account()`-functie verwijdert het volledige huishouden. Bij meerdere gebruikers in één huishouden moet de logica worden aangepast zodat alleen de vertrekkende gebruiker wordt verwijderd.
