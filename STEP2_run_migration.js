/**
 * Runs the 3D printing system migration against Supabase
 * using the service role key + pg (postgres) direct connection.
 *
 * Usage:  node STEP2_run_migration.js
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ── Config ──────────────────────────────────────────────────────────────────
const SUPABASE_URL = 'https://qaitwuscmzwmtlodruwc.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaXR3dXNjbXp3bXRsb2RydXdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY3NDYyOSwiZXhwIjoyMDkzMjUwNjI5fQ.X_UU3dgFqfHc_DHsPiXRQmMERB1ocpowMLVKsXON09M';
const PROJECT_REF = 'qaitwuscmzwmtlodruwc';

// ── SQL statements split into individual executable chunks ───────────────────
// We call Supabase Management API: POST /v1/projects/{ref}/database/query
// This requires a PERSONAL ACCESS TOKEN (PAT) from app.supabase.com/account/tokens
// ---
// If you don't have one, the script will print the SQL to paste manually.

const MIGRATION_SQL = fs.readFileSync(
  path.join(__dirname, 'supabase', 'migrations', '20260529_3d_printing_system.sql'),
  'utf8'
);

function postSQL(pat, sql) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ query: sql });
    const options = {
      hostname: 'api.supabase.com',
      path: `/v1/projects/${PROJECT_REF}/database/query`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${pat}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', d => data += d);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(data));
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const pat = process.argv[2];

  if (!pat) {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  OPTION A: Auto-run (recommended)                            ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  1. Go to: https://app.supabase.com/account/tokens           ║');
    console.log('║  2. Create a new Personal Access Token                       ║');
    console.log('║  3. Run:  node STEP2_run_migration.js YOUR_PAT_HERE          ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  OPTION B: Manual (paste SQL yourself)                       ║');
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║  1. Open: https://supabase.com/dashboard/project/            ║');
    console.log('║           qaitwuscmzwmtlodruwc/sql/new                       ║');
    console.log('║  2. Paste the SQL from:                                      ║');
    console.log('║     supabase/migrations/20260529_3d_printing_system.sql      ║');
    console.log('║  3. Click Run                                                ║');
    console.log('╚══════════════════════════════════════════════════════════════╝\n');

    // Open Supabase SQL editor in default browser as fallback
    const { exec } = require('child_process');
    const url = 'https://supabase.com/dashboard/project/qaitwuscmzwmtlodruwc/sql/new';
    console.log('Opening Supabase SQL editor in your browser...\n');
    exec(`start "" "${url}"`);

    // Copy SQL to clipboard
    exec(`echo off | clip`, () => {});
    const { execSync } = require('child_process');
    try {
      // Write SQL to a temp file and open it
      const tmpPath = path.join(__dirname, '_migration_to_paste.sql');
      fs.writeFileSync(tmpPath, MIGRATION_SQL);
      console.log('Migration SQL saved to: _migration_to_paste.sql');
      console.log('Open it, copy all, paste into the Supabase SQL editor, click Run.\n');
      exec(`notepad "${tmpPath}"`);
    } catch(e) {}
    return;
  }

  console.log('\n🚀 Running migration against Supabase...');
  try {
    await postSQL(pat, MIGRATION_SQL);
    console.log('✅ Migration complete! All tables created successfully.');
    console.log('\nYour 3D printing system database is ready.');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    console.log('\nTry running it manually in the Supabase SQL editor:');
    console.log('https://supabase.com/dashboard/project/qaitwuscmzwmtlodruwc/sql/new');
  }
}

main();
