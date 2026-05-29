'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

const ADMIN_EMAIL = 'techcraftlab.bkk@gmail.com';

interface PrintOrder {
  id: string;
  status: string;
  model_name: string;
  model_source: string;
  model_file_url?: string;
  model_preview_url?: string;
  material: string;
  color: string;
  scale_cm: number;
  infill_percent: number;
  quantity: number;
  token_cost: number;
  customer_email?: string;
  customer_name?: string;
  delivery_address?: any;
  tracking_number?: string;
  admin_note?: string;
  created_at: string;
}

const STATUS_OPTIONS = [
  { value: 'accepted', label: '✅ Accept' },
  { value: 'printing', label: '🖨️ Printing' },
  { value: 'packed',   label: '📦 Packed' },
  { value: 'shipped',  label: '🚚 Shipped' },
  { value: 'delivered',label: '🎉 Delivered' },
  { value: 'cancelled',label: '❌ Cancel (refund)' },
];

const STATUS_COLOR: Record<string, string> = {
  pending:   'bg-yellow-100 text-yellow-700',
  accepted:  'bg-blue-100 text-blue-700',
  printing:  'bg-purple-100 text-purple-700',
  packed:    'bg-indigo-100 text-indigo-700',
  shipped:   'bg-cyan-100 text-cyan-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  refunded:  'bg-gray-100 text-gray-600',
};

const STATUS_ICONS: Record<string, string> = {
  pending: '⏳', accepted: '✅', printing: '🖨️', packed: '📦',
  shipped: '🚚', delivered: '🎉', cancelled: '❌', refunded: '↩️',
};

