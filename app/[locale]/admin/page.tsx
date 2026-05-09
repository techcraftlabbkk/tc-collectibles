'use client';

import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
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
  image_url?: string | null;
}

interface Payment {
  id: string;
  order_id: string;
  method: string;
  proof_image_url: string | null;
  status: 'pending' | 'verified' | 'rejected';
  admin_notes: string | null;
  verified_at: string | null;
  created_at: string;
  order?: Order;
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

  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'products' | 'payments'>('dashboard');
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{ orderId: string; newStatus: string } | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [paymentNotes, setPaymentNotes] = useState<string>('');
  const [uploadingProductId, setUploadingProductId] = useState<string | null>(null);

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

        // Fetch all payments with order details
        const { data: paymentsData, error: paymentsError } = await supabase
          .from('payments')
          .select('*, orders(*)')
          .order('created_at', { ascending: false });

        if (paymentsError) throw paymentsError;

        setPayments(paymentsData || []);

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
  }, [locale, router, tToasts, toast]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrder(orderId);

      const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', orderId);

      if (error) {
        toast.error(tToasts('admin.update_error.message'), { description: tToasts('admin.update_error.description') });
        throw error;
      }

      // Send shipment or delivery email when status changes
      const order = orders.find((o) => o.id === orderId);
      if (order) {
        try {
          if (newStatus === 'shipped') {
            // Send shipment email
            await fetch('/api/orders/send-shipment-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.id,
                customerEmail: order.customer_email,
                customerName: order.customer_name,
                orderTotal: order.total_thb,
                shippingAddress: order.shipping_address,
              }),
            });
          } else if (newStatus === 'delivered') {
            // Send delivery email
            await fetch('/api/orders/send-delivery-email', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: order.id,
                customerEmail: order.customer_email,
                customerName: order.customer_name,
                orderTotal: order.total_thb,
              }),
            });
          }
        } catch (emailErr) {
          console.error('[EMAIL] Failed to send status update email:', emailErr);
          // Don't throw - order status was updated successfully
        }
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

  const handleApprovePayment = async (paymentId: string) => {
    try {
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) return;

      // Update payment status to verified
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'verified',
          verified_at: new Date().toISOString(),
          admin_notes: paymentNotes,
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      // Update order status to payment_received
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'payment_received' })
        .eq('id', payment.order_id);

      if (orderError) throw orderError;

      // Send payment received email to customer
      const order = orders.find((o) => o.id === payment.order_id);
      if (order) {
        try {
          await fetch('/api/email/send-payment-verified', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: order.id,
              customerEmail: order.customer_email,
              customerName: order.customer_name,
              orderTotal: order.total_thb,
            }),
          });
        } catch (emailErr) {
          console.error('[EMAIL] Failed to send payment verified email:', emailErr);
        }
      }

      toast.success(tToasts('admin.payment_approved'));
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? {
                ...p,
                status: 'verified',
                verified_at: new Date().toISOString(),
                admin_notes: paymentNotes,
              }
            : p
        )
      );
      setSelectedPayment(null);
      setPaymentNotes('');

      // Refresh orders to update stats
      const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (ordersData) {
        setOrders(ordersData);
        const totalRevenue = (ordersData || [])
          .filter((o) => o.status !== 'pending_payment' && o.status !== 'cancelled')
          .reduce((sum, o) => sum + (o.total_thb || 0), 0);
        const pendingPaymentCount = (ordersData || []).filter((o) => o.status === 'pending_payment').length;
        setStats((prev) => ({
          ...prev,
          totalRevenue,
          pendingPayment: pendingPaymentCount,
        }));
      }
    } catch (err) {
      toast.error(tToasts('admin.update_error.message'));
      setError(err instanceof Error ? err.message : 'Failed to approve payment');
    }
  };

  const handleRejectPayment = async (paymentId: string) => {
    try {
      const payment = payments.find((p) => p.id === paymentId);
      if (!payment) return;

      // Update payment status to rejected
      const { error: paymentError } = await supabase
        .from('payments')
        .update({
          status: 'rejected',
          admin_notes: paymentNotes,
        })
        .eq('id', paymentId);

      if (paymentError) throw paymentError;

      toast.success(tToasts('admin.payment_rejected'));
      setPayments((prev) =>
        prev.map((p) =>
          p.id === paymentId
            ? { ...p, status: 'rejected', admin_notes: paymentNotes }
            : p
        )
      );
      setSelectedPayment(null);
      setPaymentNotes('');
    } catch (err) {
      toast.error(tToasts('admin.update_error.message'));
      setError(err instanceof Error ? err.message : 'Failed to reject payment');
    }
  };

  const handleUploadProductImage = async (productId: string, file: File) => {
    try {
      setUploadingProductId(productId);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('productId', productId);

      const response = await fetch('/api/products/upload-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const { imageUrl } = await response.json();

      // Update local state
      setProducts((prevProducts) =>
        prevProducts.map((p) =>
          p.id === productId ? { ...p, image_url: imageUrl } : p
        )
      );

      toast.success(locale === 'en' ? 'Image uploaded successfully' : 'อัปโหลดรูปภาพสำเร็จ');
    } catch (err) {
      toast.error(locale === 'en' ? 'Failed to upload image' : 'ไม่สามารถอัปโหลดรูปภาพ');
      setError(err instanceof Error ? err.message : 'Image upload error');
    } finally {
      setUploadingProductId(null);
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
      <div className="flex gap-6 border-b border-gray-200 overflow-x-auto">
        {(['dashboard', 'orders', 'payments', 'products'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab === 'dashboard' && t('dashboard')}
            {tab === 'orders' && `${t('orders')} (${stats.totalOrders})`}
            {tab === 'payments' && `${locale === 'en' ? 'Payments' : 'การชำระเงิน'} (${payments.filter((p) => p.status === 'pending').length})`}
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

      {/* Payments Tab */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          {payments.length === 0 ? (
            <Card className="text-center py-12">
              <p className="text-gray-600">{locale === 'en' ? 'No payments found' : 'ไม่พบการชำระเงิน'}</p>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Pending Payments */}
              {payments.filter((p) => p.status === 'pending').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    {locale === 'en' ? 'Pending Verification' : 'รอการยืนยัน'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-yellow-50">
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
                            {locale === 'en' ? 'Proof' : 'หลักฐาน'}
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                            {locale === 'en' ? 'Actions' : 'การกระทำ'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments
                          .filter((p) => p.status === 'pending')
                          .map((payment) => (
                            <tr key={payment.id} className="border-b border-gray-200 hover:bg-yellow-50">
                              <td className="px-6 py-4 text-sm font-mono text-gray-900">
                                {payment.order_id.slice(0, 8)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {orders.find((o) => o.id === payment.order_id)?.customer_name}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                ฿{(orders.find((o) => o.id === payment.order_id)?.total_thb || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {payment.proof_image_url ? (
                                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                                    {locale === 'en' ? 'Uploaded' : 'อัพโหลดแล้ว'}
                                  </span>
                                ) : (
                                  <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                                    {locale === 'en' ? 'Pending' : 'รอดำเนิน'}
                                  </span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                <Button
                                  size="sm"
                                  onClick={() => setSelectedPayment(payment)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  {locale === 'en' ? 'Review' : 'ตรวจสอบ'}
                                </Button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Verified Payments */}
              {payments.filter((p) => p.status === 'verified').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">
                    {locale === 'en' ? 'Verified Payments' : 'การชำระเงินที่ยืนยัน'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-green-50">
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
                            {locale === 'en' ? 'Verified At' : 'ยืนยันเมื่อ'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments
                          .filter((p) => p.status === 'verified')
                          .map((payment) => (
                            <tr key={payment.id} className="border-b border-gray-200 hover:bg-green-50">
                              <td className="px-6 py-4 text-sm font-mono text-gray-900">
                                {payment.order_id.slice(0, 8)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {orders.find((o) => o.id === payment.order_id)?.customer_name}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                ฿{(orders.find((o) => o.id === payment.order_id)?.total_thb || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {payment.verified_at ? new Date(payment.verified_at).toLocaleDateString() : '-'}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Rejected Payments */}
              {payments.filter((p) => p.status === 'rejected').length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-8">
                    {locale === 'en' ? 'Rejected Payments' : 'การชำระเงินที่ถูกปฏิเสธ'}
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200 bg-red-50">
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
                            {locale === 'en' ? 'Reason' : 'เหตุผล'}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments
                          .filter((p) => p.status === 'rejected')
                          .map((payment) => (
                            <tr key={payment.id} className="border-b border-gray-200 hover:bg-red-50">
                              <td className="px-6 py-4 text-sm font-mono text-gray-900">
                                {payment.order_id.slice(0, 8)}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {orders.find((o) => o.id === payment.order_id)?.customer_name}
                              </td>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                ฿{(orders.find((o) => o.id === payment.order_id)?.total_thb || 0).toLocaleString()}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">{payment.admin_notes || '-'}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
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
                      {locale === 'en' ? 'Image' : 'รูปภาพ'}
                    </th>
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
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      {locale === 'en' ? 'Upload' : 'อัปโหลด'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="px-6 py-4">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.title}
                            className="w-12 h-12 object-cover rounded"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">No image</span>
                          </div>
                        )}
                      </td>
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
                      <td className="px-6 py-4 text-sm">
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              if (e.target.files?.[0]) {
                                setUploadingProductId(product.id);
                                handleUploadProductImage(product.id, e.target.files[0]);
                              }
                            }}
                            disabled={uploadingProductId === product.id}
                            className="hidden"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={uploadingProductId === product.id}
                          >
                            {uploadingProductId === product.id
                              ? (locale === 'en' ? 'Uploading...' : 'กำลังอัปโหลด...')
                              : (locale === 'en' ? 'Upload' : 'อัปโหลด')}
                          </Button>
                        </label>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Payment Verification Modal */}
      <Modal
        isOpen={selectedPayment !== null}
        onClose={() => {
          setSelectedPayment(null);
          setPaymentNotes('');
        }}
        isDanger={false}
        title={locale === 'en' ? 'Review Payment' : 'ตรวจสอบการชำระเงิน'}
        description={locale === 'en' ? 'Review the payment proof and approve or reject' : 'ตรวจสอบหลักฐานการชำระเงินและอนุมัติหรือปฏิเสธ'}
      >
        {selectedPayment && (
          <div className="space-y-4">
            {/* Payment Details */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 font-semibold">{locale === 'en' ? 'Order ID' : 'ID คำสั่ง'}</p>
                <p className="text-sm font-mono text-gray-900">{selectedPayment.order_id.slice(0, 8)}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">{locale === 'en' ? 'Method' : 'วิธีการ'}</p>
                <p className="text-sm text-gray-900 capitalize">{selectedPayment.method}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">{locale === 'en' ? 'Amount' : 'จำนวน'}</p>
                <p className="text-sm font-semibold text-gray-900">
                  ฿{(orders.find((o) => o.id === selectedPayment.order_id)?.total_thb || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600 font-semibold">{locale === 'en' ? 'Submitted' : 'ส่งเมื่อ'}</p>
                <p className="text-sm text-gray-900">{new Date(selectedPayment.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Payment Proof Image */}
            {selectedPayment.proof_image_url && (
              <div>
                <p className="text-xs text-gray-600 font-semibold mb-2">{locale === 'en' ? 'Payment Proof' : 'หลักฐานการชำระเงิน'}</p>
                <div className="relative w-full h-80 border border-gray-200 rounded-lg overflow-hidden">
                  <Image
                    src={selectedPayment.proof_image_url}
                    alt="Payment proof"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Admin Notes */}
            <div>
              <label className="block text-xs text-gray-600 font-semibold mb-2">
                {locale === 'en' ? 'Admin Notes' : 'หมายเหตุของผู้จัดการ'}
              </label>
              <textarea
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                placeholder={locale === 'en' ? 'Add notes...' : 'เพิ่มหมายเหตุ...'}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
                rows={3}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedPayment(null);
                  setPaymentNotes('');
                }}
              >
                {locale === 'en' ? 'Cancel' : 'ยกเลิก'}
              </Button>
              <Button
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                onClick={() => handleRejectPayment(selectedPayment.id)}
              >
                {locale === 'en' ? 'Reject' : 'ปฏิเสธ'}
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                onClick={() => handleApprovePayment(selectedPayment.id)}
              >
                {locale === 'en' ? 'Approve' : 'อนุมัติ'}
              </Button>
            </div>
          </div>
        )}
      </Modal>

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
