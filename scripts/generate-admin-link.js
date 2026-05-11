/**
 * Generates a fresh password reset link for the admin account.
 * Run this after updating Supabase Site URL to production.
 *
 * Usage: node scripts/generate-admin-link.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = 'https://tc-collectibles.vercel.app';

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function main() {
  const ADMIN_EMAIL = 'techcraftlab.bkk@gmail.com';

  console.log(`\nGenerating password set link for ${ADMIN_EMAIL}...\n`);

  const { data, error } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: ADMIN_EMAIL,
    options: { redirectTo: `${SITE_URL}/auth/callback` },
  });

  if (error) {
    console.error('❌  Error:', error.message);
    return;
  }

  console.log('✅  Password set link (click to set your password):');
  console.log('\n' + data.properties.action_link + '\n');
  console.log('⚠️  This link expires in 1 hour.');
}

main();
