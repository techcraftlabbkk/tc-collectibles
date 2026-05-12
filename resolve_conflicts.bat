@echo off
REM Resolve merge conflicts by keeping HEAD versions only

setlocal enabledelayedexpansion

cd /d "%~dp0"

echo.
echo ========================================
echo RESOLVING ALL MERGE CONFLICTS
echo ========================================
echo.

REM Create a temporary directory for processing
if not exist ".\temp_conflict_fix" mkdir ".\temp_conflict_fix"

REM Find all files with conflict markers and process them
echo Searching for files with merge conflict markers...

for /r . %%F in (*.ts *.tsx *.js *.jsx) do (
    setlocal enabledelayedexpansion
    set "file=%%F"

    REM Check if file contains conflict markers
    findstr /m "^<<<<<<< HEAD" "!file!" >nul 2>&1
    if !errorlevel! equ 0 (
        echo Processing: !file!

        REM Use PowerShell to resolve conflicts by keeping HEAD sections
        powershell -NoProfile -ExecutionPolicy Bypass -Command "
            $content = Get-Content -Path '!file!' -Raw

            if ($content -match '<<<<<<< HEAD') {
                # Remove all conflict markers and keep only HEAD sections
                $resolved = [regex]::Replace($content, '(?s)<<<<<<< HEAD\r?\n(.*?)\r?\n=======\r?\n.*?\r?\n>>>>>>> [^\r\n]*\r?\n', '`$1')
                Set-Content -Path '!file!' -Value $resolved -Encoding UTF8
                Write-Host 'Resolved: !file!'
            }
        "
    )
    endlocal
)

echo.
echo Staging all files...
git add .

echo.
echo Committing changes...
git commit -m "fix: resolve all merge conflicts - keep HEAD versions"

if errorlevel 1 (
    echo ERROR: Git commit failed
    pause
    exit /b 1
)

echo.
echo Pushing to GitHub...
git push origin main --force

if errorlevel 1 (
    echo ERROR: Push failed
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! All conflicts resolved and pushed
echo ========================================
echo.

REM Clean up temp directory
if exist ".\temp_conflict_fix" rmdir /s /q ".\temp_conflict_fix"

pause
