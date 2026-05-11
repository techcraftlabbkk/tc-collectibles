@echo off
setlocal

cd /d "%~dp0"

echo.
echo ========================================
echo COMMITTING AND PUSHING RESOLVED CONFLICTS
echo ========================================
echo.

REM Ensure we're in the project directory
echo Current directory: %CD%
echo.

REM Stage all changes
echo Staging all files...
git add .
if errorlevel 1 (
    echo ERROR during git add
    pause
    exit /b 1
)

REM Commit changes
echo.
echo Committing changes...
git commit -m "fix: resolve all merge conflicts - keep HEAD versions"
if errorlevel 1 (
    echo ERROR during git commit
    echo (This may be OK if there are no changes to commit)
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
echo SUCCESS! Changes committed and pushed
echo ========================================
echo.

pause
