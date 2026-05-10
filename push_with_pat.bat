@echo off
REM Push to GitHub using PAT directly in URL

echo.
echo ========================================
echo PUSHING TO GITHUB WITH PERSONAL ACCESS TOKEN
echo ========================================
echo.

cd /d "%~dp0"

REM Token - replace with your actual token
set TOKEN=ghp_1CDm8h9EIM9wf6w0GDgGi25uL0xB44SriCrn

REM Push using token in URL
echo Attempting push with token...
git push https://%TOKEN%@github.com/techcraftlabbkk/tc-collectibles.git main -u

if errorlevel 1 (
    echo.
    echo ERROR: Push failed
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
