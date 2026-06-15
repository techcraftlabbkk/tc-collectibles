-- ─────────────────────────────────────────────────────────────────────────────
-- 3D Studio: Free-model Catalogue
-- Adds a browsable catalogue of curated, Bambu-ready, free-to-print models.
-- Rows are seeded from data/catalogue_seed.json via scripts/seed-catalogue.mjs
-- and backfilled with real file_url / license by the source-import job.
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists public.catalogue_models (
  id              text primary key,            -- e.g. cat-001
  rank            int,
  name            text not null,
  category        text not null,
  source          text,                        -- MyMiniFactory / Thingiverse / Printables
  source_url      text,                        -- link to the original model page
  file_url        text,                        -- downloadable STL/3MF in our storage (backfilled)
  thumbnail_url   text,
  license         text default 'Verify',       -- raw license string from source
  commercial_ok   boolean default false,       -- TRUE only once a CC-BY/CC0/commercial license is confirmed
  bambu_ready     boolean default true,
  material        text default 'pla',
  rec_scale_cm    int default 15,
  rec_infill_percent int default 20,
  base_grams      numeric,                      -- grams at 15cm/20% reference
  est_grams       numeric,                      -- grams at recommended settings
  est_hours       numeric,                      -- print hours at recommended settings
  est_tokens      int,
  is_active       boolean default true,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists catalogue_models_category_idx on public.catalogue_models (category);
create index if not exists catalogue_models_active_idx   on public.catalogue_models (is_active, rank);

-- Public read access (catalogue is browseable by any signed-in customer).
alter table public.catalogue_models enable row level security;

drop policy if exists "catalogue read" on public.catalogue_models;
create policy "catalogue read"
  on public.catalogue_models for select
  using (is_active = true);

-- Link print orders back to the catalogue model they fulfil (nullable: custom prints have none),
-- and record the filament + time estimate shown to the customer at order time.
alter table public.print_orders
  add column if not exists catalogue_model_id text references public.catalogue_models (id),
  add column if not exists est_grams numeric,
  add column if not exists est_hours numeric;
