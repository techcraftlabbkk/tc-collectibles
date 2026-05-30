'use client';

import { useLocale } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useCartStore } from '@/lib/cartStore';
import { Product } from '@/lib/types';

const GRADE_STYLES: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'PSA 10': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-300', dot: 'bg-yellow-400' },
  'PSA 9':  { bg: 'bg-green-50',  text: 'text-green-800',  border: 'border-green-300',  dot: 'bg-green-500'  },
  'PSA 8.5':{ bg: 'bg-teal-50',   text: 'text-teal-800',   border: 'border-teal-300',   dot: 'bg-teal-500'   },
  'PSA 8':  { bg: 'bg-blue-50',   text: 'text-blue-800',   border: 'border-blue-300',   dot: 'bg-blue-500'   },
  'PSA 7':  { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-300', dot: 'bg-purple-500' },
  'PSA 6':  { bg: 'bg-gray-50',   text: 'text-gray-700',   border: 'border-gray-300',   dot: 'bg-gray-400'   },
};

export default function ProductDetail({ params }: { params: { id: string } }) {
  const locale = useLocale();
  const { addToCart } = useCartStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [alreadyInCart, setAlreadyInCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data, error: err } = await supabase
          .from('products')
          .select('*')
          .eq('id', params.id)
          .single();

        if (err || !data) throw err ?? new Error('Product not found');
        setProduct(data);

        // Fetch related (same grade, different card)
        const { data: rel } = await supabase
          .from('products')
          .select('*')
          .eq('available', true)
          .eq('grade', data.grade)
          .neq('id', data.id)
          .limit(3);
        setRelated(rel ?? []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to load product');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    const result = addToCart(product);
    if (result === 'already_in_cart') {
      setAlreadyInCart(true);
      setTimeout(() => setAlreadyInCart(false), 2500);
    } else {
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const gradeStyle = product?.grade ? (GRADE_STYLES[product.grade] ?? GRADE_STYLES['PSA 6']) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="aspect-square bg-gray-200 rounded-2xl" />
              <div className="space-y-4 pt-4">
                <div className="h-6 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
                <div className="h-8 bg-gray-200 rounded w-1/2 mt-6" />
                <div className="h-12 bg-gray-200 rounded-xl mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <div className="text-4xl">😕</div>
        <h2 className="text-xl font-bold text-gray-800">Product not found</h2>
        <p className="text-gray-500 text-sm">{error}</p>
        <Link href={`/${locale}/products`} className="text-blue-600 font-medium hover:underline text-sm">
          ← Back to Products
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-500 mb-12 pb-6 border-b-2 border-purple-100">
          <Link href={`/${locale}`} className="hover:text-purple-600 transition-colors font-medium">🏠 Home</Link>
          <span className="text-gray-300">/</span>
          <Link href={`/${locale}/products`} className="hover:text-purple-600 transition-colors font-medium">Products</Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-bold truncate max-w-[300px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Image - Premium Showcase */}
          <div className="sticky top-8">
            <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-purple-200 overflow-hidden shadow-lg flex items-center justify-center">
              {product.image_url ? (
                <Image
                  src={product.image_url}
                  alt={product.title}
                  fill
                  className="object-contain p-12 drop-shadow-lg"
                  priority
                />
              ) : (
                <div className="flex flex-col items-center gap-3 text-gray-300">
                  <span className="text-9xl">🃏</span>
                  <span className="text-sm">No image available</span>
                </div>
              )}
            </div>
          </div>

          {/* Details - Premium Layout */}
          <div className="flex flex-col">
            {/* Grade Badge - Bold */}
            {product.grade && gradeStyle && (
              <div className={`inline-flex items-center gap-2 self-start mb-6 px-4 py-2 rounded-full border-2 font-bold text-sm ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border} shadow-md`}>
                <span className={`w-3 h-3 rounded-full ${gradeStyle.dot}`} />
                {product.grade} Gem
              </div>
            )}

            {/* Title - Bold & Large */}
            <h1 className="text-4xl sm:text-5xl font-black text-gray-900 mb-4 leading-tight">{product.title}</h1>

            {product.description && (
              <p className="text-lg text-gray-600 leading-relaxed mb-8 pb-8 border-b-2 border-purple-100">{product.description}</p>
            )}

            {/* Price - Premium Highlight */}
            <div className="mb-8">
              <p className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-2">Price</p>
              <p className="text-6xl font-black text-purple-600">฿{product.price.toLocaleString()}</p>
              {product.quantity <= 3 && product.quantity > 0 && (
                <p className="text-amber-600 text-sm font-bold mt-3">⚡ Only {product.quantity} left in stock!</p>
              )}
              {product.quantity === 0 && (
                <p className="text-red-600 text-sm font-bold mt-3">❌ Out of stock</p>
              )}
            </div>

            {/* PSA Card Info - Premium Box */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl border-2 border-purple-200 p-6 mb-8 space-y-4">
              <h3 className="text-sm font-black text-purple-900 uppercase tracking-widest">Card Specifications</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-600 font-semibold mb-1">CERTIFICATION</p>
                  <p className="text-lg font-black text-gray-900">PSA</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-600 font-semibold mb-1">GRADE</p>
                  <p className="text-lg font-black text-purple-600">{product.grade || 'N/A'}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-600 font-semibold mb-1">CONDITION</p>
                  <p className="text-lg font-bold text-gray-900">{product.grade === 'PSA 10' ? 'Gem Mint' : product.grade === 'PSA 9' ? 'Mint' : 'Near Mint'}</p>
                </div>
                <div className="bg-white rounded-lg p-3 border border-purple-100">
                  <p className="text-xs text-gray-600 font-semibold mb-1">STATUS</p>
                  <p className={`text-lg font-black ${product.available && product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.available && product.quantity > 0 ? '✓ Available' : 'Sold Out'}
                  </p>
                </div>
              </div>
            </div>

            {/* Actions - Bold CTAs */}
            <div className="flex flex-col gap-4 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.available || product.quantity === 0}
                className={`flex items-center justify-center gap-2.5 w-full py-4 rounded-xl font-bold text-lg transition-all transform ${
                  added
                    ? 'bg-green-500 text-white scale-95'
                    : alreadyInCart
                    ? 'bg-blue-500 text-white'
                    : product.available && product.quantity > 0
                    ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 hover:from-amber-500 hover:to-amber-600 active:scale-95 shadow-xl shadow-amber-200'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Added to Cart! ✓
                  </>
                ) : alreadyInCart ? (
                  <>🛒 Already in Cart — Go to Cart to Checkout</>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {product.available && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>

              {added && (
                <Link
                  href={`/${locale}/cart`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-base border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-colors"
                >
                  Continue to Checkout →
                </Link>
              )}
            </div>

            {/* Trust badges - Bold Design */}
            <div className="mt-auto grid grid-cols-3 gap-3 text-center pt-8 border-t-2 border-purple-100">
              {[
                { icon: '🛡️', label: 'PSA Certified' },
                { icon: '📦', label: 'Safe Packing' },
                { icon: '🌍', label: 'Bangkok Shipped' },
              ].map((b) => (
                <div key={b.label} className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl py-4 px-2 border-2 border-purple-200 hover:shadow-lg transition-shadow">
                  <div className="text-3xl mb-2">{b.icon}</div>
                  <p className="text-xs text-gray-700 font-bold leading-tight">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products - Bold Grid */}
        {related.length > 0 && (
          <div className="mt-20 pt-12 border-t-2 border-purple-200">
            <h2 className="text-3xl font-black text-gray-900 mb-8">Similar {product.grade} Cards</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/${locale}/products/${rel.id}`}
                  className="bg-white border-2 border-purple-200 rounded-xl overflow-hidden hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col cursor-pointer"
                >
                  <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 relative overflow-hidden">
                    {rel.image_url ? (
                      <Image src={rel.image_url} alt={rel.title} fill className="object-contain p-4 group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">🃏</div>
                    )}
                    {rel.grade && (
                      <div className="absolute top-3 right-3 bg-amber-400 text-gray-900 px-3 py-1 rounded-full font-bold text-sm">
                        {rel.grade}
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-sm font-bold text-gray-800 line-clamp-2 mb-3 group-hover:text-purple-600 transition-colors">{rel.title}</p>
                    <p className="text-2xl font-black text-purple-600 mt-auto">฿{rel.price.toLocaleString()}</p>
                    <button className="mt-4 w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg font-bold text-sm transition-colors">
                      View Card →
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
