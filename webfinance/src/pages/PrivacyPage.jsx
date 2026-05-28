// ─── PrivacyPage ───
// Statische privacybeleid pagina — toegankelijk zonder inloggen.

import React from 'react'
import { Link } from 'react-router-dom'
import { useTheme } from '../hooks/useTheme'

const SECTIES = [
  { titel: 'Welke gegevens we verzamelen', tekst: 'Webfinance slaat de financiële gegevens op die jij invoert: transacties, vaste lasten, budgetten en spaardoelen. Daarnaast bewaren we profielgegevens zoals naam, initialen en e-mailadres. Tot slot slaan we je instellingen en voorkeuren op, zoals je datumformaat en budgetmodus. Bij het importeren van bankafschriften via CSV worden IBAN-nummers automatisch verwijderd vóór opslag — die worden nooit in de database bewaard.' },
  { titel: 'Waarom we deze gegevens verzamelen', tekst: 'We verzamelen alleen de gegevens die noodzakelijk zijn om je persoonlijke financiële overzicht te bieden. We verkopen jouw gegevens niet aan derden. We gebruiken je gegevens niet voor advertentiedoeleinden of profilering. Jouw data is van jou.' },
  { titel: 'Waar je gegevens worden opgeslagen', tekst: 'Alle gegevens worden opgeslagen in een PostgreSQL-database via Supabase, gehost in de Europese Unie (Frankfurt, Duitsland). Alle verbindingen zijn versleuteld via HTTPS/TLS. De dataopslag valt daarmee binnen de Europese wetgeving voor gegevensbescherming (AVG/GDPR).' },
  { titel: 'Wie toegang heeft tot je gegevens', tekst: 'Alleen jij hebt toegang tot je eigen gegevens. Webfinance maakt gebruik van Row Level Security (RLS) in de database, wat betekent dat elke databasequery automatisch gefilterd wordt op basis van jouw gebruikersidentiteit. Andere gebruikers kunnen jouw gegevens niet inzien, ook niet technisch.' },
  { titel: 'Inloggen via Google', tekst: 'Als je kiest om in te loggen met je Google-account, ontvangen wij alleen je naam en e-mailadres van Google. We hebben geen toegang tot je Google-wachtwoord, Google Drive, agenda of andere Google-diensten. Google verwerkt de authenticatie — Webfinance ontvangt alleen een bevestiging dat je bent wie je zegt te zijn.' },
  { titel: 'Je rechten (AVG/GDPR)', tekst: 'Als gebruiker van Webfinance heb je het recht om al je gegevens in te zien, te corrigeren en te laten verwijderen. Je hebt ook het recht op data-export: je kunt je gegevens downloaden als CSV-bestand. Deze functies zijn beschikbaar via Instellingen → Data beheer. Wil je je account volledig laten verwijderen, neem dan contact op via onderstaand e-mailadres.' },
  { titel: 'Cookies', tekst: 'Webfinance gebruikt uitsluitend essentiële cookies voor authenticatie, zoals sessietokens waarmee je ingelogd blijft. We plaatsen geen tracking cookies, analytische cookies of advertentiecookies. Er worden geen cookies van derden geplaatst.' },
  { titel: 'Contact', tekst: 'Heb je vragen over dit privacybeleid of wil je gebruik maken van je rechten? Stuur dan een e-mail naar privacy@webfinance.nl. We reageren binnen vijf werkdagen.' },
]

export default function PrivacyPage() {
  const { T } = useTheme()

  const S = {
    kop:  { fontSize: 17, fontWeight: 600, color: T.ink, margin: '0 0 10px' },
    tekst: { fontSize: 15, color: T.ink2, lineHeight: 1.7, margin: 0 },
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, fontFamily: "'Inter', sans-serif", padding: '48px 24px' }}>
      <div style={{ maxWidth: 720, margin: '0 auto', background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: '48px 56px', boxShadow: T.shadow }}>
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: T.ink, margin: '0 0 8px', letterSpacing: '-0.3px' }}>Privacybeleid</h1>
          <p style={{ fontSize: 13, color: T.ink4, margin: 0 }}>Webfinance — Laatst bijgewerkt: mei 2026</p>
          <div style={{ height: 1, background: T.border, marginTop: 24 }} />
        </div>

        <p style={S.tekst}>
          Webfinance is een persoonlijke financiële app. We begrijpen dat financiële gegevens gevoelig zijn en behandelen ze met de nodige zorg. In dit privacybeleid leggen we uit welke gegevens we verzamelen, waarom, en hoe we ze beschermen.
        </p>

        {SECTIES.map(({ titel, tekst }) => (
          <div key={titel} style={{ marginTop: 36 }}>
            <h2 style={S.kop}>{titel}</h2>
            <p style={S.tekst}>{tekst}</p>
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
