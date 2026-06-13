// Stripe Checkout-sessie aanmaken en redirect-URL teruggeven voor abonnement

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PLAN_PRICE_MAP = {
  monthly: process.env.STRIPE_PRICE_MONTHLY,
  quarterly: process.env.STRIPE_PRICE_QUARTERLY,
  yearly: process.env.STRIPE_PRICE_YEARLY,
};

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

  const { plan } = req.body ?? {};
  const priceId = PLAN_PRICE_MAP[plan];
  if (!priceId) {
    return res.status(400).json({ error: `Onbekend plan: ${plan}` });
  }

  try {
    // Household_id ophalen van de ingelogde gebruiker
    // Gebruik maybeSingle() zodat 0 resultaten geen error zetten in memberError
    console.error('[create-checkout] user.id:', user.id);

    const { data: member, error: memberError } = await supabase
      .from('household_members')
      .select('household_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (memberError || !member) {
      console.error('[create-checkout] household niet gevonden — memberError:', memberError, 'member:', member, 'user_id:', user.id);
      return res.status(400).json({ error: 'Huishouden niet gevonden' });
    }
    const householdId = member.household_id;
    console.error('[create-checkout] household_id:', householdId);

    // Bestaande stripe_customer_id ophalen uit subscriptions-tabel
    const { data: existingSub } = await supabase
      .from('subscriptions')
      .select('stripe_customer_id')
      .eq('household_id', householdId)
      .single();

    let customerId = existingSub?.stripe_customer_id;

    if (!customerId) {
      // Nieuwe Stripe-customer aanmaken en opslaan
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { household_id: householdId },
      });
      customerId = customer.id;

      await supabase
        .from('subscriptions')
        .upsert(
          {
            household_id: householdId,
            stripe_customer_id: customerId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'household_id' }
        );
    }

    const origin = req.headers.origin || 'https://webfinance-nl.vercel.app';

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      payment_method_types: ['card', 'ideal'],
      locale: 'nl',
      metadata: { household_id: householdId, plan },
      subscription_data: { metadata: { household_id: householdId, plan } },
      success_url: `${origin}/abonnement/geslaagd?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/abonnement/geannuleerd`,
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('[create-checkout] Fout:', err);
    return res.status(500).json({ error: 'Interne serverfout' });
  }
};
