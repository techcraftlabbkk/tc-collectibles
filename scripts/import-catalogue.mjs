// Catalogue importer — fetches real models (with actual preview images) from Thinger
// and upserts them into the catalogue_models table.
//
// Thinger indexes free models from Printables / Thingiverse / MyMiniFactory / Cults3D
// and every model page exposes: og:image (the real photo), the designer, the source,
// and a direct "Download free STL" link to the original listing.
//
// Usage:
//   node scripts/import-catalogue.mjs            # imports the built-in CANDIDATES list
//   node scripts/import-catalogue.mjs 41202 779  # import specific Thinger model ids
//
// Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY in env.
// NOTE: license must be verified per model before commercial_ok is set true.

import { createClient } from '@supabase/supabase-js';

const SUPA_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPA_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Built-in queue of real Thinger model slugs, grouped by category. Extend freely —
// browse https://api.thinger.rocks/collections/* and paste the model slugs here.
const CANDIDATES = [
  // Articulated / flexi
  ['Articulated', ['39644-cute-mini-octopus','40779-the-adorable-articulated-mini-gecko','13229-seven-the-articulated-dragon','14774-lung-oriental-articulated-dragon','16205-articulated-flexi-cute-dragon','17094-articulated-baby-dragon','16188-articulated-gothic-dragon','39820-articulated-sea-dragon','779-mr-bones-articulated-skeleton','33732-spiky-mountain-dragon-extra-long-version']],
  // Figurines
  ['Figurine', ['41838-baby-yoda','31049-mini-darth-vader','24907-mini-spiderman-homecoming','26646-mini-batman','41768-hellboy-30-cm-model','44849-fancy-skull-2-free-low-res']],
  // Planters
  ['Planter', ['39643-modern-spiral-planter','124-baby-groot-air-plant-planter','1032-hexagon-succulent-planter','82-flower-pot']],
  // Vases
  ['Vase', ['20850-mini-vase-clay-pot-style-collection-mini-vaso-in-stile-classico-terracotta']],
  // Lighting
  ['Lighting', ['39646-design-moon-lamp','27398-ring-lamp-ii-with-halloween-panels','25831-day-of-the-dead-halloween-pumpkin-lamp']],
  // Desk toys
  ['Desk Toy', ['32655-the-flex-cube','43587-3d-printable-rubiks-cube','14896-cube-infini-infinity-cube','31886-fijj-cube-no-supports-easy-print-fidget-cube-tactile']],
  // Organizers / gridfinity
  ['Organizer', ['39638-rugged-box-parametric','30840-mini-trash-can','42692-gridfinity-storage-box-schubox-v2-large-7x6','28237-gridfinity-allen-key-tray','30771-gridfinity-chapstick-blistex-holster','39710-gridfinity-folding-drill-bit-storage']],
  // Gadgets / calibration
  ['Gadget', ['12-3dbenchy-the-jolly-3d-printing-torture-test-by-creativetoolsse','30-xyz-20mm-calibration-cube','3-all-in-one-3d-printer-test','32735-first-layer-calibration-helper','29176-flow-test-cube']],
  // Tools
  ['Tool', ['39639-filament-clip-grandmas-favorite-filament-clip','39637-hexscraper-printbed-scraper','16-175mm-filament-clip','66-tush-the-ultimate-spool-holder']],
  // Tabletop
  ['Tabletop', ['17235-open-treasure-chest-tabletop-miniature','18292-green-hag-tabletop-miniature','42993-elite-guard-free','38295-skeleton-updated']],
  // Keychains
  ['Keychain', ['44800-little-sleep-dragon-keychain','28176-ghost-keychains','3187-keychain-snake-fidget-snake-toy']],
  // Seasonal
  ['Seasonal', ['14766-halloween-tree-with-pumpkins','32326-destiny-ghost-ornament','1788-little-pumpkins','670-cute-hug-me-ghost']],
  // Toys
  ['Toy', ['2-balloon-boat-v3-update-compatible-with-mini-figures','10-repeating-mini-crossbow','5910-balloon-dog']],
  // Home decor / hueforge
  ['Home Decor', ['41202-ink-splatter-cat-girl-hueforge','42440-logo-bmw']],
];

