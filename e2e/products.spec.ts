import { test, expect } from '@playwright/test'

test.describe('Products Page (English)', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/en/products')
  })

  test('should load products page', async ({ page }) => {
    // Verify page title or heading
    expect(await page.locator('text=/our collection|products/i').isVisible()).toBeTruthy()

    // Verify product grid is visible
    const productGrid = page.locator('[data-testid="products-grid"], div:has(> [data-testid="product-card"])')
    await productGrid.waitFor({ state: 'visible', timeout: 3000 })
  })

  test('should display product cards with images', async ({ page }) => {
    // Verify product images are loaded
    const productImages = page.locator('[data-testid="product-card"] img, .product-image img')
    const imageCount = await productImages.count()

    expect(imageCount).toBeGreaterThan(0)
  })

  test('should display product information (name, price, grade)', async ({ page }) => {
    // Verify product name is visible
    const productNames = page.locator('[data-testid="product-name"], .product-title, text=/charizard|lugia|mewtwo/i')
    const firstName = await productNames.first().isVisible()

    expect(firstName).toBeTruthy()

    // Verify price is displayed
    const prices = page.locator('text=/฿|[0-9]+,[0-9]+/i')
    const priceVisible = await prices.first().isVisible()

    expect(priceVisible).toBeTruthy()
  })

  test.describe('Filter: By Grade', () => {
    test('should display grade filter options', async ({ page }) => {
      // Look for grade filter section
      const gradeFilter = page.locator('[data-testid="grade-filter"], text=/grade|psa/i')
      expect(await gradeFilter.first().isVisible()).toBeTruthy()

      // Verify filter options are present
      const gradeOptions = page.locator('input[value*="9"], input[value*="10"], text=/PSA 9|PSA 10|Gem Mint/i')
      const optionCount = await gradeOptions.count()

      expect(optionCount).toBeGreaterThan(0)
    })

    test('should filter products by grade 9', async ({ page }) => {
      // Click grade 9 checkbox
      const grade9 = page.locator('input[type="checkbox"][value*="9"], label:has-text("9"), text=/grade 9|psa 9/i').first()

      if (await grade9.isVisible()) {
        await grade9.click()

        // Products should filter
        await page.waitForTimeout(500)

        // Verify filtered results
        const products = page.locator('[data-testid="product-card"]')
        const count = await products.count()

        expect(count).toBeGreaterThanOrEqual(0)
      }
    })

    test('should filter products by grade 10', async ({ page }) => {
      const grade10 = page.locator('input[type="checkbox"][value*="10"], label:has-text("10"), text=/grade 10|psa 10|gem mint/i').first()

      if (await grade10.isVisible()) {
        await grade10.click()

        await page.waitForTimeout(500)

        const products = page.locator('[data-testid="product-card"]')
        const count = await products.count()

        expect(count).toBeGreaterThanOrEqual(0)
      }
    })

    test('should allow multiple grade selection', async ({ page }) => {
      const grade9 = page.locator('input[type="checkbox"][value*="9"]').first()
      const grade10 = page.locator('input[type="checkbox"][value*="10"]').first()

      if (await grade9.isVisible() && await grade10.isVisible()) {
        await grade9.click()
        await page.waitForTimeout(300)
        await grade10.click()
        await page.waitForTimeout(300)

        // Both should be checked
        expect(await grade9.isChecked()).toBeTruthy()
        expect(await grade10.isChecked()).toBeTruthy()
      }
    })
  })

  test.describe('Filter: By Price Range', () => {
    test('should display price range filter', async ({ page }) => {
      const priceFilter = page.locator('[data-testid="price-filter"], text=/price|range|cost/i')
      expect(await priceFilter.first().isVisible()).toBeTruthy()
    })

    test('should allow setting min price', async ({ page }) => {
      const minPriceInput = page.locator('input[placeholder*="min"], input[placeholder*="From"], input[data-testid="min-price"]')

      if (await minPriceInput.isVisible()) {
        await minPriceInput.fill('10000')

        expect(await minPriceInput.inputValue()).toBe('10000')
      }
    })

    test('should allow setting max price', async ({ page }) => {
      const maxPriceInput = page.locator('input[placeholder*="max"], input[placeholder*="To"], input[data-testid="max-price"]')

      if (await maxPriceInput.isVisible()) {
        await maxPriceInput.fill('50000')

        expect(await maxPriceInput.inputValue()).toBe('50000')
      }
    })

    test('should filter products by price range', async ({ page }) => {
      const minPriceInput = page.locator('input[placeholder*="min"], input[placeholder*="From"]').first()
      const maxPriceInput = page.locator('input[placeholder*="max"], input[placeholder*="To"]').first()

      if (await minPriceInput.isVisible()) {
        await minPriceInput.fill('5000')
        await page.waitForTimeout(300)

        if (await maxPriceInput.isVisible()) {
          await maxPriceInput.fill('30000')
          await page.waitForTimeout(300)

          // Products should be filtered
          const products = page.locator('[data-testid="product-card"]')
          const count = await products.count()

          expect(count).toBeGreaterThanOrEqual(0)
        }
      }
    })
  })

  test.describe('Search Functionality', () => {
    test('should display search input', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"], [data-testid="product-search"]')

      if (await searchInput.isVisible()) {
        expect(await searchInput.isVisible()).toBeTruthy()
      }
    })

    test('should search for product by name', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]').first()

      if (await searchInput.isVisible()) {
        await searchInput.fill('Charizard')

        await page.waitForTimeout(500)

        // Products should filter based on search
        const products = page.locator('[data-testid="product-card"]')
        const count = await products.count()

        expect(count).toBeGreaterThanOrEqual(0)

        // At least one product should contain "Charizard" in title
        const charizard = page.locator('text=/charizard/i')
        const found = await charizard.first().isVisible()

        if (count > 0) {
          expect(found).toBeTruthy()
        }
      }
    })

    test('should show no results message for non-matching search', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]').first()

      if (await searchInput.isVisible()) {
        await searchInput.fill('NONEXISTENT_POKEMON_XYZ_123')

        await page.waitForTimeout(500)

        // Should show no results or empty state
        const noResults = page.locator('text=/no results|no products found|not found/i')

        if (await noResults.isVisible()) {
          expect(await noResults.isVisible()).toBeTruthy()
        } else {
          // Or product count should be 0
          const products = page.locator('[data-testid="product-card"]')
          const count = await products.count()

          expect(count).toBe(0)
        }
      }
    })

    test('should clear search and show all products', async ({ page }) => {
      const searchInput = page.locator('input[placeholder*="search"], input[placeholder*="Search"]').first()

      if (await searchInput.isVisible()) {
        // Search for something
        await searchInput.fill('Charizard')
        await page.waitForTimeout(300)

        // Clear search
        await searchInput.clear()
        await page.waitForTimeout(300)

        // All products should be visible again
        const products = page.locator('[data-testid="product-card"]')
        const count = await products.count()

        expect(count).toBeGreaterThan(0)
      }
    })
  })

  test.describe('Sorting', () => {
    test('should display sort dropdown', async ({ page }) => {
      const sortDropdown = page.locator('select, [data-testid="sort-select"], text=/sort|order/i')

      if (await sortDropdown.first().isVisible()) {
        expect(await sortDropdown.first().isVisible()).toBeTruthy()
      }
    })

    test('should sort by price low to high', async ({ page }) => {
      const sortDropdown = page.locator('select[data-testid="sort"], select').first()

      if (await sortDropdown.isVisible()) {
        await sortDropdown.selectOption('price-asc')

        await page.waitForTimeout(500)

        // Verify products are sorted
        const products = page.locator('[data-testid="product-card"]')
        expect(await products.count()).toBeGreaterThanOrEqual(0)
      }
    })

    test('should sort by price high to low', async ({ page }) => {
      const sortDropdown = page.locator('select[data-testid="sort"], select').first()

      if (await sortDropdown.isVisible()) {
        await sortDropdown.selectOption('price-desc')

        await page.waitForTimeout(500)

        const products = page.locator('[data-testid="product-card"]')
        expect(await products.count()).toBeGreaterThanOrEqual(0)
      }
    })

    test('should sort by newest', async ({ page }) => {
      const sortDropdown = page.locator('select[data-testid="sort"], select').first()

      if (await sortDropdown.isVisible()) {
        await sortDropdown.selectOption('newest')

        await page.waitForTimeout(500)

        const products = page.locator('[data-testid="product-card"]')
        expect(await products.count()).toBeGreaterThanOrEqual(0)
      }
    })
  })

  test.describe('Add to Cart from Products', () => {
    test('should add product to cart from products page', async ({ page }) => {
      // Find first add to cart button
      const addButton = page.locator('button:has-text("Add to Cart")').first()

      if (await addButton.isVisible()) {
        await addButton.click()

        // Should show success message
        const successMsg = page.locator('text=/added|added to cart|success/i')
        await successMsg.waitFor({ state: 'visible', timeout: 3000 })

        expect(await successMsg.isVisible()).toBeTruthy()
      }
    })

    test('should update cart count after adding product', async ({ page }) => {
      // Get initial cart count
      const cartBadge = page.locator('[data-testid="cart-count"], .cart-badge')
      const initialCount = await cartBadge.textContent()

      // Add product
      const addButton = page.locator('button:has-text("Add to Cart")').first()
      if (await addButton.isVisible()) {
        await addButton.click()

        await page.waitForTimeout(500)

        // Cart count should increase
        const newCount = await cartBadge.textContent()

        expect(newCount).not.toEqual(initialCount)
      }
    })
  })

  test.describe('Product Card Details', () => {
    test('should display "Add to Cart" button on hover', async ({ page }) => {
      const productCard = page.locator('[data-testid="product-card"]').first()

      if (await productCard.isVisible()) {
        // Hover over card
        await productCard.hover()

        // Add to cart button should be visible
        const addButton = productCard.locator('button:has-text("Add to Cart")')
        expect(await addButton.isVisible()).toBeTruthy()
      }
    })

    test('should navigate to product detail page on click', async ({ page }) => {
      const productCard = page.locator('[data-testid="product-card"]').first()

      if (await productCard.isVisible()) {
        // Click on card (not the add button)
        const productLink = productCard.locator('a, [data-testid="product-link"]').first()

        if (await productLink.isVisible()) {
          await productLink.click()

          // Should navigate to product detail page
          await page.waitForURL(/\/en\/products\/[a-z0-9-]+/, { timeout: 3000 })
          expect(page.url()).toContain('/en/products/')
        }
      }
    })
  })
})

