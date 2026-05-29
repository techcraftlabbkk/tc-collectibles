import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { stripe, CREDIT_PACKS } from '@/lib/stripeServer';

export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { packId, locale = 'en' } = await req.json();
    const pack = CREDIT_PACKS.find(p => p.id === packId);
    if (!pack) return NextResponse.json({ error: 'Invalid pack' }, { status: 400 });

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || 'http://localhost:3000';

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'thb',
          unit_amount: pack.priceTHB * 100, // Stripe uses smallest currency unit (satang)
          product_data: {
            name: `${pack.label} Credit Pack — ${pack.tokens} tokens`,
            description: pack.description,
            metadata: { packId: pack.id, tokens: String(pack.tokens) },
          },
        },
        quantity: 1,
      }],
      metadata: {
        userId: session.user.id,
        packId: pack.id,
        tokens: String(pack.tokens),
      },
      customer_email: session.user.email,
      success_url: `${baseUrl}/${locale}/3d-studio/wallet/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/3d-studio/wallet`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Stripe checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
