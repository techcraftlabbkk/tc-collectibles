@echo off
cd /d "%~dp0"
del /f ".git\index.lock" 2>nul
git add "app/[locale]/3d-studio/page.tsx"
git commit -m "feat: Black+Cyan theme, title '3D Printing x TechCraft Lab', tooltips"
git push
echo Done! Deploying in ~1 min.
pause
