@echo off
cd /d "C:\Users\USER\Documents\Claude\Projects\TC Collectibles\tc-next"
set GIT_EDITOR=true
set CM=fa253ea54187d0808eb6d382c0a8461fc8355b82
(
echo ===== abort the stuck rebase =====
git rebase --abort
echo ===== fetch latest from GitHub =====
git fetch origin
echo ===== start a clean branch from GitHub main =====
git checkout -B catalogue-3dstudio origin/main
echo ===== lay catalogue files on top (no merge, no conflicts) =====
git checkout %CM% -- lib/printingUtils.ts
git checkout %CM% -- "app/[locale]/3d-studio/page.tsx"
git checkout %CM% -- app/api/3d/orders/route.ts
git checkout %CM% -- app/api/3d/catalogue/route.ts
git checkout %CM% -- components/CatalogueTab.tsx
git checkout %CM% -- data/catalogue_seed.json
git checkout %CM% -- scripts/import-catalogue.mjs
git checkout %CM% -- scripts/mirror-thumbnails.mjs
git checkout %CM% -- scripts/seed-catalogue.mjs
git checkout %CM% -- supabase/migrations/20260614_catalogue_models.sql
git checkout %CM% -- CATALOGUE_INTEGRATION_GUIDE.md
echo ===== stage + commit =====
git add -A
git commit -m "3D Studio: free-model catalogue tab with real previews, grams/hours, importer"
echo ===== status before push =====
git status
echo ===== push straight to GitHub main (fast-forward) =====
git push origin catalogue-3dstudio:main
echo ===== EXIT %ERRORLEVEL% =====
) > catalogue_push_log.txt 2>&1
```
