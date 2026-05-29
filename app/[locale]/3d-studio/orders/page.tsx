'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface PrintOrder {
  id: string;
  status: string;
  model_name: string;
  model_source: string;
  model_preview_url?: string;
  material: string;
  color: string;
  scale_cm: number;
  quantity: number;
  token_cost: number;
  tracking_number?: string;
  admin_note?: string;
  created_at: string;
  updated_at: string;
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: string; step: number }> = {
  pending:    { label: 'Pending',    color: 'bg-yellow-100 text-yellow-700 border-yellow-200', icon: '⏳', step: 1 },
  accepted:   { label: 'Accepted',  color: 'bg-blue-100 text-blue-700 border-blue-200',       icon: '✅', step: 2 },
  printing:   { label: 'Printing',  color: 'bg-purple-100 text-purple-700 border-purple-200', icon: '🖨️', step: 3 },
  packed:     { label: 'Packed',    color: 'bg-indigo-100 text-indigo-700 border-indigo-200', icon: '📦', step: 4 },
  shipped:    { label: 'Shipped',   color: 'bg-cyan-100 text-cyan-700 border-cyan-200',        icon: '🚚', step: 5 },
  delivered:  { label: 'Delivered', color: 'bg-green-100 text-green-700 border-green-200',     icon: '🎉', step: 6 },
  cancelled:  { label: 'Cancelled', color: 'bg-red-100 text-red-700 border-red-200',           icon: '❌', step: 0 },
  refunded:   { label: 'Refunded',  color: 'bg-gray-100 text-gray-600 border-gray-200',        icon: '↩️', step: 0 },
};

const STEPS = ['pending', 'accepted', 'printing', 'packed', 'shipped', 'delivered'];

export default function PrintOrdersPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? 'en';

  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<PrintOrder | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) { router.push(`/${locale}/auth/login`); return; }
      fetchOrders();
    });
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const res = await fetch('/api/3d/orders');
    if (res.ok) { const d = await res.json(); setOrders(d.orders ?? []); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href={`/${locale}/3d-studio`} className="text-purple-600 hover:underline text-sm font-medium flex items-center gap-1 mb-4">
            ← Back to 3D Studio
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-black text-gray-900">📦 My Print Orders</h1>
            <button onClick={fetchOrders} className="text-sm text-gray-500 hover:text-purple-600 flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              Refresh
            </button>
          </div>
        </div>

        {loading && (
          <div className="text-center py-16 text-gray-400">
            <div className="animate-spin text-4xl mb-2">⏳</div>
            <div>Loading orders...</div>
          </div>
        )}

        {!loading && orders.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">🖨️</div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">No print orders yet</h2>
            <p className="text-gray-500 mb-6">Head to the studio to create your first 3D print!</p>
            <Link href={`/${locale}/3d-studio`} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
              Open 3D Studio
            </Link>
          </div>
        )}

        <div className="space-y-4">
          {orders.map(order => {
            const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const currentStep = cfg.step;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {order.model_preview_url ? (
                        <img src={order.model_preview_url} alt="" className="w-14 h-14 rounded-xl object-cover bg-gray-100 flex-shrink-0" />
                      ) : (
                        <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-2xl flex-shrink-0">🖨️</div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-gray-900 truncate">{order.model_name}</div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {order.material.toUpperCase()} · {order.color} · {order.scale_cm}cm · ×{order.quantity}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">
                          #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${cfg.color}`}>
                        {cfg.icon} {cfg.label}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">⚡ {order.token_cost} credits</span>
                    </div>
                  </div>

                  {/* Progress steps */}
                  {order.status !== 'cancelled' && order.status !== 'refunded' && (
                    <div className="flex items-center gap-1 mb-4">
                      {STEPS.map((s, i) => (
                        <div key={s} className="flex items-center flex-1">
                          <div className={`flex-1 h-1.5 rounded-full transition-colors ${
                            i < currentStep ? 'bg-purple-500' : 'bg-gray-100'
                          }`} />
                          {i === STEPS.length - 1 && (
                            <div className={`w-3 h-3 rounded-full ml-1 ${i < currentStep ? 'bg-purple-500' : 'bg-gray-200'}`} />
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tracking */}
                  {order.tracking_number && (
                    <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 flex items-center gap-2 text-sm">
                      <span>🚚</span>
                      <span className="text-cyan-700 font-medium">Tracking: <span className="font-bold">{order.tracking_number}</span></span>
                    </div>
                  )}

                  {/* Admin note */}
                  {order.admin_note && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 mt-2 text-sm text-gray-600">
                      💬 {order.admin_note}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
