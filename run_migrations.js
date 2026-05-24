// TC Collectibles - Supabase Migration Runner
// Run with: node run_migrations.js
const https = require('https');

const PROJECT_URL = 'qaitwuscmzwmtlodruwc.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhaXR3dXNjbXp3bXRsb2RydXdjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NzY3NDYyOSwiZXhwIjoyMDkzMjUwNjI5fQ.X_UU3dgFqfHc_DHsPiXRQmMERB1ocpowMLVKsXON09M';

function apiRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;
    const options = {
      hostname: PROJECT_URL,
      path,
      method,
      headers: {
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'apikey': SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
        ...(data ? { 'Content-Length': Buffer.byteLength(data) } : {})
      }
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body }));
    });
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function run() {
  console.log('=== TC Collectibles Migration Runner ===\n');

  // Step 1: Make products storage bucket public
  console.log('[1/2] Making products storage bucket public...');
  try {
    const r = await apiRequest('PATCH', '/storage/v1/bucket/products', { public: true, allowedMimeTypes: null, fileSizeLimit: null });
    console.log(`  Status: ${r.status} - ${r.status === 200 ? '✓ Success' : r.body}`);
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }

  // Step 2: Back-fill legacy order statuses
  console.log('[2/2] Back-filling payment_received → paid...');
  try {
    const r = await apiRequest('PATCH', '/rest/v1/orders?status=eq.payment_received', { status: 'paid' });
    console.log(`  Status: ${r.status} - ${r.status === 200 || r.status === 204 ? '✓ Success (or no rows to update)' : r.body}`);
  } catch (e) {
    console.log(`  Error: ${e.message}`);
  }

  console.log('\n=== Automated steps done! ===');
  console.log('\nStill needed - run in Supabase SQL Editor:');
  console.log('https://supabase.com/dashboard/project/qaitwuscmzwmtlodruwc/sql/new\n');
  console.log('SQL to paste:');
  console.log('--------------------------------------------------');
  console.log(`ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE orders ADD CONSTRAINT orders_status_check
  CHECK (status IN ('pending_payment','paid','processing','shipped','delivered','cancelled'));`);
  console.log('--------------------------------------------------\n');
}

run().catch(console.error);
