// Start een Enable Banking-koppeling: valideert de gebruiker, vraagt een auth-URL op
// bij Enable Banking en logt de sessie in bank_koppeling_sessies.

const crypto = require('crypto');
const { createClient } = require('@supabase/supabase-js');
const { ebFetch } = require('../_lib/enableBanking');

// Moet EXACT overeenkomen met de redirect-URL die bij Enable Banking geregistreerd staat.
const REDIRECT_URL = 'https://webfinance-nl.vercel.app/bank/callback';
const STANDAARD_GELDIGHEID_SEC = 90 * 24 * 60 * 60;

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Niet ingelogd' });
  }
  const token = authHeader.slice(7);

  const { aspsp_naam, gedeeld } = req.body || {};
  if (!aspsp_naam) {
    return res.status(400).json({ error: 'aspsp_naam is verplicht' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Ongeldig token' });
  }

  try {
    const { data: members, error: memberError } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id);

    if (memberError) {
      console.error('[bank/start] memberError:', memberError);
      return res.status(500).json({ error: 'Interne serverfout', detail: memberError.message });
    }
    if (!members || members.length === 0) {
      return res.status(400).json({ error: 'Geen huishouden gevonden voor deze gebruiker' });
    }
    const householdId = members[0].household_id;

    const { ok: aspspsOk, status: aspspsStatus, data: aspspsData } = await ebFetch('/aspsps?country=NL');
    if (!aspspsOk) {
      console.error('[bank/start] aspsps-lookup mislukt:', aspspsStatus, aspspsData);
      return res.status(aspspsStatus).json(aspspsData);
    }

    const bank = (aspspsData.aspsps || []).find((a) => a.name === aspsp_naam);
    const geldigheidSec = bank?.maximum_consent_validity ?? STANDAARD_GELDIGHEID_SEC;
    const validUntil = new Date(Date.now() + geldigheidSec * 1000).toISOString();

    const state = crypto.randomUUID();

    const { ok: authOk, status: authStatus, data: authData } = await ebFetch('/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        access: { balances: true, transactions: true, valid_until: validUntil },
        aspsp: { name: aspsp_naam, country: 'NL' },
        psu_type: 'personal',
        redirect_url: REDIRECT_URL,
        state,
      }),
    });

    if (!authOk) {
      console.error('[bank/start] /auth mislukt:', authStatus, authData);
      return res.status(authStatus).json(authData);
    }

    const { error: insertError } = await supabase.from('bank_koppeling_sessies').insert({
      household_id: householdId,
      user_id: user.id,
      state,
      aspsp_naam,
      aspsp_land: 'NL',
      gedeeld: !!gedeeld,
      status: 'gestart',
    });

    if (insertError) {
      console.error('[bank/start] insertError:', insertError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    return res.status(200).json({ url: authData.url });
  } catch (err) {
    console.error('[bank/start] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};
