const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://qaitwuscmzwmtlodruwc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaXR3dXNjbXp3bXRsb2RydXdjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2NzQ2MjksImV4cCI6MjA5MzI1MDYyOX0.UAGguTKivbheJM3hX3RJ9fsaSn2x_Ca-pVRC52-hSPM';

const supabase = createClient(supabaseUrl, supabaseKey);

const updates = [
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

async function updateImages() {
  try {
    for (const update of updates) {
      const { error } = await supabase
        .from('products')
        .update({ image_url: update.image })
        .eq('title', update.title);
      
      if (error) {
        console.error(`Error updating ${update.title}:`, error);
      } else {
        console.log(`✓ Updated ${update.title}`);
      }
    }
    console.log('\nAll images updated successfully!');
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

updateImages();
