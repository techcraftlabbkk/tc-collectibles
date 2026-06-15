// Seed the catalogue_models table from data/catalogue_seed.json
// Usage: node scripts/seed-catalogue.mjs
// Requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env.
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dir = dirname(fileURLToPath(import.meta.url));
const seed = JSON.parse(readFileSync(join(__dir, '..', 'data', 'catalogue_seed.json'), 'utf8'));

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) { console.error('Missing Supabase env vars'); process.exit(1); }

const supabase = createClient(url, key);

const rows = seed.map(r => ({
  id: r.id, rank: r.rank, name: r.name, category: r.category, source: r.source,
  source_url: r.source_url, file_url: r.file_url, thumbnail_url: r.thumbnail_url,
  license: r.license, commercial_ok: r.commercial_ok, bambu_ready: r.bambu_ready,
  material: r.material, rec_scale_cm: r.rec_scale_cm, rec_infill_percent: r.rec_infill_percent,
  base_grams: r.base_grams, est_grams: r.est_grams, est_hours: r.est_hours,
  est_tokens: r.est_tokens, is_active: true, updated_at: new Date().toISOString(),
}));

const { error } = await supabase.from('catalogue_models').upsert(rows, { onConflict: 'id' });
if (error) { console.error('Seed failed:', error.message); process.exit(1); }
console.log(`✅ Seeded ${rows.length} catalogue models.`);
