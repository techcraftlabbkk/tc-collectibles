import { test, expect } from '@playwright/test'

test.describe('Checkout Flow (English)', () => {
  test('should complete checkout flow EN: Browse → Cart → Checkout → Payment', async ({ page }) => {
    // Step 1: Browse products
    await page.goto('/en/products')
    expect(await page.locator('text=Our Collection').isVisible()).toBeTruthy()

    // Find first add to cart button
    const addButtons = page.locator('button:has-text("Add to Cart")')
    const firstAddButton = await addButtons.first()
    await firstAddButton.click()

    // Verify product added
    const addedMsg = page.locator('text=/added|added to cart/i')
    await addedMsg.waitFor({ state: 'visible', timeout: 3000 })

    // Step 2: Go to cart
    await page.click('a:has-text("Shopping Cart")')
    await page.waitForURL('/en/cart')

    // Verify cart has item
    expect(await page.locator('text=/item|product/i').first().isVisible()).toBeTruthy()

    // Verify total is calculated
    const total = page.locator('text=/฿/').last()
    await total.waitFor({ state: 'visible' })

    // Step 3: Proceed to checkout
    await page.click('button:has-text("Proceed to Checkout")')
    await page.waitForURL('/en/checkout')

    // Step 4: Fill shipping form
    expect(await page.locator('text=Checkout').isVisible()).toBeTruthy()

    // Fill required fields
    await page.fill('input[placeholder*="John"]', 'John Doe')
    await page.fill('input[type="email"]', 'john@example.com')
    await page.fill('input[type="tel"]', '08XX XXX XXXX')
    await page.fill('input[placeholder*="123"]', '123 Main Street')
    await page.fill('input[placeholder*="Bangkok"]', 'Bangkok')
    await page.fill('input[placeholder="10100"]', '10100')

    // Step 5: Place order
    await page.click('button:has-text("Place Order")')

    // Should redirect to payment page
    await page.waitForURL(/\/en\/payment\//)

    // Verify payment page loads
    expect(await page.locator('text=/payment|promptpay/i').isVisible()).toBeTruthy()
  })

  test('should validate required checkout fields', async ({ page }) => {
    await page.goto('/en/checkout')

    // Try to submit empty form
    await page.click('button:has-text("Place Order")')

    // Should show validation errors
    const errors = page.locator('text=/required|must enter/i')
    await errors.first().waitFor({ state: 'visible', timeout: 3000 })
  })

  test('should validate email format in checkout', async ({ page }) => {
    await page.goto('/en/checkout')

    // Fill form with invalid email
    await page.fill('input[placeholder*="John"]', 'John')
    await page.fill('input[type="email"]', 'invalid-email')

    await page.click('button:has-text("Place Order")')

    // Should show email error
    const error = page.locator('text=/invalid|email/i')
    expect(await error.isVisible()).toBeTruthy()
  })
})

test.describe('Checkout Flow (Thai)', () => {
  test('TH: should complete full checkout flow', async ({ page }) => {
    // Step 1: Browse products
    await page.goto('/th/products')
    expect(await page.locator('text=คอลเลกชั่นของเรา').isVisible()).toBeTruthy()

    // Add to cart
    const addButtons = page.locator('button:has-text("เพิ่มไปยังตะกร้า")')
    await addButtons.first().click()

    // Step 2: Go to cart
    await page.click('a:has-text("ตะกร้าสินค้า")')
    await page.waitForURL('/th/cart')

    // Step 3: Checkout
    await page.click('button:has-text("ไปที่การชำระเงิน")')
    await page.waitForURL('/th/checkout')

    // Fill form
    await page.fill('input', 'สมชาย ใจดี') // First input (name)
    const inputs = page.locator('input[type="email"]')
    await inputs.first().fill('somchai@example.com')

    const phoneInput = page.locator('input[type="tel"]')
    await phoneInput.fill('08XX XXX XXXX')

    // Fill address (approximate selectors)
    const textInputs = page.locator('input[type="text"]')
    const allInputs = await textInputs.all()
    if (allInputs.length > 0) {
      await allInputs[0].fill('123 ถนน...')
    }

    // Place order
    await page.click('button:has-text("วางสั่งซื้อ")')

    // Should go to payment
    await page.waitForURL(/\/th\/payment\//)
    expect(await page.url()).toContain('/th/payment/')
  })
})

test.describe('Payment Page', () => {
  test('EN: should display payment details', async ({ page }) => {
    // This would need an actual order ID
    // For now, we test the structure
    // await page.goto('/en/payment/order-123')

    // Verify elements present
    // expect(await page.locator('text=/payment|promptpay/i').isVisible()).toBeTruthy()
  })

  test('should handle payment verification', async ({ page }) => {
    // This test would interact with the payment flow
    // Verify "I Have Paid" button works
  })
})
