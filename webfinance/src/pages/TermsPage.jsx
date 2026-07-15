// ─── TermsPage ───
// Statische algemene-voorwaarden pagina — toegankelijk zonder inloggen.
// LET OP: placeholder-tekst, nog niet juridisch nagekeken. Niet als bindend beschouwen.

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const SECTIES = [
  { titel: '1. Aanbieder en contact', tekst: 'Webfinance is een persoonlijk financieel beheerplatform. [Placeholder: bedrijfsnaam, KvK-nummer, vestigingsadres en contactgegevens van de aanbieder invullen.] Vragen over deze voorwaarden kunnen gestuurd worden naar [placeholder e-mailadres].' },
  { titel: '2. Dienstomschrijving', tekst: 'Webfinance biedt een webapplicatie voor persoonlijk financieel overzicht: transacties, vaste lasten, budgetten, spaardoelen en analyses. [Placeholder: nadere omschrijving van de dienst en het beoogde gebruik.]' },
  { titel: '3. Abonnement en proefperiode', tekst: 'Toegang tot Webfinance vereist een actief betaald abonnement of een lopende gratis proefperiode. [Placeholder: duur van de proefperiode, wat er gebeurt bij het verlopen ervan, automatische verlenging van abonnementen, opzegtermijnen.]' },
  { titel: '4. Betaling via Stripe', tekst: 'Betalingen voor abonnementen worden verwerkt door Stripe, een externe betaaldienstverlener. [Placeholder: welke betaalmethoden worden ondersteund, hoe terugbetalingen verlopen, wat er gebeurt bij een mislukte betaling.]' },
  { titel: '5. Aansprakelijkheid', tekst: '[Placeholder: beperking van aansprakelijkheid voor onjuiste berekeningen, dataverlies, downtime of gevolgen van beslissingen die gebruikers baseren op de app. Uitsluitingen en eventuele maximumbedragen moeten juridisch bepaald worden.]' },
  { titel: '6. Opzegging en gegevens', tekst: 'Je kunt je account op elk moment verwijderen via Instellingen. [Placeholder: wat er precies gebeurt met je gegevens bij opzegging, bewaartermijnen, gevolgen voor gedeelde huishoudens.] Zie ook ons <link>privacybeleid</link> voor meer informatie over gegevensverwerking.' },
  { titel: '7. Wijzigingen van deze voorwaarden', tekst: '[Placeholder: hoe en wanneer wijzigingen worden aangekondigd, en vanaf welk moment gewijzigde voorwaarden gelden voor bestaande gebruikers.]' },
  { titel: '8. Toepasselijk recht', tekst: '[Placeholder: welk recht van toepassing is en welke rechter bevoegd is bij geschillen.]' },
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
