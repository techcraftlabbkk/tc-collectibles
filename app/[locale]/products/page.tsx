'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

export default function Products() {
  const t = useTranslations();
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('featured');
  const [filterGrade, setFilterGrade] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        let query = supabase.from('products').select('*');

        if (filterGrade !== 'all') {
          query = query.eq('grade', filterGrade);
        }

        let { data, error } = await query;

        if (error) throw error;

        // Sort products
        let sorted = data || [];
        if (sortBy === 'price-low') {
          sorted.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          sorted.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'featured') {
          sorted = sorted.slice(0, 12);
        }

        setProducts(sorted);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [sortBy, filterGrade]);

  return (
    <div className="w-full bg-white">
      {/* Page Header */}
      <section className="w-full px-4 py-12 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-black mb-3">
            {t('products.title')}
          </h1>
          <p className="text-lg text-gray-100">
            Shop verified authentic PSA graded collectibles. Premium selection from Bangkok.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="w-full px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Filters & Sort Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8 pb-6 border-b-2 border-purple-200">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-amber-400 font-semibold"
            >
              <option value="featured">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <select
              value={filterGrade}
              onChange={(e) => setFilterGrade(e.target.value)}
              className="flex-1 px-4 py-3 border-2 border-purple-300 rounded-lg focus:outline-none focus:border-amber-400 font-semibold"
            >
              <option value="all">Grade: All</option>
              <option value="PSA 10">PSA 10 Gem Mint</option>
              <option value="PSA 9">PSA 9 Mint</option>
              <option value="PSA 8">PSA 8 NM-MT</option>
              <option value="PSA 7">PSA 7 Near Mint</option>
            </select>

            <div className="text-right flex items-center">
              <span className="font-semibold text-gray-600">
                {products.length} cards
              </span>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-200 rounded-xl h-72 animate-pulse shadow-sm"
                />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:-translate-y-2 border border-gray-100"
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
                        <span className="text-sm">Card Image</span>
                      </div>
                    )}

                    {/* Grade Badge */}
                    <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm shadow-lg">
                      {product.grade || 'N/A'}
                    </div>

                    {/* Availability */}
                    {!product.available && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold">SOLD OUT</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 text-sm mb-2 line-clamp-2 group-hover:text-purple-600 transition-colors">
                      {product.title}
                    </h3>

                    <p className="text-gray-600 text-xs mb-3">
                      {product.available ? (
                        <span className="text-green-600 font-semibold">✓ In Stock</span>
                      ) : (
                        <span className="text-red-600 font-semibold">Sold Out</span>
                      )}
                    </p>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-2xl font-black text-purple-600">
                        ฿{product.price?.toLocaleString() || '0'}
                      </span>
                    </div>

                    {/* CTA */}
                    <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-2 rounded-lg font-bold text-sm transition-all transform hover:scale-105 active:scale-95">
                      View Details →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-gray-600 mb-6">No products found</p>
              <button
                onClick={() => {
                  setSortBy('featured');
                  setFilterGrade('all');
                }}
                className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
