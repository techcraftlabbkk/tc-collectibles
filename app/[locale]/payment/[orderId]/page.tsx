'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

type PaymentMethod = 'promptpay' | 'card';

export default function Payment({ params }: { params: { orderId: string } }) {
  const locale = useLocale();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [method, setMethod] = useState<PaymentMethod>('promptpay');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [cardLoading, setCardLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load order
  useEffect(() => {
    const load = async () => {
      const { data, error: err } = await supabase
        .from('orders')
        .select('*')
        .eq('id', params.orderId)
        .single();
      if (err || !data) { setError('Order not found'); setLoading(false); return; }
      setOrder(data);
      setLoading(false);
    };
    load();
  }, [params.orderId]);

  // Auto-generate QR when PromptPay tab is active and order is loaded
  useEffect(() => {
    if (method === 'promptpay' && order && !qrCode) {
      generateQR();
    }
  }, [method, order]);

  const generateQR = async () => {
    if (!order) return;
    setQrLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payment/generate-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: order.id, amount: order.total }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate QR');
      setQrCode(data.qrCode);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setQrLoading(false);
    }
  };

  const handleCardPayment = async () => {
    setCardLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/payment/create-card-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-locale': locale },
        body: JSON.stringify({ orderId: params.orderId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to start card payment');
      window.location.href = data.url; // redirect to Stripe Checkout
    } catch (err: any) {
      setError(err.message);
      setCardLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center flex-col gap-4">
        <p className="text-xl font-bold text-gray-700">Order not found</p>
        <Link href={`/${locale}/products`} className="text-purple-600 hover:underline">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="w-full px-4 py-10 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-black">Complete Payment</h1>
          <p className="text-purple-200 mt-1 text-sm">Order #{params.orderId.slice(0, 8).toUpperCase()}</p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">

        {/* Order summary */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-6">
          <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-4">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-bold">{'฿'}{(order.total - 150).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-gray-600">Shipping</span>
            <span className="font-bold">{'฿'}150</span>
          </div>
          <div className="flex justify-between items-baseline border-t-2 border-purple-200 pt-4">
            <span className="font-black text-gray-900 text-lg">Total</span>
            <span className="text-4xl font-black text-purple-600">{'฿'}{order.total.toLocaleString()}</span>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {'⚠️'} {error}
          </div>
        )}

        {/* Payment method tabs */}
        <div className="bg-white border-2 border-purple-100 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-2 border-b-2 border-purple-100">
            <button
              onClick={() => setMethod('promptpay')}
              className={`py-4 font-bold text-sm transition-colors ${method === 'promptpay' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'}`}
            >
              {'📱'} PromptPay QR
            </button>
            <button
              onClick={() => setMethod('card')}
              className={`py-4 font-bold text-sm transition-colors ${method === 'card' ? 'bg-purple-600 text-white' : 'text-gray-600 hover:bg-purple-50'}`}
            >
              {'💳'} Credit / Debit Card
            </button>
          </div>

          <div className="p-8">
            {/* PromptPay tab */}
            {method === 'promptpay' && (
              <div className="text-center">
                <p className="text-gray-600 text-sm mb-6">Scan with any Thai banking app and pay the exact amount shown.</p>
                {qrLoading ? (
                  <div className="w-48 h-48 mx-auto bg-gray-100 rounded-xl flex items-center justify-center animate-pulse">
                    <span className="text-gray-400 text-sm">Generating QR...</span>
                  </div>
                ) : qrCode ? (
                  <div className="flex justify-center">
                    <div className="bg-white p-4 rounded-2xl shadow-lg border-2 border-purple-100 inline-block">
                      <Image src={qrCode} alt="PromptPay QR" width={220} height={220} />
                    </div>
                  </div>
                ) : (
                  <button onClick={generateQR} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-purple-700 transition-colors">
                    Generate QR Code
                  </button>
                )}
                <div className="mt-6 text-left bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800 space-y-1">
                  <p className="font-bold mb-2">How to pay:</p>
                  <p>1. Open your banking app and scan the QR code</p>
                  <p>2. Confirm the amount: <strong>{'฿'}{order.total.toLocaleString()}</strong></p>
                  <p>3. We'll confirm your order within 1–2 hours</p>
                </div>
              </div>
            )}

            {/* Card tab */}
            {method === 'card' && (
              <div className="text-center">
                <div className="text-6xl mb-4">{'💳'}</div>
                <h3 className="text-xl font-black text-gray-900 mb-2">Pay by Card</h3>
                <p className="text-gray-600 text-sm mb-6">Securely pay with Visa, Mastercard, or any major credit/debit card via Stripe.</p>
                <div className="flex justify-center gap-3 mb-8 opacity-70">
                  {['VISA', 'MC', 'AMEX', 'JCB'].map(c => (
                    <span key={c} className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded">{c}</span>
                  ))}
                </div>
                <button
                  onClick={handleCardPayment}
                  disabled={cardLoading}
                  className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg shadow-amber-100 disabled:opacity-50"
                >
                  {cardLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                      </svg>
                      Redirecting to Stripe...
                    </span>
                  ) : (
                    `Pay ${'฿'}${order.total.toLocaleString()} by Card →`
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-3">{'🔒'} Secured by Stripe. Your card details are never stored.</p>
              </div>
            )}
          </div>
        </div>

        <Link href={`/${locale}/orders`} className="block text-center text-sm text-gray-400 hover:text-gray-600 transition-colors">
          {'←'} Back to My Orders
        </Link>
      </div>
    </div>
  );
}
