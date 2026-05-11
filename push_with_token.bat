@echo off
REM Push to GitHub after clearing cached credentials
REM The user should have a Personal Access Token ready

echo.
echo ========================================
echo PUSHING TO GITHUB
echo ========================================
echo.
echo When prompted, enter:
echo   Username: techcraftlabbkk
echo   Password: (paste your Personal Access Token)
echo.
echo Don't have a token? Go to:
echo   https://github.com/settings/tokens
echo ========================================
echo.

cd /d "%~dp0"
git push -u origin main

if errorlevel 1 (
    echo.
    echo ERROR: Push failed
    echo.
    echo Possible issues:
    echo 1. Personal Access Token not provided or incorrect
    echo 2. Token doesn't have 'repo' scope
    echo 3. Token has expired
    echo.
    echo Try these troubleshooting steps:
    echo - Generate a new token with 'repo' scope
    echo - Clear credentials again with: clear_git_credentials.bat
    echo - Try pushing again
    echo.
) else (
    echo.
    echo ========================================
    echo SUCCESS! Changes pushed to GitHub
    echo ========================================
    echo.
    echo Vercel will auto-deploy in 1-2 minutes
    echo Check status at:
    echo   https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/deployments
    echo.
    echo Test the app at:
    echo   https://tc-collectibles.vercel.app/en
    echo.
)

pause
