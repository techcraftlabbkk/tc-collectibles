import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { stripe } from '@/lib/stripeServer';

export async function POST(req: NextRequest) {
  try {
    // Accept Bearer token from Authorization header (localStorage-based auth)
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Use anon client with the user's JWT to respect RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { global: { headers: { Authorization: `Bearer ${token}` } } }
    );
    const { data: { user }, error: userErr } = await supabase.auth.getUser(token);
    if (userErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const session = { user };

    const { orderId } = await req.json();
    if (!orderId) return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });

    // Fetch order to get amount and items
    const { data: order, error: orderErr } = await supabase
      .from('orders')
      .select('*, order_items(quantity, price_at_purchase, product_id, products(title, grade))')
      .eq('id', orderId)
      .eq('user_id', session.user.id)
      .single();

    if (orderErr || !order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.status !== 'pending_payment') {
      return NextResponse.json({ error: 'Order is not awaiting payment' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || req.headers.get('origin') || 'https://tc-collectibles.vercel.app';
    const locale = req.headers.get('x-locale') || 'en';

    // Build line items from order_items
    const lineItems = (order.order_items || []).map((item: any) => ({
      price_data: {
        currency: 'thb',
        unit_amount: Math.round(item.price_at_purchase * 100), // satang
        product_data: {
          name: item.products?.title || 'PSA Card',
          description: item.products?.grade ? `Grade: ${item.products.grade}` : undefined,
        },
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item
    lineItems.push({
      price_data: {
        currency: 'thb',
        unit_amount: 15000, // 150 THB in satang
        product_data: { name: 'Shipping' },
      },
      quantity: 1,
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: lineItems,
      metadata: {
        orderId,
        userId: session.user.id,
        type: 'card_order',
      },
      customer_email: session.user.email,
      success_url: `${baseUrl}/${locale}/payment/${orderId}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/${locale}/payment/${orderId}`,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (err: any) {
    console.error('Stripe order checkout error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
