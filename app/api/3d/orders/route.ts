import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { calculateTokenCost } from '@/lib/stripeServer';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET: list user's print orders
export async function GET(_req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { data, error } = await supabase
      .from('print_orders')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: create a new print order (deducts tokens atomically)
export async function POST(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const {
      modelSource, modelFileUrl, meshyJobId, modelPreviewUrl, modelName,
      catalogueModelId = null, estGrams = null, estHours = null,
      material = 'pla', color = 'white', scaleCm = 15,
      infillPercent = 20, quantity = 1,
      customerName, customerEmail, deliveryAddress,
    } = body;

    if (!modelSource) return NextResponse.json({ error: 'modelSource is required' }, { status: 400 });

    const tokenCost = calculateTokenCost({ material, scaleCm, infillPercent, quantity });

    // Atomically deduct tokens using the DB function
    const { data: deducted, error: deductErr } = await supabaseAdmin.rpc('deduct_user_tokens', {
      p_user_id: session.user.id,
      p_amount: tokenCost,
    });

    if (deductErr) throw deductErr;
    if (!deducted) {
      return NextResponse.json({ error: 'Insufficient tokens', code: 'INSUFFICIENT_TOKENS' }, { status: 402 });
    }

    // Create the order
    const { data: order, error: orderErr } = await supabaseAdmin.from('print_orders').insert({
      user_id: session.user.id,
      model_source: modelSource,
      model_file_url: modelFileUrl ?? null,
      meshy_job_id: meshyJobId ?? null,
      model_preview_url: modelPreviewUrl ?? null,
      model_name: modelName || 'Custom Print',
      material, color,
      scale_cm: scaleCm,
      infill_percent: infillPercent,
      quantity,
      token_cost: tokenCost,
      catalogue_model_id: catalogueModelId,
      est_grams: estGrams,
      est_hours: estHours,
      customer_email: customerEmail ?? session.user.email,
      customer_name: customerName ?? null,
      delivery_address: deliveryAddress ?? null,
    }).select().single();

    if (orderErr) {
      // Refund tokens if order insert failed
      await supabaseAdmin.rpc('increment_user_tokens', { p_user_id: session.user.id, p_amount: tokenCost });
      throw orderErr;
    }

    // Log deduction to ledger
    await supabaseAdmin.from('token_ledger').insert({
      user_id: session.user.id,
      amount: -tokenCost,
      type: 'deduct',
      description: `Print order: ${modelName || 'Custom Print'}`,
      print_order_id: order.id,
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (err: any) {
    console.error('Create print order error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
