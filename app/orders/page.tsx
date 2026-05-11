'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  products?: { title: string; grade: string } | null;
}

interface Order {
  id: string;
  user_id: string;
  total: number;
  status: string;
  shipping_address: string;
  phone: string;
  shipping_note: string;
  created_at: string;
  updated_at: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-900 text-yellow-200',
  paid: 'bg-green-900 text-green-200',
  processing: 'bg-blue-900 text-blue-200',
  shipped: 'bg-purple-900 text-purple-200',
  delivered: 'bg-green-900 text-green-200',
  cancelled: 'bg-red-900 text-red-200',
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Awaiting Payment',
  paid: 'Payment Received',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_user, setUser] = useState<any>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    const fetchUserAndOrders = async () => {
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

        setUser(session.user);

        // Fetch user's orders
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;

        setOrders(ordersData || []);

        // Fetch order items for each order
        if (ordersData && ordersData.length > 0) {
          const itemsMap: Record<string, OrderItem[]> = {};

          for (const order of ordersData) {
            const { data: itemsData, error: itemsError } = await supabase
              .from('order_items')
              .select('*, products(title, grade)')
              .eq('order_id', order.id);

            if (itemsError) throw itemsError;
            itemsMap[order.id] = itemsData || [];
          }

          setOrderItems(itemsMap);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card h-32 animate-pulse">
              <div className="h-4 bg-dark-800 rounded mb-2 w-1/3" />
              <div className="h-4 bg-dark-800 rounded mb-2 w-1/4" />
              <div className="h-4 bg-dark-800 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {error && (
        <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg mb-4">You haven&apos;t placed any orders yet.</p>
          <Link href="/products" className="btn btn-primary inline-block">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card">
              {/* Order Header */}
              <div
                className="flex justify-between items-center cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-bold text-white">Order #{order.id.slice(0, 8)}</h3>
                    <span className={`px-3 py-1 rounded text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-700 text-gray-200'}`}>
                      {STATUS_LABELS[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">
                    {new Date(order.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-400 text-sm mb-1">{(orderItems[order.id] || []).length} item(s)</p>
                  <p className="font-bold text-blue-400 text-lg">฿{order.total.toLocaleString()}</p>
                </div>

                <div className="ml-6 text-gray-400">{expandedOrder === order.id ? '▼' : '▶'}</div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order.id && (
                <div className="mt-6 pt-6 border-t border-dark-800 space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Order Items</h4>
                    <div className="space-y-2 bg-dark-800 rounded p-4">
                      {(orderItems[order.id] || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <div>
                            <p className="text-gray-300">{item.products?.title || `Product #${item.product_id.slice(0, 8)}`}</p>
                            <p className="text-gray-500 text-xs">
                              {item.products?.grade ? `Grade: ${item.products.grade} · ` : ''}Qty: {item.quantity}
                            </p>
                          </div>
                          <p className="text-gray-300 font-semibold">฿{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Shipping Address</h4>
                    <div className="bg-dark-800 rounded p-4 text-sm text-gray-300">
                      <p className="mb-2">{order.shipping_address}</p>
                      <p className="text-gray-500">Phone: {order.phone}</p>
                      {order.shipping_note && (
                        <p className="mt-2 text-gray-500">Notes: {order.shipping_note}</p>
                      )}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div>
                    <h4 className="font-semibold text-white mb-3">Order Summary</h4>
                    <div className="bg-dark-800 rounded p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Subtotal</span>
                        <span className="text-gray-300">฿{order.total.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">Shipping</span>
                        <span className="text-yellow-400">TBD</span>
                      </div>
                      <div className="border-t border-dark-700 pt-2 mt-2 flex justify-between font-bold">
                        <span className="text-white">Total</span>
                        <span className="text-blue-400">฿{order.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  {order.status === 'pending_payment' && (
                    <Link href={`/payment/${order.id}`} className="btn btn-primary w-full text-center block">
                      Complete Payment
                    </Link>
                  )}

                  {order.status === 'delivered' && (
                    <button className="btn btn-secondary w-full">Leave Review</button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Continue Shopping Link */}
      <div className="text-center mt-8">
        <Link href="/products" className="text-blue-400 hover:text-blue-300">
          Continue Shopping →
        </Link>
      </div>
    </div>
  );
}
