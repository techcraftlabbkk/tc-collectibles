// Mirror catalogue preview images into your own Supabase Storage.
//
// Why: cards currently point at source CDNs (Printables / Thingiverse / MyMiniFactory).
// Those can hotlink-block by browser Referer and the links rot over time. This script
// downloads each preview server-side (no Referer issues) and re-hosts it in a public
// Supabase Storage bucket, then rewrites thumbnail_url to your own URL.
//
// Usage:
//   node scripts/mirror-thumbnails.mjs            # mirror everything in catalogue_models
//   node scripts/mirror-thumbnails.mjs --seed     # also mirror data/catalogue_seed.json and rewrite it
//
// Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env.

import { createClient } from '@supabase/supabase-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const BUCKET = 'catalogue-thumbs';
const __dir = dirname(fileURLToPath(import.meta.url));
const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPA_URL || !SUPA_KEY) { console.error('Missing Supabase env vars'); process.exit(1); }
const supabase = createClient(SUPA_URL, SUPA_KEY);

const extFor = (ct, url) => {
  if (ct?.includes('png')) return 'png';
  if (ct?.includes('webp')) return 'webp';
  if (ct?.includes('gif')) return 'gif';
  if (ct?.includes('jpeg') || ct?.includes('jpg')) return 'jpg';
  const m = url.split('?')[0].match(/\.(png|jpe?g|webp|gif)$/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
};

async function ensureBucket() {
  const { data } = await supabase.storage.getBucket(BUCKET);
  if (!data) {
    const { error } = await supabase.storage.createBucket(BUCKET, { public: true });
    if (error && !/exists/i.test(error.message)) throw error;
    console.log(`Created public bucket "${BUCKET}".`);
  }
}

async function mirror(id, srcUrl) {
  const res = await fetch(srcUrl, { headers: { 'User-Agent': 'Mozilla/5.0 TC-Collectibles-importer' } });
  if (!res.ok) throw new Error(`fetch ${res.status}`);
  const ct = res.headers.get('content-type') || '';
  const buf = Buffer.from(await res.arrayBuffer());
  const path = `${id}.${extFor(ct, srcUrl)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, buf, {
    contentType: ct || 'image/jpeg', upsert: true,
  });
  if (error) throw error;
  const { data: { publicUrl } } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return publicUrl;
}

async function main() {
  await ensureBucket();
  const useSeed = process.argv.includes('--seed');

  let rows = [];
  if (useSeed) {
    rows = JSON.parse(readFileSync(join(__dir, '..', 'data', 'catalogue_seed.json'), 'utf8'));
  } else {
    const { data, error } = await supabase.from('catalogue_models').select('id, thumbnail_url');
    if (error) throw error;
    rows = data ?? [];
  }

  let ok = 0;
  for (const r of rows) {
    if (!r.thumbnail_url || r.thumbnail_url.includes(SUPA_URL)) continue; // skip already-mirrored
    try {
      const url = await mirror(r.id, r.thumbnail_url);
      r.thumbnail_url = url;
      await supabase.from('catalogue_models').update({ thumbnail_url: url }).eq('id', r.id);
      ok++; console.log(`✓ ${r.id}`);
    } catch (e) { console.warn(`✗ ${r.id}: ${e.message}`); }
    await new Promise(r => setTimeout(r, 150));
  }

  if (useSeed) {
    writeFileSync(join(__dir, '..', 'data', 'catalogue_seed.json'), JSON.stringify(rows, null, 2));
    console.log('Rewrote data/catalogue_seed.json with mirrored URLs.');
  }
  console.log(`\n✅ Mirrored ${ok} images into Supabase Storage bucket "${BUCKET}".`);
}
main();
