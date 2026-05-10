# Resolve all merge conflicts by keeping HEAD versions

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectPath

Write-Host ""
Write-Host "========================================"
Write-Host "RESOLVING ALL MERGE CONFLICTS"
Write-Host "========================================"
Write-Host ""

# Find all files with conflict markers
$conflictFiles = @()

Get-ChildItem -Path $projectPath -Recurse -Include *.ts, *.tsx, *.js, *.jsx | ForEach-Object {
    $content = Get-Content $_.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -match '<<<<<<< HEAD') {
        $conflictFiles += $_
        Write-Host "Found conflict in: $($_.FullName)"
    }
}

Write-Host ""
Write-Host "Processing $($conflictFiles.Count) files with conflicts..."
Write-Host ""

# Resolve each file by keeping only HEAD section
foreach ($file in $conflictFiles) {
    $content = Get-Content $file.FullName -Raw

    # Remove conflict markers and keep only HEAD section
    # Pattern: <<<<<<< HEAD ... ======= ... >>>>>>> branch
    $resolved = $content -replace '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>> [^\r\n]*', '$1'

    Set-Content -Path $file.FullName -Value $resolved -Encoding UTF8
    Write-Host "Resolved: $($file.FullName)"
}

Write-Host ""
Write-Host "Staging all files..."
& git add .

Write-Host "Committing changes..."
& git commit -m "fix: resolve all merge conflicts - keep HEAD versions"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Git commit failed"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "Pushing to GitHub..."
& git push origin main --force

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Push failed"
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host ""
Write-Host "========================================"
Write-Host "SUCCESS! All conflicts resolved and pushed"
Write-Host "========================================"
Write-Host ""
Write-Host "Vercel will auto-deploy in 1-2 minutes"
Write-Host ""

Read-Host "Press Enter to exit"
