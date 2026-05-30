'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useCartStore } from '@/lib/cartStore';
import Link from 'next/link';
import Image from 'next/image';

export default function Cart() {
  const t = useTranslations();
  const { items, removeFromCart } = useCartStore();

  const locale = useLocale();
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 150 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <section className="w-full px-4 py-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black">
            {t('cart.title')}
          </h1>
          <p className="text-lg text-gray-100 mt-2">
            Review your cards before checkout
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {items.length === 0 ? (
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-16 text-center">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-2xl font-black text-gray-900 mb-3">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">{t('cart.empty')}</p>
            <Link
              href={`/${locale}/products`}
              className="inline-block bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-amber-500 hover:to-amber-600 transition-all transform active:scale-95 shadow-lg shadow-amber-200"
            >
              {t('cart.continueShopping')} →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product_id}
                  className="bg-white border-2 border-purple-200 rounded-2xl p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex gap-6">
                    {/* Product Image */}
                    <div className="w-32 h-40 flex-shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-purple-100 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          width={128}
                          height={160}
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <div className="text-4xl">🃏</div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-lg font-black text-gray-900 mb-2">
                          {item.title}
                        </h3>
                        <div className="flex items-center gap-3 mb-3">
                          <span className="bg-amber-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
                            {item.grade}
                          </span>
                          <span className="text-sm text-gray-500">
                            Grade: <span className="font-bold text-gray-900">{item.grade === 'PSA 10' ? 'Gem Mint' : item.grade === 'PSA 9' ? 'Mint' : 'Near Mint'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-purple-100">
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">Price</p>
                          <p className="text-3xl font-black text-purple-600">
                            &#3647;{(item.price * item.quantity).toLocaleString()}
                          </p>
                          {item.quantity > 1 && (
                            <p className="text-xs text-gray-500 mt-1">
                              &#3647;{item.price.toLocaleString()} &times; {item.quantity}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-gray-500 font-semibold bg-gray-100 px-2 py-1 rounded">
                            Qty: {item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.product_id)}
                            className="text-red-600 hover:text-red-700 font-bold transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 h-fit">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-200 rounded-2xl p-8 sticky top-8">
                <h2 className="text-xl font-black text-gray-900 mb-8 uppercase tracking-widest">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center pb-3 border-b-2 border-purple-200">
                    <span className="text-gray-700 font-semibold">Subtotal</span>
                    <span className="text-lg font-black text-gray-900">
                      &#3647;{subtotal.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b-2 border-purple-200">
                    <span className="text-gray-700 font-semibold">Shipping</span>
                    <span className="text-lg font-black text-gray-900">
                      &#3647;{shipping.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-900 font-black text-lg">Total</span>
                    <span className="text-4xl font-black text-purple-600">
                      &#3647;{total.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href={`/${locale}/checkout`}
                  className="block w-full bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 py-4 rounded-xl font-bold text-center transition-all transform hover:from-amber-500 hover:to-amber-600 active:scale-95 shadow-lg shadow-amber-200 mb-3"
                >
                  Proceed to Checkout &rarr;
                </Link>

                <Link
                  href={`/${locale}/products`}
                  className="block w-full border-2 border-purple-600 text-purple-600 py-3 rounded-xl font-bold text-center transition-colors hover:bg-purple-50"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
