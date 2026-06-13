// Stripe-webhook events ontvangen en de subscriptions-tabel bijwerken

const Stripe = require('stripe');
const { createClient } = require('@supabase/supabase-js');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Stripe vereist de onbewerkte body voor handtekeningverificatie
module.exports.config = {
  api: {
    bodyParser: false,
  },
};

const getRawBody = (req) =>
  new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });

// Mapping van Stripe-statussen naar interne statussen
const STATUS_MAP = {
  active: 'active',
  trialing: 'active',
  past_due: 'past_due',
  unpaid: 'past_due',
  canceled: 'canceled',
};

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  let rawBody;
  try {
    rawBody = await getRawBody(req);
  } catch (err) {
    console.error('[stripe-webhook] Body lezen mislukt:', err);
    return res.status(400).json({ error: 'Body lezen mislukt' });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('[stripe-webhook] Handtekening ongeldig:', err.message);
    return res.status(400).json({ error: 'Ongeldige handtekening' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  const now = new Date().toISOString();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const householdId = session.metadata?.household_id;
        const plan = session.metadata?.plan;
        const stripeSubId = session.subscription;

        const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
        const periodEnd = new Date(stripeSub.current_period_end * 1000).toISOString();

        await supabase
          .from('subscriptions')
          .update({
            status: 'active',
            plan,
            stripe_subscription_id: stripeSubId,
            current_period_end: periodEnd,
            updated_at: now,
          })
          .eq('household_id', householdId);
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object;
        const newStatus = STATUS_MAP[sub.status];
        // 'incomplete' en onbekende statussen niet downgraden
        if (!newStatus) break;

        const periodEnd = new Date(sub.current_period_end * 1000).toISOString();

        await supabase
          .from('subscriptions')
          .update({
            status: newStatus,
            current_period_end: periodEnd,
            updated_at: now,
          })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object;
        await supabase
          .from('subscriptions')
          .update({ status: 'canceled', updated_at: now })
          .eq('stripe_subscription_id', sub.id);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        await supabase
          .from('subscriptions')
          .update({ status: 'past_due', updated_at: now })
          .eq('stripe_subscription_id', invoice.subscription);
        break;
      }

      default:
        // Onbekend event — stilzwijgend negeren
        break;
    }
  } catch (err) {
    console.error('[stripe-webhook] Fout bij verwerken event:', event.type, err);
    return res.status(500).json({ error: 'Verwerking mislukt' });
  }

  return res.status(200).json({ received: true });
};
