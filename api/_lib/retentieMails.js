// Mailteksten voor de retentie-cron: kort, Nederlands, geruststellend van toon.
// Verwijst naar Instellingen (abonnement kiezen) en Instellingen → Data beheer (Excel-export).

const APP_URL = 'https://webfinance-nl.vercel.app';

function aanhef(naam) {
  return naam ? `Hoi ${naam},` : 'Hoi,';
}

function mailVerlopen(naam) {
  return {
    subject: 'Je proefperiode of abonnement is verlopen',
    html: `
      <p>${aanhef(naam)}</p>
      <p>Je proefperiode of abonnement bij Webfinance is verlopen. Geen zorgen: je gegevens blijven nog minimaal een jaar gewoon bewaard, en je kunt op elk moment weer verder waar je gebleven was.</p>
      <p>We hebben wel de automatische koppeling met je bank(en) opgezegd — je transacties en overige gegevens blijven gewoon staan.</p>
      <p>Wil je verder? Log in en kies een abonnement via <a href="${APP_URL}/instellingen">Instellingen</a>.</p>
      <p>Wil je je gegevens liever eerst meenemen? Dat kan als Excel-bestand via Instellingen → Data beheer.</p>
      <p>— Team Webfinance</p>
    `,
  };
}

function mailWaarschuwing30d(naam) {
  return {
    subject: 'Over 30 dagen verwijderen we je gegevens',
    html: `
      <p>${aanhef(naam)}</p>
      <p>Het is alweer bijna een jaar geleden dat je proefperiode of abonnement bij Webfinance is verlopen. Over ongeveer 30 dagen verwijderen we je financiële gegevens definitief.</p>
      <p>Wil je dit voorkomen? Log in en kies een abonnement via <a href="${APP_URL}/instellingen">Instellingen</a> — al je gegevens staan dan gewoon weer klaar.</p>
      <p>Wil je je gegevens liever eerst meenemen? Dat kan als Excel-bestand via Instellingen → Data beheer.</p>
      <p>— Team Webfinance</p>
    `,
  };
}

function mailWaarschuwing7d(naam) {
  return {
    subject: 'Nog 7 dagen voordat je gegevens verdwijnen',
    html: `
      <p>${aanhef(naam)}</p>
      <p>Een laatste herinnering: over ongeveer 7 dagen verwijderen we de financiële gegevens van je huishouden bij Webfinance definitief, omdat je abonnement of proefperiode al een jaar geleden is verlopen.</p>
      <p>Wil je dit voorkomen? Log in en kies een abonnement via <a href="${APP_URL}/instellingen">Instellingen</a>.</p>
      <p>Wil je je gegevens liever eerst meenemen? Dat kan als Excel-bestand via Instellingen → Data beheer.</p>
      <p>— Team Webfinance</p>
    `,
  };
}

function mailDataGewist(naam) {
  return {
    subject: 'Je gegevens bij Webfinance zijn verwijderd',
    html: `
      <p>${aanhef(naam)}</p>
      <p>Zoals eerder aangekondigd hebben we de financiële gegevens van je huishouden bij Webfinance verwijderd, omdat je abonnement of proefperiode al een jaar geleden is verlopen.</p>
      <p>Je account blijft gewoon bestaan — je kunt op elk moment weer inloggen en opnieuw beginnen.</p>
      <p>— Team Webfinance</p>
    `,
  };
}

module.exports = { mailVerlopen, mailWaarschuwing30d, mailWaarschuwing7d, mailDataGewist };
