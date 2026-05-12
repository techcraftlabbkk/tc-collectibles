@echo off
cd /d "%~dp0"
python3 push_to_github.py
if errorlevel 1 (
    echo.
    echo ERROR: Script failed
    pause
    exit /b 1
)
pause
