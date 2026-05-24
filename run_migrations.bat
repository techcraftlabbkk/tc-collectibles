@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"
echo Removing git lock files...
del /f /q ".git\index.lock" 2>nul
del /f /q ".git\HEAD.lock" 2>nul
del /f /q ".git\refs\heads\main.lock" 2>nul
echo.
echo Running API migrations (bucket public + order status backfill)...
node run_migrations.js
