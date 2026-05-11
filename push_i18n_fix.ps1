# Push the i18n.ts merge conflict fix
$projectPath = "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
Set-Location $projectPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "PUSHING i18n.ts MERGE CONFLICT FIX"
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check git status
Write-Host "Current git status:"
& git status --short

Write-Host ""
Write-Host "Staging app/i18n.ts..."
& git add app/i18n.ts

Write-Host "Committing fix..."
& git commit -m "fix: resolve merge conflict in app/i18n.ts"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR during commit" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Pushing to GitHub..."
& git push origin main --force

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "SUCCESS! i18n.ts fix pushed to GitHub"
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "Vercel will auto-deploy in 1-2 minutes"
} else {
    Write-Host "ERROR during push" -ForegroundColor Red
}

Write-Host ""
Read-Host "Press Enter to exit"
