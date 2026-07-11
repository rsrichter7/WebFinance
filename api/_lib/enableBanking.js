// Herbruikbare helper voor de Enable Banking API: bouwt een RS256-JWT en doet geauthenticeerde requests

const crypto = require('crypto');

const APP_ID = process.env.ENABLE_BANKING_APP_ID;
const PRIVATE_KEY = process.env.ENABLE_BANKING_PRIVATE_KEY
  ? process.env.ENABLE_BANKING_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

function base64url(input) {
  return input
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function maakJwt() {
  if (!APP_ID || !PRIVATE_KEY) {
    throw new Error('ENABLE_BANKING_APP_ID of ENABLE_BANKING_PRIVATE_KEY ontbreekt in de omgeving');
  }

  const nu = Math.floor(Date.now() / 1000);

  const header = { typ: 'JWT', alg: 'RS256', kid: APP_ID };
  const payload = {
    iss: 'enablebanking.com',
    aud: 'api.enablebanking.com',
    iat: nu,
    exp: nu + 3600,
  };

  const headerB64 = base64url(Buffer.from(JSON.stringify(header)));
  const payloadB64 = base64url(Buffer.from(JSON.stringify(payload)));
  const ongetekend = `${headerB64}.${payloadB64}`;

  const signer = crypto.createSign('RSA-SHA256');
  signer.update(ongetekend);
  signer.end();
  const handtekening = base64url(signer.sign(PRIVATE_KEY));

  return `${ongetekend}.${handtekening}`;
}

async function ebFetch(path, options = {}) {
  const jwt = maakJwt();

  const response = await fetch(`https://api.enablebanking.com${path}`, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${jwt}`,
      Accept: 'application/json',
    },
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { ok: response.ok, status: response.status, data };
}

module.exports = { maakJwt, ebFetch };