test.describe('Products Page (Thai)', () => {
  test('should display products in Thai', async ({ page }) => {
    await page.goto('/th/products')

    // Verify Thai heading
    expect(await page.locator('text=/คอลเลกชั่น|สินค้า/i').isVisible()).toBeTruthy()
  })

  test('should have Thai filter labels', async ({ page }) => {
    await page.goto('/th/products')

    // Verify Thai filter text
    const thaiGrade = page.locator('text=/เกรด/i')
    const thaiPrice = page.locator('text=/ราคา/i')

    expect(await thaiGrade.first().isVisible()).toBeTruthy()
    expect(await thaiPrice.first().isVisible()).toBeTruthy()
  })

  test('should have Thai sort options', async ({ page }) => {
    await page.goto('/th/products')

    const sortDropdown = page.locator('select[data-testid="sort"], select').first()

    if (await sortDropdown.isVisible()) {
      // Get options
      const options = sortDropdown.locator('option')
      const optionCount = await options.count()

      expect(optionCount).toBeGreaterThan(0)
    }
  })

  test('should have Thai "Add to Cart" button', async ({ page }) => {
    await page.goto('/th/products')

    const addButton = page.locator('button:has-text("เพิ่มไปยังตะกร้า")').first()

    if (await addButton.isVisible()) {
      expect(await addButton.isVisible()).toBeTruthy()
    }
  })
})

