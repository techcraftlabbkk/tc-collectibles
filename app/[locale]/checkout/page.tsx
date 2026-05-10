'use client';

<<<<<<< HEAD
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';

export default function Checkout() {
  const t = useTranslations();
  const router = useRouter();

  return (
    <div className="w-full px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Form */}
          <form className="space-y-4">
            <h2 className="text-xl font-bold mb-4">{t('checkout.shippingAddress')}</h2>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.fullName')}
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.email')}
              </label>
              <input
                type="email"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.phone')}
              </label>
              <input
                type="tel"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                {t('checkout.address')}
              </label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('checkout.city')}
                </label>
                <input type="text" className="w-full border rounded px-3 py-2" required />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">
                  {t('checkout.postalCode')}
                </label>
                <input type="text" className="w-full border rounded px-3 py-2" required />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="agree"
                className="mr-2"
                required
              />
              <label htmlFor="agree" className="text-sm">
                {t('checkout.agreeToTerms')}
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              {t('checkout.placeOrder')}
            </button>
          </form>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-bold mb-4">{t('checkout.orderSummary')}</h2>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between border-b pb-2">
                <span>{t('cart.subtotal')}</span>
                <span>฿0</span>
              </div>
              <div className="flex justify-between border-b pb-2">
                <span>{t('cart.shipping')}</span>
                <span>฿0</span>
              </div>
              <div className="flex justify-between font-bold text-lg">
                <span>{t('cart.total')}</span>
                <span>฿0</span>
              </div>
            </div>
          </div>
=======
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useCartStore } from '@/lib/cartStore';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/hooks/useToast';
import Link from 'next/link';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import Modal from '@/components/Modal';

