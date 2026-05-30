'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from './types';

export interface CartStore {
  items: CartItem[];
  addToCart: (product: Product) => 'added' | 'already_in_cart';
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product) => {
        const state = get();
        const existingItem = state.items.find((item) => item.product_id === product.id);

        // PSA collectibles are unique — cap at stock quantity (typically 1)
        const stockLimit = product.quantity ?? 1;
        if (existingItem && existingItem.quantity >= stockLimit) {
          return 'already_in_cart';
        }

        if (existingItem) {
          set((s) => ({
            items: s.items.map((item) =>
              item.product_id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          }));
        } else {
          set((s) => ({
            items: [
              ...s.items,
              {
                product_id: product.id,
                title: product.title,
                grade: product.grade,
                price: product.price,
                quantity: 1,
                image_url: product.image_url,
              },
            ],
          }));
        }
        return 'added';
      },

      removeFromCart: (productId: string) => {
        set((state) => ({
          items: state.items.filter((item) => item.product_id !== productId),
        }));
      },

      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product_id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },

      getItemCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'cart-store',
    }
  )
);
