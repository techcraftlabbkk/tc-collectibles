import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripeServer';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

// Use service-role client to bypass RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err: any) {
    console.error('Stripe webhook signature error:', err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { userId, tokens } = session.metadata ?? {};

    if (!userId || !tokens) {
      console.error('Missing metadata in Stripe session', session.id);
      return NextResponse.json({ received: true });
    }

    const tokenAmount = parseInt(tokens, 10);

    // Credit tokens to wallet (upsert in case row doesn't exist yet)
    const { error: walletErr } = await supabaseAdmin
      .from('user_tokens')
      .upsert({ user_id: userId, balance: tokenAmount }, { onConflict: 'user_id' });

    if (walletErr) {
      // Row exists — increment instead
      const { error: rpcErr } = await supabaseAdmin.rpc('increment_user_tokens', {
        p_user_id: userId,
        p_amount: tokenAmount,
      });
      if (rpcErr) {
        console.error('Failed to credit tokens:', rpcErr);
        return NextResponse.json({ error: 'Token credit failed' }, { status: 500 });
      }
    }

    // Log to ledger
    await supabaseAdmin.from('token_ledger').insert({
      user_id: userId,
      amount: tokenAmount,
      type: 'topup',
      description: `Purchased ${tokenAmount} tokens via Stripe`,
      stripe_session_id: session.id,
    });

    console.log(`✅ Credited ${tokenAmount} tokens to user ${userId}`);
  }

  return NextResponse.json({ received: true });
}
