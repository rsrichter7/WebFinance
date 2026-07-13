// Verwijdert de Enable Banking-koppeling van een rekening. De rekening en alle transacties
// blijven bestaan — alleen de bankvelden worden leeggemaakt. Sluit de Enable Banking-sessie
// af als geen andere rekening die sessie nog gebruikt.

const { createClient } = require('@supabase/supabase-js');
const { ebFetch } = require('../_lib/enableBanking');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Niet ingelogd' });
  }
  const token = authHeader.slice(7);

  const { rekening_id } = req.body || {};
  if (!rekening_id) {
    return res.status(400).json({ error: 'rekening_id is verplicht' });
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
    const { data: rekening, error: rekeningError } = await supabase
      .from('rekeningen')
      .select('id, household_id, user_id, sessie_id, extern_account_id')
      .eq('id', rekening_id)
      .maybeSingle();

    if (rekeningError) {
      console.error('[bank/ontkoppel] rekeningError:', rekeningError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }
    if (!rekening) {
      return res.status(404).json({ error: 'Rekening niet gevonden' });
    }

    const { data: members, error: memberError } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id);

    if (memberError) {
      console.error('[bank/ontkoppel] memberError:', memberError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }
    const hoortErbij = (members || []).some((m) => m.household_id === rekening.household_id);
    if (!hoortErbij) {
      return res.status(403).json({ error: 'Geen toegang tot deze rekening' });
    }

    if (!rekening.extern_account_id) {
      return res.status(200).json({ ok: true });
    }

    if (rekening.sessie_id) {
      const { data: overigeMetSessie, error: overigeError } = await supabase
        .from('rekeningen')
        .select('id')
        .eq('sessie_id', rekening.sessie_id)
        .neq('id', rekening.id)
        .not('extern_account_id', 'is', null);

      if (overigeError) {
        console.error('[bank/ontkoppel] overigeError:', overigeError);
        return res.status(500).json({ error: 'Interne serverfout' });
      }

      if (!overigeMetSessie || overigeMetSessie.length === 0) {
        const { ok: sessieOk, status: sessieStatus, data: sessieData } = await ebFetch(
          `/sessions/${rekening.sessie_id}`,
          { method: 'DELETE' }
        );
        if (!sessieOk) {
          console.error('[bank/ontkoppel] sessie afsluiten mislukt:', sessieStatus, sessieData);
        }
      }
    }

    const { error: updateError } = await supabase
      .from('rekeningen')
      .update({
        extern_account_id: null,
        provider: null,
        sessie_id: null,
        koppeling_vervalt: null,
        identificatie_hash: null,
      })
      .eq('id', rekening.id);

    if (updateError) {
      console.error('[bank/ontkoppel] updateError:', updateError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[bank/ontkoppel] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};
