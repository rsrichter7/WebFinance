// Bepaalt of een huishouden toegang heeft tot betaalde functies (bv. bankkoppeling):
// actief abonnement óf een lopende proefperiode. Exact dezelfde regel als de client-side
// useSubscription-hook (webfinance/src/hooks/useSubscription.js), maar dan server-side
// afgedwongen zodat directe API-aanroepen de client-gate niet kunnen omzeilen.

async function heeftToegang(supabase, householdId) {
  const { data } = await supabase
    .from('subscriptions')
    .select('status, trial_ends_at')
    .eq('household_id', householdId)
    .maybeSingle();

  // Geen rij: zelfde fail-open gedrag als de client (bv. huishouden nog zonder subscriptions-rij)
  if (!data) return true;

  const now = new Date();
  const trialEnd = data.trial_ends_at ? new Date(data.trial_ends_at) : null;
  const isTrialing = data.status === 'trialing' && trialEnd !== null && trialEnd > now;
  const isActive = data.status === 'active';

  return isTrialing || isActive;
}

module.exports = { heeftToegang };
