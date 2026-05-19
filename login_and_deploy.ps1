# Vercel Login + Deploy Script
$ErrorActionPreference = "Continue"

Write-Host "=== Vercel Login & Deploy ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "Step 1: Opening Vercel dashboard in browser..." -ForegroundColor Yellow
Start-Process "https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles"
Write-Host "  -> Browser opened. You can also click Redeploy there." -ForegroundColor Green
Write-Host ""

Write-Host "Step 2: Logging into Vercel CLI as techcraftlabbkk..." -ForegroundColor Yellow
Write-Host "  -> A browser tab will open for authentication." -ForegroundColor Gray
Write-Host "  -> Log in with the techcraftlabbkk account and click confirm." -ForegroundColor Gray
Write-Host ""

# Change to the repo directory
$repoPath = "C:\Users\USER\Desktop\script_clone"
if (Test-Path $repoPath) {
    Set-Location $repoPath
    Write-Host "  Working in: $repoPath" -ForegroundColor Gray
} else {
    $repoPath = "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
    Set-Location $repoPath
    Write-Host "  Working in: $repoPath" -ForegroundColor Gray
}

# Login
$loginOutput = & npx vercel login 2>&1
Write-Host $loginOutput

Write-Host ""
Write-Host "Step 3: Deploying to production..." -ForegroundColor Yellow
$deployOutput = & npx vercel --prod --yes 2>&1
Write-Host $deployOutput

Write-Host ""
Write-Host "=== Done ===" -ForegroundColor Cyan
Write-Host ""
Read-Host "Press Enter to close"
