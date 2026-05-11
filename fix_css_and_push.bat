@echo off
setlocal

cd /d "%~dp0"

echo.
echo ========================================
echo FIXING CSS CONFLICT AND PUSHING
echo ========================================
echo.

REM Stage the CSS fix
echo Staging CSS fix...
git add app/globals.css

REM Commit the fix
echo Committing CSS fix...
git commit -m "fix: resolve CSS merge conflict in globals.css"

if errorlevel 1 (
    echo ERROR during git commit
    pause
    exit /b 1
)

REM Push to GitHub
echo.
echo Pushing to GitHub...
git push origin main --force

if errorlevel 1 (
    echo ERROR during git push
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! CSS fix pushed to GitHub
echo ========================================
echo.
echo Vercel will auto-deploy in 1-2 minutes
echo.

pause
