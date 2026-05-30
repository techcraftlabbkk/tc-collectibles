@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
echo Removing lock files...
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
del /f /q ".git\refs\heads\main.lock" 2>nul
echo Pushing to GitHub...
git push origin main
echo Done! Press any key to close.
pause
