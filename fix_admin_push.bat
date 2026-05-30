@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
echo === Removing lock files ===
if exist .git\HEAD.lock del /f .git\HEAD.lock
if exist .git\index.lock del /f .git\index.lock
echo === Stashing unstaged changes ===
git stash
echo === Pulling remote changes (rebase) ===
git pull --rebase origin main
echo === Popping stash ===
git stash pop
echo === Pushing ===
git push origin main
echo === Done ===
pause
