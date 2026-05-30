@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"

echo Killing any background git processes...
taskkill /f /im git.exe 2>nul
timeout /t 1 /nobreak >nul

echo Removing lock files...
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
del /f /q ".git\refs\heads\main.lock" 2>nul

echo Committing multi-image support...
git add -A
git commit -m "feat: multi-image support per product"

echo Pushing to GitHub...
git push origin main

echo.
echo Done!
pause
