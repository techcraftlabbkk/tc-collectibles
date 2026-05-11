'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';

export default function Cart() {
  const t = useTranslations();

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('cart.title')}</h1>

        <div className="bg-white border rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-4">{t('cart.empty')}</p>
          <Link
            href="/products"
            className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {t('cart.continueShopping')}
          </Link>
        </div>
      </div>
    </div>
  );
}
