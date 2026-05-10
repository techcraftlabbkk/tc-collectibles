<<<<<<< HEAD
import { redirect } from 'next/navigation';

export default function RootPage() {
  // Redirect to the localized home page
  redirect('/en');
=======
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import Image from 'next/image';
import Link from 'next/link';

interface FeaturedProduct {
  id: string;
  title: string;
  grade: string;
  price: number;
  image_url?: string | null;
  available: boolean;
}

export default function Home() {
  const [featured, setFeatured] = useState<FeaturedProduct[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [addedId, setAddedId] = useState<string | null>(null);
  const { addToCart } = useCartStore();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    supabase
      .from('products')
      .select('id, title, grade, price, image_url, available')
      .eq('available', true)
      .order('created_at', { ascending: false })
      .limit(8)
      .then(({ data }) => {
        setFeatured(data || []);
        setLoadingFeatured(false);
      });
  }, []);

  const handleAddToCart = (product: FeaturedProduct) => {
    addToCart(product as any);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Premium PSA Pokémon Cards</h1>
        <p className="text-lg text-gray-400 mb-6">
          Authentic graded cards from trusted collectors. Final sale marketplace.
        </p>
        <Link href="/products" className="btn btn-primary text-lg px-6 py-3">
          Browse All Cards
        </Link>
      </div>

      {/* Trust badges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 mb-16">
        <div className="card text-center">
          <div className="text-4xl mb-4">✓</div>
          <h3 className="text-lg font-bold mb-2">Verified Sellers</h3>
          <p className="text-gray-400">All products verified and authenticated before listing.</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h3 className="text-lg font-bold mb-2">Secure Payment</h3>
          <p className="text-gray-400">PromptPay payment verification system for buyer protection.</p>
        </div>
        <div className="card text-center">
          <div className="text-4xl mb-4">📦</div>
          <h3 className="text-lg font-bold mb-2">Fast Delivery</h3>
          <p className="text-gray-400">Secure packaging and tracking for every order.</p>
        </div>
      </div>

      {/* Featured Cards */}
      <section className="border-t border-dark-800 pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Latest Cards</h2>
          <Link href="/products" className="text-blue-400 hover:text-blue-300 text-sm">
            View all →
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card animate-pulse">
                <div className="bg-dark-800 h-48 rounded mb-3" />
                <div className="h-4 bg-dark-800 rounded mb-2" />
                <div className="h-4 bg-dark-800 rounded w-3/4 mb-4" />
                <div className="h-8 bg-dark-800 rounded" />
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="mb-4">No cards listed yet.</p>
            <Link href="/products" className="text-blue-400 hover:text-blue-300">Browse products →</Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <div key={product.id} className="card group cursor-pointer hover:border-blue-500 transition-colors">
                <div className="bg-dark-800 h-48 rounded mb-3 overflow-hidden relative">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={product.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm">
                      No image
                    </div>
                  )}
                </div>
                <h3 className="font-bold text-white mb-1 truncate">{product.title}</h3>
                <p className="text-xs text-gray-400 mb-3">Grade: {product.grade}</p>
                <div className="flex justify-between items-center pt-3 border-t border-dark-800">
                  <span className="font-bold text-blue-400">฿{product.price.toLocaleString()}</span>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={`btn text-sm transition-colors ${
                      addedId === product.id
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'btn-primary'
                    }`}
                  >
                    {addedId === product.id ? '✓ Added' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Final Sale notice */}
      <section className="mt-16 py-8 bg-dark-900 border border-dark-800 rounded-lg px-8">
        <h2 className="text-2xl font-bold mb-4">Final Sale Policy</h2>
        <p className="text-gray-400 mb-4">
          All sales are final. No returns, exchanges, or refunds. By completing a purchase, you agree to this policy.
        </p>
        <p className="text-gray-400">
          Products are carefully described and photographed. Please review all details before purchasing.
        </p>
      </section>
    </div>
  );
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
}
