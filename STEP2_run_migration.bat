@echo off
echo ============================================
echo  Running Supabase 3D System Migration...
echo ============================================
cd /d "%~dp0"
node STEP2_run_migration.js
pause
