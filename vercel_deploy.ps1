# Vercel Deploy Script - reads local auth token and triggers deployment
$ErrorActionPreference = "Continue"

Write-Host "=== Vercel Deployment Script ===" -ForegroundColor Cyan
Write-Host ""

# Step 1: Find auth token
$authPaths = @(
    "$env:APPDATA\com.vercel.cli\auth.json",
    "$env:LOCALAPPDATA\com.vercel.cli\auth.json",
    "$env:USERPROFILE\.vercel\auth.json"
)

$token = $null
$authFile = $null

foreach ($path in $authPaths) {
    if (Test-Path $path) {
        Write-Host "Found auth file at: $path" -ForegroundColor Green
        $authFile = $path
        try {
            $authData = Get-Content $path | ConvertFrom-Json
            # Try different property names
            if ($authData.token) { $token = $authData.token }
            elseif ($authData.Token) { $token = $authData.Token }
            Write-Host "Auth file contents: $($authData | ConvertTo-Json -Compress)"
        } catch {
            Write-Host "Error reading auth file: $_" -ForegroundColor Red
            $raw = Get-Content $path -Raw
            Write-Host "Raw content: $raw"
        }
        break
    }
}

if (-not $authFile) {
    Write-Host "No auth file found. Checking vercel CLI config..." -ForegroundColor Yellow

    # Try running vercel whoami to see current state
    try {
        $whoami = & npx vercel whoami 2>&1
        Write-Host "Current vercel user: $whoami" -ForegroundColor Yellow
    } catch {
        Write-Host "Could not run vercel whoami: $_"
    }
}

# Step 2: Find project info from .vercel folder in repo
$repoPaths = @(
    "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab\.vercel\project.json",
    "C:\Users\USER\Desktop\script_clone\.vercel\project.json",
    "C:\Users\USER\Desktop\TC Collectibles\.vercel\project.json"
)

$projectId = $null
$orgId = $null

foreach ($path in $repoPaths) {
    if (Test-Path $path) {
        Write-Host "Found project.json at: $path" -ForegroundColor Green
        $proj = Get-Content $path | ConvertFrom-Json
        $projectId = $proj.projectId
        $orgId = $proj.orgId
        Write-Host "Project ID: $projectId"
        Write-Host "Org ID: $orgId"
        break
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Token found: $(if ($token) { 'YES - ' + $token.Substring(0, [Math]::Min(8, $token.Length)) + '...' } else { 'NO' })"
Write-Host "  Project ID: $(if ($projectId) { $projectId } else { 'NOT FOUND' })"
Write-Host "  Org ID: $(if ($orgId) { $orgId } else { 'NOT FOUND' })"
Write-Host ""

# Step 3: If we have a token and project ID, trigger deployment
if ($token -and $projectId) {
    Write-Host "Triggering deployment via Vercel API..." -ForegroundColor Cyan

    $headers = @{
        "Authorization" = "Bearer $token"
        "Content-Type" = "application/json"
    }

    # Get latest deployments to find what to redeploy
    try {
        $deploymentsUrl = "https://api.vercel.com/v6/deployments?projectId=$projectId&limit=3"
        $resp = Invoke-RestMethod -Uri $deploymentsUrl -Headers $headers -Method GET
        Write-Host "Latest deployments:" -ForegroundColor Green
        $resp.deployments | ForEach-Object {
            Write-Host "  UID: $($_.uid) | State: $($_.state) | URL: $($_.url)"
        }

        # Get the latest deployment UID to redeploy
        $latestDeployId = $resp.deployments[0].uid
        Write-Host ""
        Write-Host "Redeploying: $latestDeployId" -ForegroundColor Yellow

        $redeployBody = @{ target = "production" } | ConvertTo-Json
        $redeployUrl = "https://api.vercel.com/v13/deployments?forceNew=1"

        # Actually trigger a new deployment from git
        $gitBody = @{
            name = "tc-collectibles"
            gitSource = @{
                type = "github"
                repoId = "techcraftlabbkk/tc-collectibles"
                ref = "main"
            }
            target = "production"
        } | ConvertTo-Json -Depth 5

        Write-Host "Sending deployment request..." -ForegroundColor Cyan
        $deployResp = Invoke-RestMethod -Uri $redeployUrl -Headers $headers -Method POST -Body $gitBody
        Write-Host "Deployment response:" -ForegroundColor Green
        $deployResp | ConvertTo-Json -Depth 5

    } catch {
        Write-Host "API call failed: $_" -ForegroundColor Red
        Write-Host "Status: $($_.Exception.Response.StatusCode)"

        # Try to get error details
        $stream = $_.Exception.Response.GetResponseStream()
        if ($stream) {
            $reader = New-Object System.IO.StreamReader($stream)
            Write-Host "Error body: $($reader.ReadToEnd())"
        }
    }
} elseif ($token) {
    Write-Host "Have token but no project ID. Listing projects..." -ForegroundColor Yellow
    $headers = @{
        "Authorization" = "Bearer $token"
    }
    try {
        $projects = Invoke-RestMethod -Uri "https://api.vercel.com/v9/projects?limit=10" -Headers $headers -Method GET
        Write-Host "Projects:" -ForegroundColor Green
        $projects.projects | ForEach-Object {
            Write-Host "  Name: $($_.name) | ID: $($_.id) | Latest: $($_.latestDeployments[0].url)"
        }
    } catch {
        Write-Host "Failed to list projects: $_" -ForegroundColor Red
    }
} else {
    Write-Host "No token found. Please run 'vercel login' manually or provide a token." -ForegroundColor Red
    Write-Host ""
    Write-Host "ALTERNATIVE: Open https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles" -ForegroundColor Yellow
    Write-Host "and click 'Redeploy' on the latest deployment." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Script complete. Press any key to exit..."
Read-Host