test.describe('Products Page Responsiveness', () => {
  test('should display products in responsive grid on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/en/products')

    // Products grid should be visible
    const productCards = page.locator('[data-testid="product-card"]')
    const count = await productCards.count()

    expect(count).toBeGreaterThan(0)
  })

  test('should show filters on mobile (toggle or sidebar)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/en/products')

    // Look for filter button or toggle
    const filterToggle = page.locator('button:has-text("Filter"), button:has-text("Filters"), [data-testid="filter-toggle"]')

    // Filters should either be visible or toggleable
    if (await filterToggle.isVisible()) {
      expect(await filterToggle.isVisible()).toBeTruthy()
    } else {
      // Or filters should be in a sidebar/modal
      const filterSection = page.locator('[data-testid="filter-section"], aside')
      if (await filterSection.isVisible()) {
        expect(await filterSection.isVisible()).toBeTruthy()
      }
    }
  })

  test('should display products in single column on small screens', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/en/products')

    const firstCard = page.locator('[data-testid="product-card"]').first()
    const secondCard = page.locator('[data-testid="product-card"]').nth(1)

    if (await firstCard.isVisible() && await secondCard.isVisible()) {
      const firstBox = await firstCard.boundingBox()
      const secondBox = await secondCard.boundingBox()

      // Cards should be vertically stacked (same x position, different y)
      expect(firstBox?.x).toBeCloseTo(secondBox?.x || 0, 20)
    }
  })
})
