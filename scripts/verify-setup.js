#!/usr/bin/env node

/**
 * TC Collectibles - Automated Setup Verification
 * Verifies all configurations are correct before testing
 * Usage: node scripts/verify-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 TC COLLECTIBLES - SETUP VERIFICATION\n');

const results = {
    passed: [],
    failed: [],
    warnings: []
};

// Check 1: .env.local exists
console.log('Checking .env.local...');
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    results.passed.push('✅ .env.local exists');

    // Check required variables
    const requiredVars = [
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY',
        'SMTP_USER',
        'SMTP_PASS',
        'SMTP_FROM',
        'PROMPTPAY_PHONE',
        'NEXT_PUBLIC_PROMPTPAY_ACCOUNT_NAME'
    ];

    const missing = requiredVars.filter(v => !envContent.includes(v + '='));

    if (missing.length === 0) {
        results.passed.push('✅ All required environment variables present');

        // Validate format
        if (envContent.includes('SMTP_USER=techcraftlab.bkk@gmail.com')) {
            results.passed.push('✅ SMTP_USER correctly set');
        } else {
            results.warnings.push('⚠️ SMTP_USER may not be correct');
        }

        if (envContent.includes('PROMPTPAY_PHONE=0809429441')) {
            results.passed.push('✅ PROMPTPAY_PHONE correctly set');
        }
    } else {
        results.failed.push(`❌ Missing variables: ${missing.join(', ')}`);
    }
} else {
    results.failed.push('❌ .env.local not found');
}

// Check 2: package.json exists
console.log('Checking package.json...');
const packagePath = path.join(__dirname, '../package.json');
if (fs.existsSync(packagePath)) {
    try {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        if (pkg.dependencies && pkg.scripts) {
            results.passed.push('✅ package.json is valid');
        }
    } catch (e) {
        results.failed.push('❌ package.json is invalid');
    }
} else {
    results.failed.push('❌ package.json not found');
}

// Check 3: Key files exist
console.log('Checking key files...');
const keyFiles = [
    '../app/[locale]/checkout/page.tsx',
    '../app/[locale]/admin/page.tsx',
    '../app/[locale]/products/page.tsx',
    '../lib/emailService.ts',
    '../app/api/products/upload-image/route.ts',
];

keyFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        const fileName = file.split('/').pop();
        results.passed.push(`✅ ${fileName} exists`);
    } else {
        results.failed.push(`❌ ${file} not found`);
    }
});

// Check 4: Database schema exists
console.log('Checking database files...');
const dbFiles = [
    '../database/001_create_tables.sql',
    '../database/002_create_rls_policies.sql',
];

dbFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        results.passed.push(`✅ ${path.basename(file)} exists`);
    } else {
        results.warnings.push(`⚠️ ${file} not found`);
    }
});

// Print Results
console.log('\n' + '='.repeat(50));
console.log('VERIFICATION RESULTS');
console.log('='.repeat(50) + '\n');

if (results.passed.length > 0) {
    console.log('✅ PASSED:');
    results.passed.forEach(r => console.log('  ' + r));
}

if (results.warnings.length > 0) {
    console.log('\n⚠️  WARNINGS:');
    results.warnings.forEach(w => console.log('  ' + w));
}

if (results.failed.length > 0) {
    console.log('\n❌ FAILED:');
    results.failed.forEach(f => console.log('  ' + f));
}

// Summary
console.log('\n' + '='.repeat(50));
const totalChecks = results.passed.length + results.failed.length;
const passRate = Math.round((results.passed.length / totalChecks) * 100);

if (results.failed.length === 0) {
    console.log(`✅ ALL CHECKS PASSED (${results.passed.length}/${totalChecks})`);
    console.log('Ready to proceed with testing!\n');
    process.exit(0);
} else {
    console.log(`❌ ${results.failed.length} CHECK(S) FAILED (${passRate}% pass rate)`);
    console.log('Fix failures above before proceeding.\n');
    process.exit(1);
}