export default function Admin3DPage() {
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale ?? 'en';

  const [orders, setOrders] = useState<PrintOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState<PrintOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [trackingInput, setTrackingInput] = useState('');
  const [noteInput, setNoteInput] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session || session.user.email !== ADMIN_EMAIL) {
        router.push(`/${locale}/admin`);
        return;
      }
      fetchOrders();
    });
  }, [filter]);

  const fetchOrders = async () => {
    setLoading(true);
    const url = filter === 'all' ? '/api/3d/orders/all' : `/api/3d/orders/all?status=${filter}`;
    // Use admin endpoint
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(`/api/3d/orders/${filter === 'all' ? 'all' : `all?status=${filter}`}`);
    // Fallback: directly query via supabase client for admin
    const { data, error } = await (await import('@/lib/supabaseServer')).createServerSupabaseClient()
      .then ? { data: null, error: new Error('use supabase') }
      : { data: null, error: null };

    // Direct Supabase query approach (admin sees all)
    const sb = (await import('@/lib/supabase')).supabase;
    let query = sb.from('print_orders').select('*').order('created_at', { ascending: false });
    if (filter !== 'all') query = query.eq('status', filter);
    const { data: orders, error: err } = await query;
    if (!err) setOrders(orders ?? []);
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!selected || !newStatus) return;
    setUpdating(true);
    try {
      const res = await fetch(`/api/3d/orders/${selected.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus || undefined,
          trackingNumber: trackingInput || undefined,
          adminNote: noteInput || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSelected(null);
      fetchOrders();
    } catch (err: any) {
      alert('Update failed: ' + err.message);
    } finally {
      setUpdating(false);
    }
  };

  const openDetail = (order: PrintOrder) => {
    setSelected(order);
    setNewStatus(order.status);
    setTrackingInput(order.tracking_number ?? '');
    setNoteInput(order.admin_note ?? '');
  };

  const counts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    printing: orders.filter(o => o.status === 'printing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900">🖨️ 3D Print Orders</h1>
          <p className="text-gray-500 mt-1">Manage your print queue end-to-end</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total', value: counts.all, color: 'bg-gray-100 text-gray-700' },
            { label: 'Pending', value: counts.pending, color: 'bg-yellow-100 text-yellow-700' },
            { label: 'Printing', value: counts.printing, color: 'bg-purple-100 text-purple-700' },
            { label: 'Shipped', value: counts.shipped, color: 'bg-cyan-100 text-cyan-700' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 text-center ${s.color}`}>
              <div className="text-2xl font-black">{s.value}</div>
              <div className="text-xs font-semibold uppercase tracking-wide opacity-70">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {['all', 'pending', 'accepted', 'printing', 'packed', 'shipped', 'delivered', 'cancelled'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
                filter === f ? 'bg-purple-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-purple-300'
              }`}>
              {f === 'all' ? 'All Orders' : f}
            </button>
          ))}
        </div>

        {loading && <div className="text-center py-16 text-gray-400 animate-pulse">Loading orders...</div>}

        {/* Orders list */}
        <div className="space-y-3">
          {orders.map(order => (
            <div key={order.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-4 cursor-pointer hover:border-purple-200 transition-colors"
              onClick={() => openDetail(order)}>
              {order.model_preview_url ? (
                <img src={order.model_preview_url} alt="" className="w-14 h-14 rounded-xl object-cover flex-shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-purple-50 flex items-center justify-center text-2xl flex-shrink-0">
                  {STATUS_ICONS[order.status] ?? '🖨️'}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900">{order.model_name}</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                    {STATUS_ICONS[order.status]} {order.status}
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-0.5">
                  {order.customer_email} · {order.material.toUpperCase()} · {order.scale_cm}cm · ×{order.quantity}
                </div>
                <div className="text-xs text-gray-400 mt-0.5">
                  #{order.id.slice(0, 8)} · {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>

              <div className="flex-shrink-0 text-right">
                <div className="text-sm font-bold text-purple-600">⚡ {order.token_cost}</div>
                {order.tracking_number && <div className="text-xs text-cyan-600 mt-1">📦 {order.tracking_number}</div>}
              </div>
            </div>
          ))}
        </div>

        {/* Detail modal */}
        {selected && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-black text-gray-900">Order #{selected.id.slice(0, 8)}</h2>
                <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
                </button>
              </div>

              {/* Order details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-gray-500">Model</span><span className="font-semibold">{selected.model_name}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Source</span><span className="font-semibold capitalize">{selected.model_source.replace('_', ' ')}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Material</span><span className="font-semibold">{selected.material.toUpperCase()} · {selected.color}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Size</span><span className="font-semibold">{selected.scale_cm}cm · {selected.infill_percent}% infill</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Quantity</span><span className="font-semibold">×{selected.quantity}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Customer</span><span className="font-semibold">{selected.customer_name ?? selected.customer_email}</span></div>
                <div className="flex justify-between"><span className="text-gray-500">Cost</span><span className="font-semibold text-purple-600">⚡ {selected.token_cost}</span></div>
                {selected.model_file_url && (
                  <div className="flex justify-between"><span className="text-gray-500">File</span>
                    <a href={selected.model_file_url} target="_blank" rel="noopener noreferrer" className="text-purple-600 font-semibold hover:underline">Download →</a>
                  </div>
                )}
                {selected.delivery_address && (
                  <div className="pt-2 border-t border-gray-200">
                    <div className="text-gray-500 mb-1">Delivery address</div>
                    <div className="text-gray-700 text-xs whitespace-pre-wrap">{JSON.stringify(selected.delivery_address, null, 2)}</div>
                  </div>
                )}
              </div>

              {/* Update form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Update Status</label>
                  <div className="grid grid-cols-2 gap-2">
                    {STATUS_OPTIONS.map(opt => (
                      <button key={opt.value} onClick={() => setNewStatus(opt.value)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                          newStatus === opt.value ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-100 text-gray-600 hover:border-gray-200'
                        }`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Tracking Number</label>
                  <input value={trackingInput} onChange={e => setTrackingInput(e.target.value)}
                    placeholder="e.g. TH123456789TH"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Note to customer (optional)</label>
                  <textarea value={noteInput} onChange={e => setNoteInput(e.target.value)}
                    placeholder="e.g. Estimated 3–5 business days..."
                    rows={3}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-400" />
                </div>

                <button onClick={handleUpdate} disabled={updating}
                  className="w-full bg-purple-600 text-white py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors disabled:opacity-60">
                  {updating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
