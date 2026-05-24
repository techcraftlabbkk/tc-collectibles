'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import Link from 'next/link';

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  shipping_address: string;
  phone: string;
  created_at: string;
}

interface Product {
  id: string;
  title: string;
  grade: string;
  price: number;
  quantity: number;
  available: boolean;
  image_url?: string | null;
  image_urls?: string[] | null;
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingPayment: number;
  productsCount: number;
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; dot: string; label: string }> = {
  pending_payment: { bg: 'bg-amber-50',   text: 'text-amber-800',   dot: 'bg-amber-400',   label: 'Pending Payment' },
  paid:            { bg: 'bg-emerald-50', text: 'text-emerald-800', dot: 'bg-emerald-400', label: 'Paid' },
  processing:      { bg: 'bg-blue-50',    text: 'text-blue-800',    dot: 'bg-blue-400',    label: 'Processing' },
  shipped:         { bg: 'bg-purple-50',  text: 'text-purple-800',  dot: 'bg-purple-400',  label: 'Shipped' },
  delivered:       { bg: 'bg-green-50',   text: 'text-green-800',   dot: 'bg-green-400',   label: 'Delivered' },
  cancelled:       { bg: 'bg-red-50',     text: 'text-red-800',     dot: 'bg-red-400',     label: 'Cancelled' },
};

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', dot: 'bg-gray-400', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function StatCard({ label, value, icon, color }: { label: string; value: string; icon: string; color: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
      <div className={`text-3xl w-12 h-12 flex items-center justify-center rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-0.5">{label}</p>
        <p className="text-2xl font-black text-gray-900">{value}</p>
      </div>
    </div>
  );
}

const ADMIN_EMAIL = 'techcraftlab.bkk@gmail.com';

export default function AdminPage() {
  const router = useRouter();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, totalRevenue: 0, pendingPayment: 0, productsCount: 0 });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadErrorProductId, setUploadErrorProductId] = useState<string | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ title: '', grade: '', description: '', price: '', quantity: '1', available: true });
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', grade: '', description: '', price: '', quantity: '', available: true });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) { router.push(`/${locale}/auth/login`); return; }
        if (session.user.email !== ADMIN_EMAIL) { router.push(`/${locale}`); return; }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders').select('*').order('created_at', { ascending: false });
        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        const { data: productsData, error: productsError } = await supabase
          .from('products').select('*').order('created_at', { ascending: false });
        if (productsError) throw productsError;
        setProducts(productsData || []);

        const totalRevenue = (ordersData || [])
          .filter((o) => o.status !== 'pending_payment' && o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0);

        setStats({
          totalOrders: ordersData?.length || 0,
          totalRevenue,
          pendingPayment: (ordersData || []).filter((o) => o.status === 'pending_payment').length,
          productsCount: productsData?.length || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, [router, locale]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);
      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);
      if (error) throw error;

      try {
        const { data: fullOrder, error: fetchError } = await supabase
          .from('orders').select('*').eq('id', orderId).single();
        if (!fetchError && fullOrder) {
          if (newStatus === 'paid') {
            await fetch('/api/orders/send-payment-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerEmail: fullOrder.customer_email, customerName: fullOrder.customer_name, orderId: fullOrder.id, orderTotal: fullOrder.total }) });
          } else if (newStatus === 'shipped') {
            await fetch('/api/orders/send-shipment-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerEmail: fullOrder.customer_email, customerName: fullOrder.customer_name, orderId: fullOrder.id, shippingAddress: fullOrder.shipping_address }) });
          } else if (newStatus === 'delivered') {
            await fetch('/api/orders/send-delivery-email', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ customerEmail: fullOrder.customer_email, customerName: fullOrder.customer_name, orderId: fullOrder.id, orderTotal: fullOrder.total }) });
          }
        }
      } catch (emailError) { console.error('Failed to send email:', emailError); }

      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleUploadProductImage = async (productId: string, file: File) => {
    try {
      setUploadingProductId(productId);
      setUploadError(null);
      setUploadErrorProductId(null);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);
      const response = await fetch('/api/products/upload-image', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload image');
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, image_url: data.imageUrl, image_urls: data.imageUrls } : p)));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed');
      setUploadErrorProductId(productId);
    } finally {
      setUploadingProductId(null);
    }
  };

  const handleDeleteProductImage = async (productId: string, imageUrl: string) => {
    try {
      const response = await fetch('/api/products/delete-image', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, imageUrl }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to delete image');
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId
            ? { ...p, image_urls: data.imageUrls, image_url: data.imageUrls?.[0] ?? null }
            : p
        )
      );
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image delete failed');
      setUploadErrorProductId(productId);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setEditForm({ title: product.title, grade: product.grade || '', description: '', price: String(product.price), quantity: String(product.quantity), available: product.available });
  };

  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setSavingProduct(true);
      setError(null);
      const response = await fetch('/api/products/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingProduct.id,
          title: editForm.title.trim(),
          grade: editForm.grade.trim(),
          description: editForm.description.trim() || null,
          price: parseFloat(editForm.price),
          quantity: parseInt(editForm.quantity, 10),
          available: editForm.available,
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Failed to update product');
      setProducts((prev) => prev.map((p) => (p.id === editingProduct.id ? result.product : p)));
      setEditingProduct(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setAddingProduct(true);
      setError(null);
      const { data, error: insertError } = await supabase
        .from('products')
        .insert([{ title: newProduct.title.trim(), grade: newProduct.grade.trim(), description: newProduct.description.trim() || null, price: parseFloat(newProduct.price), quantity: parseInt(newProduct.quantity, 10), available: newProduct.available }])
        .select().single();
      if (insertError) throw insertError;
      setProducts((prev) => [data, ...prev]);
      setStats((prev) => ({ ...prev, productsCount: prev.productsCount + 1 }));
      setNewProduct({ title: '', grade: '', description: '', price: '', quantity: '1', available: true });
      setShowAddProduct(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add product');
    } finally {
      setAddingProduct(false);
    }
  };

  const inputCls = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition';

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="h-9 bg-gray-200 rounded w-48 mb-8 animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />)}
        </div>
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  const availableCount = products.reduce((sum, p) => sum + (p.available ? 1 : 0), 0);
  const avgOrderValue = stats.totalOrders > 0 ? stats.totalRevenue / stats.totalOrders : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">TC Collectibles · {new Date().toLocaleDateString('en-GB', { dateStyle: 'long' })}</p>
        </div>
        <Link
          href={`/${locale}`}
          className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 hover:border-gray-400 px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5"
        >
          ← Store
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm flex items-center gap-2">
          <span>⚠️</span> {error}
          <button onClick={() => setError(null)} className="ml-auto text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-1 mb-8 bg-gray-100 p-1 rounded-xl w-fit">
        {(['dashboard', 'orders', 'products'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all capitalize ${
              activeTab === tab
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'orders' ? `Orders ${stats.totalOrders > 0 ? `(${stats.totalOrders})` : ''}` : tab === 'products' ? `Products ${stats.productsCount > 0 ? `(${stats.productsCount})` : ''}` : 'Overview'}
          </button>
        ))}
      </div>

      {/* ── DASHBOARD TAB ── */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total Orders"     value={String(stats.totalOrders)}                                                                   icon="📦" color="bg-blue-50" />
            <StatCard label="Total Revenue"    value={`฿${stats.totalRevenue.toLocaleString()}`}                                                    icon="💰" color="bg-emerald-50" />
            <StatCard label="Pending Payment"  value={String(stats.pendingPayment)}                                                                 icon="⏳" color="bg-amber-50" />
            <StatCard label="Total Products"   value={String(stats.productsCount)}                                                                  icon="🃏" color="bg-purple-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Quick Metrics</h2>
              <div className="space-y-4">
                {[
                  { label: 'Avg. Order Value', value: `฿${avgOrderValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}` },
                  { label: 'Awaiting Payment', value: String(stats.pendingPayment), highlight: stats.pendingPayment > 0 },
                  { label: 'Available Inventory', value: `${availableCount} / ${stats.productsCount} items` },
                ].map(({ label, value, highlight }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                    <span className="text-sm text-gray-500">{label}</span>
                    <span className={`text-sm font-bold ${highlight ? 'text-amber-600' : 'text-gray-900'}`}>{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Order Status Breakdown</h2>
              <div className="space-y-2">
                {Object.entries(STATUS_CONFIG).map(([key, _cfg]) => {
                  const count = orders.filter((o) => o.status === key).length;
                  if (count === 0) return null;
                  return (
                    <div key={key} className="flex items-center justify-between py-1.5">
                      <StatusBadge status={key} />
                      <span className="text-sm font-bold text-gray-700">{count}</span>
                    </div>
                  );
                })}
                {orders.length === 0 && <p className="text-sm text-gray-400 py-4 text-center">No orders yet</p>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ── */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {orders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl text-center py-16">
              <p className="text-4xl mb-3">📭</p>
              <p className="text-gray-500 font-medium">No orders yet</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-colors">
                <div className="flex flex-wrap justify-between items-start gap-3 mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</h3>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                      {' · '}
                      {order.phone}
                    </p>
                    {order.shipping_address && (
                      <p className="text-xs text-gray-400 mt-0.5 max-w-xs truncate">{order.shipping_address}</p>
                    )}
                  </div>
                  <p className="font-black text-lg text-purple-600">฿{order.total.toLocaleString()}</p>
                </div>

                {order.status === 'pending_payment' && (
                  <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg flex flex-wrap justify-between items-center gap-3">
                    <p className="text-sm text-amber-800 font-medium">PromptPay received? Mark as paid to trigger confirmation email.</p>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                      disabled={updatingOrder === order.id}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
                    >
                      {updatingOrder === order.id ? 'Updating…' : '✓ Mark as Paid'}
                    </button>
                  </div>
                )}

                {order.status === 'paid' && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex flex-wrap justify-between items-center gap-3">
                    <p className="text-sm text-blue-800 font-medium">Update shipment status:</p>
                    <select
                      defaultValue="processing"
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                    </select>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* ── PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div>
          <div className="flex justify-between items-center mb-5">
            <p className="text-sm text-gray-500">{products.length} product{products.length !== 1 ? 's' : ''} · {availableCount} available</p>
            <button
              onClick={() => setShowAddProduct(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              + Add Product
            </button>
          </div>

          {/* Add Product Modal */}
          {showAddProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Add New Product</h2>
                  <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                </div>
                <form onSubmit={handleAddProduct} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Title *</label>
                    <input type="text" required value={newProduct.title} onChange={(e) => setNewProduct((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Charizard Holographic Base Set" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Grade</label>
                    <input type="text" value={newProduct.grade} onChange={(e) => setNewProduct((p) => ({ ...p, grade: e.target.value }))} placeholder="e.g. PSA 9" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                    <textarea value={newProduct.description} onChange={(e) => setNewProduct((p) => ({ ...p, description: e.target.value }))} placeholder="Optional" rows={2} className={`${inputCls} resize-none`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Price (฿) *</label>
                      <input type="number" required min="0" step="1" value={newProduct.price} onChange={(e) => setNewProduct((p) => ({ ...p, price: e.target.value }))} placeholder="2500" className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Qty *</label>
                      <input type="number" required min="0" step="1" value={newProduct.quantity} onChange={(e) => setNewProduct((p) => ({ ...p, quantity: e.target.value }))} className={inputCls} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={newProduct.available} onChange={(e) => setNewProduct((p) => ({ ...p, available: e.target.checked }))} className="w-4 h-4 accent-purple-600" />
                    <span className="text-sm text-gray-700">List as available for sale</span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={addingProduct} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
                      {addingProduct ? 'Adding…' : 'Add Product'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Product Modal */}
          {editingProduct && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
                <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
                  <h2 className="text-lg font-bold text-gray-900">Edit Product</h2>
                  <button onClick={() => setEditingProduct(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
                </div>
                <form onSubmit={handleEditProduct} className="p-6 space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Title *</label>
                    <input type="text" required value={editForm.title} onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Grade</label>
                    <input type="text" value={editForm.grade} onChange={(e) => setEditForm((p) => ({ ...p, grade: e.target.value }))} placeholder="e.g. PSA 9" className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Description</label>
                    <textarea value={editForm.description} onChange={(e) => setEditForm((p) => ({ ...p, description: e.target.value }))} rows={2} className={`${inputCls} resize-none`} />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Price (฿) *</label>
                      <input type="number" required min="0" step="1" value={editForm.price} onChange={(e) => setEditForm((p) => ({ ...p, price: e.target.value }))} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1.5">Qty *</label>
                      <input type="number" required min="0" step="1" value={editForm.quantity} onChange={(e) => setEditForm((p) => ({ ...p, quantity: e.target.value }))} className={inputCls} />
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" id="edit-available" checked={editForm.available} onChange={(e) => setEditForm((p) => ({ ...p, available: e.target.checked }))} className="w-4 h-4 accent-purple-600" />
                    <span className="text-sm text-gray-700">Listed as available for sale</span>
                  </label>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setEditingProduct(null)} className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors">Cancel</button>
                    <button type="submit" disabled={savingProduct} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors">
                      {savingProduct ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Product List */}
          <div className="space-y-3">
            {products.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl text-center py-16">
                <p className="text-4xl mb-3">📭</p>
                <p className="text-gray-500 font-medium">No products yet</p>
                <button onClick={() => setShowAddProduct(true)} className="mt-4 text-purple-600 hover:text-purple-800 text-sm font-semibold">+ Add your first product</button>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                  {/* Top row: info + edit button */}
                  <div className="flex gap-3 items-center mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <h3 className="font-bold text-gray-900 text-sm truncate">{product.title}</h3>
                        {product.grade && (
                          <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0">{product.grade}</span>
                        )}
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0 ${product.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                          {product.available ? 'Available' : 'Unavailable'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm flex-wrap">
                        <span className="font-black text-purple-600">฿{product.price.toLocaleString()}</span>
                        <span className="text-gray-400 text-xs">Stock: <span className={`font-semibold ${product.quantity > 0 ? 'text-gray-700' : 'text-red-600'}`}>{product.quantity}</span></span>
                      </div>
                    </div>
                    <button
                      onClick={() => openEditModal(product)}
                      className="flex-shrink-0 border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    >
                      ✏️ Edit
                    </button>
                  </div>

                  {/* Image gallery row */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Existing images */}
                    {(product.image_urls && product.image_urls.length > 0
                      ? product.image_urls
                      : product.image_url ? [product.image_url] : []
                    ).map((url, idx) => (
                      <div key={url} className="relative group w-16 h-16 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`${product.title} image ${idx + 1}`} className="w-16 h-16 object-cover rounded-lg border border-gray-200" />
                        {idx === 0 && (
                          <span className="absolute top-0.5 left-0.5 bg-purple-600 text-white text-[9px] font-bold px-1 rounded leading-tight">MAIN</span>
                        )}
                        <button
                          onClick={() => handleDeleteProductImage(product.id, url)}
                          className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs font-bold leading-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}

                    {/* Add image button */}
                    <label className={`w-16 h-16 flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors text-center
                      ${uploadingProductId === product.id
                        ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                        : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50 text-purple-400 hover:text-purple-600'
                      }`}>
                      {uploadingProductId === product.id ? (
                        <span className="text-[10px]">Uploading…</span>
                      ) : (
                        <>
                          <span className="text-xl leading-none">+</span>
                          <span className="text-[10px] font-semibold mt-0.5">Image</span>
                        </>
                      )}
                      <input type="file" accept="image/*" className="hidden" disabled={uploadingProductId === product.id}
                        onChange={(e) => { if (e.target.files?.[0]) { handleUploadProductImage(product.id, e.target.files[0]); e.target.value = ''; } }} />
                    </label>
                  </div>

                  {uploadError && uploadErrorProductId === product.id && (
                    <div className="mt-2 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2">
                      <span className="text-red-500 text-sm flex-shrink-0">⚠️</span>
                      <p className="text-red-700 text-xs font-medium">{uploadError}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
