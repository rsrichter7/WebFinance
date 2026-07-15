// Dagelijkse retentie-cron: zegt bankkoppelingen op zodra een abonnement/proefperiode
// verloopt, stuurt na verloop van tijd herinneringsmails en wist na 1 jaar de huishouddata
// via de SQL-functie wis_household_data(). Alleen aanroepbaar door Vercel Cron (CRON_SECRET).

const { createClient } = require('@supabase/supabase-js');
const { heeftToegang } = require('../_lib/toegang');
const { ebFetch } = require('../_lib/enableBanking');
const { sendMail } = require('../_lib/mail');
const {
  mailVerlopen,
  mailWaarschuwing30d,
  mailWaarschuwing7d,
  mailDataGewist,
} = require('../_lib/retentieMails');

const DAG_MS = 24 * 60 * 60 * 1000;

module.exports = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Niet geautoriseerd' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  let verwerkt = 0, opgezegd = 0, waarschuwingen = 0, gewist = 0;

  try {
    const { data: households, error: hhError } = await supabase.from('households').select('id');
    if (hhError) {
      console.error('[cron/retentie] households ophalen mislukt:', hhError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    for (const { id: householdId } of households || []) {
      try {
        const toegang = await heeftToegang(supabase, householdId);

        const { data: retentie, error: retentieError } = await supabase
          .from('household_retentie')
          .select('*')
          .eq('household_id', householdId)
          .maybeSingle();

        if (retentieError) {
          console.error(`[cron/retentie] retentie ophalen mislukt voor ${householdId}:`, retentieError);
          continue;
        }

        if (toegang) {
          // Weer toegang (opnieuw geabonneerd): reset de tracking als nog niet gewist is
          if (retentie && !retentie.data_gewist_op) {
            const { error: deleteError } = await supabase
              .from('household_retentie')
              .delete()
              .eq('household_id', householdId);
            if (deleteError) console.error(`[cron/retentie] reset mislukt voor ${householdId}:`, deleteError);
          }
          continue;
        }

        verwerkt++;
        const leden = await haalLeden(supabase, householdId);

        if (!retentie) {
          await verwerkNieuwVerval(supabase, householdId, leden);
          opgezegd++;
          continue;
        }

        if (retentie.data_gewist_op) continue; // al afgehandeld

        const dagenVerlopen = Math.floor((Date.now() - new Date(retentie.verlopen_sinds).getTime()) / DAG_MS);

        if (dagenVerlopen >= 365) {
          await verwerkWissen(supabase, householdId, leden);
          gewist++;
        } else if (dagenVerlopen >= 358 && !retentie.waarschuwing_7d_verzonden) {
          await verstuurAlleLeden(leden, mailWaarschuwing7d);
          await supabase.from('household_retentie').update({ waarschuwing_7d_verzonden: true }).eq('household_id', householdId);
          waarschuwingen++;
        } else if (dagenVerlopen >= 335 && !retentie.waarschuwing_30d_verzonden) {
          await verstuurAlleLeden(leden, mailWaarschuwing30d);
          await supabase.from('household_retentie').update({ waarschuwing_30d_verzonden: true }).eq('household_id', householdId);
          waarschuwingen++;
        }
      } catch (err) {
        console.error(`[cron/retentie] fout bij huishouden ${householdId}:`, err);
      }
    }

    return res.status(200).json({ verwerkt, opgezegd, waarschuwingen, gewist });
  } catch (err) {
    console.error('[cron/retentie] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};

// Haalt e-mailadres (via Auth admin-API) en voornaam (via profiles) op van elk lid
async function haalLeden(supabase, householdId) {
  const { data: members, error } = await supabase
    .from('household_members')
    .select('user_id')
    .eq('household_id', householdId);
  if (error || !members) return [];

  const { data: profiles } = await supabase
    .from('profiles')
    .select('user_id, naam')
    .eq('household_id', householdId)
    .not('user_id', 'is', null);
  const naamPerUser = new Map((profiles || []).map((p) => [p.user_id, p.naam]));

  const leden = [];
  for (const m of members) {
    const { data: userData, error: userError } = await supabase.auth.admin.getUserById(m.user_id);
    if (userError || !userData?.user?.email) continue;
    leden.push({ email: userData.user.email, naam: naamPerUser.get(m.user_id) || '' });
  }
  return leden;
}

async function verstuurAlleLeden(leden, mailFn) {
  for (const lid of leden) {
    try {
      const { subject, html } = mailFn(lid.naam);
      await sendMail(lid.email, subject, html);
    } catch (err) {
      console.error('[cron/retentie] mail versturen mislukt:', err);
    }
  }
}

// Nieuw verval: bankkoppelingen opzeggen (zelfde aanpak als bank/ontkoppel.js, maar
// huishoud-breed), retentie-rij aanmaken en de verval-mail versturen
async function verwerkNieuwVerval(supabase, householdId, leden) {
  const { data: rekeningen, error } = await supabase
    .from('rekeningen')
    .select('id, sessie_id, extern_account_id')
    .eq('household_id', householdId)
    .not('extern_account_id', 'is', null);
  if (error) console.error(`[cron/retentie] rekeningen ophalen mislukt voor ${householdId}:`, error);

  const sessieIds = [...new Set((rekeningen || []).map((r) => r.sessie_id).filter(Boolean))];
  for (const sessieId of sessieIds) {
    const { ok, status, data } = await ebFetch(`/sessions/${sessieId}`, { method: 'DELETE' });
    if (!ok) console.error(`[cron/retentie] EB-sessie opzeggen mislukt (${sessieId}):`, status, data);
  }

  if (rekeningen && rekeningen.length > 0) {
    const { error: updateError } = await supabase
      .from('rekeningen')
      .update({ extern_account_id: null, provider: null, sessie_id: null, koppeling_vervalt: null, identificatie_hash: null })
      .eq('household_id', householdId)
      .not('extern_account_id', 'is', null);
    if (updateError) console.error(`[cron/retentie] rekeningen bijwerken mislukt voor ${householdId}:`, updateError);
  }

  const { error: insertError } = await supabase
    .from('household_retentie')
    .insert({ household_id: householdId, verlopen_sinds: new Date().toISOString(), koppelingen_opgezegd: true });
  if (insertError) console.error(`[cron/retentie] retentie-rij aanmaken mislukt voor ${householdId}:`, insertError);

  await verstuurAlleLeden(leden, mailVerlopen);
}

// 1 jaar verlopen: huishouddata wissen via de SQL-functie en bevestigingsmail versturen
async function verwerkWissen(supabase, householdId, leden) {
  const { error: rpcError } = await supabase.rpc('wis_household_data', { p_household_id: householdId });
  if (rpcError) {
    console.error(`[cron/retentie] wis_household_data mislukt voor ${householdId}:`, rpcError);
    return;
  }

  const { error: updateError } = await supabase
    .from('household_retentie')
    .update({ data_gewist_op: new Date().toISOString() })
    .eq('household_id', householdId);
  if (updateError) console.error(`[cron/retentie] data_gewist_op bijwerken mislukt voor ${householdId}:`, updateError);

  await verstuurAlleLeden(leden, mailDataGewist);
}