const CATEGORY_BASE_GRAMS = {
  Articulated: 55, Figurine: 48, Planter: 85, Vase: 38, Lighting: 70, 'Desk Toy': 30,
  Organizer: 75, Gadget: 22, Tabletop: 18, Keychain: 8, Seasonal: 18, Toy: 35,
  'Home Decor': 40, Tool: 28,
};
const CATEGORY_DEFAULTS = { // [scaleCm, infill]
  Articulated: [18, 15], Figurine: [14, 15], Planter: [14, 15], Vase: [16, 8], Lighting: [15, 15],
  'Desk Toy': [8, 20], Organizer: [15, 20], Gadget: [6, 15], Tabletop: [5, 20], Keychain: [6, 20],
  Seasonal: [11, 15], Toy: [11, 15], 'Home Decor': [15, 15], Tool: [10, 30],
};

function tokenCost(scale, infill) {
  return Math.max(5, Math.round((scale / 10) * 8 * (infill / 40)));
}
function estimate(scale, infill, baseGrams) {
  const vol = Math.pow(scale / 15, 3);
  const inf = (0.35 + 0.65 * (infill / 100)) / 0.48;
  const grams = Math.max(2, Math.round(baseGrams * vol * inf));
  const hours = Math.round((grams / 13 + 0.4) * 10) / 10;
  return { grams, hours };
}
const meta = (html, prop) => {
  const m = html.match(new RegExp(`<meta property="${prop}" content="([^"]*)"`, 'i'))
    || html.match(new RegExp(`<meta name="${prop}" content="([^"]*)"`, 'i'));
  return m ? m[1].replace(/&amp;/g, '&').replace(/&#039;/g, "'").replace(/&quot;/g, '"') : null;
};

async function fetchModel(slug, category) {
  const id = slug.split('-')[0];
  const url = `https://api.thinger.rocks/3dmodel/${slug}`;
  const html = await (await fetch(url)).text();
  const img = meta(html, 'og:image');
  const title = (meta(html, 'og:title') || '').replace(/\s*\|\s*Free 3D Print Model.*$/i, '').trim();
  const desc = meta(html, 'og:description') || '';
  const dlMatch = html.match(/href="(https:\/\/(?:www\.)?(?:printables\.com|thingiverse\.com|myminifactory\.com)\/[^"]+)"/i);
  const byMatch = desc.match(/by ([^.]+?) on (Printables|Thingiverse|MyMiniFactory|Cults3D)/i);
  const designer = byMatch ? byMatch[1].trim() : 'Unknown';
  const source = byMatch ? byMatch[2] : 'Thinger';
  const [scale, infill] = CATEGORY_DEFAULTS[category] || [15, 20];
  const baseGrams = CATEGORY_BASE_GRAMS[category] || 45;
  const eff = infill > 0 ? infill : 8;
  const { grams, hours } = estimate(scale, eff, baseGrams);
  return {
    id: `thinger-${id}`, name: title, category, source, designer,
    source_url: url, file_url: dlMatch ? dlMatch[1] : null, thumbnail_url: img,
    license: 'Verify', commercial_ok: false, bambu_ready: true, material: 'pla',
    rec_scale_cm: scale, rec_infill_percent: infill, base_grams: baseGrams,
    est_grams: grams, est_hours: hours, est_tokens: tokenCost(scale, eff),
    is_active: true, updated_at: new Date().toISOString(),
  };
}

async function main() {
  const argSlugs = process.argv.slice(2);
  const jobs = [];
  if (argSlugs.length) {
    for (const s of argSlugs) jobs.push([s, 'Figurine']);
  } else {
    for (const [cat, slugs] of CANDIDATES) for (const s of slugs) jobs.push([s, cat]);
  }

  const rows = [];
  for (const [slug, cat] of jobs) {
    try {
      const r = await fetchModel(slug, cat);
      if (r.name && r.thumbnail_url) { rows.push(r); console.log(`✓ ${r.category.padEnd(11)} ${r.name}`); }
      else console.warn(`✗ skipped ${slug} (missing data)`);
    } catch (e) { console.warn(`✗ ${slug}: ${e.message}`); }
    await new Promise(r => setTimeout(r, 250)); // be polite
  }

  if (!SUPA_URL || !SUPA_KEY) {
    console.log(`\nDRY RUN — ${rows.length} models fetched (set Supabase env vars to upsert).`);
    return;
  }
  const supabase = createClient(SUPA_URL, SUPA_KEY);
  const { error } = await supabase.from('catalogue_models').upsert(rows, { onConflict: 'id' });
  if (error) { console.error('Upsert failed:', error.message); process.exit(1); }
  console.log(`\n✅ Imported ${rows.length} models into catalogue_models.`);
}
main();
