'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Link from 'next/link';
import { useProducts, ProductFilters } from '@/lib/useProducts';
import { useCartStore } from '@/lib/cartStore';
import { useToast } from '@/lib/hooks/useToast';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Image from 'next/image';

const GRADE_OPTIONS = ['All Grades', 'PSA 6', 'PSA 7', 'PSA 8', 'PSA 8.5', 'PSA 9', 'PSA 10'];

export default function ProductsPage() {
  const t = useTranslations('pages.products');
  const tToasts = useTranslations('toasts');
  const locale = useLocale();
  const { toast } = useToast();

  const [filters, setFilters] = useState<ProductFilters>({
    grade: 'All Grades',
    minPrice: undefined,
    maxPrice: undefined,
    search: '',
    sortBy: 'newest',
  });

  const [tempFilters, setTempFilters] = useState(filters);
  const { products, loading, error } = useProducts(filters);
  const { addToCart } = useCartStore();
  const [addedProduct, setAddedProduct] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      toast.error(tToasts('products.load_error.message'), { description: tToasts('products.load_error.description') });
    }
  }, [error, toast, tToasts]);

  const handleAddToCart = (product: any) => {
    addToCart(product);
    toast.success(tToasts('products.added'));
    setAddedProduct(product.id);
    setTimeout(() => setAddedProduct(null), 2000);
  };

  const handleFilterChange = (key: keyof ProductFilters, value: any) => {
    setTempFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
  };

  const handleResetFilters = () => {
    const defaultFilters: ProductFilters = {
      grade: 'All Grades',
      minPrice: undefined,
      maxPrice: undefined,
      search: '',
      sortBy: 'newest',
    };
    setTempFilters(defaultFilters);
    setFilters(defaultFilters);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">{t('title')}</h1>
        <p className="text-gray-600">{locale === 'en' ? 'Browse our complete collection' : 'เรียกดูคอลเลกชั่นของเรา'}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="space-y-6">
          <Card>
            <h2 className="text-lg font-bold text-gray-900 mb-4">{t('filter')}</h2>

            {/* Search */}
            <div className="mb-6">
              <Input
                type="text"
                placeholder={t('search_placeholder')}
                value={tempFilters.search || ''}
                onChange={(e) => handleFilterChange('search', e.target.value)}
              />
            </div>

            {/* Grade Filter */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('grade')}</label>
              <select
                value={tempFilters.grade || 'All Grades'}
                onChange={(e) => handleFilterChange('grade', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {GRADE_OPTIONS.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('price')}</label>
              <div className="space-y-2">
                <Input
                  type="number"
                  placeholder={locale === 'en' ? 'Min (฿)' : 'ต่ำสุด (฿)'}
                  value={tempFilters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                />
                <Input
                  type="number"
                  placeholder={locale === 'en' ? 'Max (฿)' : 'สูงสุด (฿)'}
                  value={tempFilters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value ? parseInt(e.target.value) : undefined)}
                />
              </div>
            </div>

            {/* Sort */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">{t('sort')}</label>
              <select
                value={tempFilters.sortBy || 'newest'}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="newest">{t('sort_newest')}</option>
                <option value="price_asc">{t('sort_price_asc')}</option>
                <option value="price_desc">{t('sort_price_desc')}</option>
              </select>
            </div>

            {/* Filter Buttons */}
            <div className="space-y-2">
              <Button className="w-full" onClick={handleApplyFilters}>
                {t('filter')}
              </Button>
              <Button className="w-full" variant="outline" onClick={handleResetFilters}>
                {locale === 'en' ? 'Reset' : 'รีเซ็ต'}
              </Button>
            </div>
          </Card>
        </aside>

        {/* Products Grid */}
        <div className="lg:col-span-3">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="bg-gray-300 h-48 rounded-lg mb-4" />
                  <div className="bg-gray-300 h-4 rounded mb-2" />
                  <div className="bg-gray-300 h-4 rounded w-3/4" />
                </Card>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: any) => (
                <Card key={product.id} hover shadow="md">
                  {product.image && (
                    <div className="relative h-48 mb-4 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={product.image}
                        alt={product.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 mb-1">{product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {t('grade')}: {product.grade}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {t('quantity')}: {product.quantity}
                  </p>
                  <p className="text-2xl font-bold text-blue-600 mb-4">
                    ฿{product.price.toLocaleString()}
                  </p>

                  {addedProduct === product.id && (
                    <div className="mb-2 p-2 bg-green-50 text-green-700 rounded text-sm text-center">
                      ✓ {locale === 'en' ? 'Added to cart' : 'เพิ่มไปยังตะกร้า'}
                    </div>
                  )}

                  <Button
                    className="w-full"
                    onClick={() => handleAddToCart(product)}
                    disabled={product.quantity === 0}
                  >
                    {product.quantity > 0 ? t('add_to_cart') : t('out_of_stock')}
                  </Button>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="text-center py-12">
              <p className="text-gray-600 text-lg">{t('no_results')}</p>
              <Button className="mt-4" onClick={handleResetFilters}>
                {locale === 'en' ? 'Clear Filters' : 'ล้างตัวกรอง'}
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
