@echo off
setlocal

cd /d "%~dp0"

echo.
echo ========================================
echo PUSHING RESOLVED MERGE CONFLICTS TO GITHUB
echo ========================================
echo.

REM Disable global credential helper and use embedded PAT
set GIT_ASKPASS=
set GIT_TERMINAL_PROMPT=0

echo Pushing to GitHub with embedded PAT...
git -c credential.helper="" push origin main --force

if errorlevel 1 (
    echo ERROR: Push failed
    echo Trying alternative method...
    REM Try with GIT_TRACE for debugging
    git -c credential.helper="" -c core.askPass=false push -u origin main --force
    if errorlevel 1 (
        echo ERROR: Push still failed
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Vercel will auto-deploy in 1-2 minutes
echo.

pause
