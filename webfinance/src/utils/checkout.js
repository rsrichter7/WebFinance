// ─── checkout ───
// Helper om een Stripe-checkoutsessie te starten via de serverless API.
// Haalt de Supabase JWT op en stuurt de gebruiker door naar Stripe.

import { supabase } from '../supabaseClient'

export async function startCheckout(plan) {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Niet ingelogd. Log opnieuw in en probeer het nogmaals.')

  const res = await fetch('/api/create-checkout', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ plan }),
  })

  if (!res.ok) {
    let bericht = 'Onbekende fout bij het starten van de checkout.'
    try {
      const json = await res.json()
      if (json?.error)   bericht = json.error
      else if (json?.message) bericht = json.message
    } catch (_) { /* json parse mislukt — gebruik standaardbericht */ }
    throw new Error(bericht)
  }

  const { url } = await res.json()
  window.location.href = url
}
