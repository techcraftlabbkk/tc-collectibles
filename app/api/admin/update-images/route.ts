import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const imageUpdates = [
  { title: 'Charizard Holographic Base Set', image: 'https://images.pokemontcg.io/base1/4_holo.png' },
  { title: 'Blastoise Holographic Base Set', image: 'https://images.pokemontcg.io/base1/2_holo.png' },
  { title: 'Venusaur Holographic Base Set', image: 'https://images.pokemontcg.io/base1/3_holo.png' },
  { title: 'Pikachu Illustrator', image: 'https://images.pokemontcg.io/base1/58_holo.png' },
  { title: 'Mewtwo Holographic Base Set', image: 'https://images.pokemontcg.io/base1/10_holo.png' },
  { title: 'Machamp Holographic Base Set', image: 'https://images.pokemontcg.io/base1/6_holo.png' },
  { title: 'Dragonite Holographic Base Set', image: 'https://images.pokemontcg.io/base1/5_holo.png' },
  { title: 'Gyarados Holographic Base Set', image: 'https://images.pokemontcg.io/base1/7_holo.png' },
  { title: 'Arcanine Holographic Base Set', image: 'https://images.pokemontcg.io/base1/20_holo.png' },
  { title: 'Lapras Holographic Base Set', image: 'https://images.pokemontcg.io/base1/25_holo.png' },
  { title: 'Articuno Holographic Base Set', image: 'https://images.pokemontcg.io/base1/30_holo.png' },
  { title: 'Zapdos Holographic Base Set', image: 'https://images.pokemontcg.io/base1/31_holo.png' },
  { title: 'Moltres Holographic Base Set', image: 'https://images.pokemontcg.io/base1/32_holo.png' },
  { title: 'Raichu Holographic Base Set', image: 'https://images.pokemontcg.io/base1/29_holo.png' },
  { title: 'Ninetales Holographic Base Set', image: 'https://images.pokemontcg.io/base1/12_holo.png' },
];

export async function POST(_request: NextRequest) {
  try {
    const results = [];
    
    for (const update of imageUpdates) {
      const { error } = await supabase
        .from('products')
        .update({ image_url: update.image })
        .eq('title', update.title);
      
      if (error) {
        results.push({ title: update.title, status: 'error', message: error.message });
      } else {
        results.push({ title: update.title, status: 'success' });
      }
    }
    
    return NextResponse.json({ success: true, updates: results });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
