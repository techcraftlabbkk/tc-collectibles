@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"

echo Pulling remote changes (rebase)...
git pull --rebase origin main

echo Pushing to origin...
git push origin main

echo Done!
pause
