'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/lib/cartStore';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [orderCreated, setOrderCreated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    shippingAddress: '',
    shippingCity: '',
    shippingPostal: '',
    note: '',
  });

  const total = getTotalPrice();
  const isEmpty = items.length === 0;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate form
      if (!formData.fullName || !formData.email || !formData.phone || !formData.shippingAddress) {
        throw new Error('Please fill in all required fields');
      }

      // Get current user session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        throw new Error('You must be logged in to place an order');
      }

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: session.user.id,
          total,
          status: 'pending_payment',
          shipping_address: `${formData.shippingAddress}, ${formData.shippingCity} ${formData.shippingPostal}`,
          phone: formData.phone,
          shipping_note: formData.note,
          customer_email: formData.email,
          customer_name: formData.fullName,
        })
        .select()
        .single();

      if (orderError) throw orderError;
      if (!order) throw new Error('Failed to create order');

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

      if (itemsError) throw itemsError;

      // Send order confirmation email
      try {
        const emailPayload = {
          orderId: order.id,
          customerEmail: formData.email,
          customerName: formData.fullName,
          orderTotal: total,
          orderItems: items.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
          orderDate: new Date().toLocaleDateString(),
          shippingAddress: `${formData.shippingAddress}, ${formData.shippingCity} ${formData.shippingPostal}`,
        };

        await fetch('/api/orders/send-confirmation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(emailPayload),
        });
      } catch (emailError) {
        console.error('Failed to send confirmation email:', emailError);
        // Don't throw - order was created successfully, just log email failure
      }

      // Clear cart and redirect to payment page
      clearCart();
      router.push(`/payment/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  if (isEmpty) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <div className="card text-center py-12">
          <p className="text-gray-400 text-lg mb-4">Your cart is empty.</p>
          <Link href="/products" className="btn btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  if (orderCreated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8">Redirecting to Payment...</h1>
        <div className="card text-center py-12">
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-700 border-t-blue-400 rounded-full mb-4" />
          <p className="text-gray-400">Setting up your payment page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleCreateOrder} className="space-y-6">
            {error && (
              <div className="bg-red-900 border border-red-800 text-red-200 px-4 py-3 rounded">
                {error}
              </div>
            )}

            {/* Personal Info */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  placeholder="John Doe"
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  placeholder="+66 8xx xxx xxxx"
                  className="w-full"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold mb-2">Shipping Address *</label>
                <input
                  type="text"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Main Street"
                  className="w-full"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">City *</label>
                  <input
                    type="text"
                    name="shippingCity"
                    value={formData.shippingCity}
                    onChange={handleInputChange}
                    required
                    placeholder="Bangkok"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Postal Code *</label>
                  <input
                    type="text"
                    name="shippingPostal"
                    value={formData.shippingPostal}
                    onChange={handleInputChange}
                    required
                    placeholder="10110"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Delivery Notes</label>
                <textarea
                  name="note"
                  value={formData.note}
                  onChange={handleInputChange}
                  placeholder="Any special instructions..."
                  className="w-full h-24"
                />
              </div>
            </div>

            {/* Payment Info */}
            <div className="card">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <div className="bg-dark-800 p-4 rounded mb-4">
                <p className="text-gray-400 text-sm mb-2">Payment Method</p>
                <p className="font-semibold text-lg">PromptPay (QR Code)</p>
              </div>
              <p className="text-xs text-gray-500">
                You will receive a PromptPay QR code after placing your order. Please scan and complete the payment.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full py-3 text-lg"
            >
              {loading ? 'Creating Order...' : 'Create Order & Continue to Payment'}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <aside className="card h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-3 mb-4 pb-4 border-b border-dark-800 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product_id} className="flex justify-between text-sm">
                <div>
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="text-gray-500 text-xs">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">฿{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>

          <div className="space-y-2 mb-4 pb-4 border-b border-dark-800">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>฿{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-yellow-400">To be calculated</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span className="text-blue-400">฿{total.toLocaleString()}</span>
          </div>

          <Link href="/cart" className="block text-center mt-6 text-blue-400 hover:text-blue-300">
            Back to Cart
          </Link>
        </aside>
      </div>
    </div>
  );
}
