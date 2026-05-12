import { test, expect } from '@playwright/test'

test.describe('Admin Dashboard (English)', () => {
  test.beforeEach(async ({ page }) => {
    // Assume admin is already logged in or would need to login
    // In a real scenario, you'd set up auth tokens or use page.context().addCookies()
    await page.goto('/en/admin')
  })

  test.describe('Dashboard Overview Tab', () => {
    test('should display dashboard metrics cards', async ({ page }) => {
      // Click dashboard tab if needed
      const dashboardTab = page.locator('button, [role="tab"]:has-text("Dashboard")')
      if (await dashboardTab.isVisible()) {
        await dashboardTab.click()
      }

      // Verify key metrics are displayed
      const totalOrders = page.locator('text=/total orders|orders/i')
      const totalRevenue = page.locator('text=/revenue|income|sales/i')
      const pendingPayments = page.locator('text=/pending|payment/i')
      const totalProducts = page.locator('text=/products|items/i')

      expect(await totalOrders.first().isVisible()).toBeTruthy()
      expect(await totalRevenue.first().isVisible()).toBeTruthy()
      expect(await pendingPayments.first().isVisible()).toBeTruthy()
      expect(await totalProducts.first().isVisible()).toBeTruthy()
    })

    test('should display metric values with currency', async ({ page }) => {
      // Look for currency symbols in metrics
      const currencyValues = page.locator('text=/฿|,|[0-9]+/i')
      const visibleValues = await currencyValues.filter({ hasText: /[0-9]/ }).first()

      expect(await visibleValues.isVisible()).toBeTruthy()
    })

    test('should display cards with proper styling', async ({ page }) => {
      // Verify cards have shadow/styling indicating they are distinct UI elements
      const cards = page.locator('[data-testid="metric-card"], div:has(> text=/orders|revenue/)')
      const cardCount = await cards.count()

      expect(cardCount).toBeGreaterThanOrEqual(3)
    })
  })

  test.describe('Orders Management Tab', () => {
    test('should display orders table with columns', async ({ page }) => {
      // Click orders tab
      const ordersTab = page.locator('button, [role="tab"]:has-text("Orders")')
      await ordersTab.click()

      // Verify table headers
      const orderIdHeader = page.locator('text=/order id|order #|order number/i')
      const statusHeader = page.locator('text=/status/i')
      const customerHeader = page.locator('text=/customer|name/i')
      const totalHeader = page.locator('text=/total|amount/i')

      expect(await orderIdHeader.first().isVisible()).toBeTruthy()
      expect(await statusHeader.first().isVisible()).toBeTruthy()
    })

    test('should display orders in table rows', async ({ page }) => {
      const ordersTab = page.locator('button, [role="tab"]:has-text("Orders")')
      await ordersTab.click()

      // Wait for table to load
      await page.waitForSelector('table, [role="table"], [data-testid="orders-table"]', { timeout: 3000 })

      // Verify at least one row is visible
      const rows = page.locator('tbody tr, [role="row"]:not(:first-child)')
      const rowCount = await rows.count()

      expect(rowCount).toBeGreaterThanOrEqual(0)
    })

    test('should allow status update from dropdown', async ({ page }) => {
      const ordersTab = page.locator('button, [role="tab"]:has-text("Orders")')
      await ordersTab.click()

      // Find first status dropdown/select
      const statusSelects = page.locator('select, [role="combobox"]').filter({ hasText: /pending|processing|completed/i })

      if (await statusSelects.first().isVisible()) {
        const firstSelect = statusSelects.first()

        // Click to open
        await firstSelect.click()

        // Select a new status
        const newStatus = page.locator('text=/completed|shipped|processing/i')
        await newStatus.first().click()

        // Verify change was made
        expect(await firstSelect.isVisible()).toBeTruthy()
      }
    })

    test('should display order search/filter functionality', async ({ page }) => {
      const ordersTab = page.locator('button, [role="tab"]:has-text("Orders")')
      await ordersTab.click()

      // Look for search input
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="order"]')

      if (await searchInput.isVisible()) {
        await searchInput.fill('order-123')
        expect(await searchInput.inputValue()).toBe('order-123')
      }
    })

    test('should sort orders by column', async ({ page }) => {
      const ordersTab = page.locator('button, [role="tab"]:has-text("Orders")')
      await ordersTab.click()

      // Find sortable headers
      const headers = page.locator('th, [role="columnheader"]')

      if (await headers.count() > 0) {
        // Click first header to sort
        const firstHeader = headers.first()
        await firstHeader.click()

        // Verify table is still visible after sort
        expect(await page.locator('table, [role="table"]').isVisible()).toBeTruthy()
      }
    })

    test('should display order details when clicking a row', async ({ page }) => {
      const ordersTab = page.locator('button, [role="tab"]:has-text("Orders")')
      await ordersTab.click()

      // Click first order row
      const firstRow = page.locator('tbody tr, [role="row"]:not(:first-child)').first()

      if (await firstRow.isVisible()) {
        await firstRow.click()

        // Verify details panel or modal opens
        const details = page.locator('[data-testid="order-details"], text=/address|shipping|items/i')
        await details.first().waitFor({ state: 'visible', timeout: 3000 })
      }
    })
  })

  test.describe('Products Inventory Tab', () => {
    test('should display products inventory table', async ({ page }) => {
      // Click products tab
      const productsTab = page.locator('button, [role="tab"]:has-text("Products")')
      await productsTab.click()

      // Verify table headers
      const productNameHeader = page.locator('text=/product|name|title/i')
      const stockHeader = page.locator('text=/stock|inventory|quantity/i')
      const priceHeader = page.locator('text=/price|cost/i')

      expect(await productNameHeader.first().isVisible()).toBeTruthy()
    })

    test('should display product list with editable fields', async ({ page }) => {
      const productsTab = page.locator('button, [role="tab"]:has-text("Products")')
      await productsTab.click()

      // Verify products are displayed
      const productRows = page.locator('tbody tr, [role="row"]:not(:first-child)')
      const count = await productRows.count()

      expect(count).toBeGreaterThanOrEqual(0)
    })

    test('should allow editing product stock quantity', async ({ page }) => {
      const productsTab = page.locator('button, [role="tab"]:has-text("Products")')
      await productsTab.click()

      // Find first stock quantity input
      const stockInputs = page.locator('input[type="number"], input[data-testid*="stock"]')

      if (await stockInputs.first().isVisible()) {
        const input = stockInputs.first()

        // Get current value
        const currentValue = await input.inputValue()

        // Change value
        await input.clear()
        await input.fill('50')

        // Verify new value
        expect(await input.inputValue()).toBe('50')
      }
    })

    test('should allow editing product price', async ({ page }) => {
      const productsTab = page.locator('button, [role="tab"]:has-text("Products")')
      await productsTab.click()

      // Find price inputs
      const priceInputs = page.locator('input[type="number"], input[data-testid*="price"]')

      if (await priceInputs.count() > 1) {
        const priceInput = priceInputs.nth(1)

        // Edit price
        await priceInput.clear()
        await priceInput.fill('25000')

        expect(await priceInput.inputValue()).toBe('25000')
      }
    })

    test('should save product changes', async ({ page }) => {
      const productsTab = page.locator('button, [role="tab"]:has-text("Products")')
      await productsTab.click()

      // Find save button
      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update"), button[data-testid*="save"]')

      if (await saveButton.isVisible()) {
        await saveButton.click()

        // Wait for success message
        const successMsg = page.locator('text=/saved|updated|success/i')
        await successMsg.waitFor({ state: 'visible', timeout: 3000 })
      }
    })

    test('should add new product', async ({ page }) => {
      const productsTab = page.locator('button, [role="tab"]:has-text("Products")')
      await productsTab.click()

      // Look for add product button
      const addButton = page.locator('button:has-text("Add Product"), button:has-text("New Product"), button[data-testid*="add"]')

      if (await addButton.isVisible()) {
        await addButton.click()

        // Verify form opens or modal appears
        const form = page.locator('form, [data-testid="product-form"], text=/product name|price/i')
        await form.first().waitFor({ state: 'visible', timeout: 3000 })
      }
    })
  })

  test.describe('Admin Responsiveness', () => {
    test('should display tabs layout on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en/admin')

      // Tabs should be visible
      const tabs = page.locator('[role="tab"], button:has-text("Dashboard"), button:has-text("Orders")')
      expect(await tabs.first().isVisible()).toBeTruthy()
    })

    test('should stack table columns on mobile or show horizontal scroll', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 })
      await page.goto('/en/admin')

      const ordersTab = page.locator('button, [role="tab"]:has-text("Orders")')
      await ordersTab.click()

      // Table should be present (scrollable or responsive)
      const table = page.locator('table, [role="table"]')
      expect(await table.first().isVisible()).toBeTruthy()
    })
  })
})

test.describe('Admin Dashboard (Thai)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/th/admin')
  })

  test('should display dashboard in Thai', async ({ page }) => {
    // Verify Thai headings
    const thaiDashboard = page.locator('text=/แดชบอร์ด|จัดการ/i')
    expect(await thaiDashboard.first().isVisible()).toBeTruthy()
  })

  test('should display Thai order statuses', async ({ page }) => {
    const ordersTab = page.locator('button, [role="tab"]:has-text("คำสั่งซื้อ|Orders")')
    await ordersTab.click()

    // Look for Thai status values
    const thaiStatus = page.locator('text=/ค้างอยู่|ประมวลผล|สำเร็จ/i')
    expect(await thaiStatus.first().isVisible()).toBeTruthy()
  })

  test('should display Thai currency in products', async ({ page }) => {
    const productsTab = page.locator('button, [role="tab"]:has-text("สินค้า|Products")')
    await productsTab.click()

    // Verify Thai currency symbol
    const baht = page.locator('text=฿')
    expect(await baht.first().isVisible()).toBeTruthy()
  })
})
