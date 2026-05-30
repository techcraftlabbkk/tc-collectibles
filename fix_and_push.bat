@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"

echo Deleting stale lock files...
if exist ".git\index.lock" del /f ".git\index.lock"
if exist ".git\HEAD.lock" del /f ".git\HEAD.lock"

echo Undoing bad commit (1653c33)...
git reset HEAD~1

echo Staging only the admin redirect fix...
git add "app/[locale]/admin/page.tsx"

echo Committing...
git commit -m "fix: redirect /[locale]/admin to working /admin dashboard"

echo Pushing to origin...
git push origin main

echo Done!
pause
