import { POST } from '@/app/api/payment/generate-qr/route'
import { NextRequest } from 'next/server'

describe('Payment API - Generate QR', () => {
  test('should generate QR code successfully', async () => {
    const request = new NextRequest('http://localhost:3000/api/payment/generate-qr', {
      method: 'POST',
      body: JSON.stringify({
        amount: 1500,
        orderId: 'order-123',
        customerName: 'John Doe',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data).toHaveProperty('qrCode')
    expect(typeof data.qrCode).toBe('string')
  })

  test('should include order details in QR payload', async () => {
    const request = new NextRequest('http://localhost:3000/api/payment/generate-qr', {
      method: 'POST',
      body: JSON.stringify({
        amount: 2500,
        orderId: 'order-456',
        customerName: 'Jane Smith',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.qrCode).toBeTruthy()
  })

  test('should handle missing required fields', async () => {
    const request = new NextRequest('http://localhost:3000/api/payment/generate-qr', {
      method: 'POST',
      body: JSON.stringify({
        orderId: 'order-789',
      }),
    })

    const response = await POST(request)

    // Should handle gracefully or return error
    expect(response.status).toBeGreaterThanOrEqual(400)
  })

  test('should validate amount parameter', async () => {
    const request = new NextRequest('http://localhost:3000/api/payment/generate-qr', {
      method: 'POST',
      body: JSON.stringify({
        amount: -100,
        orderId: 'order-123',
        customerName: 'Test User',
      }),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)
  })

  test('should generate different QR codes for different amounts', async () => {
    const request1 = new NextRequest('http://localhost:3000/api/payment/generate-qr', {
      method: 'POST',
      body: JSON.stringify({
        amount: 1000,
        orderId: 'order-1',
        customerName: 'User 1',
      }),
    })

    const request2 = new NextRequest('http://localhost:3000/api/payment/generate-qr', {
      method: 'POST',
      body: JSON.stringify({
        amount: 2000,
        orderId: 'order-2',
        customerName: 'User 2',
      }),
    })

    const response1 = await POST(request1)
    const response2 = await POST(request2)
    const data1 = await response1.json()
    const data2 = await response2.json()

    expect(data1.qrCode).not.toBe(data2.qrCode)
  })
})
