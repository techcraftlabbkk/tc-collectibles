'use client';

import { useTranslations } from 'next-intl';
<<<<<<< HEAD
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Home() {
  const t = useTranslations();
  const [products, setProducts] = useState<any[]>([]);
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
=======
import { useLocale } from 'next-intl';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';

export default function Home() {
  const t = useTranslations('pages.home');
  const locale = useLocale();

  const features = [
    {
      icon: '✓',
      key: 'quality'
    },
    {
      icon: '🔒',
      key: 'secure'
    },
    {
      icon: '📦',
      key: 'support'
    }
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center py-16">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          {t('title')}
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
        <Link href={`/${locale}/products`}>
          <Button size="lg">
            {t('hero_cta')}
          </Button>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {t('why_us')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.key} hover>
              <div className="text-4xl mb-4 text-center">{feature.icon}</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2 text-center">
                {t(`${feature.key}`)}
              </h3>
              <p className="text-gray-600 text-center">
                {t(`${feature.key}_desc`)}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Cards Section */}
      <section className="py-12 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">
          {t('featured')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} hover shadow="md">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-400 text-4xl">🎴</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">
                {locale === 'en' ? 'Charizard Base Set' : 'Charizard Base Set'}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {locale === 'en' ? 'Grade: PSA 9' : 'เกรด: PSA 9'}
              </p>
              <p className="text-2xl font-bold text-blue-600 mb-4">฿15,500</p>
              <Link href={`/${locale}/cart`} className="w-full">
                <Button className="w-full" size="sm">
                  {locale === 'en' ? 'Add to Cart' : 'เพิ่มไปยังตะกร้า'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12 px-8 rounded-xl text-center">
        <h2 className="text-3xl font-bold mb-4">
          {locale === 'en' ? 'Ready to Find Your Cards?' : 'พร้อมที่จะค้นหาการ์ดของคุณหรือ?'}
        </h2>
        <p className="text-lg mb-6 opacity-90 max-w-2xl mx-auto">
          {locale === 'en'
            ? 'Browse our curated collection of authentic graded Pokémon cards'
            : 'เรียกดูคอลเลกชั่นของเราที่ประกอบด้วยการ์ด Pokémon ที่แท้และได้เกรดแล้ว'}
        </p>
        <Link href={`/${locale}/products`}>
          <Button
            variant="outline"
            size="lg"
            className="text-white border-white hover:bg-white/10"
          >
            {t('hero_cta')}
          </Button>
        </Link>
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
      </section>
    </div>
  );
}
