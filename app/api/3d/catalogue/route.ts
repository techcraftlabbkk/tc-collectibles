import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import seed from '@/data/catalogue_seed.json';

// GET /api/3d/catalogue?q=dragon&category=Articulated&limit=100
//
// Reads from the `catalogue_models` table. If the table is empty or unavailable
// (e.g. migration not yet run), it transparently falls back to the bundled seed
// file so the Studio catalogue always works.
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get('q') ?? '').trim().toLowerCase();
  const category = searchParams.get('category') ?? '';
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '120', 10) || 120, 200);

  let rows: any[] = [];

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data, error } = await supabase
      .from('catalogue_models')
      .select('*')
      .eq('is_active', true)
      .order('rank', { ascending: true });
    if (!error && data && data.length) rows = data;
  } catch {
    /* fall through to seed */
  }

  if (!rows.length) rows = seed as any[];

  // Filter
  let filtered = rows;
  if (category && category !== 'All') filtered = filtered.filter(r => r.category === category);
  if (q) filtered = filtered.filter(r =>
    r.name.toLowerCase().includes(q) || r.category.toLowerCase().includes(q));

  const categories = ['All', ...Array.from(new Set(rows.map(r => r.category)))];

  return NextResponse.json({
    models: filtered.slice(0, limit),
    total: filtered.length,
    categories,
  });
}
