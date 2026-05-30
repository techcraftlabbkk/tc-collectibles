@echo off
echo ========================================
echo  TC Collectibles - Git Commit and Push
echo ========================================
cd /d "%~dp0"

echo Removing git lock files if present...
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\index.lock" del /f ".git\index.lock"

echo.
echo Staging fixed files...
git add "app/i18n.ts" "app/[locale]/layout.tsx" "components/Header.tsx"

echo.
echo Committing...
git commit -m "fix: update next-intl to v3.22+ API and restore truncated Header"

echo.
echo Pushing to GitHub...
git push

echo.
echo ========================================
if %ERRORLEVEL% EQU 0 (
  echo  SUCCESS - Vercel will now redeploy!
) else (
  echo  Something went wrong - check above
)
echo ========================================
pause
