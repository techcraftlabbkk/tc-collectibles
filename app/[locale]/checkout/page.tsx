'use client';

import { useTranslations } from 'next-intl';

export default function Checkout() {
  const t = useTranslations();

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <form className="space-y-4">
            <h2 className="text-xl font-bold mb-4">{t('checkout.shippingAddress')}</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.fullName')}
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.email')}
              </label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.phone')}
              </label>
              <input
                type="tel"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.address')}
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('checkout.city')}
                </label>
                <input type="text" className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('checkout.postalCode')}
                </label>
                <input type="text" className="w-full border rounded px-3 py-2" required />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                className="mr-2"
                required
              />
              <label htmlFor="agree" className="text-sm">
                {t('checkout.agreeToTerms')}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {t('checkout.placeOrder')}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span>{t('cart.subtotal')}</span>
                <span>฿0</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>{t('cart.shipping')}</span>
                <span>฿0</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>{t('cart.total')}</span>
                <span>฿0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
