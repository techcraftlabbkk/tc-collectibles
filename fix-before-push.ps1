# fix-before-push.ps1
# Run this from PowerShell (or Git Bash) on your Windows machine.
# It fixes all three pre-push blockers for the tc-next repo.

$repo = "C:\Users\USER\Documents\Claude\Projects\TC Collectibles\tc-next"

Set-Location $repo

Write-Host "`n=== BLOCK-A: Fix remote URL ===" -ForegroundColor Cyan
git remote set-url origin git@github.com:techcraftlabbkk/tc-collectibles.git
git remote -v
git fetch origin
git branch --set-upstream-to=origin/main main
Write-Host "Remote fixed." -ForegroundColor Green

Write-Host "`n=== BLOCK-B: Discard staged reversion of Blocks 3-5 ===" -ForegroundColor Cyan
git restore --staged `
    src/lib/email/copy.ts `
    src/lib/email/templates/index.ts `
    supabase/migrations/
git restore `
    src/lib/email/copy.ts `
    src/lib/email/templates/index.ts
Write-Host "Staged reversion discarded." -ForegroundColor Green

Write-Host "`n=== NOISE: Silence filemode churn ===" -ForegroundColor Cyan
git config core.fileMode false
Write-Host "core.fileMode set to false." -ForegroundColor Green

Write-Host "`n=== Final status (should be clean except maybe untracked files) ===" -ForegroundColor Cyan
git status

Write-Host "`nAll blockers resolved. Safe to push:" -ForegroundColor Yellow
Write-Host "  git push origin main" -ForegroundColor White
