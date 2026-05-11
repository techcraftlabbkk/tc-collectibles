'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations();
  const [products] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products from Supabase
    const fetchProducts = async () => {
      try {
        // This will be populated with real data from Supabase
        // For now, show loading state
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="w-full px-4 py-12 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-6xl mx-auto text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            TC Collectibles
          </h1>
          <p className="text-lg md:text-xl mb-8">
            {t('products.featured')}
          </p>
          <Link
            href="/products"
            className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            {t('products.title')}
          </Link>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {t('products.featured')}
          </h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-200 rounded-lg h-64 animate-pulse" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition"
                >
                  <div className="bg-gray-200 h-48 flex items-center justify-center">
                    <span className="text-gray-400">{t('common.loading')}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {product.grade && `${t('products.grade')}: ${product.grade}`}
                    </p>
                    <p className="text-blue-600 font-bold">฿{product.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-600">{t('products.noProducts')}</p>
          )}
        </div>
      </section>

      {/* Info Section */}
      <section className="w-full px-4 py-12 bg-gray-50">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <h3 className="text-xl font-bold mb-2">Trusted</h3>
            <p className="text-gray-600">Buy and sell with confidence</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Verified</h3>
            <p className="text-gray-600">All cards are verified authentic</p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-2">Secure</h3>
            <p className="text-gray-600">Safe payment processing</p>
          </div>
        </div>
      </section>
    </div>
  );
}
