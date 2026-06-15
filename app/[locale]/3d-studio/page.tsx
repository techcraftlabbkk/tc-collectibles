'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { calculateTokenCost, estimateFilament } from '@/lib/printingUtils';
import CatalogueTab, { CatalogueModel } from '@/components/CatalogueTab';

// ─── Types ────────────────────────────────────────────────────────────────────
type Tab = 'upload' | 'ai_text' | 'ai_image' | 'catalogue';
type Material = 'pla' | 'resin' | 'metal';

interface Config {
  material: Material;
  color: string;
  scaleCm: number;
  infillPercent: number;
  quantity: number;
}

interface AIJob {
  jobId: string;
  taskId: string;
  status: 'pending' | 'in_progress' | 'succeeded' | 'failed';
  progress: number;
  modelUrl?: string;
  thumbnailUrl?: string;
}

const MATERIALS: { id: Material; label: string; icon: string; desc: string }[] = [
  { id: 'pla', label: 'PLA Plastic', icon: '🟦', desc: 'Standard, durable, great for display pieces' },
];

const COLORS = ['White', 'Black', 'Red', 'Blue', 'Green', 'Gold', 'Silver', 'Transparent'];
const INFILLS = [10, 20, 40, 60, 80, 100];

// ─── Component ────────────────────────────────────────────────────────────────
export default function ThreeDStudioPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? 'en';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<any>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [tab, setTab] = useState<Tab>('upload');

  // Upload state
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // AI Text state
  const [prompt, setPrompt] = useState('');
  const [artStyle, setArtStyle] = useState('realistic');
  const [generating, setGenerating] = useState(false);
  const [aiJob, setAiJob] = useState<AIJob | null>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  // Catalogue state
  const [catalogueModel, setCatalogueModel] = useState<CatalogueModel | null>(null);

  // AI Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageJob, setImageJob] = useState<AIJob | null>(null);

  // Config
  const [config, setConfig] = useState<Config>({
    material: 'pla', color: 'White', scaleCm: 15, infillPercent: 20, quantity: 1,
  });

  // Order state
  const [placing, setPlacing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // ── Auth + balance
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push(`/${locale}/auth/login`); return; }
      setUser(session.user);
      fetchBalance();
    });
  }, []);

  const fetchBalance = async () => {
    const res = await fetch('/api/3d/wallet/balance');
    if (res.ok) { const d = await res.json(); setBalance(d.balance); }
  };

  // ── Token cost
  const tokenCost = calculateTokenCost({
    material: config.material,
    scaleCm: config.scaleCm,
    infillPercent: config.infillPercent,
    quantity: config.quantity,
  });

  const activeModel = tab === 'upload' ? uploadedUrl
    : tab === 'ai_text' ? (aiJob?.status === 'succeeded' ? aiJob.modelUrl : null)
    : tab === 'ai_image' ? (imageJob?.status === 'succeeded' ? imageJob.modelUrl : null)
    : (catalogueModel ? (catalogueModel.file_url ?? catalogueModel.id) : null);

  const activePreview = tab === 'ai_text' ? aiJob?.thumbnailUrl
    : tab === 'ai_image' ? imageJob?.thumbnailUrl
    : tab === 'catalogue' ? catalogueModel?.thumbnail_url
    : null;

  const canOrder = !!activeModel && balance !== null && balance >= tokenCost;

  // ── Live filament + time estimate (shown to the customer for every model)
  const filament = estimateFilament({
    scaleCm: config.scaleCm,
    infillPercent: config.infillPercent,
    baseGrams: tab === 'catalogue' && catalogueModel ? catalogueModel.base_grams : 45,
    quantity: config.quantity,
  });

  // ── Pick a catalogue model: select it and apply its recommended settings
  const handleCatalogueSelect = (m: CatalogueModel) => {
    setCatalogueModel(m);
    setConfig(c => ({ ...c, scaleCm: m.rec_scale_cm, infillPercent: m.rec_infill_percent || c.infillPercent }));
  };

  // ── File upload to Supabase storage
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setUploading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const path = `${session.user.id}/${Date.now()}_${file.name}`;
      const { error } = await supabase.storage.from('3d-models').upload(path, file);
      if (error) throw error;
      const { data: { publicUrl } } = supabase.storage.from('3d-models').getPublicUrl(path);
      setUploadedUrl(publicUrl);
    } catch (err: any) {
      alert('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // ── AI text-to-3D
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setGenerating(true);
    setAiJob(null);
    try {
      const res = await fetch('/api/3d/meshy/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, artStyle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAiJob({ jobId: data.jobId, taskId: data.taskId, status: 'pending', progress: 0 });
      startPolling(data.jobId, 'ai_text');
    } catch (err: any) {
      alert('Generation failed: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // ── AI image-to-3D
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const preview = URL.createObjectURL(file);
    setImagePreview(preview);
  };

  const handleImageConvert = async () => {
    if (!imageFile) return;
    setImageUploading(true);
    setImageJob(null);
    try {
      // Upload image to get a public URL, then send to Meshy
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');
      const path = `${session.user.id}/img_${Date.now()}_${imageFile.name}`;
      const { error: upErr } = await supabase.storage.from('3d-models').upload(path, imageFile, { contentType: imageFile.type });
      if (upErr) throw upErr;
      const { data: { publicUrl } } = supabase.storage.from('3d-models').getPublicUrl(path);

      const res = await fetch('/api/3d/meshy/image-to-3d', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: publicUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setImageJob({ jobId: data.jobId, taskId: data.taskId, status: 'pending', progress: 0 });
      startPolling(data.jobId, 'ai_image');
    } catch (err: any) {
      alert('Conversion failed: ' + err.message);
    } finally {
      setImageUploading(false);
    }
  };

  // ── Poll Meshy job status
  const startPolling = useCallback((jobId: string, source: 'ai_text' | 'ai_image') => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      const res = await fetch(`/api/3d/meshy/status/${jobId}`);
      if (!res.ok) return;
      const d = await res.json();
      const setter = source === 'ai_text' ? setAiJob : setImageJob;
      setter(prev => ({ ...prev!, ...d }));
      if (d.status === 'succeeded' || d.status === 'failed') {
        clearInterval(pollRef.current!);
      }
    }, 4000);
  }, []);

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current); }, []);

  // ── Place order
  const handlePlaceOrder = async () => {
    if (!canOrder || !user) return;
    setPlacing(true);
    setOrderError(null);
    try {
      const activeJob = tab === 'ai_text' ? aiJob : imageJob;
      const res = await fetch('/api/3d/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          modelSource: tab,
          modelFileUrl: tab === 'upload' ? uploadedUrl
            : tab === 'catalogue' ? (catalogueModel?.file_url ?? catalogueModel?.source_url ?? null)
            : activeJob?.modelUrl,
          meshyJobId: activeJob?.jobId ?? null,
          catalogueModelId: tab === 'catalogue' ? catalogueModel?.id ?? null : null,
          modelPreviewUrl: activePreview ?? null,
          modelName: tab === 'upload' ? uploadedFile?.name
            : tab === 'ai_text' ? prompt
            : tab === 'catalogue' ? catalogueModel?.name
            : imageFile?.name,
          estGrams: filament.grams,
          estHours: filament.hours,
          ...config,
          customerEmail: user.email,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (data.code === 'INSUFFICIENT_TOKENS') {
          setOrderError('Not enough tokens. Please top up your wallet.');
        } else {
          setOrderError(data.error);
        }
        return;
      }
      setOrderSuccess(data.order.id);
      fetchBalance();
    } catch (err: any) {
      setOrderError(err.message);
    } finally {
      setPlacing(false);
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-2">Order Placed!</h2>
          <p className="text-gray-600 mb-2">Order <span className="font-mono font-bold text-cyan-400">#{orderSuccess.slice(0, 8)}</span> is in the queue.</p>
          <p className="text-sm text-gray-500 mb-6">You&apos;ll receive an email when printing begins.</p>
          <div className="flex gap-3 justify-center">
            <Link href={`/${locale}/3d-studio/orders`} className="bg-cyan-500 text-black px-5 py-2.5 rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
              Track Order
            </Link>
            <button onClick={() => { setOrderSuccess(null); setUploadedFile(null); setUploadedUrl(null); setAiJob(null); setPrompt(''); setCatalogueModel(null); }}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              New Print
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">3D Printing <span className="text-cyan-400">x</span> TechCraft Lab</h1>
            <p className="text-gray-400 mt-1">Upload a model, generate with AI, or convert a photo</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-emerald-50 border border-emerald-200 text-cyan-300 px-4 py-2.5 rounded-xl font-semibold text-sm">
              ⚡ {balance !== null ? `${balance} credits` : '—'}
            </div>
            <Link href={`/${locale}/3d-studio/wallet`}
              className="bg-cyan-500 text-black px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-cyan-400 transition-colors">
              + Top Up
            </Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Model input */}
          <div className="lg:col-span-3 space-y-6">
            {/* Mode tabs */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-6">
              <div className="flex gap-2 mb-6">
                {([
                  { id: 'catalogue', label: '📚 Catalogue',    desc: '100 ready prints' },
                  { id: 'upload',   label: '📁 Upload File',   desc: 'STL / OBJ / GLB' },
                  { id: 'ai_text',  label: '✨ AI Generate',   desc: 'Text prompt' },
                  { id: 'ai_image', label: '📷 From Photo',    desc: 'Image → 3D' },
                ] as const).map(t => (
                  <button key={t.id} onClick={() => setTab(t.id)}
                    className={`flex-1 py-2.5 px-3 rounded-xl text-sm font-semibold transition-all ${
                      tab === t.id
                        ? 'bg-cyan-500 text-black shadow-sm'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}>
                    {t.label}
                    <span className="block text-xs opacity-70 mt-0.5">{t.desc}</span>
                  </button>
                ))}
              </div>

              {/* Catalogue tab */}
              {tab === 'catalogue' && (
                <CatalogueTab
                  selectedId={catalogueModel?.id}
                  config={{ scaleCm: config.scaleCm, infillPercent: config.infillPercent }}
                  onSelect={handleCatalogueSelect}
                />
              )}

              {/* Upload tab */}
              {tab === 'upload' && (
                <div>
                  <input ref={fileInputRef} type="file" accept=".stl,.obj,.glb,.3mf" className="hidden" onChange={handleFileUpload} />
                  {!uploadedFile ? (
                    <button onClick={() => fileInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-emerald-200 rounded-xl py-12 text-center hover:border-emerald-400 hover:bg-emerald-50 transition-all group">
                      <div className="text-4xl mb-3">📂</div>
                      <div className="font-semibold text-gray-700 group-hover:text-cyan-300">Drop or click to upload your 3D file</div>
                      <div className="text-sm text-gray-400 mt-1">Supports STL, OBJ, GLB, 3MF · Max 50MB</div>
                    </button>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-4">
                      <div className="text-3xl">📄</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{uploadedFile.name}</div>
                        <div className="text-sm text-gray-500">{(uploadedFile.size / 1024 / 1024).toFixed(2)} MB</div>
                      </div>
                      {uploading ? (
                        <div className="text-sm text-cyan-400 font-medium animate-pulse">Uploading...</div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600 text-sm font-semibold">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>
                          Ready
                        </div>
                      )}
                      <button onClick={() => { setUploadedFile(null); setUploadedUrl(null); }}
                        className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* AI Text tab */}
              {tab === 'ai_text' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Describe your model</label>
                    <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                      placeholder="e.g. A detailed Pikachu figurine standing on a Pokéball, game-accurate proportions..."
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Art style</label>
                    <select value={artStyle} onChange={e => setArtStyle(e.target.value)}
                      className="w-full border border-gray-700 bg-gray-800 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400">
                      <option value="realistic">Realistic</option>
                      <option value="cartoon">Cartoon</option>
                      <option value="sculpture">Sculpture</option>
                      <option value="pbr">PBR Game Asset</option>
                    </select>
                  </div>

                  {!aiJob ? (
                    <button onClick={handleGenerate} disabled={!prompt.trim() || generating}
                      className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                      {generating ? <><span className="animate-spin">⏳</span> Starting generation...</> : '✨ Generate 3D Model'}
                    </button>
                  ) : (
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-700">AI Generation</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          aiJob.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                          aiJob.status === 'failed' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700 animate-pulse'
                        }`}>
                          {aiJob.status === 'succeeded' ? '✅ Ready' :
                           aiJob.status === 'failed' ? '❌ Failed' :
                           `⏳ ${aiJob.progress}%`}
                        </span>
                      </div>
                      {aiJob.status !== 'succeeded' && aiJob.status !== 'failed' && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-emerald-600 h-2 rounded-full transition-all" style={{ width: `${aiJob.progress}%` }} />
                        </div>
                      )}
                      {aiJob.thumbnailUrl && (
                        <img src={aiJob.thumbnailUrl} alt="3D preview" className="w-full h-40 object-contain bg-gray-100 rounded-lg" />
                      )}
                      {aiJob.status === 'failed' && (
                        <button onClick={() => { setAiJob(null); }} className="text-sm text-cyan-400 hover:underline">Try again</button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* AI Image tab */}
              {tab === 'ai_image' && (
                <div className="space-y-4">
                  <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
                  {!imageFile ? (
                    <button onClick={() => imageInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-blue-200 rounded-xl py-12 text-center hover:border-blue-400 hover:bg-blue-50 transition-all group">
                      <div className="text-4xl mb-3">🖼️</div>
                      <div className="font-semibold text-gray-700 group-hover:text-blue-700">Upload a photo to convert to 3D</div>
                      <div className="text-sm text-gray-400 mt-1">JPG, PNG, WebP · Best with clear subject, white/plain background</div>
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="relative">
                        <img src={imagePreview!} alt="Input" className="w-full h-48 object-contain bg-gray-100 rounded-xl" />
                        <button onClick={() => { setImageFile(null); setImagePreview(null); setImageJob(null); }}
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-red-50 transition-colors">
                          <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                        </button>
                      </div>
                      {!imageJob ? (
                        <button onClick={handleImageConvert} disabled={imageUploading}
                          className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                          {imageUploading ? <><span className="animate-spin">⏳</span> Uploading...</> : '📷 Convert to 3D'}
                        </button>
                      ) : (
                        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-700">Converting image</span>
                            <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                              imageJob.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                              imageJob.status === 'failed' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700 animate-pulse'
                            }`}>
                              {imageJob.status === 'succeeded' ? '✅ Ready' :
                               imageJob.status === 'failed' ? '❌ Failed' :
                               `⏳ ${imageJob.progress}%`}
                            </span>
                          </div>
                          {imageJob.status !== 'succeeded' && imageJob.status !== 'failed' && (
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${imageJob.progress}%` }} />
                            </div>
                          )}
                          {imageJob.thumbnailUrl && (
                            <img src={imageJob.thumbnailUrl} alt="3D result" className="w-full h-40 object-contain bg-gray-100 rounded-lg" />
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right: Config + Order panel */}
          <div className="lg:col-span-2 space-y-5">
            {/* Material */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold text-white">Material</h3>
                <span className="group relative cursor-help">
                  <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">?</span>
                  <span className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed">
                    Choose the filament your model will be printed in. PLA is the most affordable and durable option for display pieces and prototypes.
                  </span>
                </span>
              </div>
              <div className="space-y-2">
                {MATERIALS.map(m => (
                  <button key={m.id} onClick={() => setConfig(c => ({ ...c, material: m.id }))}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      config.material === m.id ? 'border-cyan-400 bg-cyan-950' : 'border-gray-700 hover:border-gray-600'
                    }`}>
                    <span className="text-xl">{m.icon}</span>
                    <div>
                      <div className="font-semibold text-sm text-white">{m.label}</div>
                      <div className="text-xs text-gray-400">{m.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Configuration */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-4">
              <h3 className="font-bold text-white">Configuration</h3>

              {/* Color */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Colour</label>
                  <span className="group relative cursor-help">
                    <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">?</span>
                    <span className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed">
                      Select the filament colour for your print. Note: colour availability may vary. We will contact you if a substitute is needed.
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map(c => (
                    <button key={c} onClick={() => setConfig(cfg => ({ ...cfg, color: c }))}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                        config.color === c ? 'border-cyan-400 bg-cyan-950 text-cyan-300' : 'border-gray-200 text-gray-600 hover:border-gray-300'
                      }`}>{c}</button>
                  ))}
                </div>
              </div>

              {/* Scale */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Scale</label>
                    <span className="group relative cursor-help">
                      <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">?</span>
                      <span className="absolute left-6 top-0 z-20 hidden group-hover:block w-60 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed">
                        The longest dimension of your printed model. Larger prints use more material and cost more credits. 15cm is a popular size for figurines.
                      </span>
                    </span>
                  </div>
                  <span className="text-sm font-bold text-cyan-400">{config.scaleCm} cm</span>
                </div>
                <input type="range" min={5} max={50} value={config.scaleCm}
                  onChange={e => setConfig(c => ({ ...c, scaleCm: parseInt(e.target.value) }))}
                  className="w-full accent-cyan-500" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5 cm (small)</span><span>50 cm (large)</span></div>
              </div>

              {/* Infill */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Infill (density)</label>
                  <span className="group relative cursor-help">
                    <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">?</span>
                    <span className="absolute left-6 top-0 z-20 hidden group-hover:block w-64 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed">
                      How solid the inside of your print is. 10–20% = hollow shell (lighter, cheaper, good for display). 40–60% = sturdy everyday use. 80–100% = maximum strength, heaviest, most credits.
                    </span>
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1">
                  {INFILLS.map(v => (
                    <button key={v} onClick={() => setConfig(c => ({ ...c, infillPercent: v }))}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        config.infillPercent === v ? 'bg-cyan-500 text-black' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}>{v}%</button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-1.5">
                  {config.infillPercent <= 20 ? 'Light shell — great for display pieces' :
                   config.infillPercent <= 60 ? 'Balanced — sturdy for everyday handling' :
                   'Dense — maximum strength and weight'}
                </p>
              </div>

              {/* Quantity */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Quantity</label>
                  <span className="group relative cursor-help">
                    <span className="w-4 h-4 rounded-full bg-gray-200 text-gray-500 text-xs flex items-center justify-center font-bold">?</span>
                    <span className="absolute left-6 top-0 z-20 hidden group-hover:block w-56 bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl leading-relaxed">
                      Number of identical copies to print. Each copy deducts the same credit cost. Max 10 per order.
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => setConfig(c => ({ ...c, quantity: Math.max(1, c.quantity - 1) }))}
                    className="w-9 h-9 rounded-lg bg-gray-800 text-gray-200 font-bold hover:bg-gray-700 flex items-center justify-center text-lg">−</button>
                  <span className="text-xl font-bold text-white w-8 text-center">{config.quantity}</span>
                  <button onClick={() => setConfig(c => ({ ...c, quantity: Math.min(10, c.quantity + 1) }))}
                    className="w-9 h-9 rounded-lg bg-gray-800 text-gray-200 font-bold hover:bg-gray-700 flex items-center justify-center text-lg">+</button>
                </div>
              </div>
            </div>

            {/* Order summary + CTA */}
            <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600 text-sm">Estimated cost</span>
                <span className="text-2xl font-black text-cyan-400">⚡ {tokenCost}</span>
              </div>

              {/* Filament + time estimate */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-800 rounded-xl px-3 py-2.5 text-center">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Filament</div>
                  <div className="text-lg font-bold text-white">⚖️ {filament.grams} g</div>
                </div>
                <div className="bg-gray-800 rounded-xl px-3 py-2.5 text-center">
                  <div className="text-[11px] text-gray-500 uppercase tracking-wide">Print time</div>
                  <div className="text-lg font-bold text-white">⏱️ {filament.hours} h</div>
                </div>
              </div>
              <p className="text-[11px] text-gray-500 mb-4 -mt-2">
                Estimated for {config.quantity > 1 ? `${config.quantity} pcs · ` : ''}PLA on Bambu Lab · refined at slicing.
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>Your balance</span>
                <span className={balance !== null && balance < tokenCost ? 'text-red-500 font-bold' : 'font-semibold text-gray-700'}>
                  {balance !== null ? `⚡ ${balance}` : '...'}
                </span>
              </div>

              {balance !== null && balance < tokenCost && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm text-amber-700 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Not enough credits. <Link href={`/${locale}/3d-studio/wallet`} className="font-bold underline">Top up here →</Link></span>
                </div>
              )}

              {orderError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4 text-sm text-red-700">{orderError}</div>
              )}

              <button onClick={handlePlaceOrder} disabled={!canOrder || placing}
                className="w-full bg-cyan-500 text-black py-3.5 rounded-xl font-bold text-base hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {placing ? <><span className="animate-spin">⏳</span> Placing order...</> :
                 !activeModel ? '← Configure your model first' :
                 `🛒 Place Order · ⚡ ${tokenCost} credits`}
              </button>

              <div className="flex gap-3 mt-3">
                <Link href={`/${locale}/3d-studio/orders`} className="flex-1 text-center text-sm text-gray-500 hover:text-cyan-400 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  📦 My Orders
                </Link>
                <Link href={`/${locale}/3d-studio/wallet`} className="flex-1 text-center text-sm text-gray-500 hover:text-cyan-400 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                  💳 Wallet
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
