import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function GET(_req: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Ensure wallet row exists
    const { error: upsertErr } = await supabase
      .from('user_tokens')
      .upsert({ user_id: session.user.id, balance: 0 }, { onConflict: 'user_id', ignoreDuplicates: true });

    const { data, error } = await supabase
      .from('user_tokens')
      .select('balance')
      .eq('user_id', session.user.id)
      .single();

    if (error) throw error;

    // Also fetch recent ledger entries
    const { data: ledger } = await supabase
      .from('token_ledger')
      .select('id, amount, type, description, created_at')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(20);

    return NextResponse.json({ balance: data?.balance ?? 0, ledger: ledger ?? [] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
