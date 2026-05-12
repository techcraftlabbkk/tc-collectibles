@echo off
REM Initialize Git repo on Windows and push changes to GitHub

echo.
echo ========================================
echo TC Collectibles - Git Setup for Windows
echo ========================================
echo.

REM Initialize git if not already initialized
if not exist .git (
    echo [1/5] Initializing git repository...
    git init
    if errorlevel 1 (
        echo ERROR: Git is not installed or not in PATH
        echo Please install Git from: https://git-scm.com/download/win
        pause
        exit /b 1
    )
    echo Created .git directory
    echo.
)

REM Add GitHub remote if not already added
echo [2/5] Adding GitHub remote...
git remote add origin https://github.com/techcraftlabbkk/tc-collectibles.git 2>nul
if errorlevel 1 (
    echo Remote already exists, updating...
    git remote set-url origin https://github.com/techcraftlabbkk/tc-collectibles.git
)
echo GitHub remote configured
echo.

REM Configure git user
echo [3/5] Configuring git user...
git config user.email "patipat.arc@gmail.com" >nul
git config user.name "Claude Deployment" >nul
echo Git user configured
echo.

REM Add all files
echo [4/5] Staging all files...
git add -A
if errorlevel 1 (
    echo ERROR: Failed to stage files
    pause
    exit /b 1
)
echo Files staged successfully
echo.

REM Commit changes
echo [5/5] Committing changes...
git commit -m "fix: add missing i18n config and app structure - resolves 404 errors

- Created i18n/config.ts with locale configuration
- Created app/i18n.ts with next-intl setup
- Created messages/en.json and messages/th.json translations
- Created complete app/[locale] directory structure
- Added root layout, globals.css, and page redirects
- Fixes Next.js build by resolving import errors

This deployment restores the missing app files that were causing
HTTP 404 errors on all Vercel routes."
if errorlevel 1 (
    echo ERROR: Failed to commit - maybe no changes to commit
    pause
    exit /b 1
)
echo Changes committed successfully
echo.

REM Push to GitHub
echo ========================================
echo Pushing to GitHub...
echo ========================================
echo.

git push -u origin main
if errorlevel 1 (
    echo.
    echo ⚠️  PUSH FAILED - You may need to authenticate
    echo.
    echo If asked for credentials:
    echo - Username: techcraftlabbkk
    echo - Password: Use a GitHub Personal Access Token (not your password)
    echo.
    echo To create a token:
    echo 1. Go to https://github.com/settings/tokens
    echo 2. Click "Generate new token"
    echo 3. Select 'repo' scope
    echo 4. Copy the token and use it as your password
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo ✅ SUCCESS - Changes pushed to GitHub!
echo ========================================
echo.
echo Vercel will auto-deploy in 1-2 minutes.
echo.
echo Check deployment at:
echo https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/deployments
echo.
echo Test the app at:
echo https://tc-collectibles.vercel.app/en
echo.
pause
