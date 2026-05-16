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
}

interface Stats {
  totalOrders: number;
  totalRevenue: number;
  pendingPayment: number;
  productsCount: number;
}

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-900 text-yellow-200',
  paid: 'bg-green-900 text-green-200',
  processing: 'bg-blue-900 text-blue-200',
  shipped: 'bg-purple-900 text-purple-200',
  delivered: 'bg-green-900 text-green-200',
  cancelled: 'bg-red-900 text-red-200',
};

const ADMIN_EMAIL = 'techcraftlab.bkk@gmail.com';

export default function AdminPage() {
  const router = useRouter();
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingPayment: 0,
    productsCount: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
          router.push(`/${locale}/auth/login`);
          return;
        }

        if (session.user.email !== ADMIN_EMAIL) {
          router.push(`/${locale}`);
          return;
        }

        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;
        setProducts(productsData || []);

        const totalRevenue = (ordersData || [])
          .filter((o) => o.status !== 'pending_payment' && o.status !== 'cancelled')
          .reduce((sum, o) => sum + o.total, 0);

        const pendingPaymentCount = (ordersData || []).filter((o) => o.status === 'pending_payment').length;

        setStats({
          totalOrders: ordersData?.length || 0,
          totalRevenue,
          pendingPayment: pendingPaymentCount,
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
            await fetch('/api/orders/send-payment-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerEmail: fullOrder.customer_email, customerName: fullOrder.customer_name, orderId: fullOrder.id, orderTotal: fullOrder.total }),
            });
          } else if (newStatus === 'shipped') {
            await fetch('/api/orders/send-shipment-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerEmail: fullOrder.customer_email, customerName: fullOrder.customer_name, orderId: fullOrder.id, shippingAddress: fullOrder.shipping_address }),
            });
          } else if (newStatus === 'delivered') {
            await fetch('/api/orders/send-delivery-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ customerEmail: fullOrder.customer_email, customerName: fullOrder.customer_name, orderId: fullOrder.id, orderTotal: fullOrder.total }),
            });
          }
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }

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

      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);

      const response = await fetch('/api/products/upload-image', { method: 'POST', body: formData });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to upload image');

      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, image_url: data.imageUrl } : p)));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Image upload failed');
    } finally {
      setUploadingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-24 animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2 w-2/3" />
              <div className="h-6 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Link href={`/${locale}`} className="text-sm text-gray-600 hover:text-gray-900 border border-gray-300 px-4 py-2 rounded-lg transition-colors">
          ← Back to Store
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-gray-200">
        {(['dashboard', 'orders', 'products'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 font-semibold border-b-2 transition-colors capitalize ${
              activeTab === tab
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab === 'orders' ? `Orders (${stats.totalOrders})` : tab === 'products' ? `Products (${stats.productsCount})` : 'Dashboard'}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Total Orders</p>
              <p className="text-4xl font-bold text-blue-600">{stats.totalOrders}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Total Revenue</p>
              <p className="text-4xl font-bold text-green-600">฿{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Pending Payment</p>
              <p className="text-4xl font-bold text-yellow-600">{stats.pendingPayment}</p>
            </div>
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <p className="text-gray-500 text-sm mb-1">Total Products</p>
              <p className="text-4xl font-bold text-purple-600">{stats.productsCount}</p>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h2 className="text-xl font-bold mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500">Average Order Value</span>
                <span className="font-bold">฿{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <span className="text-gray-500">Awaiting Payment</span>
                <span className="font-bold text-yellow-600">{stats.pendingPayment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Available Inventory</span>
                <span className="font-bold">{products.reduce((sum, p) => sum + (p.available ? 1 : 0), 0)} items</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl text-center py-12">
              <p className="text-gray-400">No orders yet.</p>
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">Order #{order.id.slice(0, 8)}</h3>
                    <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()} • {order.phone}</p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="font-bold text-blue-600 text-lg">฿{order.total.toLocaleString()}</p>
                    <p className="text-gray-400 text-sm">{order.shipping_address}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                    {order.status}
                  </span>
                </div>
                {order.status === 'pending_payment' && (
                  <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg flex justify-between items-center mt-3">
                    <span className="text-sm text-yellow-800">Mark as paid when PromptPay confirmed:</span>
                    <button
                      onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                      disabled={updatingOrder === order.id}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm font-medium disabled:opacity-50"
                    >
                      {updatingOrder === order.id ? 'Updating...' : 'Mark as Paid'}
                    </button>
                  </div>
                )}
                {order.status === 'paid' && (
                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg flex justify-between items-center mt-3">
                    <span className="text-sm text-blue-800">Update shipment status:</span>
                    <select
                      defaultValue="processing"
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-1 text-sm bg-white"
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

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {products.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl text-center py-12">
              <p className="text-gray-400">No products found.</p>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex gap-4 items-start">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {product.image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image_url} alt={product.title} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-gray-400 text-xs text-center px-1">No image</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 mb-1">{product.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">Grade: {product.grade}</p>
                    <div className="flex items-center gap-4 text-sm flex-wrap">
                      <span className="text-gray-500">Price: <span className="text-blue-600 font-semibold">฿{product.price.toLocaleString()}</span></span>
                      <span className="text-gray-500">Stock: <span className={`${product.quantity > 0 ? 'text-green-600' : 'text-red-600'} font-semibold`}>{product.quantity}</span></span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {product.available ? 'Available' : 'Out of Stock'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <label className={`cursor-pointer border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${uploadingProductId === product.id ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      {uploadingProductId === product.id ? 'Uploading...' : product.image_url ? '↑ Replace Image' : '↑ Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingProductId === product.id}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            handleUploadProductImage(product.id, e.target.files[0]);
                            e.target.value = '';
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
                {uploadError && uploadingProductId === product.id && (
                  <p className="text-red-500 text-xs mt-2">{uploadError}</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
