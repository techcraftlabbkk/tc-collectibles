'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Admin() {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('admin.title')}</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-2 px-4 font-semibold ${
              activeTab === 'orders'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('admin.orders')}
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`py-2 px-4 font-semibold ${
              activeTab === 'payments'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('admin.payments')}
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`py-2 px-4 font-semibold ${
              activeTab === 'products'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('admin.products')}
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'orders' && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t('admin.orders')}</h2>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t('admin.payments')}</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('admin.pending')}</h3>
                  <p className="text-gray-600 text-sm">{t('common.loading')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('admin.verified')}</h3>
                  <p className="text-gray-600 text-sm">{t('common.loading')}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">{t('admin.rejected')}</h3>
                  <p className="text-gray-600 text-sm">{t('common.loading')}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div className="bg-white border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">{t('admin.products')}</h2>
              <p className="text-gray-600">{t('common.loading')}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
