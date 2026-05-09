'use client';

import { useCartStore } from '@/lib/cartStore';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/hooks/useToast';
import Card from '@/components/Card';
import Button from '@/components/Button';
import { useEffect } from 'react';

export default function CartPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    useCartStore.persist.rehydrate();
  }, []);
  const t = useTranslations('pages.cart');
  const { toast } = useToast();

  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const total = getTotalPrice();
  const isEmpty = items.length === 0;

  const handleCheckout = () => {
    router.push(`/${locale}/checkout`);
  };

  const handleContinueShopping = () => {
    router.push(`/${locale}/products`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {isEmpty ? (
            <Card className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-gray-600 text-lg mb-6">{t('empty')}</p>
              <Button onClick={handleContinueShopping}>
                {t('continue_shopping')}
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <Card key={item.product_id} className="p-4">
                  <div className="flex gap-4">
                    {/* Item Image */}
                    <div className="w-24 h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden relative">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 text-3xl">
                          🎴
                        </div>
                      )}
                    </div>

                    {/* Item Details */}
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900 mb-1">{item.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {item.grade && `${t('grade')}: ${item.grade}`}
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        ฿{item.price.toLocaleString()}
                      </p>
                    </div>

                    {/* Quantity & Actions */}
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                          className="px-2 py-1 hover:bg-gray-200 rounded"
                        >
                          −
                        </button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-gray-200 rounded"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => {
                          removeFromCart(item.product_id);
                          toast.info(t('toasts.cart.removed'));
                        }}
                        className="text-sm text-red-600 hover:text-red-700 font-medium mt-2"
                      >
                        {t('remove')}
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Order Summary */}
        {!isEmpty && (
          <div className="h-fit">
            <Card className="space-y-4">
              <h2 className="text-lg font-bold text-gray-900">{t('order_summary')}</h2>

              <div className="space-y-2 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-gray-600">
                  <span>{t('subtotal')}</span>
                  <span>฿{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>{t('shipping')}</span>
                  <span className="text-green-600 font-medium">{t('free_shipping')}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-4">
                <span>{t('total')}</span>
                <span className="text-blue-600">฿{total.toLocaleString()}</span>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCheckout}
              >
                {t('checkout')}
              </Button>

              <Button
                className="w-full"
                variant="outline"
                onClick={handleContinueShopping}
              >
                {t('continue_shopping')}
              </Button>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
