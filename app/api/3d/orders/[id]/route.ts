import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const ADMIN_EMAIL = 'techcraftlab.bkk@gmail.com';

// PATCH: admin updates order status / tracking number
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    if (session.user.email !== ADMIN_EMAIL) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { status, trackingNumber, adminNote } = await req.json();

    const updates: Record<string, any> = {};
    if (status) updates.status = status;
    if (trackingNumber !== undefined) updates.tracking_number = trackingNumber;
    if (adminNote !== undefined) updates.admin_note = adminNote;

    const { data, error } = await supabaseAdmin
      .from('print_orders')
      .update(updates)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;

    // If cancelled, refund tokens
    if (status === 'cancelled' || status === 'refunded') {
      const { data: order } = await supabaseAdmin
        .from('print_orders').select('user_id, token_cost').eq('id', params.id).single();
      if (order) {
        await supabaseAdmin.rpc('increment_user_tokens', {
          p_user_id: order.user_id, p_amount: order.token_cost,
        });
        await supabaseAdmin.from('token_ledger').insert({
          user_id: order.user_id,
          amount: order.token_cost,
          type: 'refund',
          description: `Refund for order #${params.id.slice(0, 8)}`,
          print_order_id: params.id,
        });
      }
    }

    return NextResponse.json({ order: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET all orders — admin only
export async function GET(req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || session.user.email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabaseAdmin.from('print_orders').select('*').order('created_at', { ascending: false });
    if (status) query = query.eq('status', status);

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ orders: data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
