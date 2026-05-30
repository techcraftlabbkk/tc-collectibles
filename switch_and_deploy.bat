@echo off
cd /d "%~dp0"
echo ============================================
echo  TC Collectibles - Vercel Deploy
echo ============================================
echo.
echo Step 1: Logging out of current account...
npx vercel logout
echo.
echo Step 2: Logging in as techcraftlab.bkk@gmail.com
echo  ^> Check your email and click the Vercel link!
echo.
npx vercel login techcraftlab.bkk@gmail.com
echo.
echo Step 3: Deploying to production...
npx vercel --prod --yes
echo.
echo ============================================
echo  Done! Type EXIT to close this window.
echo ============================================
cmd /k
