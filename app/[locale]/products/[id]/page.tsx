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
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href={`/${locale}`} className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href={`/${locale}/products`} className="hover:text-blue-600 transition-colors">Products</Link>
          <span>/</span>
          <span className="text-gray-700 truncate max-w-[200px]">{product.title}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* Image */}
          <div className="relative aspect-square bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm flex items-center justify-center">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.title}
                fill
                className="object-contain p-8"
                priority
              />
            ) : (
              <div className="flex flex-col items-center gap-3 text-gray-300">
                <span className="text-7xl">🃏</span>
                <span className="text-sm">No image available</span>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Grade Badge */}
            {product.grade && gradeStyle && (
              <div className={`inline-flex items-center gap-2 self-start mb-4 px-3 py-1.5 rounded-full border font-bold text-sm ${gradeStyle.bg} ${gradeStyle.text} ${gradeStyle.border}`}>
                <span className={`w-2 h-2 rounded-full ${gradeStyle.dot}`} />
                {product.grade} Graded
              </div>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 leading-snug">{product.title}</h1>

            {product.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Price */}
            <div className="mb-6 pb-6 border-b border-gray-100">
              <p className="text-4xl font-extrabold text-blue-600">฿{product.price.toLocaleString()}</p>
              {product.quantity <= 3 && product.quantity > 0 && (
                <p className="text-orange-500 text-sm font-semibold mt-1">⚡ Only {product.quantity} left in stock!</p>
              )}
              {product.quantity === 0 && (
                <p className="text-red-500 text-sm font-semibold mt-1">Out of stock</p>
              )}
            </div>

            {/* PSA Card Info */}
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 mb-6 space-y-2.5">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Card Details</h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Certification</span>
                <span className="font-semibold text-gray-900">PSA</span>
              </div>
              {product.grade && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Grade</span>
                  <span className="font-bold text-gray-900">{product.grade}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Condition</span>
                <span className="font-semibold text-gray-900">{product.grade === 'PSA 10' ? 'Gem Mint' : product.grade === 'PSA 9' ? 'Mint' : 'Near Mint'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Availability</span>
                <span className={`font-semibold ${product.available && product.quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {product.available && product.quantity > 0 ? 'In Stock' : 'Unavailable'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleAddToCart}
                disabled={!product.available || product.quantity === 0}
                className={`flex items-center justify-center gap-2.5 w-full py-3.5 rounded-xl font-bold text-base transition-all ${
                  added
                    ? 'bg-green-500 text-white scale-[0.98]'
                    : product.available && product.quantity > 0
                    ? 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-200'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                {added ? (
                  <>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {product.available && product.quantity > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </>
                )}
              </button>

              {added && (
                <Link
                  href={`/${locale}/cart`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-base border-2 border-blue-200 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View Cart →
                </Link>
              )}
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              {[
                { icon: '🛡️', label: 'PSA Certified' },
                { icon: '📦', label: 'Safe Packing' },
                { icon: '💬', label: 'Thai Support' },
              ].map((b) => (
                <div key={b.label} className="bg-gray-50 rounded-xl py-3 px-2 border border-gray-100">
                  <div className="text-xl mb-1">{b.icon}</div>
                  <p className="text-xs text-gray-500 font-medium leading-tight">{b.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-gray-900 mb-5">More {product.grade} Cards</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/${locale}/products/${rel.id}`}
                  className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all group flex flex-col"
                >
                  <div className="h-40 bg-gray-50 relative overflow-hidden">
                    {rel.image_url ? (
                      <Image src={rel.image_url} alt={rel.title} fill className="object-contain p-3 group-hover:scale-105 transition-transform" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">🃏</div>
                    )}
                  </div>
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">{rel.title}</p>
                    <p className="text-blue-600 font-bold mt-auto">฿{rel.price.toLocaleString()}</p>
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
