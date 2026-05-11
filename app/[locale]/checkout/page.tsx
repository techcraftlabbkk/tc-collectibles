'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useCartStore } from '@/lib/cartStore';

export default function Checkout() {
  const t = useTranslations();
  const { items } = useCartStore();
  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address');

  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = items.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  const steps = [
    { id: 'address', label: 'Shipping Address', icon: '📍' },
    { id: 'payment', label: 'Payment', icon: '💳' },
    { id: 'confirm', label: 'Confirm Order', icon: '✓' },
  ];

  const currentStepIndex = steps.findIndex((s) => s.id === step);

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="w-full px-4 py-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">
            {t('checkout.title')}
          </h1>
          <p className="text-lg text-gray-100 mt-2">
            Complete your secure checkout in 3 steps
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            {steps.map((s, idx) => {
              const isActive = s.id === step;
              const isComplete = steps.findIndex((st) => st.id === step) > idx;

              return (
                <div key={s.id} className="flex-1 flex items-center">
                  <div className="flex flex-col items-center flex-1">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-all mb-2 ${
                        isComplete
                          ? 'bg-green-500 text-white'
                          : isActive
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white ring-4 ring-purple-200'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {isComplete ? '✓' : s.icon}
                    </div>
                    <p
                      className={`text-sm font-bold text-center ${
                        isActive ? 'text-purple-600' : isComplete ? 'text-green-600' : 'text-gray-600'
                      }`}
                    >
                      {s.label}
                    </p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-all ${
                        isComplete ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <form className="space-y-6">
              {/* Address Step */}
              {step === 'address' && (
                <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-purple-100">
                    <span className="text-3xl">📍</span>
                    <h2 className="text-2xl font-black text-gray-900">
                      {t('checkout.shippingAddress')}
                    </h2>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                      {t('checkout.fullName')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                        {t('checkout.email')}
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                        {t('checkout.phone')}
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                      {t('checkout.address')}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                        {t('checkout.city')}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                        {t('checkout.postalCode')}
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setStep('payment')}
                    className="w-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all transform hover:from-amber-500 hover:to-amber-600 active:scale-95 shadow-lg shadow-amber-200 mt-8"
                  >
                    Continue to Payment →
                  </button>
                </div>
              )}

              {/* Payment Step */}
              {step === 'payment' && (
                <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-purple-100">
                    <span className="text-3xl">💳</span>
                    <h2 className="text-2xl font-black text-gray-900">
                      Payment Information
                    </h2>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-xl p-6 text-center">
                    <p className="text-gray-700 mb-4">Select your payment method</p>
                    <div className="grid grid-cols-2 gap-4">
                      <button className="border-2 border-purple-300 rounded-lg py-4 px-4 font-bold text-gray-900 hover:bg-purple-50 transition-all">
                        💳 Credit Card
                      </button>
                      <button className="border-2 border-purple-300 rounded-lg py-4 px-4 font-bold text-gray-900 hover:bg-purple-50 transition-all">
                        🏦 Bank Transfer
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                      Card Number
                    </label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                        Expiry
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-3 uppercase tracking-widest">
                        CVV
                      </label>
                      <input
                        type="text"
                        placeholder="123"
                        className="w-full px-4 py-3 border-2 border-purple-300 rounded-xl focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-200 font-semibold"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep('address')}
                      className="flex-1 border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-bold transition-colors hover:bg-purple-50"
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      onClick={() => setStep('confirm')}
                      className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 py-3 rounded-xl font-bold transition-all transform hover:from-amber-500 hover:to-amber-600 active:scale-95 shadow-lg shadow-amber-200"
                    >
                      Review Order →
                    </button>
                  </div>
                </div>
              )}

              {/* Confirm Step */}
              {step === 'confirm' && (
                <div className="bg-white border-2 border-purple-200 rounded-2xl p-8 space-y-6">
                  <div className="flex items-center gap-3 mb-6 pb-6 border-b-2 border-purple-100">
                    <span className="text-3xl">✓</span>
                    <h2 className="text-2xl font-black text-gray-900">
                      Confirm Your Order
                    </h2>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 text-center">
                    <p className="text-green-700 font-bold text-lg mb-2">✓ All information verified</p>
                    <p className="text-green-600">Your order is ready to be placed</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="agree" className="w-5 h-5" required />
                    <label htmlFor="agree" className="text-sm text-gray-700">
                      {t('checkout.agreeToTerms')}
                    </label>
                  </div>

                  <div className="flex gap-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setStep('payment')}
                      className="flex-1 border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-bold transition-colors hover:bg-purple-50"
                    >
                      ← Back
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 py-4 rounded-xl font-bold text-lg transition-all transform hover:from-amber-500 hover:to-amber-600 active:scale-95 shadow-lg shadow-amber-200"
                    >
                      {t('checkout.placeOrder')} →
                    </button>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Order Summary - Premium Box */}
          <div className="lg:col-span-1 h-fit">
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 sticky top-8">
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-widest">
                Order Summary
              </h2>

              <div className="bg-white rounded-xl p-4 mb-6 border border-purple-100">
                <p className="text-xs text-gray-600 uppercase tracking-widest font-bold mb-1">Items ({items.length})</p>
                <p className="text-2xl font-black text-gray-900">{items.length} premium card{items.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center pb-3 border-b-2 border-purple-200">
                  <span className="text-gray-700 font-semibold">Subtotal</span>
                  <span className="text-lg font-black text-gray-900">
                    ฿{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b-2 border-purple-200">
                  <span className="text-gray-700 font-semibold">Shipping</span>
                  <span className="text-lg font-black text-gray-900">
                    ฿{shipping.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-900 font-black text-lg">Total</span>
                  <span className="text-4xl font-black text-purple-600">
                    ฿{total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="space-y-3">
                {[
                  { icon: '🔒', label: 'Secure Payment' },
                  { icon: '📦', label: 'Safe Packing' },
                  { icon: '✓', label: 'Satisfaction Guaranteed' },
                ].map((badge) => (
                  <div key={badge.label} className="flex items-center gap-3 text-sm text-gray-700">
                    <span className="text-xl">{badge.icon}</span>
                    <span className="font-semibold">{badge.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
