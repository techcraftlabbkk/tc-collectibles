@echo off
echo === TC Collectibles - Vercel Deploy ===
echo.
echo STEP 1: Go to Chrome and open this URL:
echo   https://vercel.com/account/tokens
echo.
echo STEP 2: Click Create, name it anything, copy the token.
echo.
echo STEP 3: Paste it below and press Enter.
echo.
set /p VERCEL_TOKEN=Paste your Vercel token here: 
echo.
echo Deploying tc-collectibles to production...
cd /d "C:\Users\USER\Desktop\script_clone" 2>nul
if errorlevel 1 (
  cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
)
npx vercel --prod --yes --token %VERCEL_TOKEN%
echo.
echo === Deployment complete! ===
pause
