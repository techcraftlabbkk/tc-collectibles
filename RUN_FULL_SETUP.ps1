# ============================================================
# TC Collectibles — 3D Studio Full Auto Setup
# Double-click or right-click > "Run with PowerShell"
# ============================================================

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $projectPath

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  TC Collectibles 3D Studio Setup" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# ── STEP 1: npm install ────────────────────────────────────
Write-Host "STEP 1: Installing Stripe packages..." -ForegroundColor Yellow
npm install stripe @stripe/stripe-js
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: npm install failed." -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}
Write-Host "  stripe + @stripe/stripe-js installed!" -ForegroundColor Green
Write-Host ""

# ── STEP 2: Open Supabase SQL editor ──────────────────────
Write-Host "STEP 2: Opening Supabase SQL editor in Chrome..." -ForegroundColor Yellow
$sqlUrl = "https://supabase.com/dashboard/project/qaitwuscmzwmtlodruwc/sql/new"
Start-Process $sqlUrl
Write-Host "  Browser opened!" -ForegroundColor Green
Write-Host ""

# ── STEP 3: Copy migration SQL to clipboard ────────────────
Write-Host "STEP 3: Copying migration SQL to clipboard..." -ForegroundColor Yellow
$sqlFile = Join-Path $projectPath "supabase\migrations\20260529_3d_printing_system.sql"
if (Test-Path $sqlFile) {
    Get-Content $sqlFile -Raw | Set-Clipboard
    Write-Host "  Migration SQL is now in your clipboard!" -ForegroundColor Green
} else {
    Write-Host "  SQL file not found at: $sqlFile" -ForegroundColor Red
}
Write-Host ""

# ── STEP 4: Open Stripe dashboard ─────────────────────────
Write-Host "STEP 4: Opening Stripe dashboard for API keys..." -ForegroundColor Yellow
Start-Process "https://dashboard.stripe.com/apikeys"
Write-Host "  Stripe dashboard opened!" -ForegroundColor Green
Write-Host ""

# ── STEP 5: Open Meshy AI ──────────────────────────────────
Write-Host "STEP 5: Opening Meshy AI for API key..." -ForegroundColor Yellow
Start-Process "https://app.meshy.ai/api-key"
Write-Host "  Meshy AI opened!" -ForegroundColor Green
Write-Host ""

# ── STEP 6: Open .env.local for editing ───────────────────
Write-Host "STEP 6: Opening .env.local to paste your keys..." -ForegroundColor Yellow
$envFile = Join-Path $projectPath ".env.local"
Start-Process notepad $envFile
Write-Host "  .env.local opened in Notepad!" -ForegroundColor Green
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  WHAT TO DO NEXT:" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  1. SUPABASE SQL EDITOR is open in your browser." -ForegroundColor White
Write-Host "     Ctrl+A to select all, then Ctrl+V to paste" -ForegroundColor White
Write-Host "     the migration SQL, then click 'Run'." -ForegroundColor White
Write-Host ""
Write-Host "  2. STRIPE DASHBOARD is open." -ForegroundColor White
Write-Host "     Copy your Secret Key (sk_live_...) and" -ForegroundColor White
Write-Host "     paste it into .env.local as STRIPE_SECRET_KEY." -ForegroundColor White
Write-Host ""
Write-Host "  3. MESHY AI is open." -ForegroundColor White
Write-Host "     Copy your API key and paste into .env.local" -ForegroundColor White
Write-Host "     as MESHY_API_KEY." -ForegroundColor White
Write-Host ""
Write-Host "  4. For STRIPE_WEBHOOK_SECRET, go to:" -ForegroundColor White
Write-Host "     https://dashboard.stripe.com/webhooks" -ForegroundColor White
Write-Host "     Add endpoint: https://tc-collectibles.vercel.app/api/webhooks/stripe" -ForegroundColor White
Write-Host "     Event: checkout.session.completed" -ForegroundColor White
Write-Host ""
Write-Host "  npm packages installed, browsers opened." -ForegroundColor Green
Write-Host "  Just paste the 3 keys and run the SQL!" -ForegroundColor Green
Write-Host ""
Read-Host "Press Enter to close"
