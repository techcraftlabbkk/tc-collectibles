'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
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

export default function AdminPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products'>('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats>({
    totalOrders: 0,
    totalRevenue: 0,
    pendingPayment: 0,
    productsCount: 0,
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          router.push('/auth/login');
          return;
        }

        // Check if user is admin (for now, we'll just allow access - in production, check role)
        setUser(session.user);

        // Fetch all orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData || []);

        // Fetch all products
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (productsError) throw productsError;

        setProducts(productsData || []);

        // Calculate stats
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
  }, [router]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);

      // Get order details for email
      const orderToUpdate = orders.find((o) => o.id === orderId);
      if (!orderToUpdate) throw new Error('Order not found');

      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

      if (error) throw error;

      // Send appropriate email based on status change
      try {
        // Fetch full order with customer info
        const { data: fullOrder, error: fetchError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (!fetchError && fullOrder) {
          if (newStatus === 'paid') {
            // Send payment received email
            await fetch('/api/orders/send-payment-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerEmail: fullOrder.customer_email,
                customerName: fullOrder.customer_name,
                orderId: fullOrder.id,
                orderTotal: fullOrder.total,
              }),
            });
          } else if (newStatus === 'shipped') {
            // Send shipment email
            await fetch('/api/orders/send-shipment-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerEmail: fullOrder.customer_email,
                customerName: fullOrder.customer_name,
                orderId: fullOrder.id,
                shippingAddress: fullOrder.shipping_address,
              }),
            });
          } else if (newStatus === 'delivered') {
            // Send delivery email
            await fetch('/api/orders/send-delivery-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                customerEmail: fullOrder.customer_email,
                customerName: fullOrder.customer_name,
                orderId: fullOrder.id,
                orderTotal: fullOrder.total,
              }),
            });
          }
        }
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
        // Don't fail the order update if email fails
      }

      // Update local state
      setOrders((prevOrders) => prevOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
    } finally {
      setUpdatingOrder(null);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card h-24 animate-pulse">
              <div className="h-4 bg-dark-800 rounded mb-2 w-2/3" />
              <div className="h-6 bg-dark-800 rounded" />
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
        <Link href="/" className="btn btn-secondary">
          Back to Store
        </Link>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-4 mb-8 border-b border-dark-800">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'dashboard'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Orders ({stats.totalOrders})
        </button>
        <button
          onClick={() => setActiveTab('products')}
          className={`px-4 py-2 font-semibold border-b-2 transition-colors ${
            activeTab === 'products'
              ? 'border-blue-500 text-blue-400'
              : 'border-transparent text-gray-400 hover:text-gray-300'
          }`}
        >
          Products ({stats.productsCount})
        </button>
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Total Orders</p>
              <p className="text-4xl font-bold text-blue-400">{stats.totalOrders}</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
              <p className="text-4xl font-bold text-green-400">฿{stats.totalRevenue.toLocaleString()}</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Pending Payment</p>
              <p className="text-4xl font-bold text-yellow-400">{stats.pendingPayment}</p>
            </div>
            <div className="card">
              <p className="text-gray-400 text-sm mb-2">Total Products</p>
              <p className="text-4xl font-bold text-purple-400">{stats.productsCount}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Quick Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center pb-3 border-b border-dark-800">
                <span className="text-gray-400">Average Order Value</span>
                <span className="font-bold text-lg">
                  ฿{stats.totalOrders > 0 ? (stats.totalRevenue / stats.totalOrders).toLocaleString(undefined, { maximumFractionDigits: 0 }) : 0}
                </span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-dark-800">
                <span className="text-gray-400">Orders Awaiting Payment</span>
                <span className="font-bold text-lg text-yellow-400">{stats.pendingPayment}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Inventory Items</span>
                <span className="font-bold text-lg">
                  {products.reduce((sum, p) => sum + (p.available ? 1 : 0), 0)} available
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">No orders yet.</p>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="card">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">Order #{order.id.slice(0, 8)}</h3>
                      <p className="text-sm text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()} • {order.phone}
                      </p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="font-bold text-blue-400 text-lg">฿{order.total.toLocaleString()}</p>
                      <p className="text-gray-500 text-sm">{order.shipping_address}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-700'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {order.status === 'pending_payment' && (
                    <div className="bg-dark-800 p-3 rounded flex justify-between items-center">
                      <span className="text-sm text-gray-400">Mark as paid when PromptPay confirmed:</span>
                      <button
                        onClick={() => handleUpdateOrderStatus(order.id, 'paid')}
                        disabled={updatingOrder === order.id}
                        className="btn bg-green-600 hover:bg-green-700 text-white px-4 py-1 text-sm"
                      >
                        {updatingOrder === order.id ? 'Updating...' : 'Mark as Paid'}
                      </button>
                    </div>
                  )}

                  {order.status === 'paid' && (
                    <div className="bg-dark-800 p-3 rounded flex justify-between items-center">
                      <span className="text-sm text-gray-400">Update shipment status:</span>
                      <select
                        defaultValue="processing"
                        onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                        className="bg-dark-700 border border-dark-600 rounded px-3 py-1 text-sm"
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
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="card text-center py-12">
                <p className="text-gray-400">No products found.</p>
              </div>
            ) : (
              products.map((product) => (
                <div key={product.id} className="card">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{product.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">Grade: {product.grade}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">Price: <span className="text-blue-400 font-semibold">฿{product.price.toLocaleString()}</span></span>
                        <span className="text-gray-400">Stock: <span className={product.quantity > 0 ? 'text-green-400' : 'text-red-400'} className="font-semibold">{product.quantity}</span></span>
                        <span className={`px-2 py-1 rounded text-xs ${product.available ? 'bg-green-900 text-green-200' : 'bg-red-900 text-red-200'}`}>
                          {product.available ? 'Available' : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
