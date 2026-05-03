'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/hooks/useToast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loading from '@/components/Loading';
import Modal from '@/components/Modal';
import { getAdminUser } from '@/lib/adminHelpers';

interface Order {
  id: string;
  user_id: string;
  total_thb: number;
  status: string;
  shipping_address: string;
  phone: string;
  customer_name: string;
  customer_email: string;
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
  pending_payment: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function AdminPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations('pages.admin');
  const tToasts = useTranslations('toasts');
  const tModals = useTranslations('modals');
  const { toast } = useToast();

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
  const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: string; newStatus: string } | null>(null);

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
          router.push(`/${locale}/auth/login`);
          return;
        }

        // Check if user is an admin
        const adminUser = await getAdminUser(session.user.id);
        if (!adminUser) {
          toast.error(tToasts('admin.access_denied.message'), { description: tToasts('admin.access_denied.description') });
          setError(locale === 'en' ? 'Access denied. You are not an admin.' : 'การเข้าถึงถูกปฏิเสธ คุณไม่ใช่ผู้จัดการ');
          setTimeout(() => {
            router.push(`/${locale}`);
          }, 2000);
          return;
        }

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
          .reduce((sum, o) => sum + (o.total_thb || 0), 0);

        const pendingPaymentCount = (ordersData || []).filter((o) => o.status === 'pending_payment').length;

        setStats({
          totalOrders: ordersData?.length || 0,
          totalRevenue,
          pendingPayment: pendingPaymentCount,
          productsCount: productsData?.length || 0,
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : locale === 'en' ? 'Failed to load admin data' : 'ไม่สามารถโหลดข้อมูลผู้จัดการ'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [locale, router]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);

      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

      if (error) {
        toast.error(tToasts('admin.update_error.message'), { description: tToasts('admin.update_error.description') });
        throw error;
      }

      // Update local state
      toast.success(tToasts('admin.updated'));
      setOrders((prevOrders) => prevOrders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      setError(err instanceof Error ? err.message : locale === 'en' ? 'Failed to update order' : 'ไม่สามารถอัพเดตคำสั่ง');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const handleConfirmStatusChange = async () => {
    if (pendingStatusChange) {
      await handleUpdateOrderStatus(pendingStatusChange.orderId, pendingStatusChange.newStatus);
      setPendingStatusChange(null);
    }
  };

  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending_payment: t('order_status') || locale === 'en' ? 'Awaiting Payment' : 'รอการชำระเงิน',
      paid: locale === 'en' ? 'Payment Received' : 'ได้รับการชำระเงิน',
      processing: locale === 'en' ? 'Processing' : 'กำลังประมวลผล',
      shipped: locale === 'en' ? 'Shipped' : 'ส่งแล้ว',
      delivered: locale === 'en' ? 'Delivered' : 'ส่งถึงแล้ว',
      cancelled: locale === 'en' ? 'Cancelled' : 'ยกเลิกแล้ว',
    };
    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-24 flex items-center justify-center">
              <Loading type="spinner" size="sm" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
        <Link href={`/${locale}`}>
          <Button variant="outline">{locale === 'en' ? 'Back to Store' : 'กลับไปที่ร้านค้า'}</Button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex gap-6 border-b border-gray-200">
        {(['dashboard', 'orders', 'products'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'dashboard' && t('dashboard')}
            {tab === 'orders' && `${t('orders')} (${stats.totalOrders})`}
            {tab === 'products' && `${t('products')} (${stats.productsCount})`}
          </button>
        ))}
      </div>

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Revenue */}
          <Card shadow="md">
            <p className="text-gray-600 text-sm font-medium">{t('total_revenue')}</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">฿{stats.totalRevenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">
              {locale === 'en' ? 'From paid orders' : 'จากคำสั่งที่จ่ายแล้ว'}
            </p>
          </Card>

          {/* Total Orders */}
          <Card shadow="md">
            <p className="text-gray-600 text-sm font-medium">{t('total_orders')}</p>
            <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalOrders}</p>
            <p className="text-xs text-gray-500 mt-2">
              {locale === 'en' ? 'All time' : 'ตลอดเวลา'}
            </p>
          </Card>

          {/* Pending Payment */}
          <Card shadow="md">
            <p className="text-gray-600 text-sm font-medium">{t('pending_payment')}</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pendingPayment}</p>
            <p className="text-xs text-gray-500 mt-2">
              {locale === 'en' ? 'Awaiting payment' : 'รอการชำระเงิน'}
            </p>
          </Card>

          {/* Total Products */}
          <Card shadow="md">
            <p className="text-gray-600 text-sm font-medium">{t('total_products')}</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.productsCount}</p>
            <p className="text-xs text-gray-500 mt-2">
              {locale === 'en' ? 'In catalog' : 'ในแค็ตตาล็อก'}
            </p>
          </Card>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">{t('no_orders')}</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('order_id')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {locale === 'en' ? 'Customer' : 'ลูกค้า'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('total')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('status')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {locale === 'en' ? 'Date' : 'วันที่'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('view_details')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{order.customer_name}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ฿{order.total_thb.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={order.status}
                          onChange={(e) => setPendingStatusChange({ orderId: order.id, newStatus: e.target.value })}
                          disabled={updatingOrder === order.id}
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'
                          } border-0 cursor-pointer`}
                        >
                          <option value="pending_payment">{getStatusLabel('pending_payment')}</option>
                          <option value="paid">{getStatusLabel('paid')}</option>
                          <option value="processing">{getStatusLabel('processing')}</option>
                          <option value="shipped">{getStatusLabel('shipped')}</option>
                          <option value="delivered">{getStatusLabel('delivered')}</option>
                          <option value="cancelled">{getStatusLabel('cancelled')}</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString(locale === 'en' ? 'en-US' : 'th-TH')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="sm" variant="outline">
                          {t('view_details')}
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          {products.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">{locale === 'en' ? 'No products found' : 'ไม่พบสินค้า'}</p>
            </Card>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {locale === 'en' ? 'Title' : 'ชื่อ'}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('grade')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('price')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {t('quantity')}
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {locale === 'en' ? 'Status' : 'สถานะ'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.grade}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ฿{product.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{product.quantity}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            product.available ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {product.available ? (locale === 'en' ? 'Available' : 'มี') : locale === 'en' ? 'Out of Stock' : 'หมด'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Status Change Confirmation Modal */}
      <Modal
        isOpen={pendingStatusChange !== null}
        onClose={() => setPendingStatusChange(null)}
        onConfirm={handleConfirmStatusChange}
        isDanger
        title={tModals('admin.statusChange.title')}
        description={tModals('admin.statusChange.description')}
        confirmButtonText={tModals('admin.statusChange.confirm')}
        closeButtonText={tModals('admin.statusChange.cancel')}
      />
    </div>
  );
}
