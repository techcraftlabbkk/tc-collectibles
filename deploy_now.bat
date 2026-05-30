@echo off
echo === Vercel Login and Deploy ===
echo.
echo Changing to git repo directory...
cd /d "C:\Users\USER\Desktop\script_clone"
if errorlevel 1 (
  echo Trying workspace folder...
  cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
)
echo.
echo Step 1: Logging into Vercel (browser will open)...
echo Log in with the techcraftlabbkk account.
echo.
npx vercel login
echo.
echo Step 2: Deploying to production...
npx vercel --prod --yes
echo.
echo === Done! ===
pause
