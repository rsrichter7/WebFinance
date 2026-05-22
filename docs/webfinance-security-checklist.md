# Webfinance — Security Checklist (Supabase migratie)

Gebaseerd op de algemene security-prompt, gefilterd op wat relevant is voor Webfinance: een React 18 frontend + Supabase backend (geen eigen server).

---

## Hoe deze checklist te lezen

- ✅ **Must do** — direct toepassen bij de Supabase migratie
- ⏳ **Later** — relevant wanneer de app live gaat of gebruikers krijgt
- ➖ **Niet van toepassing** — Supabase handelt dit af, of het geldt niet voor onze stack

---

## 1. Row Level Security (RLS) — HOOGSTE PRIORITEIT

Dit is de #1 security-maatregel voor Supabase. Zonder RLS kan elke gebruiker alle data in je database opvragen.

- ✅ RLS inschakelen op ELKE tabel — zonder uitzondering
- ✅ Elke tabel heeft een `user_id` kolom die verwijst naar `auth.users`
- ✅ Policies schrijven: `SELECT`, `INSERT`, `UPDATE`, `DELETE` — per tabel apart
- ✅ Standaard policy: `USING (user_id = auth.uid())` — gebruiker ziet alleen eigen data
- ✅ NOOIT `SECURITY DEFINER` gebruiken op Postgres-functies — als er een permissiefout komt, los het op met een correcte RLS-policy
- ✅ Na elke tabel: test met een tweede testaccount of je elkaars data NIET kunt zien

**Voorbeeld policy:**
```sql
-- Gebruiker kan alleen eigen transacties lezen
CREATE POLICY "Eigen transacties lezen"
ON transactions FOR SELECT
USING (user_id = auth.uid());

-- Gebruiker kan alleen eigen transacties invoegen
CREATE POLICY "Eigen transacties invoegen"
ON transactions FOR INSERT
WITH CHECK (user_id = auth.uid());
```

---

## 2. Authenticatie

Supabase regelt het zware werk (hashing, sessies, tokens), maar de integratie in de app moet goed.

- ✅ `useAuth` hook bouwen — centrale plek voor login/logout/sessie-check
- ✅ `ProtectedRoute` component — wrapt ALLE routes behalve `/login` en `/register`
- ✅ Bij elke pagina-load: sessie controleren via `supabase.auth.getSession()`
- ✅ Luisteren naar `onAuthStateChange` — automatisch uitloggen bij verlopen sessie
- ✅ Na uitloggen: redirect naar login, geen gecachte data tonen
- ✅ Email-verificatie inschakelen in Supabase dashboard
- ⏳ Wachtwoord-eisen: minimaal 8 tekens (Supabase standaard is 6 — ophogen)
- ⏳ Rate limiting op login-pogingen (Supabase heeft dit ingebouwd, controleer de instellingen)
- ⏳ Magic link of social login (Google) als alternatief

---

## 3. Environment Variables & Keys

- ✅ `.env` bestand aanmaken met `VITE_SUPABASE_URL` en `VITE_SUPABASE_ANON_KEY`
- ✅ `.env` toevoegen aan `.gitignore` — NOOIT committen naar GitHub
- ✅ Controleer: staat `.env` in `.gitignore` VOORDAT je het bestand aanmaakt
- ✅ In Codespaces: stel de keys in als Codespace Secrets (Settings → Secrets)
- ✅ De `anon key` is NIET geheim (die draait in de browser) — maar de `service_role key` mag NOOIT in de frontend
- ✅ Gebruik NOOIT de `service_role key` in React-code — die is alleen voor server-side scripts

**Check:** Zoek in je hele codebase op "service_role" — als die ergens staat behalve in server-side scripts, verwijder hem.

---

## 4. Input Validatie

Supabase beschermt tegen SQL-injectie (de API gebruikt parameterized queries), maar je frontend moet ook valideren.

- ✅ Valideer alle formuliervelden vóórdat je ze naar Supabase stuurt (type, lengte, format)
- ✅ Bedragen: controleer op geldige getallen, geen negatieve waarden waar dat niet mag
- ✅ Datums: controleer op geldig datumformat (`YYYY-MM-DD`)
- ✅ Tekstvelden: maximale lengte instellen (bijv. beschrijving max 500 tekens)
- ✅ Categorie/soort/wie: valideer tegen bekende waarden (allowlist)
- ✅ Geen `eval()`, `Function()`, of `innerHTML` met user input
- ➖ SQL-injectie: Supabase client library handelt dit af (parameterized queries)

