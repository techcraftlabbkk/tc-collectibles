@echo off
REM Clear cached Git credentials from Windows Credential Manager
echo Clearing cached Git credentials...
git credential-manager delete https://github.com
echo.
echo Credentials cleared!
echo.
echo Next time you push, you'll be prompted to login.
echo Use your GitHub username: techcraftlabbkk
echo And your Personal Access Token as the password
echo.
pause
