import {
  sendOrderConfirmationEmail,
  sendPaymentReceivedEmail,
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from '@/lib/emailService'
import nodemailer from 'nodemailer'

jest.mock('nodemailer')

describe('Email Service', () => {
  let mockSendMail: jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
    mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-id' })
    ;(nodemailer.createTransport as jest.Mock).mockReturnValue({
      sendMail: mockSendMail,
    })
  })

  describe('sendOrderConfirmationEmail', () => {
    test('should send order confirmation email', async () => {
      await sendOrderConfirmationEmail('test@example.com', {
        id: 'order-123',
        customer_name: 'John Doe',
        total: 150,
        items: [
          { title: 'Pokemon Card', quantity: 1, price_at_purchase: 150 },
        ],
        created_at: new Date().toISOString(),
      })

      expect(mockSendMail).toHaveBeenCalled()
      const call = mockSendMail.mock.calls[0][0]
      expect(call.to).toBe('test@example.com')
      expect(call.subject).toContain('Order Confirmation')
      expect(call.html).toContain('order-123')
    })

    test('should handle email service errors gracefully', async () => {
      mockSendMail.mockRejectedValueOnce(new Error('SMTP Error'))

      await expect(
        sendOrderConfirmationEmail('test@example.com', {
          id: 'order-123',
          customer_name: 'John Doe',
          total: 150,
          items: [],
          created_at: new Date().toISOString(),
        })
      ).rejects.toThrow()
    })
  })

  describe('sendPaymentReceivedEmail', () => {
    test('should send payment received email', async () => {
      await sendPaymentReceivedEmail('test@example.com', {
        id: 'order-123',
        customer_name: 'John Doe',
        total: 150,
        items: [],
        created_at: new Date().toISOString(),
      })

      expect(mockSendMail).toHaveBeenCalled()
      const call = mockSendMail.mock.calls[0][0]
      expect(call.to).toBe('test@example.com')
      expect(call.subject).toContain('Payment Received')
    })
  })

  describe('sendOrderShippedEmail', () => {
    test('should send order shipped email', async () => {
      await sendOrderShippedEmail('test@example.com', {
        id: 'order-123',
        customer_name: 'John Doe',
        total: 150,
        items: [],
        created_at: new Date().toISOString(),
      })

      expect(mockSendMail).toHaveBeenCalled()
      const call = mockSendMail.mock.calls[0][0]
      expect(call.to).toBe('test@example.com')
      expect(call.subject).toContain('Shipped')
    })
  })

  describe('sendOrderDeliveredEmail', () => {
    test('should send order delivered email', async () => {
      await sendOrderDeliveredEmail('test@example.com', {
        id: 'order-123',
        customer_name: 'John Doe',
        total: 150,
        items: [],
        created_at: new Date().toISOString(),
      })

      expect(mockSendMail).toHaveBeenCalled()
      const call = mockSendMail.mock.calls[0][0]
      expect(call.to).toBe('test@example.com')
      expect(call.subject).toContain('Delivered')
    })
  })

  describe('Email template validation', () => {
    test('should include order details in email body', async () => {
      await sendOrderConfirmationEmail('test@example.com', {
        id: 'order-123',
        customer_name: 'Jane Smith',
        total: 299.99,
        items: [
          { title: 'Pikachu Card', quantity: 2, price_at_purchase: 100 },
          { title: 'Charizard Card', quantity: 1, price_at_purchase: 99.99 },
        ],
        created_at: new Date().toISOString(),
      })

      const call = mockSendMail.mock.calls[0][0]
      expect(call.html).toContain('Jane Smith')
      expect(call.html).toContain('order-123')
      expect(call.html).toContain('299.99')
    })

    test('should format currency correctly', async () => {
      await sendPaymentReceivedEmail('test@example.com', {
        id: 'order-456',
        customer_name: 'Test User',
        total: 1500,
        items: [],
        created_at: new Date().toISOString(),
      })

      const call = mockSendMail.mock.calls[0][0]
      expect(call.html).toContain('฿') // Thai Baht symbol
    })
  })
})
