// Haalt nieuwe banktransacties op via Enable Banking voor een gekoppelde rekening,
// filtert al eerder geïmporteerde transacties eruit (op extern_transactie_id) en
// levert ze aan als preview — inserten gebeurt pas na bevestiging vanuit de frontend.

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');
const { ebFetch } = require('../_lib/enableBanking');
const { heeftToegang } = require('../_lib/toegang');

const MAX_PAGINAS = 20;

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
      .select('id, household_id, extern_account_id, koppeling_vervalt, laatst_gesynct')
      .eq('id', rekening_id)
      .maybeSingle();

    if (rekeningError) {
      console.error('[bank/sync] rekeningError:', rekeningError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }
    if (!rekening) {
      return res.status(404).json({ error: 'Rekening niet gevonden' });
    }
    if (!rekening.extern_account_id) {
      return res.status(400).json({ error: 'Rekening is niet gekoppeld' });
    }

    const { data: members, error: memberError } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id);

    if (memberError) {
      console.error('[bank/sync] memberError:', memberError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }
    const hoortErbij = (members || []).some((m) => m.household_id === rekening.household_id);
    if (!hoortErbij) {
      return res.status(403).json({ error: 'Geen toegang tot deze rekening' });
    }
    if (!(await heeftToegang(supabase, rekening.household_id))) {
      return res.status(402).json({ error: 'Actief abonnement vereist', abonnementVereist: true });
    }

    if (rekening.koppeling_vervalt && new Date(rekening.koppeling_vervalt) < new Date()) {
      return res.status(409).json({ error: 'Bankkoppeling verlopen', herkoppelen: true });
    }

    const dateFrom = rekening.laatst_gesynct
      ? dagenAftrekken(rekening.laatst_gesynct, 7)
      : dagenAftrekken(new Date().toISOString(), 90);

    let alleTransacties = [];
    let continuationKey = null;
    let pagina = 0;

    do {
      let path = `/accounts/${rekening.extern_account_id}/transactions?date_from=${dateFrom}`;
      if (continuationKey) path += `&continuation_key=${encodeURIComponent(continuationKey)}`;

      const { ok, status, data } = await ebFetch(path);

      if (!ok) {
        console.error('[bank/sync] transacties ophalen mislukt:', status, data);
        if (status === 401 || status === 403) {
          return res.status(status).json({ error: 'Ophalen mislukt, mogelijk moet je opnieuw koppelen', herkoppelen: true });
        }
        return res.status(status).json(data);
      }

      alleTransacties = alleTransacties.concat(data?.transactions || []);
      continuationKey = data?.continuation_key || null;
      pagina++;
    } while (continuationKey && pagina < MAX_PAGINAS);

    const geboekt = alleTransacties.filter((t) => t.status === 'BOOK');

    const { data: bestaandeRijen, error: bestaandeError } = await supabase
      .from('transactions')
      .select('extern_transactie_id')
      .eq('account_id', rekening.id)
      .not('extern_transactie_id', 'is', null);

    if (bestaandeError) {
      console.error('[bank/sync] bestaandeError:', bestaandeError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    const bestaandeIds = new Set((bestaandeRijen || []).map((r) => r.extern_transactie_id));
    const batchIds = new Set();
    const nieuweTransacties = [];

    for (const t of geboekt) {
      const indicator = t.credit_debit_indicator;
      const type = indicator === 'CRDT' ? 'Inkomst' : 'Uitgave';
      const bedrag = Math.abs(parseFloat(t.transaction_amount?.amount || '0'));
      const datum = t.booking_date || t.value_date || t.transaction_date;
      const remittance = Array.isArray(t.remittance_information)
        ? t.remittance_information.join(' ')
        : (t.remittance_information || '');
      const winkel = indicator === 'DBIT' ? (t.creditor?.name || '') : (t.debtor?.name || '');
      const ref = t.entry_reference || t.reference_number || null;
      const extern = ref || crypto.createHash('sha256')
        .update([datum, bedrag, indicator, remittance].join('|'))
        .digest('hex').slice(0, 40);

      if (bestaandeIds.has(extern) || batchIds.has(extern)) continue;
      batchIds.add(extern);

      nieuweTransacties.push({
        datum,
        beschrijving: remittance,
        bedrag,
        type,
        categorie: '',
        subcategorie: '',
        soort: 'Noodzaak',
        wie: 'GZ',
        winkel,
        bron: 'bank',
        extern_transactie_id: extern,
      });
    }

    return res.status(200).json({
      ok: true,
      transacties: nieuweTransacties,
      opgehaald: geboekt.length,
      nieuw: nieuweTransacties.length,
    });
  } catch (err) {
    console.error('[bank/sync] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};

function dagenAftrekken(isoDatum, dagen) {
  const d = new Date(isoDatum);
  d.setDate(d.getDate() - dagen);
  return d.toISOString().slice(0, 10);
}
