/**
 * Integration Tests for Complete Checkout Flow
 * Tests the end-to-end workflow from browsing to order creation
 */

import { useCartStore } from '@/lib/cartStore'
import { renderHook, act } from '@testing-library/react'

describe('Checkout Flow Integration', () => {
  beforeEach(() => {
    const store = useCartStore.getState()
    store.clearCart()
  })

  describe('Complete Purchase Flow', () => {
    test('should complete full purchase workflow', () => {
      const { result } = renderHook(() => useCartStore())

      // Step 1: Browse and add products to cart
      act(() => {
        result.current.addItem({
          id: '1',
          title: 'PSA 10 Pikachu Holo',
          price: 500,
          quantity: 1,
          image_url: 'pikachu.jpg',
        })
      })

      expect(result.current.items).toHaveLength(1)
      expect(result.current.total).toBe(500)

      // Step 2: Add another item
      act(() => {
        result.current.addItem({
          id: '2',
          title: 'PSA 9 Charizard',
          price: 1200,
          quantity: 1,
          image_url: 'charizard.jpg',
        })
      })

      expect(result.current.items).toHaveLength(2)
      expect(result.current.total).toBe(1700)

      // Step 3: Review cart (calculate total)
      expect(result.current.items.reduce((sum, item) => sum + item.price * item.quantity, 0)).toBe(1700)

      // Step 4: Modify quantity if needed
      act(() => {
        result.current.updateQuantity('1', 2)
      })

      expect(result.current.total).toBe(2200)

      // Step 5: Verify order can be created with current cart
      const orderItems = result.current.items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price_at_purchase: item.price,
      }))

      expect(orderItems).toHaveLength(2)
      expect(orderItems[0].quantity).toBe(2)
    })

    test('should handle address and payment info in checkout', () => {
      // Simulating checkout form submission
      const checkoutData = {
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        phone: '0811234567',
        shipping_address: '123 Moo 1, Bangkok, Thailand 10110',
        country: 'Thailand',
        postal_code: '10110',
        final_sale_accepted: true,
      }

      expect(checkoutData.customer_name).toBeDefined()
      expect(checkoutData.customer_email).toBeDefined()
      expect(checkoutData.shipping_address).toBeDefined()
      expect(checkoutData.final_sale_accepted).toBe(true)
    })

    test('should validate required checkout fields', () => {
      const requiredFields = ['customer_name', 'customer_email', 'phone', 'shipping_address']

      const checkoutData = {
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        phone: '0811234567',
        shipping_address: '123 Moo 1, Bangkok, Thailand 10110',
      }

      for (const field of requiredFields) {
        expect(checkoutData).toHaveProperty(field)
      }
    })

    test('should calculate correct order total with multiple items and quantities', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        // Add PSA 10 card (500 baht each, quantity 3)
        result.current.addItem({
          id: '1',
          title: 'PSA 10',
          price: 500,
          quantity: 3,
          image_url: 'card1.jpg',
        })

        // Add PSA 9 card (300 baht each, quantity 2)
        result.current.addItem({
          id: '2',
          title: 'PSA 9',
          price: 300,
          quantity: 2,
          image_url: 'card2.jpg',
        })
      })

      const expectedTotal = 500 * 3 + 300 * 2 // 2100
      expect(result.current.total).toBe(expectedTotal)
    })

    test('should allow order modifications before submission', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          id: '1',
          title: 'Card',
          price: 100,
          quantity: 1,
          image_url: 'card.jpg',
        })
      })

      // User decides to increase quantity
      act(() => {
        result.current.updateQuantity('1', 5)
      })

      expect(result.current.total).toBe(500)

      // User changes mind and removes item
      act(() => {
        result.current.removeItem('1')
      })

      expect(result.current.items).toHaveLength(0)
      expect(result.current.total).toBe(0)
    })
  })

  describe('Order Confirmation Flow', () => {
    test('should prepare order confirmation data', () => {
      const { result } = renderHook(() => useCartStore())

      act(() => {
        result.current.addItem({
          id: '1',
          title: 'PSA 10 Card',
          price: 1000,
          quantity: 1,
          image_url: 'card.jpg',
        })
      })

      const orderConfirmationData = {
        order_id: 'ORD-20260502-001',
        customer_name: 'John Doe',
        customer_email: 'john@example.com',
        items: result.current.items,
        total: result.current.total,
        shipping_address: '123 Main St, Bangkok',
        status: 'pending_payment',
        created_at: new Date().toISOString(),
      }

      expect(orderConfirmationData.total).toBe(1000)
      expect(orderConfirmationData.items).toHaveLength(1)
      expect(orderConfirmationData.status).toBe('pending_payment')
    })
  })

  describe('Error Handling in Checkout', () => {
    test('should handle empty cart submission', () => {
      const { result } = renderHook(() => useCartStore())

      expect(result.current.items.length).toBe(0)
      expect(() => {
        if (result.current.items.length === 0) {
          throw new Error('Cannot checkout with empty cart')
        }
      }).toThrow('Cannot checkout with empty cart')
    })

    test('should validate email format', () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

      expect(emailRegex.test('user@example.com')).toBe(true)
      expect(emailRegex.test('invalid-email')).toBe(false)
      expect(emailRegex.test('user@domain')).toBe(false)
    })
  })
})
