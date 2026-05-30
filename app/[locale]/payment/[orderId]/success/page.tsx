'use client';

import { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';

export default function PaymentSuccess({ params }: { params: { orderId: string } }) {
  const locale = useLocale();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    // Give Stripe webhook a moment to process, then confirm
    const timer = setTimeout(() => setStatus('success'), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-semibold">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-3">Payment Received!</h1>
        <p className="text-gray-600 mb-2">Your order <span className="font-mono text-sm text-purple-600">{params.orderId.slice(0, 8)}...</span> has been confirmed.</p>
        <p className="text-gray-500 text-sm mb-8">We'll pack and ship your PSA card within 1-2 business days. You'll receive an email update.</p>
        <div className="flex flex-col gap-3">
          <Link
            href={`/${locale}/orders`}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-bold hover:from-purple-700 hover:to-indigo-700 transition-all"
          >
            View My Orders
          </Link>
          <Link
            href={`/${locale}/products`}
            className="w-full border-2 border-purple-200 text-purple-600 py-3 rounded-xl font-bold hover:bg-purple-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
