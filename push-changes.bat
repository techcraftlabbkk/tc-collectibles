@echo off
cd /d "C:\Users\USER\Desktop\Claude Project\TC Collectibles x TechCraft Lab"

echo Configuring git user...
git config user.email "patipat.arc@gmail.com"
git config user.name "TechCraft Lab"

echo Adding changes...
git add -A

echo Committing changes...
git commit -m "fix: add auth i18n translations, improve toast provider, migrate auth pages to locale routing"

echo Pushing to GitHub...
git push origin main

echo Done!
pause
