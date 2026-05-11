/**
 * TC Collectibles — Product Seed Script
 * ──────────────────────────────────────
 * Inserts 10 sample PSA Pokémon cards into Supabase.
 *
 * Usage:
 *   node scripts/seed-products.js
 *
 * Requirements:
 *   npm install @supabase/supabase-js dotenv
 *   (or: node --require dotenv/config scripts/seed-products.js)
 *
 * Reads credentials from .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...   ← needs service role to bypass RLS
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

const products = [
  {
    title: 'Charizard Base Set Holo — PSA 10 Gem Mint',
    grade: 'PSA 10',
    description: 'The holy grail of Pokémon cards. Base Set unlimited Charizard in perfect PSA 10 condition.',
    price: 85000,
    quantity: 1,
    available: true,
  },
  {
    title: 'Pikachu Illustrator — PSA 9 Mint',
    grade: 'PSA 9',
    description: 'One of the rarest Pokémon cards ever printed. CoroCoro 1998 Illustrator promo.',
    price: 320000,
    quantity: 1,
    available: true,
  },
  {
    title: 'Blastoise Base Set Holo — PSA 9 Mint',
    grade: 'PSA 9',
    description: 'Classic Base Set Blastoise holo in near-perfect condition.',
    price: 12500,
    quantity: 2,
    available: true,
  },
  {
    title: 'Venusaur Base Set Holo — PSA 8.5 NM-MT+',
    grade: 'PSA 8.5',
    description: 'Completing the original starter trio — Base Set Venusaur in excellent shape.',
    price: 9800,
    quantity: 1,
    available: true,
  },
  {
    title: 'Mewtwo Base Set Holo — PSA 10 Gem Mint',
    grade: 'PSA 10',
    description: 'The legendary Mewtwo from Base Set in flawless PSA 10 condition.',
    price: 28000,
    quantity: 1,
    available: true,
  },
  {
    title: 'Gengar 1st Edition Fossil — PSA 8 NM-MT',
    grade: 'PSA 8',
    description: 'Shadowless Gengar from the Fossil expansion, 1st Edition stamp.',
    price: 15500,
    quantity: 1,
    available: true,
  },
  {
    title: 'Lugia Neo Genesis Holo — PSA 9 Mint',
    grade: 'PSA 9',
    description: 'Iconic Gen 2 legendary. Neo Genesis Lugia in mint condition.',
    price: 22000,
    quantity: 2,
    available: true,
  },
  {
    title: 'Charizard EX FireRed & LeafGreen — PSA 10',
    grade: 'PSA 10',
    description: 'Shining Charizard EX from the FireRed & LeafGreen era in perfect PSA 10.',
    price: 18000,
    quantity: 1,
    available: true,
  },
  {
    title: 'Umbreon Gold Star — PSA 9 Mint',
    grade: 'PSA 9',
    description: 'One of the most sought-after Gold Star cards — Umbreon from POP Series 5.',
    price: 35000,
    quantity: 1,
    available: true,
  },
  {
    title: 'Rayquaza Gold Star — PSA 7 Near Mint',
    grade: 'PSA 7',
    description: 'The beloved Rayquaza Gold Star from Dragon Vault. Great starter investment piece.',
    price: 7500,
    quantity: 3,
    available: true,
  },
];

async function seed() {
  console.log(`\n🌱  Seeding ${products.length} products into Supabase...\n`);

  // Check if products table already has data
  const { count } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  if (count && count > 0) {
    console.log(`⚠️  Table already has ${count} rows. Skipping seed to avoid duplicates.`);
    console.log('   Delete existing rows in Supabase Table Editor first if you want to re-seed.\n');
    process.exit(0);
  }

  const { data, error } = await supabase
    .from('products')
    .insert(products)
    .select();

  if (error) {
    console.error('❌  Insert failed:', error.message);
    process.exit(1);
  }

  console.log(`✅  Inserted ${data.length} products:\n`);
  data.forEach((p, i) => {
    console.log(`  ${i + 1}. [${p.grade}] ${p.title.substring(0, 50)} — ฿${p.price.toLocaleString()}`);
  });

  console.log('\n🚀  Done! Visit your Supabase dashboard or the live site to verify.\n');
}

seed().catch((e) => { console.error(e); process.exit(1); });
