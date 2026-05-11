import { useCartStore } from '@/lib/cartStore'
import { renderHook, act } from '@testing-library/react'

describe('Cart Store', () => {
  beforeEach(() => {
    const store = useCartStore.getState()
    store.clearCart()
  })

  test('should initialize with empty cart', () => {
    const store = useCartStore.getState()
    expect(store.items).toEqual([])
    expect(store.total).toBe(0)
  })

  test('should add item to cart', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem({
        id: '1',
        title: 'Pokemon Card',
        price: 50,
        quantity: 1,
        image_url: 'test.jpg',
      })
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].id).toBe('1')
    expect(result.current.total).toBe(50)
  })

  test('should increase quantity when adding duplicate item', () => {
    const { result } = renderHook(() => useCartStore())

    const item = {
      id: '1',
      title: 'Pokemon Card',
      price: 50,
      quantity: 1,
      image_url: 'test.jpg',
    }

    act(() => {
      result.current.addItem(item)
      result.current.addItem(item)
    })

    expect(result.current.items).toHaveLength(1)
    expect(result.current.items[0].quantity).toBe(2)
    expect(result.current.total).toBe(100)
  })

  test('should remove item from cart', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem({
        id: '1',
        title: 'Pokemon Card',
        price: 50,
        quantity: 1,
        image_url: 'test.jpg',
      })
    })

    expect(result.current.items).toHaveLength(1)

    act(() => {
      result.current.removeItem('1')
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  test('should update item quantity', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem({
        id: '1',
        title: 'Pokemon Card',
        price: 50,
        quantity: 1,
        image_url: 'test.jpg',
      })
    })

    act(() => {
      result.current.updateQuantity('1', 5)
    })

    expect(result.current.items[0].quantity).toBe(5)
    expect(result.current.total).toBe(250)
  })

  test('should clear cart', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem({
        id: '1',
        title: 'Pokemon Card',
        price: 50,
        quantity: 1,
        image_url: 'test.jpg',
      })
      result.current.addItem({
        id: '2',
        title: 'Another Card',
        price: 75,
        quantity: 1,
        image_url: 'test2.jpg',
      })
    })

    expect(result.current.items).toHaveLength(2)

    act(() => {
      result.current.clearCart()
    })

    expect(result.current.items).toHaveLength(0)
    expect(result.current.total).toBe(0)
  })

  test('should calculate correct total with multiple items', () => {
    const { result } = renderHook(() => useCartStore())

    act(() => {
      result.current.addItem({
        id: '1',
        title: 'Card 1',
        price: 50,
        quantity: 2,
        image_url: 'test1.jpg',
      })
      result.current.addItem({
        id: '2',
        title: 'Card 2',
        price: 75,
        quantity: 3,
        image_url: 'test2.jpg',
      })
    })

    expect(result.current.total).toBe(50 * 2 + 75 * 3)
  })
})
