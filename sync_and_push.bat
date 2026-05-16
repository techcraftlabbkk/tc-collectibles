@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"

echo === Removing stale lock files ===
if exist .git\index.lock del /f .git\index.lock
if exist .git\MERGE_HEAD del /f .git\MERGE_HEAD

echo === Git status ===
git status

echo === Staging all changes ===
git add -A

echo === Committing ===
git commit -m "feat: add admin console to nav + full admin dashboard at locale route"

echo === Pull rebase from remote ===
git pull --rebase origin main

echo === Pushing to GitHub ===
git push origin main

echo === Done ===
pause
