// Maakt de daadwerkelijke koppeling: per gekozen bankrekening ofwel een nieuwe rekening
// aanmaken, ofwel een bestaande rekening voorzien van de Enable Banking-koppelvelden.

const { createClient } = require('@supabase/supabase-js');
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

  const { state, keuzes } = req.body || {};
  if (!state || !Array.isArray(keuzes)) {
    return res.status(400).json({ error: 'state en keuzes zijn verplicht' });
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
      console.error('[bank/koppel] sessieError:', sessieError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }
    if (!sessie) {
      return res.status(400).json({ error: 'Koppelsessie niet gevonden' });
    }
    if (sessie.user_id !== user.id) {
      return res.status(403).json({ error: 'Geen toegang tot deze koppelsessie' });
    }
    if (sessie.status !== 'voltooid' || !sessie.accounts_json) {
      return res.status(400).json({ error: 'Sessie nog niet afgerond' });
    }
    if (!(await heeftToegang(supabase, sessie.household_id))) {
      return res.status(402).json({ error: 'Actief abonnement vereist', abonnementVereist: true });
    }

    const { data: rekeningen, error: rekeningenError } = await supabase
      .from('rekeningen')
      .select('id, iban, extern_account_id, volgorde')
      .eq('household_id', sessie.household_id);

    if (rekeningenError) {
      console.error('[bank/koppel] rekeningenError:', rekeningenError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    let volgendeVolgorde = (rekeningen || []).reduce((max, r) => Math.max(max, r.volgorde ?? 0), 0) + 1;

    let aangemaakt = 0;
    let gekoppeld = 0;
    const fouten = [];

    for (const keuze of keuzes) {
      const { uid, doel } = keuze || {};
      const bankRekening = (sessie.accounts_json || []).find((a) => a.uid === uid);
      if (!bankRekening) {
        fouten.push(`Bankrekening ${uid} niet gevonden in sessie`);
        continue;
      }

      const gedeeldeVelden = {
        extern_account_id: uid,
        provider: 'enablebanking',
        identificatie_hash: bankRekening.identification_hash,
        sessie_id: sessie.sessie_id,
        koppeling_vervalt: sessie.valid_until,
        aspsp_naam: sessie.aspsp_naam,
      };

      if (doel === 'nieuw') {
        const { error: insertError } = await supabase.from('rekeningen').insert({
          household_id: sessie.household_id,
          naam: bankRekening.name || sessie.aspsp_naam,
          gedeeld: sessie.gedeeld,
          user_id: sessie.gedeeld ? null : user.id,
          iban: bankRekening.account_id?.iban || null,
          volgorde: volgendeVolgorde++,
          bron: 'bank',
          ...gedeeldeVelden,
        });

        if (insertError) {
          console.error('[bank/koppel] insertError:', insertError);
          fouten.push(`Aanmaken van ${bankRekening.name} mislukt`);
          continue;
        }
        aangemaakt++;
      } else {
        const bestaandeRekening = (rekeningen || []).find((r) => r.id === doel);
        if (!bestaandeRekening || bestaandeRekening.extern_account_id) {
          fouten.push(`Koppelen van ${bankRekening.name} mislukt: rekening niet beschikbaar`);
          continue;
        }

        const updates = { ...gedeeldeVelden };
        if (!bestaandeRekening.iban && bankRekening.account_id?.iban) {
          updates.iban = bankRekening.account_id.iban;
        }

        const { error: updateError } = await supabase
          .from('rekeningen')
          .update(updates)
          .eq('id', bestaandeRekening.id);

        if (updateError) {
          console.error('[bank/koppel] updateError:', updateError);
          fouten.push(`Koppelen van ${bankRekening.name} mislukt`);
          continue;
        }
        gekoppeld++;
      }
    }

    return res.status(200).json({ ok: true, aangemaakt, gekoppeld, fouten });
  } catch (err) {
    console.error('[bank/koppel] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};
