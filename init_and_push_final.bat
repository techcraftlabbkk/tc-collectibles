@echo off
REM Initialize Git and Push to GitHub with PAT (No password prompt)

echo.
echo ========================================
echo INITIALIZING GIT AND PUSHING TO GITHUB
echo ========================================
echo.

cd /d "%~dp0"

REM Token
set TOKEN=ghp_1CDm8h9EIM9wf6w0GDgGi25uL0xB44SriCrn

REM Initialize fresh git repository
echo Initializing git repository...
git init --initial-branch=main
if errorlevel 1 (
    echo ERROR: Git init failed
    pause
    exit /b 1
)

REM Disable credential manager to use token from URL
echo Configuring git to use embedded credentials...
git config credential.helper ""

REM Configure git user
echo Configuring git user...
git config user.email "patipat.arc@gmail.com"
git config user.name "TechCraft Lab"

REM Add all files
echo Adding files to git...
git add .
if errorlevel 1 (
    echo ERROR: Git add failed
    pause
    exit /b 1
)

REM Commit
echo Committing files...
git commit -m "fix: reinitialize git and deploy i18n configuration with dynamic routing"
if errorlevel 1 (
    echo ERROR: Git commit failed
    pause
    exit /b 1
)

REM Add remote
echo Adding remote...
git remote add origin https://%TOKEN%@github.com/techcraftlabbkk/tc-collectibles.git
if errorlevel 1 (
    echo Remote may already exist, trying to update...
    git remote set-url origin https://%TOKEN%@github.com/techcraftlabbkk/tc-collectibles.git
)

REM Push
echo Pushing to GitHub...
git -c core.askPass=true push -u origin main --force
if errorlevel 1 (
    echo.
    echo ERROR: Push failed - trying with credential.helper disabled
    echo.
    git config --global credential.helper ""
    git push -u origin main --force
    if errorlevel 1 (
        echo Push failed even after disabling credential helper
        pause
        exit /b 1
    )
)

echo.
echo ========================================
echo SUCCESS! Changes pushed to GitHub
echo ========================================
echo.
echo Vercel will auto-deploy in 1-2 minutes
echo Check status at:
echo   https://vercel.com/techcraftlabbkk-7072s-projects/tc-collectibles/deployments
echo.
echo Test the app at:
echo   https://tc-collectibles.vercel.app/en
echo.

pause
