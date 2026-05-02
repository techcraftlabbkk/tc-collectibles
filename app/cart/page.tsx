'use client';

import { useCartStore } from '@/lib/cartStore';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCartStore();
  const total = getTotalPrice();
  const isEmpty = items.length === 0;

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          {isEmpty ? (
            <div className="card">
              <p className="text-gray-400 text-center py-8">
                Your cart is empty.{' '}
                <Link href="/products" className="text-blue-400 hover:text-blue-300">
                  Browse products
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product_id} className="card flex gap-4">
                  {/* Item Image */}
                  <div className="w-24 h-24 bg-dark-800 rounded flex-shrink-0 overflow-hidden relative">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs text-center">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-400 mb-3">Grade: {item.grade}</p>

                    <div className="flex items-center gap-2 mb-3">
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                        className="btn bg-dark-800 hover:bg-dark-700 text-white px-2 py-1 text-sm"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                        className="btn bg-dark-800 hover:bg-dark-700 text-white px-2 py-1 text-sm"
                      >
                        +
                      </button>
                      <span className="text-gray-400 ml-2">
                        ฿{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Remove
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <p className="text-gray-400 text-sm mb-1">Unit Price</p>
                    <p className="font-bold text-blue-400">฿{item.price.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <aside className="card h-fit">
          <h2 className="text-lg font-bold mb-4">Order Summary</h2>

          <div className="space-y-2 mb-4 pb-4 border-b border-dark-800">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>฿{total.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Items</span>
              <span>{items.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span className="text-yellow-400">TBD</span>
            </div>
          </div>

          <div className="flex justify-between font-bold text-lg mb-6">
            <span>Total</span>
            <span className="text-blue-400">฿{total.toLocaleString()}</span>
          </div>

          <button
            onClick={handleCheckout}
            className="btn btn-primary w-full mb-3"
            disabled={isEmpty}
          >
            Proceed to Checkout
          </button>

          <Link href="/products" className="block text-center text-blue-400 hover:text-blue-300">
            Continue Shopping
          </Link>
        </aside>
      </div>
    </div>
  );
}