export default function CheckoutPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    useCartStore.persist.rehydrate();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) router.push(`/${locale}/auth/login?redirect=/${locale}/checkout`);
    });
  }, [router, locale]);
  const t = useTranslations('pages.checkout');
  const tErr = useTranslations('errors');
  const tToasts = useTranslations('toasts');
  const tModals = useTranslations('modals');
  const { toast } = useToast();

  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostal: '',
    note: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const total = getTotalPrice();
  const isEmpty = items.length === 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim()) errors.fullName = tErr('required_field');
    if (!formData.email.trim()) errors.email = tErr('required_field');
    if (!formData.email.includes('@')) errors.email = tErr('invalid_email');
    if (!formData.phone.trim()) errors.phone = tErr('required_field');
    if (!formData.shippingAddress.trim()) errors.shippingAddress = tErr('required_field');

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setConfirmOpen(true);
  };

  const handleConfirmPlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // Get current user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push(`/${locale}/auth/login`);
        return;
      }

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total_thb: total,
          status: 'pending_payment',
          shipping_address: `${formData.shippingAddress}, ${formData.shippingCity} ${formData.shippingPostal}`,
          phone: formData.phone,
          shipping_note: formData.note,
          customer_email: formData.email,
          customer_name: formData.fullName,
        })
        .select()
        .single();

      if (orderError) {
        toast.error(tToasts('checkout.create_error.message'), { description: tToasts('checkout.create_error.description') });
        throw orderError;
      }
      if (!order) {
        toast.error(tToasts('checkout.create_failed.message'), { description: tToasts('checkout.create_failed.description') });
        throw new Error('Failed to create order');
      }

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) {
        toast.error(tToasts('checkout.items_error.message'), { description: tToasts('checkout.items_error.description') });
        throw itemsError;
      }

      // Send order confirmation email
      try {
        const emailResponse = await fetch('/api/orders/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: order.id,
            customerEmail: formData.email,
            customerName: formData.fullName,
            orderTotal: total,
            orderItems: items.map((item) => ({
              title: item.title,
              quantity: item.quantity,
              price: item.price,
            })),
            shippingAddress: `${formData.shippingAddress}, ${formData.shippingCity} ${formData.shippingPostal}`,
            orderDate: new Date().toLocaleDateString(),
          }),
        });

        if (!emailResponse.ok) {
          console.error('Failed to send order confirmation email');
          // Don't throw - order was created successfully, email failure shouldn't block
        }
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't throw - order was created successfully, email failure shouldn't block
      }

      // Clear cart and redirect to payment
      toast.success(tToasts('checkout.created'));
      clearCart();
      router.push(`/${locale}/payment/${order.id}`);
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="space-y-8">
        <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
        <Card className="text-center py-12">
          <div className="text-6xl mb-4">🛒</div>
          <p className="text-gray-600 text-lg mb-6">
            {locale === 'en' ? 'Your cart is empty' : 'ตะกร้าของคุณว่างเปล่า'}
          </p>
          <Link href={`/${locale}/products`}>
            <Button>
              {locale === 'en' ? 'Continue Shopping' : 'เลือกสินค้าต่อ'}
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">{t('title')}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCreateOrder} className="space-y-6">
            {/* Step 1: Shipping Information */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('step1')}</h2>
                <span className="text-sm font-medium text-blue-600">Step 1 of 3</span>
              </div>

              <div className="space-y-4">
                <Input
                  label={t('firstname')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  error={formErrors.fullName}
                  placeholder={locale === 'en' ? 'John Doe' : 'นามสกุล นาม'}
                />
                <Input
                  label={t('phone')}
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  error={formErrors.phone}
                  placeholder="+66 XX XXX XXXX"
                />
                <Input
                  label={t('email')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  error={formErrors.email}
                  placeholder="you@example.com"
                />
              </div>
            </Card>

            {/* Step 2: Shipping Address */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('step2')}</h2>
                <span className="text-sm font-medium text-blue-600">Step 2 of 3</span>
              </div>

              <div className="space-y-4">
                <Input
                  label={t('address')}
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  error={formErrors.shippingAddress}
                  placeholder={locale === 'en' ? '123 Main St' : '123 ถนน...'}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label={t('city')}
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    placeholder={locale === 'en' ? 'Bangkok' : 'กรุงเทพฯ'}
                  />
                  <Input
                    label={t('zipcode')}
                    name="shippingPostal"
                    value={formData.shippingPostal}
                    onChange={handleInputChange}
                    placeholder="10100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {locale === 'en' ? 'Order Note (Optional)' : 'หมายเหตุคำสั่ง (ไม่บังคับ)'}
                  </label>
                  <textarea
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder={locale === 'en' ? 'Add any special instructions...' : 'เพิ่มคำแนะนำพิเศษ...'}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </Card>

            {/* Step 3: Review & Payment */}
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-900">{t('step3')}</h2>
                <span className="text-sm font-medium text-blue-600">Step 3 of 3</span>
              </div>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    {locale === 'en'
                      ? 'You will be able to select your payment method on the next page.'
                      : 'คุณจะสามารถเลือกวิธีการชำระเงินในหน้าถัดไป'}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{locale === 'en' ? 'Payment Method' : 'วิธีการชำระเงิน'}</span>
                    <span className="font-medium">PromptPay QR Code</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              isLoading={loading}
              disabled={loading}
            >
              {t('place_order')}
            </Button>
          </form>

          {/* Confirmation Modal */}
          <Modal
            isOpen={confirmOpen}
            onClose={() => setConfirmOpen(false)}
            onConfirm={handleConfirmPlaceOrder}
            title={tModals('checkout.placeOrder.title')}
            description={tModals('checkout.placeOrder.description')}
            confirmButtonText={tModals('checkout.placeOrder.confirm')}
            closeButtonText={tModals('checkout.placeOrder.cancel')}
          />
        </div>

        {/* Order Summary */}
        <div className="h-fit">
          <Card className="sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-6">{t('order_summary')}</h2>

            <div className="space-y-3 max-h-96 overflow-y-auto mb-6 pb-4 border-b border-gray-200">
              {items.map((item) => (
                <div key={item.product_id} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium text-gray-900 truncate">{item.title}</p>
                    <p className="text-gray-500">x{item.quantity}</p>
                  </div>
                  <p className="font-medium text-gray-900">฿{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>{t('subtotal')}</span>
                <span>฿{total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>{t('shipping')}</span>
                <span className="text-green-600 font-medium">{t('free_shipping')}</span>
              </div>
            </div>

            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 mt-4 pt-4">
              <span>{t('total')}</span>
              <span className="text-blue-600">฿{total.toLocaleString()}</span>
            </div>
          </Card>
>>>>>>> 5ba90b22ffae258d62b7ff24ca18b56f04f361e7
        </div>
      </div>
    </div>
  );
}