---

## 5. Data Protection & Privacy

- ✅ Supabase project aanmaken in **EU-West regio** (belangrijk voor AVG/GDPR)
- ✅ Sla NOOIT meer data op dan nodig (data minimalisatie)
- ✅ Geen wachtwoorden, tokens of API keys loggen in `console.log`
- ✅ Verwijder alle `console.log` statements vóór productie (stijlgids zegt dit al)
- ⏳ Privacy policy pagina schrijven — verplicht zodra je gebruikersdata opslaat
- ⏳ "Account verwijderen" functie bouwen — gebruiker moet al z'n data kunnen wissen (AVG recht)
- ⏳ Data export functie — gebruiker moet z'n data kunnen downloaden (AVG recht)
- ⏳ Cookie-banner (als je analytics of tracking toevoegt — nu niet nodig)

---

## 6. Frontend Security

- ✅ Geen gevoelige data in localStorage na migratie — auth tokens beheert Supabase zelf
- ✅ Geen gevoelige data in de URL (query parameters)
- ✅ React escapet HTML standaard — maar gebruik NOOIT `dangerouslySetInnerHTML`
- ⏳ Content Security Policy (CSP) header instellen via Vercel config bij deployment
- ⏳ HTTPS afdwingen (Vercel doet dit automatisch)

---

## 7. API & Query Security

- ✅ Gebruik altijd de Supabase client library (`.from().select()`) — nooit raw SQL vanuit de frontend
- ✅ Filter altijd op `user_id` in queries, ook al heb je RLS (defense in depth)
- ✅ Geen `SELECT *` — vraag alleen de kolommen op die je nodig hebt
- ✅ Paginering toevoegen bij grote datasets (`.range(0, 49)`)
- ➖ API rate limiting: Supabase handelt dit af op platform-niveau
- ➖ CORS: Supabase configureert dit automatisch voor je project-URL

---

## 8. Huishouden / Multi-user (toekomst)

Als je later Anne of anderen toegang geeft tot dezelfde data:

- ⏳ Huishouden-concept in database: `household_id` op elke tabel
- ⏳ RLS-policies aanpassen: `user_id IN (SELECT user_id FROM household_members WHERE household_id = ...)`
- ⏳ Uitnodigingssysteem: via email-link, niet via gedeelde wachtwoorden
- ⏳ Rollen: eigenaar (kan leden beheren) vs lid (kan alleen data zien/bewerken)

---

## 9. Dependency Management

- ✅ Na installatie van `@supabase/supabase-js`: draai `npm audit`
- ✅ Geen onnodige packages installeren
- ⏳ Periodiek `npm audit` draaien en kwetsbaarheden fixen
- ⏳ `package-lock.json` altijd committen

---

## 10. Wat Supabase al voor je regelt

Deze punten uit de originele security-prompt hoef je NIET zelf te bouwen:

- ➖ **Wachtwoord hashing** — Supabase gebruikt bcrypt automatisch
- ➖ **Session management** — Supabase auth met JWT tokens
- ➖ **TLS/HTTPS** — Supabase API is altijd HTTPS
- ➖ **SQL injection preventie** — de client library gebruikt parameterized queries
- ➖ **Database encryption at rest** — Supabase versleutelt standaard
- ➖ **Token refresh** — Supabase client handelt dit automatisch af
- ➖ **CORS** — geconfigureerd op Supabase project-niveau
- ➖ **Rate limiting** — ingebouwd op platform-niveau

---

## Pre-launch checklist (voordat de app live gaat)

Gebruik deze checklist voordat je Webfinance publiek maakt:

- [ ] RLS ingeschakeld en getest op ELKE tabel
- [ ] Geen `SECURITY DEFINER` functies in de database
- [ ] `.env` staat in `.gitignore` en is NIET gecommit
- [ ] `service_role key` staat NERGENS in de frontend code
- [ ] Alle routes achter `ProtectedRoute` behalve login/register
- [ ] Email-verificatie ingeschakeld
- [ ] Supabase project in EU-West regio
- [ ] `npm audit` toont geen high/critical kwetsbaarheden
- [ ] Geen `console.log` in productie-code
- [ ] Privacy policy aanwezig
- [ ] Account-verwijder functie werkt
- [ ] Getest met 2 accounts: gebruiker A kan data van B NIET zien
