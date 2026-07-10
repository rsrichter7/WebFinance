// Account verwijderen: solo-huishouden wist alles + zegt Stripe op, gedeeld huishouden laat de gebruiker vertrekken

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Niet ingelogd' });
  }
  const token = authHeader.slice(7);

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return res.status(401).json({ error: 'Ongeldig token' });
  }

  try {
    const { data: member, error: memberError } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (memberError) {
      console.error('[delete-account] memberError:', memberError);
    }

    if (!member) {
      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteUserError) {
        console.error('[delete-account] deleteUser (geen huishouden) fout:', deleteUserError);
        return res.status(500).json({ error: 'Interne serverfout' });
      }
      return res.status(200).json({ deleted: true });
    }

    const householdId = member.household_id;

    const { count, error: countError } = await supabase
      .from('household_members')
      .select('user_id', { count: 'exact', head: true })
      .eq('household_id', householdId);

    if (countError) {
      console.error('[delete-account] countError:', countError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    if ((count ?? 0) <= 1) {
      // Solo-huishouden: Stripe opzeggen, dan data wissen, dan auth-user verwijderen
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('stripe_subscription_id')
        .eq('household_id', householdId)
        .maybeSingle();

      if (sub?.stripe_subscription_id) {
        try {
          await stripe.subscriptions.cancel(sub.stripe_subscription_id);
        } catch (stripeErr) {
          console.error('[delete-account] Stripe-opzegging mislukt:', stripeErr);
        }
      }

      const { error: cascadeError } = await supabase.rpc('delete_household_cascade', {
        p_household_id: householdId,
      });
      if (cascadeError) {
        console.error('[delete-account] delete_household_cascade fout:', cascadeError);
        return res.status(500).json({ error: 'Interne serverfout' });
      }

      const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
      if (deleteUserError) {
        console.error('[delete-account] deleteUser (solo) fout:', deleteUserError);
        return res.status(500).json({ error: 'Interne serverfout' });
      }

      return res.status(200).json({ deleted: true });
    }

    // Gedeeld huishouden: alleen deze gebruiker vertrekt, Stripe blijft ongemoeid
    const { error: departError } = await supabase.rpc('depart_shared_household', {
      p_user_id: user.id,
    });
    if (departError) {
      console.error('[delete-account] depart_shared_household fout:', departError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    const { error: deleteUserError } = await supabase.auth.admin.deleteUser(user.id);
    if (deleteUserError) {
      console.error('[delete-account] deleteUser (gedeeld) fout:', deleteUserError);
      return res.status(500).json({ error: 'Interne serverfout' });
    }

    return res.status(200).json({ deleted: true });
  } catch (err) {
    console.error('[delete-account] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};
