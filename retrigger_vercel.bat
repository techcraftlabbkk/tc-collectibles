@echo off
cd /d "%~dp0"
echo Removing lock files...
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
echo Creating empty commit...
git -c user.email=techcraftlab.bkk@gmail.com -c user.name="TechCraft Lab" commit --allow-empty -m "chore: trigger vercel redeploy" > retrigger_result.txt 2>&1
echo Pushing...
git push origin main >> retrigger_result.txt 2>&1
echo Done. Result:
type retrigger_result.txt
pause
