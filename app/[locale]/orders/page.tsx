'use client';

<<<<<<< HEAD
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Orders() {
  const t = useTranslations();
  const [orders] = useState([]);

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('orders.title')}</h1>

        {orders.length === 0 ? (
          <div className="bg-white border rounded-lg p-8 text-center">
            <p className="text-gray-600">{t('orders.noOrders')}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-bold">{t('orders.orderId')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.date')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.total')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.status')}</th>
                  <th className="text-left py-3 px-4 font-bold">{t('orders.viewDetails')}</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">{order.id}</td>
                    <td className="py-3 px-4">{order.date}</td>
                    <td className="py-3 px-4">฿{order.total}</td>
                    <td className="py-3 px-4">
                      <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm">
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:underline">
                        {t('orders.viewDetails')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
=======
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/hooks/useToast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Card from '@/components/Card';
import Button from '@/components/Button';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  products?: { title: string; grade: string } | null;
}

interface Order {
  id: string;
  user_id: string;
  total_thb: number;
  status: string;
  shipping_address: string;
  phone: string;
  shipping_note: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
}

const STATUS_COLORS: Record<string, string> = {
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('pages.orders');
  const tToasts = useTranslations('toasts');
  const { toast } = useToast();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          router.push(`/${locale}/auth/login`);
          return;
        }

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
        setError(err instanceof Error ? err.message : locale === 'en' ? 'Failed to load orders' : 'ไม่สามารถโหลดคำสั่งซื้อ');
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndOrders();
  }, [locale, router]);

  useEffect(() => {
    if (error) {
      toast.error(tToasts('orders.load_error.message'), { description: tToasts('orders.load_error.description') });
    }
  }, [error, toast, tToasts]);

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_payment: t('status_pending'),
      paid: locale === 'en' ? 'Payment Received' : 'ได้รับการชำระเงิน',
      processing: t('status_processing'),
      shipped: t('status_shipped'),
      delivered: t('status_delivered'),
      cancelled: t('status_cancelled'),
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
        <div className="space-y-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-6 animate-pulse">
              <div className="flex justify-between items-center mb-4">
                <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/3" />
                <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-20" />
              </div>
              <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 rounded w-1/2" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-gray-600 text-lg mb-6">{t('empty')}</p>
          <Link href={`/${locale}/products`}>
            <Button>{t('start_shopping')}</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
            >
              {/* Order Header */}
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-bold text-gray-900">
                      {t('order_id')}: #{order.id.slice(0, 8).toUpperCase()}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {getStatusLabel(order.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {new Date(order.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'th-TH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>

                <div className="text-right mr-4">
                  <p className="text-gray-600 text-sm mb-1">
                    {(orderItems[order.id] || []).length} {locale === 'en' ? 'item(s)' : 'รายการ'}
                  </p>
                  <p className="font-bold text-blue-600 text-lg">฿{order.total_thb.toLocaleString()}</p>
                </div>

                <div className="text-gray-400">{expandedOrder === order.id ? '▼' : '▶'}</div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedOrder === order.id && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  {/* Order Items */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {locale === 'en' ? 'Order Items' : 'สินค้าในคำสั่ง'}
                    </h4>
                    <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                      {(orderItems[order.id] || []).map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm border-b border-gray-200 last:border-0 pb-2 last:pb-0">
                          <div>
                            <p className="text-gray-900 font-medium">
                              {item.products?.title || `${locale === 'en' ? 'Product' : 'สินค้า'} #${item.product_id.slice(0, 8)}`}
                            </p>
                            <p className="text-gray-600 text-xs">
                              {item.products?.grade ? `Grade: ${item.products.grade} · ` : ''}{locale === 'en' ? 'Qty' : 'จำนวน'}: {item.quantity}
                            </p>
                          </div>
                          <p className="text-gray-900 font-semibold">
                            ฿{(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Shipping Information */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">
                      {t('track') ? locale === 'en' ? 'Shipping Address' : 'ที่อยู่การจัดส่ง' : ''}
                    </h4>
                    <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700">
                      <p className="mb-2 font-medium">{order.customer_name}</p>
                      <p className="mb-1">{order.shipping_address}</p>
                      <p className="text-gray-600">{locale === 'en' ? 'Phone' : 'โทรศัพท์'}: {order.phone}</p>
                      {order.shipping_note && (
                        <p className="mt-2 text-gray-600 italic">
                          {locale === 'en' ? 'Note' : 'หมายเหตุ'}: {order.shipping_note}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-4">
                    {order.status === 'pending_payment' && (
                      <Link href={`/${locale}/payment/${order.id}`} className="flex-1">
                        <Button className="w-full" variant="primary">
                          {locale === 'en' ? 'Pay Now' : 'ชำระเงินตอนนี้'}
                        </Button>
                      </Link>
                    )}
                    <Link href={`/${locale}/products`} className="flex-1">
                      <Button className="w-full" variant="outline">
                        {locale === 'en' ? 'Continue Shopping' : 'เลือกสินค้าต่อ'}
                      </Button>
                    </Link>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
    </div>
  );
}
