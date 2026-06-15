@echo off
cd /d "C:\Users\USER\Documents\Claude\Projects\TC Collectibles\tc-next"
set GIT_EDITOR=true
set GIT_SEQUENCE_EDITOR=true
set EDITOR=true
(
echo ===== clearing stale locks =====
del /f /q .git\*.lock 2>nul
del /f /q .git\rebase-merge\*.lock 2>nul
echo ===== removing generated tsbuildinfo from commit =====
git rm -f tsconfig.tsbuildinfo
echo ===== staging resolved package.json =====
git add package.json
echo ===== continuing rebase =====
git rebase --continue
echo ===== ignoring tsbuildinfo going forward =====
findstr /x /c:"tsconfig.tsbuildinfo" .gitignore >nul 2>&1 || echo tsconfig.tsbuildinfo>> .gitignore
git add .gitignore
git commit -m "chore: stop tracking generated tsconfig.tsbuildinfo" 2>nul
echo ===== status =====
git status
echo ===== pushing to origin main =====
git push origin main
echo ===== EXITCODE %ERRORLEVEL% =====
echo ===== DONE =====
) > finish_push_log.txt 2>&1
