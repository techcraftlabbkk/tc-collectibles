'use client';

<<<<<<< HEAD
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Payment({ params }: { params: { orderId: string } }) {
  const t = useTranslations();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">{t('payment.title')}</h1>

        <div className="bg-white border rounded-lg p-8">
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">{t('payment.promptpay')}</h2>
            <p className="text-gray-600 mb-4">{t('payment.scanQR')}</p>

            {qrCode ? (
              <div className="flex justify-center mb-8">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">{t('common.loading')}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center mb-8">
                <div className="bg-gray-200 w-48 h-48 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400">{t('common.loading')}</span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4 border-t pt-6">
            <div className="flex justify-between">
              <span className="font-semibold">{t('payment.reference')}:</span>
              <span className="font-mono">{params.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">{t('payment.amount')}:</span>
              <span>฿0</span>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-900">
            <p className="font-semibold mb-2">{t('payment.promptpay')} {t('common.loading')}</p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Use your banking app to scan the QR code above</li>
              <li>Verify the amount and reference number</li>
              <li>Complete the payment</li>
              <li>Your order will be updated once payment is received</li>
            </ul>
          </div>
        </div>
      </div>
=======
import { useEffect, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/hooks/useToast';
import Link from 'next/link';
import Image from 'next/image';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Loading from '@/components/Loading';

interface Order {
  id: string;
  total_thb: number;
  status: string;
  shipping_address: string;
  phone: string;
  customer_name: string;
  created_at: string;
}

export default function PaymentPage({ params }: { params: Promise<{ orderId: string }> }) {
  const locale = useLocale();
  const t = useTranslations();
  const { toast } = useToast();
  const [orderId, setOrderId] = useState<string>('');
  const [order, setOrder] = useState<Order | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [promptPayRef, setPromptPayRef] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  useEffect(() => {
    params.then((p) => setOrderId(p.orderId));
  }, [params]);

  useEffect(() => {
    if (!orderId) return;

    const fetchOrderAndQR = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', orderId)
          .single();

        if (orderError) throw orderError;
        if (!orderData) throw new Error(locale === 'en' ? 'Order not found' : 'ไม่พบคำสั่ง');

        setOrder(orderData);

        // Generate QR code if payment is pending
        if (orderData.status === 'pending_payment') {
          try {
            const qrResponse = await fetch('/api/payment/generate-qr', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.id,
                amount: orderData.total_thb,
              }),
            });

            const qrData = await qrResponse.json();
            if (qrData.qrCode) {
              setQrCode(qrData.qrCode);
              setPromptPayRef(qrData.promptPayRef);
            }
          } catch (qrErr) {
            toast.error(t('toasts.payment.load_error.message'), { description: t('toasts.payment.load_error.description') });
          }
        }
      } catch (err) {
        const message = err instanceof Error
          ? err.message
          : locale === 'en'
          ? 'Failed to load payment details'
          : 'ไม่สามารถโหลดรายละเอียดการชำระเงิน';
        setError(message);
        toast.error(t('toasts.payment.load_error.message'), { description: t('toasts.payment.load_error.description') });
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndQR();
  }, [orderId, locale, t, toast]);

  const handleVerifyPayment = async () => {
    try {
      setVerifyingPayment(true);
      setError(null);

      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (error) {
        toast.error(t('toasts.payment.verify_error.message'), { description: t('toasts.payment.verify_error.description') });
        throw error;
      }

      const { data: updatedOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (updatedOrder) {
        toast.success(t('toasts.payment.verified'));
        setOrder(updatedOrder);
        setQrCode(null);
      }
    } catch (err) {
      const message = err instanceof Error
        ? err.message
        : locale === 'en'
        ? 'Failed to verify payment'
        : 'ไม่สามารถยืนยันการชำระเงิน';
      setError(message);
      toast.error(t('toasts.payment.verify_error.message'), { description: t('toasts.payment.verify_error.description') });
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {locale === 'en' ? 'Payment' : 'การชำระเงิน'}
        </h1>
        <div className="max-w-4xl mx-auto flex items-center justify-center py-20">
          <Loading type="spinner" size="md" message={t('common.loading')} />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">
          {locale === 'en' ? 'Payment' : 'การชำระเงิน'}
        </h1>
        <Card className="text-center py-12 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">❌</div>
          <p className="text-red-600 text-lg mb-6">
            {locale === 'en' ? 'Order not found' : 'ไม่พบคำสั่ง'}
          </p>
          <Link href={`/${locale}/orders`}>
            <Button>{locale === 'en' ? 'View All Orders' : 'ดูคำสั่งทั้งหมด'}</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          {locale === 'en' ? 'Payment' : 'การชำระเงิน'}
        </h1>
        <p className="text-gray-600 mt-2">
          {locale === 'en'
            ? `Order #${order.id.slice(0, 8).toUpperCase()}`
            : `คำสั่งที่ #${order.id.slice(0, 8).toUpperCase()}`}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg max-w-4xl mx-auto">
          {error}
        </div>
      )}

      {order.status === 'pending_payment' ? (
        <div className="max-w-4xl mx-auto space-y-8">
          {/* PromptPay Payment Slip */}
          <Card className="overflow-hidden shadow-lg">
            {/* SCB Header */}
            <div className="bg-purple-600 py-6 text-center">
              <p className="text-white text-4xl font-bold">SCB</p>
            </div>

            {/* Thai QR Payment Header */}
            <div className="bg-blue-900 text-white px-6 py-4 text-center">
              <p className="text-2xl font-bold">THAI QR PAYMENT</p>
            </div>

            {/* PromptPay Label */}
            <div className="px-6 pt-6 text-center">
              <div className="inline-block border-2 border-blue-900 px-4 py-1 rounded">
                <p className="text-blue-900 font-bold">
                  Prompt<span className="text-red-500">Pay</span>
                </p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="px-6 py-8 flex flex-col items-center">
              {qrCode ? (
                <div className="bg-white p-4 border-2 border-gray-300 rounded">
                  <Image
                    src={qrCode}
                    alt="PromptPay QR Code"
                    width={300}
                    height={300}
                    className="w-80 h-80"
                  />
                </div>
              ) : (
                <div className="w-80 h-80 bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-gray-600">{locale === 'en' ? 'No QR Code' : 'ไม่มี QR Code'}</p>
                </div>
              )}
            </div>

            {/* Payment Info */}
            <div className="px-6 pb-6 border-t-2 border-gray-300">
              <div className="flex justify-between items-center mb-6 pt-4">
                <p className="text-gray-900 font-bold text-lg">
                  {locale === 'en' ? 'PAY TO PROMPTPAY' : 'ชำระเงินให้กับ PROMPTPAY'}
                </p>
                <p className="text-gray-900 font-mono text-lg">{promptPayRef}</p>
              </div>

              <div className="border-t-2 border-gray-300 pt-4">
                <p className="text-gray-600 text-sm mb-2">{locale === 'en' ? 'AMOUNT' : 'จำนวนเงิน'}</p>
                <p className="text-gray-900 text-4xl font-bold">฿ {order.total_thb.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-4">
                  {locale === 'en' ? '* Payer to specify amount' : '* ผู้จ่ายเงินระบุจำนวนเงิน'}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-purple-600 h-8" />
          </Card>

          {/* Instructions & Order Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Steps */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'en' ? 'How to Pay' : 'วิธีการชำระเงิน'}
              </h2>
              <ol className="space-y-3 text-sm text-gray-600">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0 min-w-6">1.</span>
                  <span>
                    {locale === 'en'
                      ? 'Open your mobile banking app or PromptPay wallet'
                      : 'เปิดแอพธนาคารหรือกระเป๋าเงิน PromptPay ของคุณ'}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0 min-w-6">2.</span>
                  <span>
                    {locale === 'en' ? 'Select "Scan QR Code" option' : 'เลือก "สแกน QR Code"'}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0 min-w-6">3.</span>
                  <span>
                    {locale === 'en'
                      ? 'Scan the QR code displayed above'
                      : 'สแกน QR Code ที่แสดงด้านบน'}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0 min-w-6">4.</span>
                  <span>
                    {locale === 'en'
                      ? 'Review the amount and confirm payment'
                      : 'ตรวจสอบจำนวนเงินและยืนยันการชำระเงิน'}
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-600 flex-shrink-0 min-w-6">5.</span>
                  <span>
                    {locale === 'en'
                      ? 'You will receive a confirmation message'
                      : 'คุณจะได้รับข้อความยืนยัน'}
                  </span>
                </li>
              </ol>
            </Card>

            {/* Order Summary */}
            <Card>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {locale === 'en' ? 'Order Summary' : 'สรุปคำสั่ง'}
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between text-gray-600">
                  <span>{locale === 'en' ? 'Order ID' : 'รหัสคำสั่ง'}</span>
                  <span className="font-medium text-gray-900">#{order.id.slice(0, 8).toUpperCase()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{locale === 'en' ? 'Customer Name' : 'ชื่อลูกค้า'}</span>
                  <span className="font-medium text-gray-900">{order.customer_name}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{locale === 'en' ? 'Shipping Address' : 'ที่อยู่การจัดส่ง'}</span>
                  <span className="font-medium text-gray-900">{order.shipping_address}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{locale === 'en' ? 'Phone' : 'โทรศัพท์'}</span>
                  <span className="font-medium text-gray-900">{order.phone}</span>
                </div>
                <div className="border-t border-gray-200 pt-4 flex justify-between">
                  <span className="font-semibold text-gray-900">{locale === 'en' ? 'Amount Due' : 'จำนวนเงินค้างชำระ'}</span>
                  <span className="text-2xl font-bold text-blue-600">฿{order.total_thb.toLocaleString()}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2">
                <Button
                  className="w-full"
                  onClick={handleVerifyPayment}
                  isLoading={verifyingPayment}
                  disabled={verifyingPayment}
                >
                  {locale === 'en' ? 'I Have Paid' : 'ฉันได้ชำระเงินแล้ว'}
                </Button>
                <Link href={`/${locale}/orders`} className="block">
                  <Button className="w-full" variant="outline">
                    {locale === 'en' ? 'Cancel' : 'ยกเลิก'}
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        /* Payment Confirmed */
        <Card className="max-w-2xl mx-auto text-center py-12">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {locale === 'en' ? 'Payment Confirmed' : 'ยืนยันการชำระเงิน'}
          </h2>
          <p className="text-gray-600 mb-6">
            {locale === 'en'
              ? 'Your payment has been received. Thank you for your purchase!'
              : 'เราได้รับการชำระเงินของคุณแล้ว ขอบคุณที่ทำการซื้อสินค้า'}
          </p>
          <p className="text-gray-600 mb-6">
            {locale === 'en'
              ? 'You will receive an email confirmation shortly.'
              : 'คุณจะได้รับอีเมลยืนยันในเร็วๆ นี้'}
          </p>
          <Link href={`/${locale}/orders`}>
            <Button>{locale === 'en' ? 'View Your Orders' : 'ดูคำสั่งของคุณ'}</Button>
          </Link>
        </Card>
      )}
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
    </div>
  );
}
