'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';

interface Order {
  id: string;
  total: number;
  status: string;
  shipping_address: string;
  phone: string;
  customer_name: string;
  created_at: string;
}

export default function PaymentPage({ params }: { params: { orderId: string } }) {
  const orderId = params.orderId;
  const [order, setOrder] = useState<Order | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [promptPayRef, setPromptPayRef] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verifyingPayment, setVerifyingPayment] = useState(false);

  useEffect(() => {
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
        if (!orderData) throw new Error('Order not found');

        setOrder(orderData);

        // Generate QR code if payment is pending
        if (orderData.status === 'pending_payment') {
          const qrResponse = await fetch('/api/payment/generate-qr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: orderData.id,
              amount: orderData.total,
            }),
          });

          const qrData = await qrResponse.json();
          if (qrData.qrCode) {
            setQrCode(qrData.qrCode);
            setPromptPayRef(qrData.promptPayRef);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load payment details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderAndQR();
  }, [orderId]);

  const handleVerifyPayment = async () => {
    try {
      setVerifyingPayment(true);
      setError(null);

      // For testing: mark order as paid
      const { error } = await supabase
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (error) throw error;

      // Refresh order data
      const { data: updatedOrder } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (updatedOrder) {
        setOrder(updatedOrder);
        setQrCode(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to verify payment');
    } finally {
      setVerifyingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-screen animate-pulse">
          <div className="h-12 bg-dark-800 rounded w-1/3 mb-4" />
          <div className="h-96 bg-dark-800 rounded" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="card text-center py-12">
          <p className="text-red-400 text-lg mb-4">Order not found</p>
          <Link href="/orders" className="btn btn-primary inline-block">
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {order.status === 'pending_payment' ? (
        <>
          {/* PromptPay Payment Slip */}
          <div className="bg-white text-black rounded-lg shadow-xl overflow-hidden mb-8">
            {/* SCB Header */}
            <div className="bg-purple-600 py-6 text-center">
              <p className="text-white text-3xl font-bold">SCB</p>
            </div>

            {/* Thai QR Payment Header */}
            <div className="bg-blue-900 text-white px-6 py-4 text-center">
              <p className="text-2xl font-bold">THAI QR PAYMENT</p>
            </div>

            {/* PromptPay Label */}
            <div className="px-6 pt-6 text-center">
              <div className="inline-block border-2 border-blue-900 px-4 py-1 rounded">
                <p className="text-blue-900 font-bold">Prompt<span className="text-red-500">Pay</span></p>
              </div>
            </div>

            {/* QR Code Section */}
            <div className="px-6 py-8 flex flex-col items-center">
              {qrCode && (
                <div className="bg-white p-4 border-2 border-gray-300 rounded">
                  <Image
                    src={qrCode}
                    alt="PromptPay QR Code"
                    width={300}
                    height={300}
                    className="w-80 h-80"
                  />
                </div>
              )}
            </div>

            {/* Payment Info */}
            <div className="px-6 pb-6 border-t-2 border-gray-300">
              <div className="flex justify-between items-center mb-6 pt-4">
                <p className="text-black font-bold text-lg">PAY TO PROMPTPAY</p>
                <p className="text-black font-mono text-lg">{promptPayRef}</p>
              </div>

              <div className="border-t-2 border-gray-300 pt-4">
                <p className="text-gray-600 text-sm mb-2">AMOUNT</p>
                <p className="text-black text-3xl font-bold">฿ {order.total.toLocaleString()}</p>
                <p className="text-gray-500 text-xs mt-4">* Payer to specify amount</p>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-purple-600 h-8" />
          </div>

          {/* Instructions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Payment Steps */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">How to Pay</h2>
              <ol className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 flex-shrink-0 min-w-6">1.</span>
                  <span>Open your mobile banking app</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 flex-shrink-0 min-w-6">2.</span>
                  <span>Select &quot;PromptPay&quot; or &quot;QR Payment&quot;</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 flex-shrink-0 min-w-6">3.</span>
                  <span>Scan the QR code</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 flex-shrink-0 min-w-6">4.</span>
                  <span>Verify amount: ฿{order.total.toLocaleString()}</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400 flex-shrink-0 min-w-6">5.</span>
                  <span>Complete the transaction</span>
                </li>
              </ol>
              <p className="text-xs text-gray-500 mt-4">
                Payment confirms within 1-2 minutes
              </p>
            </div>

            {/* Order Summary */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="pb-3 border-b border-dark-800">
                  <p className="text-xs text-gray-500">Order ID</p>
                  <p className="font-mono text-sm text-blue-400">{order.id.slice(0, 8)}</p>
                </div>

                <div className="pb-3 border-b border-dark-800">
                  <p className="text-xs text-gray-500">Customer</p>
                  <p className="text-white">{order.customer_name || 'N/A'}</p>
                </div>

                <div className="pb-3 border-b border-dark-800">
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="text-2xl font-bold text-green-400">฿{order.total.toLocaleString()}</p>
                </div>

                <div className="pb-3 border-b border-dark-800">
                  <p className="text-xs text-gray-500">Address</p>
                  <p className="text-sm text-gray-300">{order.shipping_address}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm text-gray-300">{order.phone}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Test Button */}
          <div className="mt-6 flex gap-3">
            <button
              onClick={handleVerifyPayment}
              disabled={verifyingPayment}
              className="btn bg-green-600 hover:bg-green-700 text-white flex-1 py-3"
            >
              {verifyingPayment ? 'Verifying...' : 'Test: Mark as Paid'}
            </button>
            <Link href="/orders" className="btn btn-secondary flex-1 py-3 text-center">
              View All Orders
            </Link>
          </div>
        </>
      ) : (
        /* Payment Completed */
        <div className="card text-center py-16">
          <div className="text-6xl mb-6">✓</div>
          <h1 className="text-4xl font-bold text-green-400 mb-4">Payment Received!</h1>
          <p className="text-gray-300 text-lg mb-8">Order #{order.id.slice(0, 8)}</p>
          <p className="text-gray-400 mb-8">
            Thank you for your payment. Your order is now being processed and will be shipped soon.
          </p>

          <div className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto">
            <div className="card">
              <p className="text-xs text-gray-500 mb-1">Amount Paid</p>
              <p className="text-2xl font-bold text-green-400">฿{order.total.toLocaleString()}</p>
            </div>
            <div className="card">
              <p className="text-xs text-gray-500 mb-1">Status</p>
              <p className="text-lg font-bold text-blue-400">Processing</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <Link href="/orders" className="btn btn-primary">
              View My Orders
            </Link>
            <Link href="/products" className="btn btn-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
