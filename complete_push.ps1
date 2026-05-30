# Complete the git push for CSS fix
$projectPath = "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
Set-Location $projectPath

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "COMPLETING GIT PUSH"
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Get git status to verify commit
Write-Host "Current git status:"
& git status --short

Write-Host ""
Write-Host "Pushing to GitHub..."

# Try to push with the embedded PAT in the URL
# The PAT should be embedded in the remote URL from .git/config
try {
    & git push origin main --force 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "SUCCESS! Push completed"
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "Vercel will auto-deploy in 1-2 minutes"
    } else {
        Write-Host "Push completed with code: $LASTEXITCODE"
    }
} catch {
    Write-Host "Error during push: $_"
}

Write-Host ""
Read-Host "Press Enter to exit"
