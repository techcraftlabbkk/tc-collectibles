@echo off
echo ============================================
echo  Installing Stripe packages...
echo ============================================
cd /d "%~dp0"
call npm install stripe @stripe/stripe-js
if %errorlevel% neq 0 (
  echo.
  echo ERROR: npm install failed. Make sure Node.js is installed.
  pause
  exit /b 1
)
echo.
echo SUCCESS: stripe and @stripe/stripe-js installed!
echo.
echo Next step: Run STEP2_run_migration.bat
pause
