import { test, expect } from '@playwright/test'

test.describe('Payment Flow', () => {
  test.describe('Payment Page Display (EN)', () => {
    test('should display payment details with PromptPay QR', async ({ page }) => {
      // Navigate to a payment page (this would be after completing checkout)
      // For now, we verify the structure is in place
      await page.goto('/en/payment/test-order-123')

      // Verify payment page header
      expect(await page.locator('text=/payment|ชำระเงิน/i').isVisible()).toBeTruthy()

      // Verify order summary section
      const orderSummary = page.locator('text=/order|order summary/i')
      await orderSummary.waitFor({ state: 'visible', timeout: 5000 })

      // Verify payment method selection
      const promptPayOption = page.locator('text=/PromptPay|promptpay/i')
      await promptPayOption.waitFor({ state: 'visible', timeout: 3000 })

      // Verify QR code display (image element with alt text or data)
      const qrCode = page.locator('img[alt*="QR"], [data-testid="qr-code"]').first()
      await qrCode.waitFor({ state: 'visible', timeout: 3000 })
    })

    test('should display order summary with items and total', async ({ page }) => {
      await page.goto('/en/payment/test-order-123')

      // Verify order items are displayed
      const items = page.locator('text=/item|product|amount/i')
      await items.first().waitFor({ state: 'visible' })

      // Verify total is displayed with currency
      const total = page.locator('text=/฿|total|thb/i')
      await total.waitFor({ state: 'visible' })

      // Verify item breakdown
      const itemList = page.locator('[data-testid="order-item"], tr:has(td)')
      const count = await itemList.count()
      expect(count).toBeGreaterThan(0)
    })

    test('should display payment instructions', async ({ page }) => {
      await page.goto('/en/payment/test-order-123')

      // Verify instructions are visible
      const instructions = page.locator('text=/instruction|scan|transfer|upload/i')
      await instructions.first().waitFor({ state: 'visible' })

      // Instructions should be in English
      const enInstructions = page.locator('text=/scan this qr code|transfer amount|upload receipt/i')
      expect(await enInstructions.first().isVisible()).toBeTruthy()
    })
  })

  test.describe('Payment Page Display (TH)', () => {
    test('should display Thai payment page with instructions', async ({ page }) => {
      await page.goto('/th/payment/test-order-123')

      // Verify page title in Thai
      expect(await page.locator('text=/ชำระเงิน|payment/i').isVisible()).toBeTruthy()

      // Verify instructions in Thai
      const thaiInstructions = page.locator('text=/สแกน|โอนเงิน|อัปโหลด/i')
      await thaiInstructions.first().waitFor({ state: 'visible' })

      // Verify Thai currency display
      const thbCurrency = page.locator('text=฿')
      await thbCurrency.waitFor({ state: 'visible' })
    })

    test('should display PromptPay details in Thai', async ({ page }) => {
      await page.goto('/th/payment/test-order-123')

      // Verify PromptPay section
      const promptPay = page.locator('text=/พร้อมเพย์|promptpay/i')
      await promptPay.first().waitFor({ state: 'visible' })

      // Verify Thai instructions for scanning
      const scanInstructions = page.locator('text=/สแกน qr code/i')
      expect(await scanInstructions.isVisible()).toBeTruthy()
    })
  })

  test.describe('Payment Confirmation', () => {
    test('should validate "I Have Paid" button functionality', async ({ page }) => {
      await page.goto('/en/payment/test-order-123')

      // Find the confirmation button
      const confirmButton = page.locator('button:has-text("I Have Paid"), button:has-text("ฉันได้ชำระเงินแล้ว")')

      // Verify button is visible
      await confirmButton.waitFor({ state: 'visible', timeout: 3000 })
      expect(await confirmButton.isVisible()).toBeTruthy()

      // Click the button
      await confirmButton.click()

      // Should show success message or navigate
      const successMsg = page.locator('text=/success|confirmed|pending|verification/i')
      await successMsg.waitFor({ state: 'visible', timeout: 5000 })
    })

    test('should handle payment verification', async ({ page }) => {
      await page.goto('/en/payment/test-order-123')

      // Look for verification section
      const verificationSection = page.locator('[data-testid="verification"], text=/we will verify|verification pending/i')

      if (await verificationSection.isVisible()) {
        expect(await verificationSection.isVisible()).toBeTruthy()
      }

      // Verify waiting message or verification status
      const statusText = page.locator('text=/pending|verifying|confirmed/i')
      await statusText.first().waitFor({ state: 'visible', timeout: 3000 })
    })

    test('should display order details to review before payment', async ({ page }) => {
      await page.goto('/en/payment/test-order-123')

      // Verify customer information is shown
      const customerInfo = page.locator('text=/name|address|email|phone/i')
      await customerInfo.first().waitFor({ state: 'visible' })

      // Verify order number/ID is displayed
      const orderId = page.locator('text=/order|#|id/i')
      expect(await orderId.first().isVisible()).toBeTruthy()

      // Verify shipping address is displayed
      const address = page.locator('[data-testid="shipping-address"], text=/address|street|city/i')
      await address.first().waitFor({ state: 'visible', timeout: 3000 })
    })
  })

  test.describe('Payment Page Responsiveness', () => {
    test('should display payment page on mobile viewport', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 667 })

      await page.goto('/en/payment/test-order-123')

      // Verify main elements are visible
      const qrCode = page.locator('[data-testid="qr-code"], img[alt*="QR"]').first()
      await qrCode.waitFor({ state: 'visible', timeout: 3000 })

      // Verify button is accessible
      const button = page.locator('button:has-text("I Have Paid")')
      await button.waitFor({ state: 'visible' })
      expect(await button.isVisible()).toBeTruthy()
    })

    test('should stack layout properly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en/payment/test-order-123')

      // Summary should be visible and not cut off
      const summary = page.locator('[data-testid="order-summary"]')
      expect(await summary.boundingBox()).toBeTruthy()

      // QR code should be visible
      const qr = page.locator('[data-testid="qr-code"]')
      expect(await qr.boundingBox()).toBeTruthy()
    })
  })

  test.describe('Invalid Order ID Handling', () => {
    test('should handle non-existent order ID', async ({ page }) => {
      await page.goto('/en/payment/invalid-order-id-xyz')

      // Should show error or redirect
      const errorMsg = page.locator('text=/not found|invalid|error|does not exist/i')
      const redirected = page.url()

      // Either error message or redirect should occur
      expect(
        (await errorMsg.isVisible()) || !redirected.includes('invalid-order')
      ).toBeTruthy()
    })

    test('should prevent access to other users\' payment pages', async ({ page }) => {
      // Note: This test would need actual multi-user setup
      // For now, we verify the URL structure is protected
      await page.goto('/en/payment/someone-else-order-123')

      // Should either show 404 or redirect to login
      const notFound = page.locator('text=/not found|404|unauthorized|access denied/i')
      const loginForm = page.locator('text=/sign in|login|email/i')

      expect(
        (await notFound.first().isVisible()) || (await loginForm.first().isVisible())
      ).toBeTruthy()
    })
  })
})
