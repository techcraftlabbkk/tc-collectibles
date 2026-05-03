import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'

// Mock provider wrapper for tests
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }

// Common test data
export const mockProduct = {
  id: '1',
  title: 'Charizard Base Set',
  grade: 'PSA 9',
  price: 15000,
  quantity: 5,
  available: true,
  image_url: null,
  created_at: '2026-05-01T00:00:00Z',
}

export const mockOrder = {
  id: 'order-1',
  user_id: 'user-1',
  total_thb: 15000,
  status: 'pending_payment',
  shipping_address: '123 Main St, Bangkok',
  phone: '08XX XXX XXXX',
  customer_name: 'John Doe',
  customer_email: 'john@example.com',
  created_at: '2026-05-01T00:00:00Z',
}

export const mockUser = {
  id: 'user-1',
  email: 'test@example.com',
  user_metadata: {
    name: 'Test User',
  },
}

// Helper to wait for async operations
export const waitForLoadingToFinish = async () => {
  const { screen } = await import('@testing-library/react')
  const elements = screen.queryAllByText((content) => content.includes('Loading'))
  if (elements.length > 0) {
    await Promise.all(elements.map(() => new Promise((resolve) => setTimeout(resolve, 100))))
  }
}
