// Rondt een Enable Banking-koppeling af: wisselt de authorisatiecode in voor een sessie
// bij Enable Banking en geeft de gevonden bankrekeningen terug (nog geen koppeling maken).

const { createClient } = require('@supabase/supabase-js');
const { ebFetch } = require('../_lib/enableBanking');
const { heeftToegang } = require('../_lib/toegang');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Niet ingelogd' });
  }
  const token = authHeader.slice(7);

  const { code, state } = req.body || {};
  if (!code || !state) {
    return res.status(400).json({ error: 'code en state zijn verplicht' });
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
    const { data: sessie, error: sessieError } = await supabase
      .from('bank_koppeling_sessies')
      .select('*')
      .eq('state', state)
      .maybeSingle();

    if (sessieError) {
      console.error('[bank/callback] sessieError:', sessieError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }
    if (!sessie) {
      return res.status(400).json({ error: 'Koppelsessie niet gevonden' });
    }
    if (sessie.user_id !== user.id) {
      return res.status(403).json({ error: 'Geen toegang tot deze koppelsessie' });
    }
    if (!(await heeftToegang(supabase, sessie.household_id))) {
      return res.status(402).json({ error: 'Actief abonnement vereist', abonnementVereist: true });
    }

    let accounts;

    if (sessie.status === 'voltooid' && sessie.accounts_json) {
      // Idempotent: de code is eenmalig geldig, dus bij een herhaalde aanroep
      // (bv. dubbele redirect) hergebruiken we de eerder opgehaalde rekeningen.
      accounts = sessie.accounts_json;
    } else {
      const { ok: sessionOk, status: sessionStatus, data: sessionData } = await ebFetch('/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      });

      if (!sessionOk) {
        console.error('[bank/callback] /sessions mislukt:', sessionStatus, sessionData);
        await supabase
          .from('bank_koppeling_sessies')
          .update({ status: 'mislukt' })
          .eq('state', state);
        return res.status(sessionStatus).json(sessionData);
      }

      accounts = sessionData.accounts;

      const { error: updateError } = await supabase
        .from('bank_koppeling_sessies')
        .update({
          status: 'voltooid',
          sessie_id: sessionData.session_id,
          accounts_json: accounts,
        })
        .eq('state', state);

      if (updateError) {
        console.error('[bank/callback] updateError:', updateError);
        return res.status(500).json({ error: 'Interne serverfout' });
      }
    }

    const { data: alleRekeningen, error: bestaandeError } = await supabase
      .from('rekeningen')
      .select('id, naam, iban, gedeeld, extern_account_id, identificatie_hash')
      .eq('household_id', sessie.household_id);

    if (bestaandeError) {
      console.error('[bank/callback] bestaandeError:', bestaandeError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    const ongekoppeld = (alleRekeningen || []).filter((r) => !r.extern_account_id);
    const normIban = (iban) => (iban || '').replace(/\s/g, '');

    const herkoppeld = [];
    const bankRekeningen = [];

    for (const a of accounts || []) {
      const iban = a.account_id?.iban || null;

      // Al eerder gekoppelde rekening met dezelfde bank-identificatie: automatisch herkoppelen,
      // geen keuzescherm nodig.
      const bestaandeGekoppeld = (alleRekeningen || []).find(
        (r) => r.extern_account_id && r.identificatie_hash === a.identification_hash
      );

      if (bestaandeGekoppeld) {
        const { error: herkoppelError } = await supabase
          .from('rekeningen')
          .update({
            extern_account_id: a.uid,
            sessie_id: sessie.sessie_id,
            koppeling_vervalt: sessie.valid_until,
            provider: 'enablebanking',
            aspsp_naam: sessie.aspsp_naam,
          })
          .eq('id', bestaandeGekoppeld.id);

        if (herkoppelError) {
          console.error('[bank/callback] herkoppelError:', herkoppelError);
        } else {
          herkoppeld.push({ naam: bestaandeGekoppeld.naam, iban: bestaandeGekoppeld.iban });
        }
        continue;
      }

      const suggestie = iban
        ? ongekoppeld.find((r) => normIban(r.iban) === normIban(iban)) || null
        : null;

      bankRekeningen.push({
        uid: a.uid,
        iban,
        naam: a.name,
        identificatie_hash: a.identification_hash,
        suggestie_rekening_id: suggestie ? suggestie.id : null,
      });
    }

    return res.status(200).json({
      gedeeld: sessie.gedeeld,
      herkoppeld,
      bankRekeningen,
      bestaandeRekeningen: ongekoppeld.map((r) => ({ id: r.id, naam: r.naam, iban: r.iban })),
    });
  } catch (err) {
    console.error('[bank/callback] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};
