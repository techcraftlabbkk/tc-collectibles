@echo off
echo =============================================
echo  Copying fixes to active repo and pushing
echo =============================================

set SRC=C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab
set DST=C:\Users\USER\Documents\tc-collectibles

echo Source: %SRC%
echo Dest:   %DST%
echo.

REM Check if destination exists
if not exist "%DST%" (
  echo ERROR: Destination repo not found at %DST%
  echo Trying git push from source repo instead...
  cd /d "%SRC%"
  if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
  if exist ".git\index.lock" del /f ".git\index.lock"
  git push
  goto end
)

echo Copying fixed files...
copy /Y "%SRC%\app\i18n.ts" "%DST%\app\i18n.ts"
copy /Y "%SRC%\app\[locale]\layout.tsx" "%DST%\app\[locale]\layout.tsx"
copy /Y "%SRC%\components\Header.tsx" "%DST%\components\Header.tsx"

echo.
echo Committing in destination repo...
cd /d "%DST%"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"
if exist ".git\index.lock" del /f ".git\index.lock"
git add "app/i18n.ts" "app/[locale]/layout.tsx" "components/Header.tsx"
git commit -m "fix: update next-intl to v3.22+ API and restore truncated Header"
echo.
echo Pushing to GitHub...
git push

:end
echo.
echo =============================================
if %ERRORLEVEL% EQU 0 (
  echo  SUCCESS - Vercel will now redeploy!
) else (
  echo  Check output above for errors
)
echo =============================================
pause
