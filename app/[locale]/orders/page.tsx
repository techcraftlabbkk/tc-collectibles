'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

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
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid:            'bg-green-100 text-green-800',
  processing:      'bg-blue-100 text-blue-800',
  shipped:         'bg-emerald-100 text-emerald-800',
  delivered:       'bg-green-100 text-green-800',
  cancelled:       'bg-red-100 text-red-800',
};

const STATUS_LABELS: Record<string, string> = {
  pending_payment: 'Awaiting Payment',
  paid:            'Payment Received',
  processing:      'Processing',
  shipped:         'Shipped',
  delivered:       'Delivered',
  cancelled:       'Cancelled',
};

export default function Orders() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use getUser() to validate token server-side (more reliable than getSession()
        // which reads stale localStorage state that may not match the active JWT)
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) { router.push(`/${locale}/auth/login`); return; }

        // Let RLS handle user filtering — avoids silent empty-result bug when
        // session.user.id is undefined or stale (matches admin page pattern)
        const { data: ordersData, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .order('created_at', { ascending: false });

        if (ordersError) throw ordersError;
        setOrders(ordersData || []);

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

    fetchOrders();
  }, [router, locale]);

  if (loading) {
    return (
      <div className="w-full px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">{t('orders.title')}</h1>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white border rounded-2xl p-6 animate-pulse">
                <div className="h-4 bg-gray-100 rounded mb-3 w-1/3" />
                <div className="h-4 bg-gray-100 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('orders.title')}</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bg-white border rounded-2xl p-10 text-center">
            <p className="text-gray-500 text-lg mb-4">{t('orders.noOrders')}</p>
            <Link href={`/${locale}/products`} className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-700 transition">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white border-2 border-emerald-100 rounded-2xl p-6">
                {/* Order Header */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-gray-900">{t('orders.orderId')} #{order.id.slice(0, 8)}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">
                      {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div className="text-right mr-4">
                    <p className="text-sm text-gray-400">{(orderItems[order.id] || []).length} item(s)</p>
                    <p className="font-black text-emerald-600 text-lg">฿{order.total.toLocaleString()}</p>
                  </div>
                  <span className="text-gray-400 text-sm">{expandedOrder === order.id ? '▼' : '▶'}</span>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.id && (
                  <div className="mt-5 pt-5 border-t-2 border-emerald-50 space-y-4">
                    {/* Items */}
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-widest">Items</h4>
                      <div className="space-y-2 bg-gray-50 rounded-xl p-4">
                        {(orderItems[order.id] || []).map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <div>
                              <p className="text-gray-800 font-medium">{item.products?.title || `Product #${item.product_id.slice(0, 8)}`}</p>
                              <p className="text-gray-500 text-xs">
                                {item.products?.grade ? `${item.products.grade} · ` : ''}Qty: {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-gray-700">฿{(item.price_at_purchase * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Shipping */}
                    <div>
                      <h4 className="font-bold text-gray-700 mb-2 text-sm uppercase tracking-widest">Shipping</h4>
                      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                        <p>{order.shipping_address}</p>
                        <p className="text-gray-400 mt-1">Phone: {order.phone}</p>
                        {order.shipping_note && <p className="text-gray-400 mt-1">Note: {order.shipping_note}</p>}
                      </div>
                    </div>

                    {/* Actions */}
                    {order.status === 'pending_payment' && (
                      <Link
                        href={`/${locale}/payment/${order.id}`}
                        className="block w-full text-center bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 py-3 rounded-xl font-bold transition"
                      >
                        Complete Payment →
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href={`/${locale}/products`} className="text-emerald-600 hover:underline font-medium">
            Continue Shopping →
          </Link>
        </div>
      </div>
    </div>
  );
}
