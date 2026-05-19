@echo off
cd /d "%~dp0"
echo === Checking Vercel auth === > vercel_deploy_log.txt 2>&1
npx vercel whoami >> vercel_deploy_log.txt 2>&1
echo. >> vercel_deploy_log.txt
echo === Deploying to production === >> vercel_deploy_log.txt
npx vercel --prod --yes >> vercel_deploy_log.txt 2>&1
echo Exit code: %ERRORLEVEL% >> vercel_deploy_log.txt
echo. >> vercel_deploy_log.txt
echo === Result === >> vercel_deploy_log.txt
type vercel_deploy_log.txt
pause
