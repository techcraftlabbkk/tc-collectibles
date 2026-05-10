'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';

export default function Products() {
  const t = useTranslations();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch products from Supabase
    setIsLoading(false);
  }, []);

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('products.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="font-bold mb-4">{t('products.filter')}</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('products.price')}
                  </label>
                  <input type="range" min="0" max="10000" className="w-full" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    {t('products.grade')}
                  </label>
                  <select className="w-full border rounded px-2 py-1">
                    <option>All</option>
                    <option>PSA 10</option>
                    <option>PSA 9</option>
                    <option>PSA 8</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="md:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-600 py-12">
                {t('products.noProducts')}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
