/**
 * Admin Setup Script
 * Run once to create the admin account for techcraftlab.bkk@gmail.com
 *
 * Usage:
 *   node scripts/setup-admin.js
 *
 * This will:
 *  1. Invite techcraftlab.bkk@gmail.com via Supabase (sends invite email)
 *  2. Add the user to the admins table with full permissions
 *  3. Print a password reset link so you can set the password immediately
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://tc-collectibles.vercel.app';

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const ADMIN_EMAIL = 'techcraftlab.bkk@gmail.com';
const ADMIN_NAME = 'TC Collectibles Admin';

async function main() {
  console.log(`\n🚀  Setting up admin account for ${ADMIN_EMAIL}...\n`);

  // ── Step 1: Check if user already exists ──────────────────────────────────
  const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
  if (listError) {
    console.error('❌  Could not list users:', listError.message);
    process.exit(1);
  }

  let userId = null;
  const existingUser = users.find((u) => u.email === ADMIN_EMAIL);

  if (existingUser) {
    userId = existingUser.id;
    console.log(`ℹ️   User already exists in Supabase Auth (id: ${userId})`);
  } else {
    // ── Step 2: Invite user (sends email with link to set password) ──────────
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      ADMIN_EMAIL,
      {
        data: { full_name: ADMIN_NAME },
        redirectTo: `${SITE_URL}/auth/callback`,
      }
    );

    if (inviteError) {
      console.error('❌  Failed to invite user:', inviteError.message);
      process.exit(1);
    }

    userId = inviteData.user.id;
    console.log(`✅  Invitation sent to ${ADMIN_EMAIL} (id: ${userId})`);
    console.log(`    → Check inbox for a "Confirm your signup" email`);
    console.log(`    → Click it to set a password and activate the account\n`);
  }

  // ── Step 3: Add to admins table ────────────────────────────────────────────
  const { error: adminError } = await supabaseAdmin.from('admins').upsert(
    [
      {
        user_id: userId,
        role: 'admin',
        permissions: [
          'view_orders',
          'update_orders',
          'view_products',
          'update_products',
          'manage_admins',
        ],
      },
    ],
    { onConflict: 'user_id' }
  );

  if (adminError) {
    console.error('❌  Failed to add to admins table:', adminError.message);
    console.log('    → You may need to run the SQL migrations first:');
    console.log('       database/002_create_admins_table.sql');
    process.exit(1);
  }

  console.log(`✅  Added to admins table with full permissions\n`);

  // ── Step 4: Generate a password reset link (immediate use) ────────────────
  const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
    type: 'recovery',
    email: ADMIN_EMAIL,
    options: { redirectTo: `${SITE_URL}/auth/callback` },
  });

  if (!linkError && linkData?.properties?.action_link) {
    console.log('🔗  Password reset link (use this to set your first password):');
    console.log(`    ${linkData.properties.action_link}`);
    console.log('    ⚠️  This link expires in 24 hours.\n');
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅  Admin setup complete!');
  console.log(`    Email:       ${ADMIN_EMAIL}`);
  console.log(`    Role:        admin (full access)`);
  console.log(`    Login URL:   ${SITE_URL}/en/auth/login`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
