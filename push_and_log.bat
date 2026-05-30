@echo off
cd /d "%~dp0"
git push origin main > push_result.txt 2>&1
echo Exit code: %ERRORLEVEL% >> push_result.txt
type push_result.txt
pause
