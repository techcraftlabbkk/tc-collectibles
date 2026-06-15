'use client';

import { useEffect, useMemo, useState } from 'react';
import { estimateFilament } from '@/lib/printingUtils';

export interface CatalogueModel {
  id: string;
  rank: number;
  name: string;
  category: string;
  source: string;
  designer: string;
  source_url: string | null;
  file_url: string | null;
  thumbnail_url: string | null;
  license: string;
  commercial_ok: boolean;
  bambu_ready: boolean;
  material: string;
  rec_scale_cm: number;
  rec_infill_percent: number;
  base_grams: number;
  est_grams: number;
  est_hours: number;
  est_tokens: number;
}

const CATEGORY_ICON: Record<string, string> = {
  Articulated: '🐉', Figurine: '🗿', Planter: '🪴', Vase: '🏺', Lighting: '💡',
  'Desk Toy': '🎲', Organizer: '🗂️', Gadget: '🔧', Tabletop: '♟️', Keychain: '🔑',
  Seasonal: '🎄', Toy: '🧸', 'Home Decor': '🖼️', Tool: '🛠️',
};
const CATEGORY_GRADIENT: Record<string, string> = {
  Articulated: 'from-pink-500/30 to-fuchsia-500/10', Figurine: 'from-violet-500/30 to-indigo-500/10',
  Planter: 'from-emerald-500/30 to-green-500/10', Vase: 'from-cyan-500/30 to-sky-500/10',
  Lighting: 'from-amber-400/30 to-yellow-500/10', 'Desk Toy': 'from-rose-500/30 to-red-500/10',
  Organizer: 'from-sky-500/30 to-blue-500/10', Gadget: 'from-slate-400/30 to-slate-500/10',
  Tabletop: 'from-red-500/30 to-orange-500/10', Keychain: 'from-purple-500/30 to-violet-500/10',
  Seasonal: 'from-orange-400/30 to-amber-500/10', Toy: 'from-teal-500/30 to-emerald-500/10',
  'Home Decor': 'from-fuchsia-500/30 to-pink-500/10', Tool: 'from-zinc-400/30 to-zinc-500/10',
};

interface Props {
  selectedId?: string | null;
  config: { scaleCm: number; infillPercent: number };
  onSelect: (m: CatalogueModel) => void;
}

export default function CatalogueTab({ selectedId, config, onSelect }: Props) {
  const [models, setModels] = useState<CatalogueModel[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [activeCat, setActiveCat] = useState('All');
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/3d/catalogue?limit=200')
      .then(r => r.json())
      .then(d => { setModels(d.models ?? []); setCategories(d.categories ?? ['All']); })
      .catch(() => setModels([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return models.filter(m =>
      (activeCat === 'All' || m.category === activeCat) &&
      (!needle || m.name.toLowerCase().includes(needle) || m.category.toLowerCase().includes(needle))
    );
  }, [models, activeCat, q]);

  return (
    <div className="space-y-4">
      {/* Guided helper */}
      <div className="bg-cyan-950/40 border border-cyan-800/50 rounded-xl px-4 py-3 flex items-center gap-3">
        <span className="text-lg">①</span>
        <p className="text-sm text-cyan-200">
          Pick a ready-to-print model below. We&apos;ll apply its recommended size &amp; infill —
          then just confirm options on the right and order. All models are tuned for your Bambu Lab printer.
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search 100 models — dragon, planter, vase, keychain…"
          className="w-full bg-gray-800 border border-gray-700 text-white rounded-xl pl-9 pr-4 py-2.5 text-sm
                     focus:outline-none focus:ring-2 focus:ring-cyan-400 placeholder-gray-500"
        />
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {categories.map(c => (
          <button key={c} onClick={() => setActiveCat(c)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              activeCat === c
                ? 'bg-cyan-500 text-black border-cyan-400'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:border-gray-600'
            }`}>
            {c === 'All' ? 'All' : `${CATEGORY_ICON[c] ?? '•'} ${c}`}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-500 px-0.5">
        <span>{loading ? 'Loading catalogue…' : `${filtered.length} models`}</span>
        <span>⚖️ grams &amp; ⏱️ hours are estimates for PLA on a Bambu Lab P-series</span>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 bg-gray-800/60 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3 max-h-[560px] overflow-y-auto pr-1">
          {filtered.map(m => {
            const selected = selectedId === m.id;
            // Live estimate reflecting the size/infill the customer currently has chosen.
            const live = estimateFilament({
              scaleCm: config.scaleCm,
              infillPercent: config.infillPercent || m.rec_infill_percent,
              baseGrams: m.base_grams,
            });
            return (
              <div key={m.id} onClick={() => onSelect(m)} role="button" tabIndex={0}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSelect(m); }}
                className={`text-left rounded-2xl border transition-all overflow-hidden group cursor-pointer ${
                  selected ? 'border-cyan-400 ring-2 ring-cyan-400/40 bg-cyan-950/30'
                           : 'border-gray-800 bg-gray-900 hover:border-gray-600'
                }`}>
                {/* Thumb */}
                <div className={`relative h-24 flex items-center justify-center bg-gradient-to-br ${
                  CATEGORY_GRADIENT[m.category] ?? 'from-gray-700/30 to-gray-800/10'}`}>
                  {m.thumbnail_url
                    ? <img src={m.thumbnail_url} alt={m.name} className="h-full w-full object-cover" />
                    : <span className="text-4xl opacity-90">{CATEGORY_ICON[m.category] ?? '🧩'}</span>}
                  <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wide
                                   bg-black/40 text-white px-2 py-0.5 rounded-full backdrop-blur">
                    {m.category}
                  </span>
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    m.commercial_ok ? 'bg-emerald-500/90 text-black' : 'bg-amber-500/90 text-black'
                  }`}>
                    {m.commercial_ok ? 'Commercial OK' : 'Verify license'}
                  </span>
                  {selected && (
                    <span className="absolute bottom-2 right-2 bg-cyan-500 text-black rounded-full w-6 h-6
                                     flex items-center justify-center font-bold shadow">✓</span>
                  )}
                </div>
                {/* Body */}
                <div className="p-3">
                  <div className="font-semibold text-sm text-white leading-snug line-clamp-1">{m.name}</div>
                  <div className="text-[11px] text-gray-500 mb-2 truncate">
                    by {m.designer} · {m.source}
                  </div>
                  <div className="flex items-center gap-2 text-[11px]">
                    <span className="bg-gray-800 text-gray-200 rounded-lg px-2 py-1">⚖️ {live.grams} g</span>
                    <span className="bg-gray-800 text-gray-200 rounded-lg px-2 py-1">⏱️ {live.hours} h</span>
                    <span className="ml-auto font-bold text-cyan-400">⚡ {m.est_tokens}</span>
                  </div>
                  {m.source_url && (
                    <a href={m.source_url} target="_blank" rel="noopener noreferrer"
                       onClick={e => e.stopPropagation()}
                       className="block mt-2 text-[11px] text-cyan-400 hover:underline">
                      View original →
                    </a>
                  )}
                </div>
              </div>
            );
          })}
          {!filtered.length && (
            <div className="col-span-full text-center text-gray-500 py-12 text-sm">
              No models match “{q}”. Try another search or category.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
