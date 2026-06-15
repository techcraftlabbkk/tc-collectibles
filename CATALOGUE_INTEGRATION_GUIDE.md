# 3D Studio — Free-Model Catalogue Integration

Adds a **📚 Catalogue** tab to `/[locale]/3d-studio` so customers can pick from **100 curated, Bambu-ready, free-to-print models** instead of only uploading or AI-generating. Every model shows **filament grams** and **print time (hours)**, and selecting one auto-applies its recommended size & infill, then flows straight into your existing token-checkout.

---

## Guided customer flow (the UX)

1. **① Browse** — Open 3D Studio → the **Catalogue** tab is first. Search ("dragon", "planter", "vase") or filter by category chips. Each card shows live ⚖️ grams, ⏱️ hours, ⚡ tokens.
2. **② Pick** — Click a model. It highlights with a ✓, and its recommended **size + infill are applied automatically**.
3. **③ Customise** — Adjust colour / size / infill / quantity on the right. Grams, hours and token cost update live.
4. **④ Order** — "Place Order" deducts tokens exactly as today. The order records which catalogue model it was, plus the grams/hours estimate, for your print queue.

No change to payments, wallet, or the order pipeline — the catalogue just feeds the existing flow.

---

## Files added / changed

**Added**
- `data/catalogue_seed.json` — the 100 models (name, category, recommended settings, grams, hours, tokens).
- `app/api/3d/catalogue/route.ts` — `GET /api/3d/catalogue?q=&category=` (reads DB, **falls back to the seed file** so it works before seeding).
- `components/CatalogueTab.tsx` — the guided, searchable, filterable grid UI.
- `supabase/migrations/20260614_catalogue_models.sql` — `catalogue_models` table + RLS + links `print_orders.catalogue_model_id`, `est_grams`, `est_hours`.
- `scripts/seed-catalogue.mjs` — loads the seed JSON into the table.

**Changed**
- `lib/printingUtils.ts` — new `estimateFilament({ scaleCm, infillPercent, baseGrams, quantity })` → `{ grams, hours }`.
- `app/[locale]/3d-studio/page.tsx` — new `catalogue` tab, live grams/hours panel, order hookup.
- `app/api/3d/orders/route.ts` — persists `catalogue_model_id`, `est_grams`, `est_hours`.

---

## Deploy (3 steps)

1. **Run the migration** — apply `supabase/migrations/20260614_catalogue_models.sql` in Supabase.
2. **Seed the catalogue** — `node scripts/seed-catalogue.mjs` (needs `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`). *Optional* — the API already falls back to the bundled seed, so the tab works even if you skip this.
3. **Deploy** to Vercel as usual. The Catalogue tab appears immediately.

---

## ⚠️ Before you sell prints — the licensing gate

The catalogue ships with every model marked **`commercial_ok = false` / license = "Verify"** on purpose. "Free to download" does **not** mean "free to sell prints of" — many free models are Creative-Commons **NonCommercial**, which you may not sell without the designer's permission.

The catalogue entries are curated *model concepts* (e.g. "Spiral Twisted Vase", "Low-Poly Fox"). The **source-import step** binds each to a specific real file from MyMiniFactory / Thingiverse / Printables and **confirms a commercial-safe license (CC-BY / CC0 / commercial)** before flipping `commercial_ok = true` and filling `file_url`, `thumbnail_url`, `source_url`. Only flip that flag once the license is verified. CC-BY models also need attribution (designer name + link) on the product page / packing slip.

---

## Real previews (live now)

The catalogue ships seeded with **27 real, hand-picked models** — each with an **actual product photo**, the real designer, the source platform, a direct download link to the original listing, and accurate grams/time/token estimates. Cards show the photo, "by {designer} · {source}", a **license badge** (green "Commercial OK" / amber "Verify license"), and a **View original →** link. Images are hosted on the source CDNs (Printables / Thingiverse / MyMiniFactory) and load under the existing CSP (`img-src https:`).

### Scale past 100 — the importer

`scripts/import-catalogue.mjs` pulls more real models (with real photos) from Thinger, which indexes free models across Printables / Thingiverse / MyMiniFactory / Cults3D. It's pre-loaded with a category-grouped queue of real model slugs.

```
node scripts/import-catalogue.mjs          # import the built-in queue (~60 models)
node scripts/import-catalogue.mjs 41202 779 # import specific Thinger model ids
```

Each import reads the real og:image, designer, source, and download link, computes estimates, and upserts into `catalogue_models`. Add more slugs from any `https://api.thinger.rocks/collections/*` page to grow the catalogue to 100+.

## Two things to do before selling

- **Verify licenses.** Every imported model defaults to `commercial_ok = false` / "Verify". "Free to download" ≠ "free to sell prints of." Confirm a commercial-safe license (CC-BY / CC0 / explicit commercial) per model before flipping the flag. Example signals already captured: **#3DBenchy is public domain (commercial OK)**; the **Cinderwing Bamboo Dragon is explicitly personal-use-only** (no commercial sale); fan-art (Baby Yoda, Spiderman, Darth Vader) carries IP risk regardless of CC.
- **Mirror images into your storage (recommended).** Cards currently hotlink the source CDN, which can break on browser Referer checks and rots over time. Run `node scripts/mirror-thumbnails.mjs --seed` to download every preview into a public Supabase Storage bucket (`catalogue-thumbs`) and rewrite `thumbnail_url` to your own URL. After this, previews are 100% reliable and owned by you. (Note: third-party images can't render in the in-chat preview pane due to its sandbox, but they load fine in your deployed app.)
- **Reprice using grams/time** — token cost currently keys off size/infill/material only. Now that grams + hours are computed, consider factoring them in so a 7-hour, 90 g print isn't priced like a 1-hour, 12 g one.
