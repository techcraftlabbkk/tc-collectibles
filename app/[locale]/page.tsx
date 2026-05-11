'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export default function Home() {
  const t = useTranslations();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch featured products from Supabase
    const fetchProducts = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* HERO SECTION - BOLD & ENERGETIC */}
      <section className="relative w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white overflow-hidden">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            {/* Eyebrow */}
            <p className="text-amber-300 font-bold uppercase tracking-widest text-sm mb-4">
              ⚡ Authentic • Verified • Trusted
            </p>

            {/* Main heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6">
              Authentic PSA Pokémon Cards
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              Verified. Graded. Shipped from Bangkok. The only marketplace you trust for premium collectibles.
            </p>

            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/products"
                className="inline-block bg-amber-400 hover:bg-amber-500 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 transform hover:scale-105 shadow-xl"
              >
                Shop Premium Cards →
              </Link>
              <Link
                href="/products"
                className="inline-block border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200"
              >
                Browse Gallery
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS SECTION - BOLD CARDS */}
      <section className="w-full px-4 py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-3">
              Featured Cards
            </h2>
            <p className="text-lg text-gray-600">
              Hand-picked gems. Verified authentic. Ready to own.
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-72 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2"
                >
                  {/* Product Image */}
                  <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <span>No image</span>
                      </div>
                    )}

                    {/* Grade Badge */}
                    <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                      {product.grade || 'N/A'}
                    </div>
                  </div>

                  {/* Card Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 text-xs mb-3">
                      {product.available ? '✓ In Stock' : 'Sold Out'}
                    </p>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-black text-purple-600">
                        ฿{product.price?.toLocaleString() || '0'}
                      </span>
                    </div>

                    {/* CTA */}
                    <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105 active:scale-95">
                      View Details
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600 mb-6">{t('products.noProducts')}</p>
              <Link
                href="/products"
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* TRUST SECTION - BOLD DESIGN */}
      <section className="w-full px-4 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Authentic */}
            <div className="text-center p-8 rounded-2xl border-2 border-purple-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-50 to-transparent">
              <div className="text-6xl mb-4">🛡️</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">100% Authentic</h3>
              <p className="text-gray-600 leading-relaxed">
                Every card verified by our expert team. No fakes. No exceptions.
              </p>
            </div>

            {/* Verified */}
            <div className="text-center p-8 rounded-2xl border-2 border-purple-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-indigo-50 to-transparent">
              <div className="text-6xl mb-4">✓</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">PSA Graded</h3>
              <p className="text-gray-600 leading-relaxed">
                Professional authentication & grading. Industry standard certified.
              </p>
            </div>

            {/* Secure */}
            <div className="text-center p-8 rounded-2xl border-2 border-purple-200 hover:border-amber-400 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-transparent">
              <div className="text-6xl mb-4">🔒</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Secure Payment</h3>
              <p className="text-gray-600 leading-relaxed">
                PromptPay & Supabase encryption. Your data is protected.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
