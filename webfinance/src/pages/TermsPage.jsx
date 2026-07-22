// ─── TermsPage ───
// Statische algemene-voorwaarden pagina — toegankelijk zonder inloggen.
// LET OP: placeholder-tekst, nog niet juridisch nagekeken. Niet als bindend beschouwen.

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const SECTIES = [
  { titel: '1. Aanbieder en contact', tekst: 'Webfinance is een persoonlijk financieel beheerplatform. [JOUW INVULLING: bedrijfsnaam, KvK-nummer, vestigingsadres en contactgegevens van de aanbieder invullen.] Vragen over deze voorwaarden kunnen gestuurd worden naar [JOUW INVULLING: contact-e-mailadres].' },
  { titel: '2. Dienstomschrijving', tekst: 'Webfinance biedt een webapplicatie voor persoonlijk financieel overzicht, bestemd voor gebruik door één persoon of een huishouden. De dienst omvat onder meer: het bijhouden van transacties (handmatig of via CSV-import vanuit je bank), overzicht van vaste lasten en vaste inkomsten, budgetten en spaardoelen, een kalenderweergave van verwachte versus werkelijke uitgaven, en analyses van je financiële gegevens. Meerdere leden van hetzelfde huishouden kunnen gezamenlijke en persoonlijke rekeningen beheren binnen de app.' },
  { titel: '3. Abonnement en proefperiode', tekst: 'Elk huishouden krijgt bij het aanmaken van een account een proefperiode van 30 dagen waarin de volledige dienst kosteloos gebruikt kan worden. Webfinance kent geen gratis basisversie: na afloop van de proefperiode is een actief betaald abonnement vereist om de dienst te blijven gebruiken. Er zijn drie abonnementsvormen: maandelijks, per kwartaal en per jaar, met de op de website vermelde tarieven. Een abonnement wordt automatisch verlengd voor eenzelfde periode, tenzij het vooraf is opgezegd. [JOUW INVULLING: exacte opzegtermijn vóór de verlengingsdatum bevestigen.] Zonder actief abonnement of lopende proefperiode is toegang tot de dienst niet meer mogelijk; zie sectie 6 voor wat er vervolgens met je gegevens gebeurt.' },
  { titel: '4. Betaling via Stripe', tekst: 'Betalingen voor abonnementen worden verwerkt door Stripe, een externe betaaldienstverlener. Betaling is mogelijk via iDEAL of creditcard. Bij automatische verlenging van een jaar- of kwartaalabonnement kan, afhankelijk van de gekozen betaalmethode, een doorlopende machtiging worden gebruikt voor de vervolgbetaling. Als een betaling mislukt, kan de toegang tot de dienst tijdelijk worden opgeschort totdat de betaling alsnog slaagt of het abonnement wordt beëindigd. [JOUW INVULLING: beleid rond terugbetalingen vaststellen — Webfinance kent op dit moment geen automatisch terugbetalingsproces; verzoeken lopen via het in sectie 1 genoemde contactadres.]' },
  { titel: '5. Aansprakelijkheid', tekst: 'Webfinance is een hulpmiddel voor persoonlijk financieel overzicht en biedt geen financieel, fiscaal of juridisch advies. Berekeningen, overzichten en signaleringen in de app zijn indicatief en gebaseerd op de gegevens die je zelf invoert of importeert; controleer belangrijke beslissingen altijd zelf. [JOUW INVULLING: beperking van aansprakelijkheid voor onjuiste berekeningen, dataverlies, downtime of gevolgen van beslissingen die gebruikers op de app baseren — uitsluitingen en eventuele maximumbedragen moeten juridisch bepaald worden.]' },
  { titel: '6. Opzegging en gegevens', tekst: 'Je kunt je account op elk moment verwijderen via Instellingen. Wat er gebeurt hangt af van je situatie: ben je de enige gebruiker in je huishouden, dan wordt je lopende abonnement bij Stripe opgezegd en worden al je gegevens verwijderd. Maak je deel uit van een gedeeld huishouden, dan verlaat alleen jij het huishouden; de gedeelde gegevens en het abonnement blijven voor de overige leden bestaan. Bij verwijdering kun je vooraf je gegevens exporteren naar Excel via Instellingen → Data beheer. Wordt een abonnement niet verlengd en verloopt ook de proefperiode zonder betaling, dan blijft het huishouden nog enige tijd bereikbaar; je ontvangt vooraf waarschuwingse-mails, en na verloop van tijd zonder actief abonnement worden de gegevens automatisch verwijderd. Zie ook ons <link>privacybeleid</link> voor meer informatie over gegevensverwerking en bewaartermijnen.' },
  { titel: '7. Wijzigingen van deze voorwaarden', tekst: 'Deze voorwaarden kunnen worden gewijzigd, bijvoorbeeld bij nieuwe functionaliteit of wijzigingen in wet- en regelgeving. Wijzigingen worden vooraf aangekondigd via de app of per e-mail. [JOUW INVULLING: exacte aankondigingstermijn vaststellen en vanaf welk moment gewijzigde voorwaarden gelden voor bestaande gebruikers.]' },
  { titel: '8. Toepasselijk recht', tekst: 'Op deze voorwaarden is Nederlands recht van toepassing. [JOUW INVULLING: welke rechter bevoegd is bij geschillen bevestigen.]' },
]

export default function TermsPage() {
  const { T } = useTheme()

  const S = {
    kop:  { fontSize: 17, fontWeight: 600, color: T.ink, margin: '0 0 10px' },
    tekst: { fontSize: 15, color: T.ink2, lineHeight: 1.7, margin: 0 },
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '48px 56px', boxShadow: T.shadow }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: T.ink, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Algemene voorwaarden</h1>
          <p style={{ fontSize: 13, color: T.ink4, margin: 0 }}>Webfinance — Laatst bijgewerkt: juli 2026</p>
          <div style={{ height: 1, background: T.border, marginTop: 24 }} />
        </div>

        <div style={{ padding: '14px 16px', borderRadius: 10, background: T.amberSoft, border: '1px solid #FDE68A', fontSize: 13, color: '#78350F', lineHeight: 1.6, marginBottom: 32 }}>
          Let op: deze tekst is een concept en dient nog juridisch nagekeken te worden voordat Webfinance live gaat. De secties hieronder bevatten placeholder-tekst en mogen niet als bindend worden beschouwd.
        </div>

        <p style={S.tekst}>
          Deze algemene voorwaarden zijn van toepassing op het gebruik van Webfinance. Door een account aan te maken en de dienst te gebruiken, ga je akkoord met deze voorwaarden.
        </p>

        {SECTIES.map(({ titel, tekst }) => (
          <div key={titel} style={{ marginTop: 36 }}>
            <h2 style={S.kop}>{titel}</h2>
            <p style={S.tekst}>
              {tekst.split(/<link>|<\/link>/).map((deel, i) =>
                i === 1
                  ? <Link key={i} to="/privacy" style={{ color: T.blue, textDecoration: 'none', fontWeight: 500 }}>{deel}</Link>
                  : <React.Fragment key={i}>{deel}</React.Fragment>
              )}
            </p>
          </div>
        ))}

        <div style={{ height: 1, background: T.border, margin: '40px 0 28px' }} />
        <Link to="/login" style={{ fontSize: 13, color: T.blue, textDecoration: 'none', fontWeight: 500 }}>
          ← Terug naar inloggen
        </Link>
      </div>
    </div>
  )
}
